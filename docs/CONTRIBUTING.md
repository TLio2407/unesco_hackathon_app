# Contributing to SilverTrust

## Quick Start

```bash
pnpm install          # Install dependencies
pnpm test             # Run unit tests
pnpm typecheck        # TypeScript check
```

## Branch Model

We use **feature branches** from `main`:

```
main ───────────────────────────────────────────
  ├─ feat/wp1-contract      ← WP1 contract changes
  ├─ feat/wp2-contract      ← WP2 contract changes
  ├─ feat/wp7-contract      ← WP7 contract changes
  └─ feat/docs              ← Documentation changes
```

### Branch naming
- `feat/<wp>-<description>` — Feature work
- `fix/<description>` — Bug fixes
- `docs/<description>` — Documentation only
- `refactor/<description>` — Code restructuring

### Workflow
1. Create branch from `main`: `git checkout -b feat/wp1-contract main`
2. Make changes. All public interfaces need Zod schemas + JSDoc.
3. Run `pnpm test` — all tests must pass.
4. Run `pnpm typecheck` — no TypeScript errors.
5. Run `./scripts/validate-contracts.sh` — contracts consistent.
6. Commit with [Conventional Commits](https://www.conventionalcommits.org/):
   ```
   feat(wp1): add Zod schema for InputBag
   fix(wp3): correct urgency keyword matching
   docs: update ADR-0001 structure
   ```
7. Push and open PR targeting `main`.
8. PR requires 1 approval + passing CI.

## Pull Request Requirements

- [ ] All tests pass (`pnpm test`)
- [ ] TypeScript compiles (`pnpm typecheck`)
- [ ] Contract validation passes (`./scripts/validate-contracts.sh`)
- [ ] New public interfaces have JSDoc comments
- [ ] New public interfaces have Zod schemas
- [ ] CHANGELOG.md updated with changes
- [ ] If modifying a WP contract, bump VERSION in schema file
- [ ] No PII leaks in logs or test data

## Writing Zod Schemas

Every public WP interface needs a Zod schema:

```typescript
// @version 1.0.0
import { z } from 'zod';

export const InputBagSchema = z.object({
  kind: z.enum(['text', 'url', 'image', 'voice']),
  text: z.string(),
  url: z.string().url().optional(),
  receivedAt: z.number(),
});

export type InputBag = z.infer<typeof InputBagSchema>;
```

## ADR Process

New architectural decisions require an ADR:

1. Copy `docs/ADRS/TEMPLATE.md` → `docs/ADRS/NNNN-title.md`
2. Fill in Status, Deciders, Context, Decision, Consequences
3. Update `docs/CHANGELOG.md` under `[Unreleased]`
4. Reference from related files via `[ADR-NNNN](../docs/ADRS/NNNN-title.md)`

## License Compliance

All new files must include copyright headers. Run:

```bash
./scripts/adr-validate.sh   # Verify ADR cross-references
./scripts/bootstrap.sh      # Initialize REUSE metadata
```

## Works Council (Betriebsrat)

Per company policy, changes affecting employee data handling or workplace processes require Betriebsrat notification. See `.opencode-state/betriebsrat/` for policies.
