# Parallel Branch Workflow — Reference

Companion doc for the `parallel-branch-workflow` skill. Contains the reusable
per-agent brief template, the project conventions, and the label taxonomy.

## Per-agent brief template

Copy per work package `N`. Replace `<...>` placeholders.

```markdown
You are a Swarm Worker executing ONE work package in an ISOLATED git worktree.
Do exactly what is specified. No more, no less.

## ISOLATION (critical)
- WORKTREE PATH: <abs path, e.g. /home/.../wt-wpN>
- ALL file writes use absolute paths under that path ONLY.
- Every shell/git/pnpm command MUST use workdir = <abs worktree path>.
- Do NOT edit, cd into, or touch the main repo at <abs main repo path>.
- You are on branch feat/wpN-slug (base: main).

## PROJECT CONTEXT
- Stack: Expo SDK 57, expo-router (routes under src/app/), React 19, TypeScript 6, pnpm.
- Path alias @/* -> src/*. Use pnpm (not npm). Do NOT add new npm dependencies.
- i18n: t(key) from @/i18n. Locale files src/locales/{vi,en}.json.
- Accessibility: Accessibility from @/theme/tokens (fontSize, colors, minTouchSize:48).
  Spacing from @/constants/theme.
- Reusable UI: ThemedText (type, style), ThemedView from @/components/.

## OBJECTIVE — WPn: <one-line scope>
<exact files to create/modify, i18n keys to use, behavior>

## ACCEPTANCE (run with workdir = worktree path)
- pnpm test -> all pass (do not break existing).
- pnpm exec tsc -p tsconfig.json --noEmit -> NO new type errors in your files.
  (Pre-existing css/global.css errors on main are unrelated — ignore.)
- Optional: add a unit test for any pure logic you add.

## RETURN CONTRACT
1. Commit on feat/wpN-slug (message: "WPn: <scope>"). Do NOT commit .serena/,
   .opencode-state/, or stray docs.
2. git push -u origin feat/wpN-slug
3. gh pr create --base main --title "WPn: <scope>" --body "...Closes #N" with labels:
   frontend, company-arch, wpN, <domain labels>
4. Report: PR URL, test count, typecheck notes, files created.
```

## Project conventions (An Tâm Số — UNESCO MIL app)

| Area | Rule |
|------|------|
| Package manager | `pnpm` (`.npmrc`: `node-linker=hoisted`). Never `npm install`. |
| Routes | expo-router, files under `src/app/` (e.g. `src/app/alert.tsx` -> `/alert`). |
| Imports | Use `@/*` alias, never relative `../../`. |
| i18n | Add keys to `src/locales/{vi,en}.json`; consume via `t(key)`. No hardcoded UI strings. |
| Accessibility | `Accessibility.fontSize` (16–34pt), `minTouchSize:48`, high-contrast `Accessibility.colors`. |
| Privacy | Sensitive data (CCCD/phone/email) must pass `redact()` from `@/lib/redact` before share. |
| Tests | `pnpm test` (vitest, node env). Pure logic only; relative imports in tests. |
| Typecheck | `pnpm exec tsc -p tsconfig.wp2.json --noEmit` (CI gate) + `tsc -p tsconfig.json --noEmit`. |
| Release | Tag-only (`vX.Y.Z`). On tag, `eas update` (needs `EXPO_TOKEN` secret). |

## Label taxonomy

| Group | Labels |
|-------|--------|
| Scope | `frontend` (primary), `backend` (cross-ref only), `company-arch` |
| Work package | `wp1` `wp2` `wp3` `wp4` `wp5` `wp6` |
| Type | `bug` `enhancement` `documentation` `chore` `test` `ci-cd` |
| Domain | `accessibility` `i18n` `privacy` `ui` |

GitHub Issue Types are NOT available on this user-owned repo (API 404), so Labels
carry the type + scope + domain + work-package taxonomy.

## Issue <-> PR ritual
- Every work package has an issue (`gh issue create` if missing).
- PR body MUST contain `Closes #N` so the issue auto-closes on merge.
- PR base is always `main` (or a documented stack branch when deps are unmerged).
