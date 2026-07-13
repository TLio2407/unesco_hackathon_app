---
name: parallel-branch-workflow
description: >-
  Run multiple coding agents in parallel, each isolated in its own git worktree,
  each solving a different GitHub issue on its own branch and opening its own PR
  that auto-closes the issue. Use when you have several independent work packages
  / issues to implement at once and want conflict-free parallel execution with
  clean, reviewable per-issue pull requests. This is the "git-based multi-agent"
  pattern: every subagent owns one branch, one PR, one issue.
---

# Parallel Branch Workflow (git-based multi-agent)

Drive N agents concurrently, each in an isolated git worktree, each delivering one
issue → one branch → one PR. No shared working tree means no index races.

## When to use
- 2+ independent issues / work packages ready to build.
- `main` is green (tests + typecheck pass) and is the intended merge target.
- You want separate, reviewable PRs (not one monster branch).

## When NOT to use
- Tasks that must share uncommitted state or edit the same files (do those sequentially).
- `main` is red or you have not decided the contract yet.

## Preconditions
1. Foundation on `main` is complete (dependencies already merged). If not, merge the
   prerequisite PRs first so every new branch forks a clean `main`.
2. Each work package has a GitHub issue. Create one if missing
   (`gh issue create --title "WPn: ..." --body "..." --label frontend,company-arch,wpn`).
3. Node toolchain uses `pnpm` (lockfile committed). Confirm `pnpm test` is green on `main`.

## Procedure

### 1. Sync `main`
```bash
git fetch origin
git checkout main && git pull origin main
```

### 2. One worktree per work package (isolated, parallel-safe)
For each package `N` with slug `wpN-slug`:
```bash
git worktree add -b feat/wpN-slug ../wt-wpN main
cd ../wt-wpN && pnpm install
```
`../wt-wpN` is a sibling of the repo root. `pnpm install` inside the worktree
creates a proper node_modules via hardlinks from the global store (≈1s, no download).
**Do NOT symlink node_modules from the main repo** — pnpm's virtual store
(.pnpm directory) resolves to an absolute path and the symlinked store confuses it.

### 3. Spawn the agents IN PARALLEL
One `Task` call per worktree, in a single message, all at once:
```
Task(subagent_type="swarm-worker", prompt="<brief for wpN, scoped to /abs/wt-wpN>")
```
Use `company-worker` if you prefer the company-arch persona; both are interchangeable
for execution. Give each agent the STRICT brief from `REFERENCE.md` (absolute worktree
path, base = main, conventions, acceptance, commit/push/PR steps).

### 4. Each agent (inside its worktree) must
- Edit only files under its worktree absolute path.
- Run every shell/git/pnpm command with `workdir` = that worktree path.
- Not touch the main repo.
- After work: `git commit`, `git push -u origin feat/wpN-slug`,
  `gh pr create --base main --title "WPn: ..." --body "...Closes #N"`,
  add labels (`frontend`, `company-arch`, `wpN`, + domain labels).

### 5. Consolidate
- When all agents return, verify each PR: `pnpm test` + `tsc` green, labels correct,
  body contains `Closes #N`.
- Review and merge in dependency order. Merging a branch updates `main`; later
  branches may need a rebase if they forked before that merge (rare if all fork `main`).
- Clean worktrees: `git worktree remove ../wt-wpN --force` (after merge).

## Critical gotchas
- **Never `cd` + `workdir` together** — the persistent shell can double the path
  (`/repo/repo`). Use the `workdir` tool parameter ONLY, no `cd`.
- **Rebasing a branch does NOT move its PR base.** After `git rebase main`, run
  `gh pr edit <n> --base main`. Force-push can auto-close/reopen the PR oddly; if a
  PR shows MERGED/CLOSED after a rebase, reopen and reset base.
- **Don't edit `opencode.jsonc` subagent prompts to add this protocol** — instead embed
  the brief per Task (the Company Architect protocol already mandates per-task briefs).
  Editing the giant JSON prompts risks breaking agent definitions.
- **Native tab bars need PNG icons.** If a package would add `NativeTabs.Trigger`
  entries, either generate the icon assets or route via an in-app hub screen instead.
- **ESLint config required for CI.** `expo lint` auto-installs ESLint deps in an
  interactive prompt; in CI it hangs or fails. Install `@eslint/js` + `typescript-eslint`
  and write a flat `eslint.config.mjs` early, or set `continue-on-error: true` until
  config is ready.
- **`pnpm approve-builds` for native addons.** If a dependency has ignored build scripts
  (`ERR_PNPM_IGNORED_BUILDS`), run `pnpm approve-builds <name>` and commit the
  generated `pnpm-workspace.yaml`.
- **`EXPO_TOKEN` / secrets**: CI release workflows can be authored before the secret
  exists; they fail on tag push until added — note this in the PR body.

## Label taxonomy (see REFERENCE.md)
`frontend`, `company-arch`, `wp1`..`wp6`, `bug`, `enhancement`, `documentation`,
`chore`, `test`, `ci-cd`, `accessibility`, `i18n`, `privacy`, `ui`, `backend` (x-ref).
