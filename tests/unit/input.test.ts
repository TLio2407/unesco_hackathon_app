/**
 * WP1 — Input Layer: Unit Tests
 *
 * Tests the InputProcessor, sanitizers, normalizers, and validators.
 * Vitest + pure functions = no mocks needed except for Date.now().
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

import { DefaultInputProcessor } from '../../src/api/input/processor';
import {
  sanitizeText,
  normalizeUrl,
  isAllowedMime,
  InputValidationError,
  DEFAULT_LIMITS,
  ALLOWED_IMAGE_MIMES,
  ALLOWED_VOICE_MIMES,
} from '../../src/api/input/types';

import type { RawInput, InputLimits } from '../../src/api/input/types';

// ── Test helpers ─────────────────────────────────────────────────────────────

function makeProcessor(limits?: InputLimits) {
  return new DefaultInputProcessor(limits);
}

function frozenNow() {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-07-14T00:00:00Z'));
}

beforeEach(() => frozenNow());
afterEach(() => vi.useRealTimers());

// ── Sanitize helpers ─────────────────────────────────────────────────────────

describe('sanitizeText()', () => {
  it('trims leading/trailing whitespace', () => {
    expect(sanitizeText('  hello  ')).toBe('hello');
  });

  it('collapses multiple spaces into one', () => {
    expect(sanitizeText('a   b    c')).toBe('a b c');
  });

  it('collapses tabs and spaces', () => {
    expect(sanitizeText('a\t  b\t c')).toBe('a b c');
  });

  it('collapses 3+ newlines into two', () => {
    expect(sanitizeText('a\n\n\n\nb')).toBe('a\n\nb');
  });

  it('strips null bytes', () => {
    expect(sanitizeText('he\0llo')).toBe('hello');
  });

  it('returns empty string for empty input', () => {
    expect(sanitizeText('')).toBe('');
  });

  it('returns empty string for whitespace-only', () => {
    expect(sanitizeText('   \t\n  ')).toBe('');
  });
});

// ── URL normalizer ───────────────────────────────────────────────────────────

describe('normalizeUrl()', () => {
  it('adds https:// if missing', () => {
    expect(normalizeUrl('example.com')).toBe('https://example.com/');
  });

  it('lowercases hostname', () => {
    expect(normalizeUrl('https://Example.COM/path')).toBe('https://example.com/path');
  });

  it('preserves existing scheme', () => {
    expect(normalizeUrl('http://example.com')).toBe('http://example.com/');
  });

  it('trims leading/trailing space', () => {
    expect(normalizeUrl('  https://example.com  ')).toBe('https://example.com/');
  });

  it('returns original for unparseable URL', () => {
    expect(normalizeUrl('not a url !!')).toBe('not a url !!');
  });
});

// ── MIME checker ─────────────────────────────────────────────────────────────

describe('isAllowedMime()', () => {
  it('accepts valid image MIME', () => {
    expect(isAllowedMime('image/png', ALLOWED_IMAGE_MIMES)).toBe(true);
    expect(isAllowedMime('image/jpeg', ALLOWED_IMAGE_MIMES)).toBe(true);
    expect(isAllowedMime('image/webp', ALLOWED_IMAGE_MIMES)).toBe(true);
  });

  it('rejects invalid image MIME', () => {
    expect(isAllowedMime('image/svg+xml', ALLOWED_IMAGE_MIMES)).toBe(false);
    expect(isAllowedMime('text/plain', ALLOWED_IMAGE_MIMES)).toBe(false);
  });

  it('handles MIME with charset (strips params)', () => {
    // The split logic strips '; codecs=opus' — so 'audio/webm' matches the allowed set
    expect(isAllowedMime('audio/webm; codecs=opus', ALLOWED_VOICE_MIMES)).toBe(true);
  });

  it('is case-insensitive', () => {
    expect(isAllowedMime('IMAGE/PNG', ALLOWED_IMAGE_MIMES)).toBe(true);
  });
});

// ── Text input processing ────────────────────────────────────────────────────

describe('InputProcessor — text', () => {
  const p = makeProcessor();

  it('processes valid text', () => {
    const result = p.process({ kind: 'text', text: 'Cảnh báo lừa đảo!' });
    expect(result.bag.kind).toBe('text');
    expect(result.bag.text).toBe('Cảnh báo lừa đảo!');
    expect(result.bag.receivedAt).toBeGreaterThan(0);
  });

  it('preserves source annotation', () => {
    const result = p.process({ kind: 'text', text: 'hello', source: 'paste' });
    expect(result.bag.source).toBe('paste');
  });

  it('rejects empty string', () => {
    expect(() => p.process({ kind: 'text', text: '' })).toThrow(InputValidationError);
  });

  it('rejects whitespace-only', () => {
    expect(() => p.process({ kind: 'text', text: '   \n  ' })).toThrow(InputValidationError);
  });

  it('rejects text exceeding limit', () => {
    const long = 'x'.repeat(DEFAULT_LIMITS.maxTextChars + 1);
    expect(() => p.process({ kind: 'text', text: long })).toThrow(InputValidationError);
  });

  it('trims and normalizes text', () => {
    const result = p.process({ kind: 'text', text: '  A\t\tB    C  ' });
    expect(result.bag.text).toBe('A B C');
  });

  it('has correct error code on empty', () => {
    try {
      p.process({ kind: 'text', text: '' });
    } catch (e) {
      expect(e).toBeInstanceOf(InputValidationError);
      expect((e as InputValidationError).code).toBe('EMPTY_INPUT');
    }
  });
});

// ── URL input processing ─────────────────────────────────────────────────────

describe('InputProcessor — url', () => {
  const p = makeProcessor();

  it('processes valid URL', () => {
    const result = p.process({ kind: 'url', url: 'https://example.com/scam' });
    expect(result.bag.kind).toBe('url');
    expect(result.bag.url).toBe('https://example.com/scam');
    expect(result.bag.text).toBe('https://example.com/scam');
  });

  it('adds https:// to bare domain', () => {
    const result = p.process({ kind: 'url', url: 'nganhang-vietnam.com' });
    expect(result.bag.url).toContain('https://');
  });

  it('rejects empty URL', () => {
    expect(() => p.process({ kind: 'url', url: '' })).toThrow(InputValidationError);
  });

  it('rejects unparseable URL', () => {
    expect(() =>
      p.process({ kind: 'url', url: 'not a real url !!!' }),
    ).toThrow(InputValidationError);
  });

  it('rejects URL exceeding limit', () => {
    const long = 'https://' + 'x'.repeat(DEFAULT_LIMITS.maxUrlChars) + '.com';
    expect(() => p.process({ kind: 'url', url: long })).toThrow(InputValidationError);
  });

  it('has correct error code for invalid URL', () => {
    try {
      p.process({ kind: 'url', url: '!!!' });
    } catch (e) {
      expect((e as InputValidationError).code).toBe('INVALID_URL');
    }
  });
});

// ── Image input processing ───────────────────────────────────────────────────

describe('InputProcessor — image', () => {
  const p = makeProcessor();

  const validImage: RawInput = {
    kind: 'image',
    data: 'x'.repeat(1000),
    mimeType: 'image/png',
  };

  it('processes valid image', () => {
    const result = p.process(validImage);
    expect(result.bag.kind).toBe('image');
    expect(result.bag.imageRef).toBeTruthy();
    expect(result.bag.imageRef).toMatch(/^img_\d+_\d+$/);
    expect(result.bag.text).toBe(''); // OCR not yet populated
  });

  it('rejects empty data', () => {
    expect(() =>
      p.process({ kind: 'image', data: '', mimeType: 'image/png' }),
    ).toThrow(InputValidationError);
  });

  it('rejects unsupported MIME type', () => {
    expect(() =>
      p.process({ kind: 'image', data: 'xxx', mimeType: 'image/svg+xml' }),
    ).toThrow(InputValidationError);
  });

  it('rejects image exceeding size limit', () => {
    const large = 'x'.repeat(DEFAULT_LIMITS.maxImageBytes + 1);
    expect(() =>
      p.process({ kind: 'image', data: large, mimeType: 'image/png' }),
    ).toThrow(InputValidationError);
  });

  it('preserves mimeType in bag', () => {
    const result = p.process(validImage);
    expect(result.bag.mimeType).toBe('image/png');
  });

  it('accepts all allowed MIME types', () => {
    for (const mime of ALLOWED_IMAGE_MIMES) {
      const result = p.process({
        kind: 'image',
        data: 'x'.repeat(100),
        mimeType: mime,
      });
      expect(result.bag.kind).toBe('image');
    }
  });

  it('has correct error code for unsupported MIME', () => {
    try {
      p.process({ kind: 'image', data: 'x', mimeType: 'text/plain' });
    } catch (e) {
      expect((e as InputValidationError).code).toBe('UNSUPPORTED_MIME');
    }
  });
});

// ── Voice input processing ───────────────────────────────────────────────────

describe('InputProcessor — voice', () => {
  const p = makeProcessor();

  const validVoice: RawInput = {
    kind: 'voice',
    data: 'x'.repeat(5000),
    mimeType: 'audio/webm',
    durationMs: 30_000,
  };

  it('processes valid voice', () => {
    const result = p.process(validVoice);
    expect(result.bag.kind).toBe('voice');
    expect(result.bag.voiceRef).toBeTruthy();
    expect(result.bag.voiceRef).toMatch(/^voice_\d+_\d+$/);
    expect(result.bag.text).toBe(''); // STT not yet populated
    expect(result.bag.durationMs).toBe(30_000);
  });

  it('rejects empty data', () => {
    expect(() =>
      p.process({ kind: 'voice', data: '', mimeType: 'audio/webm' }),
    ).toThrow(InputValidationError);
  });

  it('rejects unsupported MIME', () => {
    expect(() =>
      p.process({ kind: 'voice', data: 'x', mimeType: 'video/mp4' }),
    ).toThrow(InputValidationError);
  });

  it('rejects voice exceeding duration limit', () => {
    expect(() =>
      p.process({
        kind: 'voice',
        data: 'x',
        mimeType: 'audio/webm',
        durationMs: DEFAULT_LIMITS.maxVoiceDurationMs + 1,
      }),
    ).toThrow(InputValidationError);
  });

  it('rejects voice exceeding size limit', () => {
    const large = 'x'.repeat(DEFAULT_LIMITS.maxVoiceBytes + 1);
    expect(() =>
      p.process({
        kind: 'voice',
        data: large,
        mimeType: 'audio/webm',
      }),
    ).toThrow(InputValidationError);
  });

  it('allows voice without duration (unknown)', () => {
    const result = p.process({
      kind: 'voice',
      data: 'x'.repeat(100),
      mimeType: 'audio/webm',
    });
    expect(result.bag.durationMs).toBeUndefined();
  });
});

// ── Configurable limits ──────────────────────────────────────────────────────

describe('InputProcessor — custom limits', () => {
  it('respects custom text limit', () => {
    const p = new DefaultInputProcessor({ ...DEFAULT_LIMITS, maxTextChars: 5 });
    expect(() => p.process({ kind: 'text', text: '123456' })).toThrow(InputValidationError);
    const result = p.process({ kind: 'text', text: '12345' });
    expect(result.bag.text).toBe('12345');
  });

  it('respects custom image limit', () => {
    const p = new DefaultInputProcessor({
      ...DEFAULT_LIMITS,
      maxImageBytes: 10,
    });
    expect(() =>
      p.process({ kind: 'image', data: 'x'.repeat(11), mimeType: 'image/png' }),
    ).toThrow(InputValidationError);
  });
});

// ── Real-world scam input cases ──────────────────────────────────────────────

describe('InputProcessor — real-world scam inputs', () => {
  const p = makeProcessor();

  it('handles impersonation scam text', () => {
    const scamText =
      'Thông báo từ Ngân hàng: Tài khoản của quý khách sắp bị khóa. ' +
      'Vui lòng bấm link https://nganhang-fake.com để xác minh trong 10 phút.';
    const result = p.process({ kind: 'text', text: scamText });
    expect(result.bag.kind).toBe('text');
    expect(result.bag.text).toContain('Ngân hàng');
  });

  it('handles URL from scam message', () => {
    const result = p.process({
      kind: 'url',
      url: 'nganhang-fake.com/xac-minh',
      source: 'zalo-forward',
    });
    expect(result.bag.kind).toBe('url');
    expect(result.bag.source).toBe('zalo-forward');
    expect(result.bag.url).toBe('https://nganhang-fake.com/xac-minh');
  });

  it('handles gift scam text', () => {
    const scamText =
      'CHÚC MỪNG! Bạn đã trúng thưởng iPhone 15. ' +
      'Chuyển ngay 200,000 VND phí xử lý để nhận quà.';
    const result = p.process({ kind: 'text', text: scamText });
    expect(result.bag.text).toContain('trúng thưởng');
  });
});
