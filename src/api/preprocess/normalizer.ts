/**
 * WP2 — Text Normalizer
 *
 * Pure-function pipeline that normalises Vietnamese + English text
 * before it hits the risk reasoning engine.  Every stage is
 * unit-testable in isolation.
 *
 * Pipeline: raw → whitespace → diacritics → entities → redact → bag
 */

// ── Unicode helpers ──────────────────────────────────────────────────────────

/** Strip zero-width characters, BOM, etc. (invisible noise). */
export function stripInvisible(text: string): string {
  return text.replace(/[\u200B-\u200D\uFEFF\u00AD\u2060]/g, '');
}

/** Collapse runs of whitespace (spaces, tabs, non-breaking spaces) to one. */
export function collapseWhitespace(text: string): string {
  return text
    .replace(/[\t\u00A0\u3000]/g, ' ')
    .replace(/  +/g, ' ')
    .trim();
}

/** Collapse 3+ newlines to at most 2. */
export function collapseNewlines(text: string): string {
  return text.replace(/\n{3,}/g, '\n\n');
}

/** Fold VN diacritics to ASCII base (fuzzy matching helper, not for display). */
export function foldDiacritics(text: string): string {
  // VN tone marks → base (NFC decomposed, strip combining marks)
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

// ── Vietnamese-specific normalisation ────────────────────────────────────────

const TYPO_MAP: [RegExp, string][] = [
  [/“|”/g, '"'],
  [/‘|’/g, "'"],
  [/…+/g, '...'],
  [/([!?]){2,}/g, '$1'], // collapse !! or ?? to one
  [/\u2013|\u2014/g, '-'], // en-dash, em-dash → hyphen
];

/** Fix common punctuation noise (smart quotes, excessive punctuation). */
export function normalisePunctuation(text: string): string {
  return TYPO_MAP.reduce((t, [re, sub]) => t.replace(re, sub), text);
}

// ── Composed pipeline ────────────────────────────────────────────────────────

export interface NormalisedText {
  /** Display-safe text (keeps diacritics, clean punctuation) */
  cleaned: string;
  /** ASCII-folded text for search / keyword matching */
  ascii: string;
  /** Lowercased ascii for case-insensitive matching */
  lower: string;
}

/**
 * Run the full normalisation pipeline on a raw text string.
 * Returns three views: cleaned (display), ascii (search), lower (matching).
 */
export function normalise(text: string): NormalisedText {
  const cleaned = stripInvisible(
    normalisePunctuation(collapseNewlines(collapseWhitespace(text))),
  );
  const ascii = foldDiacritics(cleaned);
  const lower = ascii.toLowerCase();
  return { cleaned, ascii, lower };
}
