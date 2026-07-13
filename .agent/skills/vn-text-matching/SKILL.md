# VN Text Matching — Regex Patterns for Vietnamese Scam Detection

## When To Use
Writing regex patterns for Vietnamese text. Every rule in WP3's rule engine and every PII detector in WP2's entity extractor depends on this.

## The Core Problem: JavaScript `\b` Is ASCII-Only

```js
// BROKEN: Vietnamese diacritics are not [a-zA-Z0-9_]
/\bphí\b/i.test('phí xử lý')  // → false!
/\bgấp\b/i.test('rất gấp')     // → false!
/\bbộ\b/i.test('bộ công an')   // → false!

// WORKING: omit \b for VN words, rely on regex specificity
/phí/i.test('phí xử lý')       // → true
/gấp/i.test('rất gấp')         // → true
/bộ/i.test('bộ công an')       // → true
```

## Why `\b` Fails

JavaScript's `\b` matches between `[a-zA-Z0-9_]` (word char) and `[^a-zA-Z0-9_]` (non-word char). Vietnamese diacritics like `í` (U+00ED), `ấ` (U+1EA5), `ộ` (U+1ED9) are NOT in `[a-zA-Z0-9_]`. So `\b` after "phí" finds `í` is non-word (from JS perspective), and looks for a word character after it. The space after "phí" is also non-word. `\b` fails because both sides are non-word.

Even the modern ES2018 `u` flag doesn't fix `\b` — it remains ASCII-only.

## Correct Patterns for VN Text

### Simple Words (Acceptable False Positive Risk)
```js
/gấp/i           // "gấp" anywhere — fine for scam detection
/phí/i           // "phí" anywhere — fine, combines with other signals
/bộ/i            // "bộ" anywhere — authority_impersonation has other signals too
```

### Unicode-Aware Word Boundary (Production-Ready)
```js
// Positive: preceded by start-or-punctuation, followed by end-or-punctuation
/(?:(?<=\s)|^)phí(?=\s|$)/i
// Or: preceded by non-letter, followed by non-letter
/(?<!\p{L})phí(?!\p{L})/u
```

### Common VN Text Patterns (Battle-Tested)

```js
// VN phone: 03x, 05x, 07x, 08x, 09x + 8 digits
/\b0[35789]\d{8}\b/      // \b works: 0 and digits are ASCII ✓

// CCCD: 12 digits
/\b\d{12}\b/             // \b works: all digits are ASCII ✓

// Bank account: 8-14 digits, excluding phone/CCCD already matched
/\b\d{8,14}\b/           // \b works ✓ (but dedup against phones!)

// OTP: keyword + digits with text between
/\b(?:OTP|mã\s*xác\s*nhận|mã\s*OTP)\b[^0-9]*?(\d{4,8})/gi
// \b works for "OTP" (ASCII), [^0-9]*? allows text between keyword and digits

// Email: all ASCII
/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g  // ✓ no \b needed

// VN money: number + currency
/(\d{1,3}(?:[,.]\d{3})*(?:[,.]\d{0,3})?)\s*(triệu|tỷ|nghìn|ngàn|VND|đ|USD)/gi

// VN phrases (spaces between words use \s*)
/công\s*an/i             // ✓ \s* handles "công an" and "côngan"
/ngân\s*hàng/i           // ✓
/chuyển\s*tiền/i         // ✓
/trúng\s*thưởng/i        // ✓
/mật\s*khẩu/i            // ✓
```

## The NFC/NFD Trap

Vietnamese text can be in two Unicode normalization forms:
- **NFC**: `"trúng"` — single code point for `ú` (U+00FA)
- **NFD**: `"trúng"` — `u` (U+0075) + combining accent `́` (U+0301)

JavaScript `.toLowerCase()` preserves the form of the input. If source code is NFC (VSCode default) and test text is also NFC → match. But if text comes from external source in NFD → regex fails.

**Fix for production**: `text.normalize('NFC')` before regex matching.

## Pattern Priority in Rule Engine
```js
// Order matters: more specific first
PATTERNS = [
  { kind: 'phone', re: /\b0[35789]\d{8}\b/g },     // 1st: specific VN mobile
  { kind: 'cccd', re: /\b\d{12}\b/g },               // 2nd: CCCD is 12 digits
  { kind: 'email', re: /...@...\..{2,}/g },          // 3rd: email
  { kind: 'bank_account', re: /\b\d{8,14}\b/g },     // 4th: any remaining digit runs
  { kind: 'otp', re: /\b(?:OTP|mã\s*...)\b[^0-9]*?(\d{4,8})/gi } // 5th: OTP
]
// Bank account MUST be last among digit patterns to avoid
// stealing phone/CCCD matches.
```

## Testing VN Patterns
```ts
// Always test with:
// 1. Exact match
expect(/trúng\s*thưởng/i.test('trúng thưởng')).toBe(true)
// 2. Diacritic variants
expect(/trúng\s*thưởng/i.test('TRÚNG THƯỞNG')).toBe(true)  // uppercase
// 3. False positive check
expect(/trúng\s*thưởng/i.test('trung thu')).toBe(false)
// 4. NFC/NFD normalization
expect(/trúng\s*thưởng/i.test('tru\u0301ng th\u01B0\u01A1\u0309ng')).toBe(true)
```
