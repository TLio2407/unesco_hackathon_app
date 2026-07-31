import { describe, expect, it } from 'vitest';
import { DIALECTS, setDialect, getDialect, simplifyJargon } from '../../src/i18n/regional';

describe('Regional Dialects & Simplified Vocabulary Glossary', () => {
  it('supports 5 regional dialects and minority representations', () => {
    expect(Object.keys(DIALECTS)).toHaveLength(5);
    expect(DIALECTS['vi-north'].regionLabel).toBe('Miền Bắc');
    expect(DIALECTS['vi-central'].regionLabel).toBe('Miền Trung');
    expect(DIALECTS['vi-south'].regionLabel).toBe('Miền Nam');
    expect(DIALECTS['hmn'].regionLabel).toBe('Tây Bắc');
  });

  it('allows switching active dialect dynamically', () => {
    setDialect('vi-south');
    expect(getDialect()).toBe('vi-south');

    setDialect('vi-north');
    expect(getDialect()).toBe('vi-north');
  });

  it('simplifies technical jargon into elderly-friendly everyday analogies', () => {
    const textWithJargon = 'Vui lòng không cung cấp Mã OTP và kiểm tra kĩ đường URL.';
    const simplified = simplifyJargon(textWithJargon);

    expect(simplified).toContain('Mã OTP (Mã mật khẩu 6 chữ số qua tin nhắn)');
    expect(simplified).toContain('Đường link / URL (Địa chỉ đường dẫn trang mạng)');
  });
});
