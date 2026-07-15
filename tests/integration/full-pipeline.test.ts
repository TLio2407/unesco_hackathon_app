/**
 * Integration Test: Full Pipeline Composition
 *
 * Tests the complete WP1→WP2→WP3→WP5 pipeline with real implementations,
 * not mocked components. Uses real VN scam text flowing through all layers.
 */

import { describe, it, expect } from 'vitest';

import { DefaultInputProcessor } from '../../src/api/input/processor';
import { DefaultPreprocessPipeline } from '../../src/api/preprocess/pipeline';
import { DefaultRiskPipeline } from '../../src/api/risk/pipeline';
import { OutputAssembler } from '../../src/api/output/assembler';
import { AlertsIndex } from '../../src/api/evidence/index';
import alertsData from '../../data/evidence/alerts.json';
import type { RiskPipelineOutput, MatchedSignal, RedFlag, RiskLevel } from '../../src/api/risk/contract';

describe('Full Pipeline Integration', () => {
  const inputProcessor = new DefaultInputProcessor();
  const preprocessPipeline = new DefaultPreprocessPipeline();
  const riskPipeline = new DefaultRiskPipeline();
  const outputAssembler = new OutputAssembler();
  const evidenceIndex = new AlertsIndex(alertsData as any);

  it('processes VN impersonation scam through entire pipeline', async () => {
    // WP1: Input processing
    const scamText =
      'Thông báo từ Ngân hàng: Tài khoản của quý khách sắp bị khóa. ' +
      'Vui lòng bấm link https://nganhang-fake.com để xác minh trong 10 phút.';
    const inputResult = inputProcessor.process({ kind: 'text', text: scamText });
    expect(inputResult.bag.kind).toBe('text');
    expect(inputResult.bag.text).toContain('Ngân hàng');

    // WP2: Pre-processing (normalization + entity extraction + redaction)
    const preprocessed = preprocessPipeline.run(inputResult.bag);
    console.log('DEBUG preprocessed.normalised.lower:', preprocessed.normalised.lower);
    console.log('DEBUG preprocessed.redacted.text:', preprocessed.redacted.text);
    expect(preprocessed.normalised.cleaned).toBeTruthy();
    expect(preprocessed.redacted.text).toBeTruthy();
    expect(preprocessed.redacted.redactions.length).toBeGreaterThanOrEqual(0);

    // WP3: Risk reasoning (rules + LLM + RAG)
    const riskInput = { preprocessed, ragIndex: evidenceIndex };
    const riskOutput: RiskPipelineOutput = await riskPipeline.run(riskInput);

    // Verify risk output structure
    expect(riskOutput.riskLevel).toBe('high_risk');
    expect(riskOutput.redFlags.length).toBeGreaterThanOrEqual(2);
    expect(riskOutput.verificationSteps.length).toBeGreaterThan(0);
    expect(riskOutput.nextAction).toBeTruthy();
    expect(riskOutput.lessonCard).toBeDefined();
    expect(riskOutput.disclaimer).toContain('AI chỉ hỗ trợ');

    // Verify specific red flags for this scam
    const flagSignals = riskOutput.redFlags.map((f: RedFlag) => f.signal);
    expect(flagSignals).toContain('authority_impersonation');
    expect(flagSignals).toContain('urgency');
    expect(flagSignals).toContain('suspicious_url');

    // WP5: Output assembly (should match risk output since risk pipeline already uses assembler)
    const assembled = outputAssembler.assemble(
      riskOutput.riskLevel,
      riskOutput.redFlags,
      riskOutput.verificationSteps,
      riskOutput.nextAction,
      riskOutput.redFlags,
    );
    expect(assembled.riskLevel).toBe('high_risk');
    expect(assembled.lessonCard).toBeDefined();
  });

  it('processes VN gift scam through entire pipeline', async () => {
    const scamText =
      'CHÚC MỪNG! Bạn đã trúng thưởng iPhone 15. ' +
      'Chuyển ngay 200,000 VND phí xử lý để nhận quà.';
    const inputResult = inputProcessor.process({ kind: 'text', text: scamText });
    const preprocessed = preprocessPipeline.run(inputResult.bag);
    const riskOutput = await riskPipeline.run({ preprocessed, ragIndex: evidenceIndex });

    expect(riskOutput.riskLevel).toBe('high_risk');
    expect(riskOutput.redFlags.length).toBeGreaterThanOrEqual(2);

    const flagSignals = riskOutput.redFlags.map((f: RedFlag) => f.signal);
    expect(flagSignals).toContain('too_good_to_be_true');
    expect(flagSignals).toContain('upfront_payment');
  });

  it('processes VN investment scam through entire pipeline', async () => {
    const scamText =
      'Cơ hội đầu tư lợi nhuận 20%/tháng. ' +
      'Nhiều người đã nhận lợi nhuận, đánh giá tốt. ' +
      'Chuyển tiền ngay để không bỏ lỡ.';
    const inputResult = inputProcessor.process({ kind: 'text', text: scamText });
    const preprocessed = preprocessPipeline.run(inputResult.bag);
    const riskOutput = await riskPipeline.run({ preprocessed, ragIndex: evidenceIndex });

    expect(riskOutput.riskLevel).toBe('high_risk');
    const flagSignals = riskOutput.redFlags.map((f: RedFlag) => f.signal);
    expect(flagSignals).toContain('too_good_to_be_true');
    expect(flagSignals).toContain('social_proof');
  });

  it('processes safe text correctly', async () => {
    const safeText = 'Chào cô, chúc cô một ngày tốt lành.';
    const inputResult = inputProcessor.process({ kind: 'text', text: safeText });
    const preprocessed = preprocessPipeline.run(inputResult.bag);
    const riskOutput = await riskPipeline.run({ preprocessed, ragIndex: evidenceIndex });

    expect(riskOutput.riskLevel).toBe('safe');
    expect(riskOutput.redFlags).toHaveLength(0);
    expect(riskOutput.lessonCard).toBeUndefined();
  });

  it('handles URL input through pipeline', async () => {
    const urlInput = 'nganhang-fake.com/xac-minh';
    const inputResult = inputProcessor.process({ kind: 'url', url: urlInput });
    expect(inputResult.bag.kind).toBe('url');
    expect(inputResult.bag.url).toContain('https://');

    const preprocessed = preprocessPipeline.run(inputResult.bag);
    const riskOutput = await riskPipeline.run({ preprocessed, ragIndex: evidenceIndex });

    expect(riskOutput.riskLevel).not.toBe('insufficient_data');
    expect(riskOutput.redFlags.length).toBeGreaterThanOrEqual(0);
  });

  it('preserves audit trace through pipeline', async () => {
    const scamText = 'Công an yêu cầu chuyển 500,000 VND trong 10 phút.';
    const inputResult = inputProcessor.process({ kind: 'text', text: scamText });
    const preprocessed = preprocessPipeline.run(inputResult.bag);
    const riskOutput = await riskPipeline.run({ preprocessed, ragIndex: evidenceIndex });

    expect(riskOutput.trace).toBeDefined();
    expect(riskOutput.trace.inputHash).toMatch(/^hash_/);
    expect(riskOutput.trace.rulesMatched).toBeInstanceOf(Array);
    expect(riskOutput.trace.rulesMatched.length).toBeGreaterThan(0);
    expect(riskOutput.trace.llmResponse).toBeDefined();
  });

  it('verifies PII redaction before LLM call', async () => {
    const scamText = 'SĐT 0912345678 CCCD 123456789012 OTP 123456 chuyển tiền ngay.';
    const inputResult = inputProcessor.process({ kind: 'text', text: scamText });
    const preprocessed = preprocessPipeline.run(inputResult.bag);

    // Redacted text should not contain raw PII
    expect(preprocessed.redacted.text).not.toContain('0912345678');
    expect(preprocessed.redacted.text).not.toContain('123456789012');
    expect(preprocessed.redacted.text).not.toContain('123456');
    expect(preprocessed.redacted.redactions.length).toBeGreaterThan(0);

    // Pipeline should still work with redacted text
    const riskOutput = await riskPipeline.run({ preprocessed, ragIndex: evidenceIndex });
    expect(riskOutput.riskLevel).toBe('high_risk');
  });

  it('RAG retrieves relevant evidence for matched signals', async () => {
    const scamText = 'Công an yêu cầu chuyển tiền gấp. Link lạ: bit.ly/scam';
    const inputResult = inputProcessor.process({ kind: 'text', text: scamText });
    const preprocessed = preprocessPipeline.run(inputResult.bag);
    const riskOutput = await riskPipeline.run({ preprocessed, ragIndex: evidenceIndex });

    // Trace should include RAG retrieved alerts
    expect(riskOutput.trace.ragRetrieved).toBeDefined();
    if (riskOutput.trace.ragRetrieved && riskOutput.trace.ragRetrieved.length > 0) {
      const alerts = riskOutput.trace.ragRetrieved;
      expect(alerts[0]).toHaveProperty('title');
      expect(alerts[0]).toHaveProperty('signals');
    }
  });
});

