import { describe, it, expect } from 'vitest';
import { OutputAssembler, generateLesson, formatTrustedCircle, validateOutput } from '../../src/api/output';
import type { RedFlag } from '../../src/api/contract';

describe('OutputAssembler', () => {
  const assembler = new OutputAssembler();

  it('produces valid AnalyzeOutput for high_risk', () => {
    const flags: RedFlag[] = [
      { signal: 'urgency', explanation: 'Áp lực thời gian' },
      { signal: 'authority_impersonation', explanation: 'Giả danh cơ quan' },
    ];
    const out = assembler.assemble('high_risk', flags);
    expect(out.riskLevel).toBe('high_risk');
    expect(out.redFlags).toHaveLength(2);
    expect(out.lessonCard).toBeDefined();
    expect(out.disclaimer).toBeTruthy();
    expect(out.verificationSteps.length).toBeGreaterThan(0);
    expect(out.nextAction).toBeTruthy();
    expect(validateOutput(out)).toBe(true);
  });

  it('includes lessonCard for caution', () => {
    const flags: RedFlag[] = [{ signal: 'suspicious_url', explanation: 'Link lạ' }];
    const out = assembler.assemble('caution', flags);
    expect(out.lessonCard).toBeDefined();
    expect(validateOutput(out)).toBe(true);
  });

  it('omits lessonCard for safe level', () => {
    const out = assembler.assemble('safe', []);
    expect(out.lessonCard).toBeUndefined();
    expect(validateOutput(out)).toBe(true);
  });

  it('omits lessonCard for insufficient_data', () => {
    const out = assembler.assemble('insufficient_data', []);
    expect(out.lessonCard).toBeUndefined();
    expect(validateOutput(out)).toBe(true);
  });

  it('accepts overrides via options', () => {
    const flags: RedFlag[] = [{ signal: 'urgency', explanation: 'Gấp' }];
    const out = assembler.assemble('caution', flags, [], 'Tùy chỉnh', flags, {
      disclaimer: 'Tự chịu trách nhiệm',
    });
    expect(out.disclaimer).toBe('Tự chịu trách nhiệm');
    expect(out.nextAction).toBe('Tùy chỉnh');
  });
});

describe('generateLesson', () => {
  it('generates lesson card for risky signals', () => {
    const flags: RedFlag[] = [
      { signal: 'urgency', explanation: 'test' },
      { signal: 'upfront_payment', explanation: 'test' },
    ];
    const lesson = generateLesson(flags);
    expect(lesson).toBeDefined();
    expect(lesson!.title).toBe('3 dấu hiệu cần nhớ');
    expect(lesson!.points).toHaveLength(2);
    expect(lesson!.points[0]).toContain('Áp lực thời gian');
    expect(lesson!.points[1]).toContain('chuyển tiền');
    expect(lesson!.quiz).toBeDefined();
  });

  it('caps at 3 points', () => {
    const flags: RedFlag[] = [
      { signal: 'urgency', explanation: 'a' },
      { signal: 'authority_impersonation', explanation: 'b' },
      { signal: 'too_good_to_be_true', explanation: 'c' },
      { signal: 'upfront_payment', explanation: 'd' },
    ];
    const lesson = generateLesson(flags);
    expect(lesson!.points).toHaveLength(3);
  });

  it('returns undefined for no signals', () => {
    expect(generateLesson([])).toBeUndefined();
  });
});

describe('formatTrustedCircle', () => {
  it('contains risk info in output', () => {
    const result = formatTrustedCircle(
      { text: 'Chuyển tiền gấp vào tài khoản 0912345678' },
      'high_risk',
      [{ signal: 'urgency', explanation: 'Ép thời gian' }],
    );
    expect(result.plainText).toContain('HIGH_RISK');
    expect(result.plainText).toContain('Ép thời gian');
    expect(result.markdown).toContain('high_risk');
  });

  it('redacts PII', () => {
    const result = formatTrustedCircle(
      { text: 'Email a@b.com và số 0912345678' },
      'caution',
      [],
    );
    expect(result.redactionCount).toBeGreaterThanOrEqual(2);
    expect(result.plainText).not.toContain('a@b.com');
    expect(result.plainText).toContain('[ĐÃ CHE]');
  });

  it('returns both plainText and markdown', () => {
    const result = formatTrustedCircle({ text: 'Nội dung' }, 'safe', []);
    expect(result.plainText).toBeTruthy();
    expect(result.markdown).toBeTruthy();
    expect(typeof result.redactionCount).toBe('number');
  });
});

describe('validateOutput', () => {
  it('accepts valid output', () => {
    const valid = {
      riskLevel: 'caution',
      redFlags: [{ signal: 'urgency', explanation: 'Gấp' }],
      verificationSteps: ['Bước 1'],
      nextAction: 'Dừng lại',
    };
    expect(validateOutput(valid)).toBe(true);
  });

  it('rejects missing riskLevel', () => {
    expect(validateOutput({ redFlags: [], verificationSteps: [], nextAction: 'x' })).toBe(
      false,
    );
  });

  it('rejects invalid riskLevel', () => {
    expect(
      validateOutput({
        riskLevel: 'nuclear',
        redFlags: [],
        verificationSteps: [],
        nextAction: 'x',
      }),
    ).toBe(false);
  });

  it('rejects non-array redFlags', () => {
    expect(
      validateOutput({
        riskLevel: 'safe',
        redFlags: 'not-array',
        verificationSteps: [],
        nextAction: 'x',
      }),
    ).toBe(false);
  });

  it('rejects bad lessonCard shape', () => {
    expect(
      validateOutput({
        riskLevel: 'caution',
        redFlags: [{ signal: 'urgency', explanation: 'Gấp' }],
        verificationSteps: ['Bước 1'],
        nextAction: 'Dừng lại',
        lessonCard: { title: 42 },
      }),
    ).toBe(false);
  });

  it('rejects null', () => {
    expect(validateOutput(null)).toBe(false);
  });

  it('rejects non-object', () => {
    expect(validateOutput('string')).toBe(false);
  });
});
