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

  it('flags suspicious URLs as high_risk or caution', async () => {
    const suspiciousUrls = [
      'http://bit.ly/otp-verify',
      'http://tinyurl.com/chuyen-tien',
      'http://goo.gl/giu-vi-tri',
    ];
    for (const url of suspiciousUrls) {
      const out = await mockAnalyze({ kind: 'url', url });
      expect(['caution', 'high_risk']).toContain(out.riskLevel);
      expect(out.redFlags.length).toBeGreaterThan(0);
    }
  });

  it('returns safe for legitimate URLs', async () => {
    const legitimateUrls = [
      'https://unesco.org',
      'https://www.google.com',
      'https://banking.gov.vn',
      'https://zalo.me',
    ];
    for (const url of legitimateUrls) {
      const out = await mockAnalyze({ kind: 'url', url });
      expect(out.riskLevel).toBe('safe');
      expect(out.redFlags).toHaveLength(0);
    }
  });

  it('flags URL with scam keywords as caution', async () => {
    const out = await mockAnalyze({
      kind: 'url',
      url: 'http://bit.ly/giu-vi-tri-trung-thuong',
    });
    expect(['caution', 'high_risk']).toContain(out.riskLevel);
  });
});
