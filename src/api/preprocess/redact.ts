/**
 * WP2 — PII Redaction (enhanced)
 *
 * Privacy-by-design: redacts identifiers (CCCD, phone, email,
 * account numbers) before ANY external call or Trusted Circle share.
 *
 * Extends src/lib/redact.ts with more VN-specific patterns
 * and structured redaction metadata for audit.
 */

// ── Types ────────────────────────────────────────────────────────────────────

export type PiiKind = 'phone' | 'cccd' | 'email' | 'bank_account' | 'otp';

export interface Redaction {
  kind: PiiKind;
  original: string;
  position: number; // byte offset in original text
}

export interface RedactResult {
  text: string;
  redactions: Redaction[];
  count: number;
}

// ── Patterns (ordered: more specific first) ──────────────────────────────────

interface Pattern {
  kind: PiiKind;
  re: RegExp;
}

const PATTERNS: Pattern[] = [
  // VN mobile (must come before generic digit runs)
  { kind: 'phone', re: /\b0[35789]\d{8}\b/g },
  // CCCD: 12 digit runs
  { kind: 'cccd', re: /\b\d{12}\b/g },
  // Email
  { kind: 'email', re: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g },
  // Bank account: 8-14 digits (not phone/CCCD, but digit run fallback)
  { kind: 'bank_account', re: /\b\d{8,14}\b/g },
  // OTP patterns: "OTP: 123456", "OTP của bạn là 123456", "mã xác nhận 654321"
  { kind: 'otp', re: /\b(?:OTP|mã\s*xác\s*nhận|mã\s*OTP)\b[^0-9]*?(\d{4,8})/gi },
];

const MASK = '[ĐÃ CHE]';

// ── Redaction engine ─────────────────────────────────────────────────────────

/** Track which digit sequences have already been redacted */
class DigitTracker {
  private seen = new Set<string>();

  isRedacted(value: string): boolean {
    return this.seen.has(value);
  }

  mark(value: string): void {
    this.seen.add(value);
  }
}

/**
 * Redact all PII from text.
 *
 * Rules:
 * - Phones, CCCD, emails are always redacted
 * - Bank account digit runs are redacted only if they aren't already
 *   covered by a phone/CCCD match
 * - OTP patterns: the OTP keyword + the digits are replaced
 * - Position tracking for auditability
 *
 * Returns redacted text + metadata for each redaction.
 */
export function redactPii(text: string): RedactResult {
  const redactions: Redaction[] = [];
  const tracker = new DigitTracker();

  let out = text;

  // Process in order: phones first → CCCD → email → bank → OTP
  for (const pattern of PATTERNS) {
    // Reset lastIndex for each pattern (global regex state)
    const re = new RegExp(pattern.re.source, pattern.re.flags);

    out = out.replace(re, (match, ...args) => {
      const offset = args[args.length - 2] as number;

      // For bank accounts: skip if already covered by phone/CCCD
      if (pattern.kind === 'bank_account' && tracker.isRedacted(match)) {
        return match;
      }

      redactions.push({
        kind: pattern.kind,
        original: match,
        position: offset,
      });

      if (pattern.kind === 'phone' || pattern.kind === 'cccd' || pattern.kind === 'bank_account') {
        tracker.mark(match);
      }

      // For OTP: keep the label but mask the digits
      if (pattern.kind === 'otp') {
        const label = match.replace(/\d{4,8}/, MASK);
        return label;
      }

      return MASK;
    });
  }

  return { text: out, redactions, count: redactions.length };
}
