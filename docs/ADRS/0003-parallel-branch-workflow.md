# ADR-0003: Parallel Branch Workflow with Git Worktrees

- Status: Accepted
- Date: 2026-07-15
- Deciders: SilverTrust Engineering Team
- Context: 7-WP Expo app for elderly Vietnamese scam protection. Need maintainable workflow for parallel development by multiple agents/people over 50+ year lifespan.
- Decision: Use git worktrees for true parallel branch isolation, one PR per issue, conventional commits, and strict CI gates.
- Consequences:
  - Zero merge conflicts on shared files (each worktree has own working directory)
  - True parallelism: multiple developers/agents work simultaneously
  - Clear audit trail: every issue → branch → PR → merge
  - Easy rollback: `git worktree remove` cleans up
  - CI runs on each PR independently

## Workflow

```bash
# 1. Create worktree for new issue
git worktree add -b feat/wpN-description ../wt-wpN main

# 2. Work in isolated directory
cd ../wt-wpN
# implement, test, commit

# 3. Push and create PR
git push -u origin feat/wpN-description
gh pr create --base main --title "WP N: Description" --body "Closes #N"

# 4. After merge, cleanup
git worktree remove ../wt-wpN --force
```

## Branch Naming Convention

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feat/wpN-<slug>` | `feat/wp3-risk-reasoning` |
| Fix | `fix/<description>` | `fix/api-client-validation` |
| Docs | `docs/<description>` | `docs/adr-0003` |
| CI/CD | `ci/<description>` | `ci/release-automation` |

## PR Requirements

- [ ] All tests pass (`pnpm test`)
- [ ] Typecheck clean (`pnpm typecheck`)
- [ ] Lint pass (`pnpm lint`)
- [ ] Contract validation (`./scripts/validate-contracts.sh`)
- [ ] Conventional commit messages
- [ ] `Closes #N` in PR body
- [ ] Labels: `frontend|backend|company-arch`, `wp1..wp7`, `test|docs|ci-cd|chore|bug`

## 50-Year Rationale

Git worktrees are a native Git feature (since 2.5, 2015) with zero external dependencies. They provide filesystem-level isolation without container overhead. This mirrors how Linux kernel maintainers manage thousands of concurrent topic branches. The workflow scales from 2 to 200+ parallel developers.

## References

- [parallel-branch-workflow skill](/.config/opencode/skills/parallel-branch-workflow/SKILL.md)
- [BACKEND_ARCHITECTURE.md §7.1](../BACKEND_ARCHITECTURE.md#71-branch-workflow)
