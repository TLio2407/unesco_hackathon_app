# ADR-0002: Versioned API Contracts

- Status: Accepted
- Date: 2026-07-14
- Deciders: SilverTrust Engineering Team
- Context: 7-WP app with cross-module interfaces. Without versioned contracts, breaking changes in one WP silently break others. Long-term maintainability requires explicit contract governance.
- Decision: All public WP interfaces are versioned using semver. Each contract module exports:
  1. A `VERSION` string constant
  2. Zod schemas for runtime validation
  3. TypeScript types inferred via `z.infer`
  4. JSDoc `@version` tags on all exported symbols
- Consequences:
  - Breaking changes require VERSION bump + migration path
  - Runtime validation catches schema drift at boundaries
  - Cross-WP dependencies declare version constraints
  - `scripts/validate-contracts.sh` enforces contract consistency at CI time
  - `scripts/typecheck-all.sh` validates all modules compile

## Contract Registry

| Module | Path | Version |
|--------|------|---------|
| Core | `src/api/contract.ts` | 1.0.0 |
| Input | `src/api/input/schema.ts` | 1.0.0 |
| Preprocess | `src/api/preprocess/schema.ts` | 1.0.0 |
| Risk | `src/api/risk/schema.ts` | 1.0.0 |
| Output | `src/api/output/schema.ts` | 1.0.0 |
| Privacy | `src/api/privacy/schema.ts` | 1.0.0 |
| Evidence | `src/api/evidence/schema.ts` | 1.0.0 |
| Analytics | `src/api/analytics/schema.ts` | 1.0.0 |

## References
- [ADR-0001](./0001-project-structure.md) — Project structure
- [CONTRIBUTING.md](../CONTRIBUTING.md) — Version bump procedure
