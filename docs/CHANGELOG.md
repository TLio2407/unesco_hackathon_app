# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- ADR-0001: Project structure documentation
- ADR-0002: Versioned API contracts
- Zod schemas for all 7 WP public interfaces
- Contract validation script
- Typecheck-all script
- REUSE compliance metadata
- Versioned API contract enforcement

### Changed
- `src/api/contract.ts`: Added VERSION constant, Zod schemas alongside TypeScript types
- `src/api/input/schema.ts`: New — Zod schemas for input types
- `src/api/preprocess/schema.ts`: New — Zod schemas for preprocess types
- `src/api/risk/schema.ts`: New — Zod schemas for risk types
- `src/api/output/schema.ts`: New — Zod schemas for output types
- `src/api/privacy/schema.ts`: New — Zod schemas for privacy types
- `src/api/evidence/schema.ts`: Rewritten with Zod schemas
- `src/api/analytics/schema.ts`: Rewritten with Zod schemas

## [1.0.0] — 2026-07-14

### Added
- WP1: Input processing (text, URL, image, voice)
- WP2: Preprocessing (normalization, entity extraction, PII redaction)
- WP3: Risk reasoning (rule engine, LLM explainer, RAG)
- WP4: Evidence layer (trusted alerts index)
- WP5: Output assembly (lesson cards, trusted circle summaries)
- WP6: Privacy (consent, audit logging, session management)
- WP7: Analytics (event tracking, metrics export)
- Expo Router screens (auth, tabs, alert, circle, events, explore, learning, profile)
- Vietnamese + English i18n
- Accessibility-first design tokens (WCAG 2.2 AA target)
- Unit tests for all WPs
- Contributing guide, security policy

[Unreleased]: https://github.com/TLio2407/unesco_hackathon_app/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/TLio2407/unesco_hackathon_app/releases/tag/v1.0.0
