# ADR-0001: Project Structure

- Status: Accepted
- Date: 2026-07-14
- Deciders: SilverTrust Engineering Team
- Context: 7-WP TypeScript/Expo app for elderly Vietnamese scam protection. Need maintainable architecture for 50+ year lifespan.
- Decision: Adopt modular directory structure with strict WP boundaries. All public interfaces use Zod schemas + TypeScript types. Contracts live in `src/api/`. Implementation in subdirectories.
- Consequences:
  - Clear module boundaries prevent cross-WP coupling
  - New contributors can navigate by WP number
  - Schema validation at boundaries catches data corruption early
  - Documentation in `docs/` supports long-term maintenance

## Structure

```
src/
├── api/           # Public WP contracts (versioned, Zod-validated)
│   ├── contract.ts       # WP0: Core types (RiskLevel, AnalysisInput, AnalyzeOutput)
│   ├── input/            # WP1: Input processing (RawInput → InputBag)
│   ├── preprocess/       # WP2: Text normalization, entity extraction, PII redaction
│   ├── risk/             # WP3: Rule engine, LLM explainer, RAG retrieval
│   ├── output/           # WP5: Result assembly, lesson generation, trusted circle
│   ├── privacy/          # WP6: Consent, audit logging, session management
│   ├── evidence/         # WP4: Trusted alerts index, RAG data
│   └── analytics/        # WP7: Event tracking, metrics export
├── app/               # Expo Router screens
├── components/        # React Native UI components
├── hooks/             # Custom React hooks
├── constants/         # Theme constants
├── i18n/              # Internationalization (vi/en)
├── lib/               # Shared utilities
├── locales/           # Translation JSON files
├── theme/             # Design tokens
tests/
├── unit/              # Vitest unit tests
scripts/               # Build/validation scripts
docs/                  # Documentation (ADRs, guides)
```

## References
- [ADR-0002](./0002-versioned-api-contracts.md) — Versioned API contracts
- [CONTRIBUTING.md](../CONTRIBUTING.md) — Contribution workflow
- [SECURITY.md](../SECURITY.md) — Security policy
