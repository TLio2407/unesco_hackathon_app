/**
 * WP3 — Risk Reasoning Layer: Unit Tests
 *
 * Tests the rule engine, scorer, LLM explainer, RAG, and pipeline.
 */

import { describe, it, expect, vi } from 'vitest';

import {
  evaluateRules,
  getRule,
  listSignals,
} from '../../src/api/risk/rules';

import { scoreRisk, isRisky } from '../../src/api/risk/scorer';

import { generateExplanation } from '../../src/api/risk/llm';

import { retrieveRag, buildRagContext } from '../../src/api/risk/rag';

import { DefaultRiskPipeline } from '../../src/api/risk/pipeline';

import type { MatchedSignal } from '../../src/api/risk/contract';

// ── Rule engine tests ───────────────────────────────────────────────────────

describe('Rule Engine', () => {
  describe('evaluateRules()', () => {
    it('detects urgency signal', () => {
      const signals = evaluateRules('Chỉ còn 10 phút để xác minh');
      expect(signals.some((s) => s.signal === 'urgency')).toBe(true);
    });

    it('detects upfront_payment signal', () => {
      const signals = evaluateRules('Chuyển tiền 500,000 VND để nhận quà');
      expect(signals.some((s) => s.signal === 'upfront_payment')).toBe(true);
    });

    it('detects authority_impersonation signal', () => {
      const signals = evaluateRules('Thông báo từ Công an thành phố');
      expect(signals.some((s) => s.signal === 'authority_impersonation')).toBe(true);
    });

    it('detects suspicious_url signal', () => {
      const signals = evaluateRules('Bấm link bit.ly/xyz ngay');
      expect(signals.some((s) => s.signal === 'suspicious_url')).toBe(true);
    });

    it('detects too_good_to_be_true signal', () => {
      const signals = evaluateRules('Trúng thưởng iPhone 15 chỉ với 200,000 VND');
      expect(signals.some((s) => s.signal === 'too_good_to_be_true')).toBe(true);
    });

    it('detects personal_data_request signal', () => {
      const signals = evaluateRules('Cung cấp CCCD và OTP để xác minh');
      expect(signals.some((s) => s.signal === 'personal_data_request')).toBe(true);
    });

    it('detects social_proof signal', () => {
      const signals = evaluateRules('Nhiều người đã nhận và hài lòng 100%');
      expect(signals.some((s) => s.signal === 'social_proof')).toBe(true);
    });

    it('returns empty array for safe text', () => {
      const signals = evaluateRules('Chào cô, chúc cô một ngày tốt lành');
      expect(signals).toHaveLength(0);
    });

    it('returns multiple signals for complex scam', () => {
      const scam =
        'Công an thông báo: tài khoản sắp bị khóa. ' +
        'Chuyển 500,000 VND trong 10 phút qua link bit.ly/xyz.';
      const signals = evaluateRules(scam);
      expect(signals.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('getRule()', () => {
    it('returns rule for urgency', () => {
      const rule = getRule('urgency');
      expect(rule).toBeDefined();
      expect(rule?.weight).toBe('high');
    });

    it('returns undefined for unknown signal', () => {
      expect(getRule('fake_signal' as any)).toBeUndefined();
    });
  });

  describe('listSignals()', () => {
    it('lists all 7 signals', () => {
      const signals = listSignals();
      expect(signals).toHaveLength(7);
      expect(signals).toContain('urgency');
    });
  });
});

// ── Scorer tests ─────────────────────────────────────────────────────────────

describe('Risk Scorer', () => {
  describe('scoreRisk()', () => {
    it('returns safe for no signals', () => {
      expect(scoreRisk([])).toBe('safe');
    });

    it('returns high_risk for 2+ high signals', () => {
      const signals: MatchedSignal[] = [
        { signal: 'urgency', explanation: 'x', weight: 'high' },
        { signal: 'upfront_payment', explanation: 'x', weight: 'high' },
      ];
      expect(scoreRisk(signals)).toBe('high_risk');
    });

    it('returns caution for 1 high signal', () => {
      const signals: MatchedSignal[] = [
        { signal: 'urgency', explanation: 'x', weight: 'high' },
      ];
      expect(scoreRisk(signals)).toBe('caution');
    });

    it('returns caution for 2+ medium signals', () => {
      const signals: MatchedSignal[] = [
        { signal: 'suspicious_url', explanation: 'x', weight: 'medium' },
        { signal: 'social_proof', explanation: 'x', weight: 'medium' },
      ];
      expect(scoreRisk(signals)).toBe('caution');
    });

    it('returns high_risk for 1 high + 1 medium (aggressive rule)', () => {
      const signals: MatchedSignal[] = [
        { signal: 'urgency', explanation: 'x', weight: 'high' },
        { signal: 'suspicious_url', explanation: 'x', weight: 'medium' },
      ];
      // 1 high + total=2 → high_risk
      expect(scoreRisk(signals)).toBe('high_risk');
    });

    it('respects custom highRiskMinHighCount threshold', () => {
      // Single high signal with threshold requiring 2 → caution
      const signals: MatchedSignal[] = [
        { signal: 'urgency', explanation: 'x', weight: 'high' },
      ];
      expect(
        scoreRisk(signals, { highRiskMinHighCount: 2, highRiskMinTotalWithHigh: 2 }),
      ).toBe('caution');
    });

    it('respects custom highRiskMinTotalWithHigh threshold', () => {
      // 1 high + 1 medium = 2 total, but threshold requires 5 → caution
      const signals: MatchedSignal[] = [
        { signal: 'urgency', explanation: 'x', weight: 'high' },
        { signal: 'suspicious_url', explanation: 'x', weight: 'medium' },
      ];
      expect(
        scoreRisk(signals, { highRiskMinHighCount: 2, highRiskMinTotalWithHigh: 5 }),
      ).toBe('caution');
    });
  });

  describe('isRisky()', () => {
    it('returns true for caution', () => {
      expect(isRisky('caution')).toBe(true);
    });

    it('returns true for high_risk', () => {
      expect(isRisky('high_risk')).toBe(true);
    });

    it('returns false for safe', () => {
      expect(isRisky('safe')).toBe(false);
    });

    it('returns false for insufficient_data', () => {
      expect(isRisky('insufficient_data')).toBe(false);
    });
  });
});

// ── LLM explainer tests ─────────────────────────────────────────────────────

describe('LLM Explainer', () => {
  it('generates explanation for urgency + upfront_payment', async () => {
    const signals: MatchedSignal[] = [
      { signal: 'urgency', explanation: 'x', weight: 'high' },
      { signal: 'upfront_payment', explanation: 'x', weight: 'high' },
    ];
    const result = await generateExplanation(signals, 'Chuyển tiền gấp trong 10 phút');
    expect(result.explanation).toContain('quyết định thật nhanh');
    expect(result.verificationSteps.length).toBeGreaterThan(0);
    expect(result.nextAction).toContain('Dừng lại');
  });

  it('returns safe message for no signals', async () => {
    const result = await generateExplanation([], 'Tin nhắn bình thường');
    expect(result.explanation).toContain('Không phát hiện');
  });

  it('falls back to template if LLM fails', async () => {
    // Mock fetch to fail
    global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));
    const signals: MatchedSignal[] = [
      { signal: 'urgency', explanation: 'x', weight: 'high' },
    ];
    const result = await generateExplanation(signals, 'test');
    expect(result.explanation).toBeTruthy();
    delete (global as any).fetch;
  });
});

// ── RAG tests ───────────────────────────────────────────────────────────────

describe('RAG Retrieval', () => {
  it('retrieves alerts for signals', () => {
    // Mock index
    const index = {
      alerts: [
        {
          id: '1',
          source: 'BoCA',
          sourceUrl: 'https://boca.gov.vn',
          date: '2026-07-01',
          title: 'Cảnh báo lừa đảo giả mạo công an',
          summary: 'Nhiều vụ giả mạo công an yêu cầu chuyển tiền.',
          signals: ['authority_impersonation' as any, 'upfront_payment' as any],
        },
      ],
      search: (signals: any[]) =>
        index.alerts.filter((a) => signals.some((s) => a.signals.includes(s))),
    };

    const result = retrieveRag({ signals: ['authority_impersonation' as any] }, index);
    expect(result.alerts).toHaveLength(1);
    expect(result.alerts[0].title).toContain('giả mạo công an');
  });

  it('limits results', () => {
    const index = {
      alerts: [
        { id: '1', source: 'x', sourceUrl: 'x', date: 'x', title: 'x', summary: 'x', signals: ['urgency' as any] },
        { id: '2', source: 'x', sourceUrl: 'x', date: 'x', title: 'x', summary: 'x', signals: ['urgency' as any] },
        { id: '3', source: 'x', sourceUrl: 'x', date: 'x', title: 'x', summary: 'x', signals: ['urgency' as any] },
      ],
      search: () => index.alerts,
    };
    const result = retrieveRag({ signals: ['urgency' as any], limit: 2 }, index);
    expect(result.alerts).toHaveLength(2);
  });

  it('builds RAG context string', () => {
    const alerts = [
      {
        id: '1',
        source: 'BoCA',
        sourceUrl: 'https://boca.gov.vn',
        date: '2026-07-01',
        title: 'Cảnh báo lừa đảo',
        summary: 'Nhiều vụ giả mạo công an.',
        signals: ['authority_impersonation' as any],
      },
    ];
    const context = buildRagContext(alerts);
    expect(context).toContain('Cảnh báo lừa đảo');
    expect(context).toContain('BoCA');
  });
});

// ── Pipeline integration tests ──────────────────────────────────────────────

describe('Risk Pipeline', () => {
  const pipeline = new DefaultRiskPipeline();

  it('processes scam text end-to-end', async () => {
    const scamText =
      'Công an thông báo: tài khoản sắp bị khóa. ' +
      'Chuyển 500,000 VND trong 10 phút qua link bit.ly/xyz.';

    const preprocessed = {
      normalised: { cleaned: scamText, ascii: 'Cong an thong bao...', lower: scamText.toLowerCase() },
      entities: [],
      redacted: { text: scamText, redactions: [], count: 0 },
    };

    const result = await pipeline.run({ preprocessed });

    expect(result.riskLevel).toBe('high_risk');
    expect(result.redFlags.length).toBeGreaterThanOrEqual(2);
    expect(result.verificationSteps.length).toBeGreaterThan(0);
    expect(result.lessonCard).toBeDefined();
    expect(result.disclaimer).toContain('AI chỉ hỗ trợ');
    expect(result.trace.rulesMatched.length).toBeGreaterThanOrEqual(2);
  });

  it('handles safe text', async () => {
    const safeText = 'Chào cô, chúc cô một ngày tốt lành.';
    const preprocessed = {
      normalised: { cleaned: safeText, ascii: safeText, lower: safeText.toLowerCase() },
      entities: [],
      redacted: { text: safeText, redactions: [], count: 0 },
    };

    const result = await pipeline.run({ preprocessed });

    expect(result.riskLevel).toBe('safe');
    expect(result.redFlags).toHaveLength(0);
    expect(result.lessonCard).toBeUndefined();
  });

  it('generates lesson card for risky text', async () => {
    const riskyText = 'OTP của bạn là 123456, chuyển tiền gấp.';
    const preprocessed = {
      normalised: { cleaned: riskyText, ascii: riskyText, lower: riskyText.toLowerCase() },
      entities: [],
      redacted: { text: riskyText, redactions: [], count: 0 },
    };

    const result = await pipeline.run({ preprocessed });

    expect(result.lessonCard).toBeDefined();
    expect(result.lessonCard?.title).toContain('dấu hiệu');
    expect(result.lessonCard?.points.length).toBeGreaterThan(0);
  });

  it('includes audit trace', async () => {
    const text = 'Test scam message';
    const preprocessed = {
      normalised: { cleaned: text, ascii: text, lower: text.toLowerCase() },
      entities: [],
      redacted: { text, redactions: [], count: 0 },
    };

    const result = await pipeline.run({ preprocessed });

    expect(result.trace.inputHash).toMatch(/^hash_/);
    expect(result.trace.rulesMatched).toBeInstanceOf(Array);
    expect(result.trace.llmResponse).toBeDefined();
  });
});

// ── Real-world scam tests ──────────────────────────────────────────────────

describe('Real-world Scam Cases', () => {
  const pipeline = new DefaultRiskPipeline();

  it('detects impersonation scam', async () => {
    const scam =
      'Thông báo từ Ngân hàng: Tài khoản của quý khách sắp bị khóa. ' +
      'Vui lòng bấm link https://nganhang-fake.com để xác minh trong 10 phút.';

    const preprocessed = {
      normalised: { cleaned: scam, ascii: 'Thong bao tu Ngan hang...', lower: scam.toLowerCase() },
      entities: [],
      redacted: { text: scam, redactions: [], count: 0 },
    };

    const result = await pipeline.run({ preprocessed });

    expect(result.riskLevel).toBe('high_risk');
    expect(result.redFlags.some((f) => f.signal === 'authority_impersonation')).toBe(true);
    expect(result.redFlags.some((f) => f.signal === 'urgency')).toBe(true);
  });

  it('detects gift scam', async () => {
    const scam =
      'CHÚC MỪNG! Bạn đã trúng thưởng iPhone 15. ' +
      'Chuyển ngay 200,000 VND phí xử lý để nhận quà.';

    const preprocessed = {
      normalised: { cleaned: scam, ascii: 'CHUC MUNG! Ban da trung thuong...', lower: scam.toLowerCase() },
      entities: [],
      redacted: { text: scam, redactions: [], count: 0 },
    };

    const result = await pipeline.run({ preprocessed });

    // Debug: inspect what signals matched
    expect(result.trace.rulesMatched.length).toBeGreaterThanOrEqual(1);
    const sigs = result.trace.rulesMatched.map((r: any) => `${r.signal}(${r.weight})`);
    expect(sigs).toContain('too_good_to_be_true(medium)');
    expect(sigs).toContain('upfront_payment(high)');

    expect(result.riskLevel).toBe('high_risk');
    expect(result.redFlags.some((f) => f.signal === 'too_good_to_be_true')).toBe(true);
    expect(result.redFlags.some((f) => f.signal === 'upfront_payment')).toBe(true);
  });

  it('detects investment scam', async () => {
    const scam =
      'Cơ hội đầu tư lợi nhuận 20%/tháng. ' +
      'Nhiều người đã nhận lợi nhuận, đánh giá tốt. ' +
      'Chuyển tiền ngay để không bỏ lỡ.';

    const preprocessed = {
      normalised: { cleaned: scam, ascii: 'Co hoi dau tu loi nhuan 20%/thang...', lower: scam.toLowerCase() },
      entities: [],
      redacted: { text: scam, redactions: [], count: 0 },
    };

    const result = await pipeline.run({ preprocessed });

    expect(result.riskLevel).toBe('high_risk');
    expect(result.redFlags.some((f) => f.signal === 'too_good_to_be_true')).toBe(true);
    expect(result.redFlags.some((f) => f.signal === 'social_proof')).toBe(true);
  });
});