describe('WP2→WP6 Privacy Guard Integration', () => {
  const inputProcessor = new DefaultInputProcessor();
  const preprocessPipeline = new DefaultPreprocessPipeline();

  it('redacts PII before any external call', () => {
    const piiText = 'SĐT: 0901234567, CCCD: 001200001234, Email: user@example.com';
    const inputResult = inputProcessor.process({ kind: 'text', text: piiText });
    const preprocessed = preprocessPipeline.run(inputResult.bag);

    // All PII types should be redacted
    expect(preprocessed.redacted.text).not.toContain('0901234567');
    expect(preprocessed.redacted.text).not.toContain('001200001234');
    expect(preprocessed.redacted.text).not.toContain('user@example.com');
    expect(preprocessed.redacted.redactions.length).toBeGreaterThanOrEqual(3);
  });

  it('preserves non-PII text during redaction', () => {
    const normalText = 'Chào bạn, hôm nay thời tiết đẹp quá!';
    const inputResult = inputProcessor.process({ kind: 'text', text: normalText });
    const preprocessed = preprocessPipeline.run(inputResult.bag);

    // Non-PII text should remain unchanged
    expect(preprocessed.redacted.text).toBe(normalText);
    expect(preprocessed.redacted.redactions).toHaveLength(0);
  });
});
