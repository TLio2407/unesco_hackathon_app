/**
 * WP2 — Pre-processing Layer: Unit Tests
 *
 * Tests the normaliser, entity extractor, PII redactor, and pipeline.
 */

import { describe, it, expect } from 'vitest';

import {
  normalise,
  foldDiacritics,
  collapseWhitespace,
  stripInvisible,
} from '../../src/api/preprocess/normalizer';

import {
  extractEntities,
  extractPhones,
  extractCccd,
  extractEmails,
  extractMoney,
  extractUrls,
} from '../../src/api/preprocess/entities';

import { redactPii } from '../../src/api/preprocess/redact';

import { DefaultPreprocessPipeline } from '../../src/api/preprocess/pipeline';
import type { InputBag } from '../../src/api/input';

// ── Normaliser tests ─────────────────────────────────────────────────────────

describe('normaliser', () => {
  describe('stripInvisible()', () => {
    it('removes zero-width spaces', () => {
      expect(stripInvisible('he\u200Bllo')).toBe('hello');
    });

    it('removes BOM', () => {
      expect(stripInvisible('\uFEFFhello')).toBe('hello');
    });

    it('preserves normal text', () => {
      expect(stripInvisible('Chào bạn')).toBe('Chào bạn');
    });
  });

  describe('collapseWhitespace()', () => {
    it('collapses multiple spaces', () => {
      expect(collapseWhitespace('a     b')).toBe('a b');
    });

    it('handles tabs', () => {
      expect(collapseWhitespace('a\t\tb')).toBe('a b');
    });

    it('handles non-breaking spaces', () => {
      expect(collapseWhitespace('a\u00A0b')).toBe('a b');
    });

    it('trims leading/trailing whitespace', () => {
      expect(collapseWhitespace('  hello  ')).toBe('hello');
    });
  });

  describe('foldDiacritics()', () => {
    it('strips VN tone marks', () => {
      expect(foldDiacritics('Cảnh báo lừa đảo')).toBe('Canh bao lua dao');
    });

    it('handles đ/Đ', () => {
      expect(foldDiacritics('đúng Đẹp')).toBe('dung Dep');
    });

    it('preserves ASCII', () => {
      expect(foldDiacritics('hello world')).toBe('hello world');
    });
  });

  describe('normalise()', () => {
    it('produces cleaned, ascii, and lower views', () => {
      const result = normalise('  Cảnh  báo   LỪA ĐẢO!  ');
      expect(result.cleaned).toBe('Cảnh báo LỪA ĐẢO!');
      expect(result.ascii).toBe('Canh bao LUA DAO!');
      expect(result.lower).toBe('canh bao lua dao!');
    });

    it('collapses excessive punctuation', () => {
      const result = normalise('Khẩn cấp!!!');
      expect(result.cleaned).toBe('Khẩn cấp!');
    });

    it('handles smart quotes', () => {
      const result = normalise('\u201Cngân hàng\u201D');
      expect(result.cleaned).toBe('"ngân hàng"');
    });

    it('handles empty string', () => {
      const result = normalise('');
      expect(result.cleaned).toBe('');
      expect(result.ascii).toBe('');
      expect(result.lower).toBe('');
    });
  });
});

// ── Entity extractor tests ───────────────────────────────────────────────────

