export interface RedactResult {
  text: string;
  redactions: number;
}

const PATTERNS: RegExp[] = [
  /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi, // email
  /\b0[0-9]{9}\b/g, // VN mobile
  /\b\d{9,12}\b/g, // CCCD / long digit runs
  /\b\d{8,}\b/g, // bank account fallback
];

const MASK = '[ĐÃ CHE]';

// Redacts identifiers (CCCD, phone, email, account numbers) before any
// Trusted Circle share. Privacy-by-design: no sensitive data leaves the device
// unredacted. Pure function, unit-tested.
export function redact(text: string): RedactResult {
  let redactions = 0;
  const out = PATTERNS.reduce((acc, re) => {
    return acc.replace(re, () => {
      redactions += 1;
      return MASK;
    });
  }, text);
  return { text: out, redactions };
}
