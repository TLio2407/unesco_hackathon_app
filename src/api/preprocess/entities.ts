/**
 * WP2 — Entity Extractor
 *
 * Extracts structured entities from normalised Vietnamese text.
 * All extractors are pure functions returning typed arrays.
 */

// ── Entity types ─────────────────────────────────────────────────────────────

export interface VnPhone {
  kind: 'phone';
  value: string;
  /** "mobile" | "landline" | "unknown" */
  type: 'mobile' | 'landline' | 'unknown';
}

export interface VnBankAccount {
  kind: 'bank_account';
  value: string;
}

export interface VnCccd {
  kind: 'cccd';
  value: string;
}

export interface EmailAddress {
  kind: 'email';
  value: string;
}

export interface VnMoney {
  kind: 'money';
  value: string;
  amountRaw: string;
  currency: 'VND' | 'USD' | 'unknown';
}

export interface WebUrl {
  kind: 'web_url';
  value: string;
  /** Normalised hostname */
  host?: string;
}

export type ExtractedEntity =
  | VnPhone
  | VnBankAccount
  | VnCccd
  | EmailAddress
  | VnMoney
  | WebUrl;

// ── Extraction result ────────────────────────────────────────────────────────

export interface ExtractionResult {
  entities: ExtractedEntity[];
}

// ── Regex patterns (Vietnamese-specific) ─────────────────────────────────────

/** Vietnamese mobile: 03x, 05x, 07x, 08x, 09x + 9 digits */
const VN_MOBILE_RE = /\b(0[35789]\d{8})\b/g;

/** VN landline: 02x + 8-9 digits */
const VN_LANDLINE_RE = /\b(02\d{8,9})\b/g;

/** CCCD: exactly 12 digits (loose match — downstream validates checksum) */
const CCCD_RE = /\b(\d{12})\b/g;

/** Bank account: 8-14 digit runs that aren't phone or CCCD */
const BANK_ACCOUNT_RE = /\b(\d{8,14})\b/g;

/** Email */
const EMAIL_RE = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;

/** Money: amount + optional currency suffix (capturing group for currency) */
const MONEY_RE =
  /(\d{1,3}(?:[,.]\d{3})*(?:[,.]\d{0,3})?)\s*(VND|đ|USD|triệu|tỷ|nghìn|ngàn)/gi;

/** Vietnamese currency words (phrases) */
const MONEY_PHRASE_RE =
  /(\d+)\s*(triệu|tỷ|nghìn|ngàn)\s*(đồng)?/gi;

/** Loose URL match (http/https or www.domain) */
const URL_RE = /(https?:\/\/[^\s]+|www\.[^\s]+\.[a-z]{2,}[^\s]*)/gi;

// ── Extractors ───────────────────────────────────────────────────────────────

export function extractPhones(text: string): VnPhone[] {
  const results: VnPhone[] = [];
  for (const m of text.matchAll(VN_MOBILE_RE)) {
    results.push({ kind: 'phone', value: m[1], type: 'mobile' });
  }
  for (const m of text.matchAll(VN_LANDLINE_RE)) {
    // Avoid double-counting: landline patterns that also matched mobile
    if (!results.some((p) => p.value === m[1])) {
      results.push({ kind: 'phone', value: m[1], type: 'landline' });
    }
  }
  return results;
}

export function extractCccd(text: string): VnCccd[] {
  return [...text.matchAll(CCCD_RE)].map((m) => ({
    kind: 'cccd' as const,
    value: m[1],
  }));
}

export function extractBankAccounts(
  text: string,
  phones: VnPhone[],
  cccds: VnCccd[],
): VnBankAccount[] {
  const skip = new Set([
    ...phones.map((p) => p.value),
    ...cccds.map((c) => c.value),
  ]);
  return [...text.matchAll(BANK_ACCOUNT_RE)]
    .filter((m) => !skip.has(m[1]))
    .map((m) => ({ kind: 'bank_account' as const, value: m[1] }));
}

export function extractEmails(text: string): EmailAddress[] {
  return [...text.matchAll(EMAIL_RE)].map((m) => ({
    kind: 'email' as const,
    value: m[1],
  }));
}

export function extractMoney(text: string): VnMoney[] {
  const results: VnMoney[] = [];
  for (const m of text.matchAll(MONEY_RE)) {
    const raw = m[1].replace(/,/g, '');
    const suffix = (m[2] || '').toLowerCase();
    let currency: VnMoney['currency'] = 'unknown';
    if (['vnd', 'đ'].includes(suffix)) currency = 'VND';
    else if (suffix === 'usd') currency = 'USD';
    results.push({
      kind: 'money',
      value: m[0],
      amountRaw: raw,
      currency,
    });
  }
  for (const m of text.matchAll(MONEY_PHRASE_RE)) {
    const raw = m[1];
    const unit = (m[2] || '').toLowerCase();
    const full = m[0];
    // Avoid dupes
    if (!results.some((r) => r.value === full)) {
      results.push({
        kind: 'money',
        value: full,
        amountRaw: raw,
        currency: 'VND',
      });
    }
  }
  return results;
}

export function extractUrls(text: string): WebUrl[] {
  return [...text.matchAll(URL_RE)].map((m) => {
    let url = m[1];
    if (/^www\./i.test(url)) url = 'https://' + url;
    let host: string | undefined;
    try {
      host = new URL(url).hostname.toLowerCase();
    } catch {
      // ignore
    }
    return { kind: 'web_url' as const, value: url, host };
  });
}

// ── Main extractor ───────────────────────────────────────────────────────────

/**
 * Extract all entities from normalised text.
 * Returns deduplicated list ordered by kind: phones → cccd → bank → email → money → url.
 */
export function extractEntities(text: string): ExtractionResult {
  const phones = extractPhones(text);
  const cccds = extractCccd(text);
  const banks = extractBankAccounts(text, phones, cccds);
  const emails = extractEmails(text);
  const money = extractMoney(text);
  const urls = extractUrls(text);

  return {
    entities: [...phones, ...cccds, ...banks, ...emails, ...money, ...urls],
  };
}
