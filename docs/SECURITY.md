# Security Policy — SilverTrust

## Scope

This app processes sensitive data from elderly Vietnamese users:
- Personal messages (text, URLs, images, voice)
- PII: phone numbers, CCCD, bank accounts, emails, OTP codes
- Risk assessment results
- Analytics events (anonymized)

## Data Handling

### PII Redaction (Privacy-by-Design)
- **All** PII is redacted before leaving the device
- `src/api/preprocess/redact.ts` — Vietnamese-specific PII patterns
- `src/lib/redact.ts` — Generic identifier redaction
- Redacted text is the ONLY form sent to LLM services
- Audit trail logs redaction counts, not raw data

### Consent Management
- `src/api/privacy/consent.ts` — Token-based consent for sharing
- `src/api/privacy/audit.ts` — Immutable audit log (SHA-256 hashed tokens)
- `src/api/privacy/session.ts` — TTL-based session cleanup (15 min default)

### Analytics Privacy
- `src/api/analytics/schema.ts` — Metadata whitelist (only riskLevel, redFlagCount, lessonShown allowed)
- `src/api/analytics/exporter.ts` — PII stripped before export
- CSV/JSONL exports contain no personal identifiers

## Vulnerability Reporting

If you discover a security vulnerability:

1. **DO NOT** create a public GitHub issue
2. Email: security@silverttrust.dev (placeholder — use project maintainer contact)
3. Include: description, reproduction steps, affected version
4. We respond within 48 hours, remediate within 7 days

## Threat Model

| Threat | Mitigation | Location |
|--------|-----------|----------|
| PII leak via LLM | Redaction before external calls | `src/api/preprocess/redact.ts` |
| Unauthorized data access | Consent tokens, session TTL | `src/api/privacy/` |
| Analytics PII leakage | Metadata whitelist | `src/api/analytics/schema.ts` |
| Man-in-the-middle | HTTPS only, certificate pinning (mobile) | Network layer |
| Local storage exposure | AsyncStorage encryption (mobile) | `@react-native-async-storage/async-storage` |
| Supply chain | Lockfiles, pinned versions | `pnpm-lock.yaml` |
| Dependency vulnerabilities | Regular `npm audit` | CI pipeline |

## Compliance

- **GDPR**: Right to erasure via `SessionManager.destroy()`
- **VN Data Protection Law**: Local data processing, no cross-border PII transfer
- **WCAG 2.2 AA**: Accessibility compliance for elderly users
- **Healthcare-grade**: No medical advice; disclaimer on all outputs

## Cryptography

- SHA-256 for audit token hashing (`crypto.createHash`)
- RandomBytes for consent tokens (`crypto.randomBytes`)
- UUID v4 for session IDs (`crypto.randomUUID`)
- No custom crypto — use platform primitives only
