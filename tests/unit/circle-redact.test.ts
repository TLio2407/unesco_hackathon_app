import { describe, it, expect } from 'vitest';
import { redact } from '../../src/lib/redact';

describe('circle redact', () => {
  it('hides phone number in shared summary', () => {
    const { text, redactions } = redact('Cô gọi SĐT 0912345678 để xác minh.');
    expect(redactions).toBeGreaterThanOrEqual(1);
    expect(text).not.toContain('0912345678');
    expect(text).toContain('[ĐÃ CHE]');
  });

  it('hides CCCD in shared summary', () => {
    const { text } = redact('Người gửi yêu cầu CCCD 012345678901.');
    expect(text).not.toContain('012345678901');
  });
});
