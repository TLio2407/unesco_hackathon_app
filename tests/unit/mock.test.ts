import { describe, it, expect } from 'vitest';
import { mockAnalyze } from '../../src/api/mock';

describe('mockAnalyze', () => {
  it('flags fake authority + urgency + payment as high_risk', async () => {
    const out = await mockAnalyze({
      kind: 'text',
      text: 'Tài khoản VNeID của cô sắp bị khóa, bấm link trong 10 phút và chuyển tiền xác minh ngay.',
    });
    expect(out.riskLevel).toBe('high_risk');
    const signals = out.redFlags.map((r) => r.signal);
    expect(signals).toContain('authority_impersonation');
    expect(signals).toContain('urgency');
    expect(signals).toContain('upfront_payment');
    expect(out.nextAction).toContain('Dừng lại');
    expect(out.lessonCard).toBeDefined();
    expect(out.disclaimer).toBeTruthy();
  });

  it('flags too-good-to-be-true investment as caution or high', async () => {
    const out = await mockAnalyze({
      kind: 'text',
      text: 'Đầu tư lợi nhuận 30%/tháng, chuyển trước để giữ vị trí trúng thưởng.',
    });
    expect(['caution', 'high_risk']).toContain(out.riskLevel);
    expect(out.redFlags.map((r) => r.signal)).toContain('too_good_to_be_true');
  });

  it('returns insufficient_data for image (OCR is backend)', async () => {
    const out = await mockAnalyze({ kind: 'image', ref: 'base64...' });
    expect(out.riskLevel).toBe('insufficient_data');
  });

  it('returns safe for benign text', async () => {
    const out = await mockAnalyze({ kind: 'text', text: 'Chúc mừng sinh nhật bà nhé, tối nay ăn cơm cùng gia đình.' });
    expect(out.riskLevel).toBe('safe');
  });
});