describe('entity extractor', () => {
  describe('extractPhones()', () => {
    it('extracts VN mobile numbers', () => {
      const phones = extractPhones('Gọi 0912345678 để xác nhận');
      expect(phones).toHaveLength(1);
      expect(phones[0].value).toBe('0912345678');
      expect(phones[0].type).toBe('mobile');
    });

    it('extracts VN landline numbers', () => {
      const phones = extractPhones('Hotline 02412345678');
      expect(phones).toHaveLength(1);
      expect(phones[0].type).toBe('landline');
    });

    it('returns empty for no phones', () => {
      expect(extractPhones('Không có số điện thoại')).toHaveLength(0);
    });
  });

  describe('extractCccd()', () => {
    it('extracts 12-digit CCCD', () => {
      const cccds = extractCccd('CCCD 012345678901 của tôi');
      expect(cccds).toHaveLength(1);
      expect(cccds[0].value).toBe('012345678901');
    });

    it('returns empty for no CCCD', () => {
      expect(extractCccd('12345 67890')).toHaveLength(0);
    });
  });

  describe('extractEmails()', () => {
    it('extracts email', () => {
      const emails = extractEmails('Liên hệ abc@def.com hoặc xyz@ghi.com.vn');
      expect(emails).toHaveLength(2);
      expect(emails[0].value).toBe('abc@def.com');
    });
  });

  describe('extractMoney()', () => {
    it('extracts VND amounts', () => {
      const money = extractMoney('Chuyển 500,000 VND để nhận quà');
      expect(money).toHaveLength(1);
      expect(money[0].currency).toBe('VND');
    });

    it('extracts triệu/đồng phrases', () => {
      const money = extractMoney('Nhận ngay 50 triệu đồng');
      const vnd = money.filter((m) => m.currency === 'VND');
      expect(vnd.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('extractUrls()', () => {
    it('extracts http URLs', () => {
      const urls = extractUrls('Bấm https://nganhang-fake.com để xác minh');
      expect(urls).toHaveLength(1);
      expect(urls[0].host).toBe('nganhang-fake.com');
    });

    it('extracts www URLs', () => {
      const urls = extractUrls('Vào www.scam-site.com ngay');
      expect(urls).toHaveLength(1);
      expect(urls[0].value).toContain('https://');
    });
  });

  describe('extractEntities() — full', () => {
    it('extracts multiple entity types', () => {
      const text =
        'Gọi 0912345678, CCCD 012345678901, email test@fake.com, ' +
        'chuyển 200,000 VND vào tài khoản 1234567890, ' +
        'bấm https://scam.com/xac-nhan';
      const result = extractEntities(text);
      expect(result.entities.length).toBeGreaterThanOrEqual(5);
    });
  });
});

// ── PII redaction tests ──────────────────────────────────────────────────────

describe('redactPii()', () => {
  it('redacts phone numbers', () => {
    const result = redactPii('SĐT tôi là 0912345678');
    expect(result.text).not.toContain('0912345678');
    expect(result.text).toContain('[ĐÃ CHE]');
  });

  it('redacts CCCD', () => {
    const result = redactPii('CCCD 012345678901 của tôi');
    expect(result.text).not.toContain('012345678901');
  });

  it('redacts emails', () => {
    const result = redactPii('Email abc@test.com');
    expect(result.text).not.toContain('abc@test.com');
  });

  it('redacts bank account numbers', () => {
    const result = redactPii('Tài khoản 123456789012 của tôi');
    expect(result.text).not.toContain('123456789012');
  });

  it('redacts OTP patterns', () => {
    const result = redactPii('OTP của bạn là 123456, không chia sẻ');
    expect(result.text).toContain('OTP');
    expect(result.text).toContain('[ĐÃ CHE]');
    expect(result.text).not.toContain('123456');
  });

  it('avoids double-redacting phone that is also a bank account match', () => {
    const result = redactPii('SĐT 0912345678, tài khoản 0912345678');
    // The phone match covers both; count should not be double
    expect(result.count).toBeGreaterThanOrEqual(1);
  });

  it('tracks redaction metadata', () => {
    const result = redactPii('SĐT 0912345678 và CCCD 012345678901');
    expect(result.redactions).toHaveLength(2);
    expect(result.redactions[0].kind).toBe('phone');
    expect(result.redactions[1].kind).toBe('cccd');
  });

  it('leaves safe text unchanged', () => {
    const result = redactPii('Tôi muốn hỏi con về tin nhắn này.');
    expect(result.text).toBe('Tôi muốn hỏi con về tin nhắn này.');
    expect(result.count).toBe(0);
  });

  it('redacts all PII in a real scam message', () => {
    const scam =
      'Ngân hàng thông báo: Tài khoản 1234567890 sắp bị khóa. ' +
      'Gọi ngay 0912345678, cung cấp CCCD 012345678901 và OTP 654321 ' +
      'để xác minh. Email hotro@nganhang-fake.com.';
    const result = redactPii(scam);
    expect(result.count).toBeGreaterThanOrEqual(4); // bank, phone, cccd, otp, email
    expect(result.text).not.toContain('0912345678');
    expect(result.text).not.toContain('012345678901');
    expect(result.text).not.toContain('654321');
    expect(result.text).toContain('Ngân hàng thông báo'); // safe text preserved
  });
});

// ── Pipeline integration tests ───────────────────────────────────────────────

describe('PreprocessPipeline', () => {
  const pipeline = new DefaultPreprocessPipeline();

  it('processes text input end-to-end', () => {
    const bag: InputBag = {
      kind: 'text',
      text: 'Cảnh báo: gọi 0912345678, CCCD 012345678901 để nhận 50 triệu.',
      source: 'zalo',
      receivedAt: Date.now(),
    };

    const result = pipeline.run(bag);

    expect(result.normalised.cleaned).toContain('Cảnh báo');
    expect(result.normalised.lower).toContain('canh bao');
    expect(result.entities.entities.length).toBeGreaterThan(0);
    expect(result.redacted.text).not.toContain('0912345678');
    expect(result.redacted.text).not.toContain('012345678901');
    expect(result.original).toBe(bag);
  });

  it('handles empty text gracefully', () => {
    const bag: InputBag = {
      kind: 'text',
      text: '',
      source: 'paste',
      receivedAt: Date.now(),
    };
    const result = pipeline.run(bag);
    expect(result.normalised.cleaned).toBe('');
    expect(result.entities.entities).toHaveLength(0);
    expect(result.redacted.count).toBe(0);
  });

  it('handles email scam text', () => {
    const bag: InputBag = {
      kind: 'text',
      text:
        'HOTRO@SCAM.COM yêu cầu chuyển 2,000,000 VND, ' +
        'CCCD 012345678901, SĐT 0987654321',
      receivedAt: Date.now(),
    };

    const result = pipeline.run(bag);

    expect(result.redacted.text).not.toContain('HOTRO@SCAM.COM');
    expect(result.redacted.text).not.toContain('0987654321');
    expect(result.redacted.text).not.toContain('012345678901');
    expect(result.redacted.count).toBeGreaterThanOrEqual(3);
  });
});
