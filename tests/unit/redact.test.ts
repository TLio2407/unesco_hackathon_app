import { describe, it, expect } from 'vitest';
import { redact } from '../../src/lib/redact';

describe('redact', () => {
  it('redacts phone, CCCD and email', () => {
    const { text, redactions } = redact(
      'SĐT 0912345678 CCCD 012345678901 email a@b.com tài khoản 12345678'
    );
    expect(redactions).toBeGreaterThanOrEqual(3);
    expect(text).not.toContain('0912345678');
    expect(text).not.toContain('012345678901');
    expect(text).not.toContain('a@b.com');
    expect(text).toContain('[ĐÃ CHE]');
  });

  it('leaves safe text unchanged', () => {
    const { text, redactions } = redact('Tôi muốn hỏi con về tin nhắn này.');
    expect(redactions).toBe(0);
    expect(text).toBe('Tôi muốn hỏi con về tin nhắn này.');
  });
});
