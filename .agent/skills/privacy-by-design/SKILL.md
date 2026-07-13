# Privacy By Design — PII Redaction Pattern Library

## When To Use
Any time user text leaves the application boundary: LLM calls, analytics, Trusted Circle shares, logging, error messages, audit trails.

## The Two-Tier Rule

```
Tier 1: INGRESS FILTER — redact BEFORE any external call
Tier 2: EXPORT FILTER — whitelist-only metadata at export time
BOTH tiers must be in place for defense-in-depth.
```

## PII Types Covered (Vietnamese Context)

| PII Type | Pattern | Examples |
|----------|---------|----------|
| Phone (VN mobile) | `0[35789]\d{8}` | 0912345678 |
| CCCD (national ID) | `\d{12}` | 012345678901 |
| Email | `...@...\..{2,}` | abc@test.com |
| Bank account | `\d{8,14}` (after phone/CCCD dedup) | 123456789012 |
| OTP | keyword + 4-8 digits with text between | OTP: 123456, mã của bạn là 654321 |

## Pattern: Redaction Engine

```ts
// Tier 1: Pre-call redaction
export interface Redaction {
  kind: 'phone' | 'cccd' | 'email' | 'bank_account' | 'otp';
  original: string;
  position: number; // byte offset for audit trail
}

export function redactPii(text: string): { text: string; redactions: Redaction[]; count: number }

// Usage in WP3 pipeline (Betriebsrat C-001 fix):
// NOT: generateExplanation(signals, normalised.lower)  // PII leak!
// YES: generateExplanation(signals, redacted.text)      // zero PII
```

## Pattern: Metadata Whitelist

```ts
// Tier 2: Export-time filter
const VALID_META_KEYS = new Set([
  'riskLevel',      // safe | caution | high_risk
  'redFlagCount',   // number
  'lessonShown',    // boolean
  'signal',         // string (red flag type)
  'count',           // number
]);

export function filterMeta(
  meta: Record<string, any> | undefined
): Record<string, string | number | boolean> | undefined {
  if (!meta) return undefined;
  const filtered: Record<string, string | number | boolean> = {};
  for (const key of Object.keys(meta)) {
    if (VALID_META_KEYS.has(key)) {
      filtered[key] = meta[key];  // only whitelisted keys
    }
  }
  return Object.keys(filtered).length > 0 ? filtered : undefined;
}
```

## Pattern: Deduplication (Digit Tracker)

```ts
// Prevent double-redaction: phone 0912345678 also matches bank \d{8,14}
class DigitTracker {
  private seen = new Set<string>();
  isRedacted(value: string): boolean { return this.seen.has(value); }
  mark(value: string): void { this.seen.add(value); }
}
// Process phones first → mark digits → bank matches skip already-marked
```

## Audit Trail Requirements

Every redaction must produce metadata:
```ts
interface Redaction { kind, original, position }
```
This enables:
- Compliance verification (how many fields were redacted?)
- Debugging (what was redacted and where?)
- Trusted Circle transparency ("Đã che 4 thông tin cá nhân trước khi gửi")

## Anti-Patterns That Leaked PII

### 1. URL in Error Message (WP1, fixed)
```ts
// BROKEN: URL can contain tokens, emails, tracking IDs
throw new Error(`Cannot parse URL: ${raw.url}`);
// FIXED:
throw new InputValidationError('INVALID_URL', 'Cannot parse URL');
```

### 2. Raw Text to LLM (WP3, Betriebsrat C-001)
```ts
// BROKEN: sends raw user text with phones/CCCD/OTP to external service
generateExplanation(signals, normalised.lower)
// FIXED:
generateExplanation(signals, redacted.text)
```

### 3. Analytics Queue Stores PII (WP7, Auditor A-002)
```ts
// BROKEN: raw event metadata lives in queue for 30s before export filter
this.queue.push(event);
// FIXED:
this.queue.push({ ...event, metadata: filterMeta(event.metadata) });
```

## The Betriebsrat Check

Before any code merge, verify:
- [ ] All external calls receive redacted data
- [ ] All analytics events filtered at ingestion
- [ ] All error messages sanitized of user input
- [ ] All logs use hashed identifiers, never raw PII
- [ ] Consent required before data sharing (Trusted Circle)
- [ ] Session TTL enforced, no disk persistence by default
- [ ] Whistleblower channel preserved — no retaliation
