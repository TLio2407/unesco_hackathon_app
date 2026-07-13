# Backend Parallel Branch Development — Battle-Tested Skill

## What This Is
A Company Architect workflow for building backend module layers following German 3-layer governance with simultaneous git branches. Refined across 7 WPs, 204 tests, 13 test files, 8 parallel PRs on the SilverTrust MIL Companion.

## When To Use
- Building multi-module backend where each module is an independent work package
- Need parallel PRs on separate git branches with cross-layer contracts
- Following German corporate governance (Aufsichtsrat → Betriebsrat → whistleblower)

## Governance: German 3-Layer Model

```
Aufsichtsrat (Supervisory Board)
  └── Vorstand (Management Board) — Arch. decisions, interface contracts
       └── Abteilungsleiter (Department Heads) — One per WP branch
            └── Meister (Team Leaders) — Decompose WP into tasks
                 └── Mitarbeiter (Workers) — Execute atomic chunks
                      └── Betriebsrat (Works Council) — Veto, co-determination, whistleblower
```

## Session State: REQUIRED Before Any Delegation

```
.opencode-state/sessions/<S-20260713-HHMMSS>/
├── mission.json          — WP status, PRs, test counts, active vetoes
├── context-brief.md      — Shared context ALL agents read first
├── dependency-graph.json — Build order, parallel groups, critical path
├── decision-log.md       — Every architectural decision (ADR format)
├── tasks/
│   └── <taskId>.md       — Per-task brief (objective, contract, acceptance criteria)
└── outputs/
```

### context-brief.md Required Sections
```markdown
## User Goal (exact user words), Company Snapshot, Non-Negotiables,
## Interface Contracts (IPO per WP), Dependency Graph,
## Active Vetoes, Session Paths
```

## Branch Strategy

### Worktrees for True Parallelism
```bash
# NOT: git checkout between branches (untracked files follow, cause chaos)
# YES: isolated worktrees
git worktree add ../wt-wp<N> feat/wp<N>-<name>
# Each agent gets worktree path as its working directory
```

### Branch Naming
`feat/wp<N>-<layer>` — e.g., `feat/wp3-risk-reasoning`

## Tiered Delegation (USE PROPER COMPANY-* TYPES)

| Agent Type | When | Does |
|-----------|------|------|
| `company-writer` | Plan WP structure | Plans department, delegates to Team Leaders |
| `company-team-leader` | Supervise parallel workers | First-pass quality review, consolidate output |
| `company-worker` | Execute atomic tasks | Write SPECIFIC files, never decide scope |
| `company-reviewer` | Quality audit per WP | Cross-links, governance, compliance, PASS/FAIL |
| `company-auditor` | Regulatory compliance | GDPR, ISO 9001, accessibility, whistleblower |
| `company-benchmarker` | Industry comparison | OWASP, AWS WAF, Azure, Cloudflare best practices |
| `company-betriebsrat` | Co-determination gate | Clears WPs, issues vetoes, whistleblower |
| `company-integrator` | Cross-WP optimization | Value stream mapping, bottleneck elimination |
| `company-analyst` | Retrospective PDCA | Failure patterns, efficiency trends, prompt improvements |

**CRITICAL: NEVER use `general` subagent_type for Company Architect tasks.**
Using `general` broke the German 3-layer model — WP4-WP7 had TypeScript errors because general agents don't run `tsc --noEmit`.

## CI Pipeline (Mandatory Per-WP Checklist Before PR)

```yaml
# .github/workflows/ci.yml
name: CI
on:
  pull_request:
    branches: [main]
jobs:
  gate:
    name: Typecheck + Test + Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 11 }
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm exec tsc -p tsconfig.wp2.json --noEmit
      - run: pnpm test
      - run: pnpm lint
        continue-on-error: true
```

## Loop Protocol (Per WP)

```
reviewer finds issues → worker fixes → reviewer re-checks → PASS → PR
 CI fails → fix TypeScript errors → push → CI re-run → PASS → merge
```

**Never merge with failing CI.** Fix in loop until all green.

## Lessons Learned (Hard-Won)

### 1. Lockfile Sync Kills CI
**Symptom:** `ERR_PNPM_OUTDATED_LOCKFILE` on every PR.
**Root cause:** `pnpm-lock.yaml` out of sync with `package.json` when branches diverge from main.
**Fix:** Always sync `package.json` + `pnpm-lock.yaml` from canonical source (main) to ALL branches. Regenerate via `pnpm install --no-frozen-lockfile` on each branch.

### 2. Package Version Ranges Matter
**Symptom:** `expo: ^57.0.4` in manifest but `~57.0.4` in lockfile → CI fail.
**Fix:** Pin ranges to `~` (tilde) to match lockfile exactly. `^` allows minor bumps that may not exist in lockfile.

### 3. Untracked Files Follow `git checkout`
**Symptom:** WP2 files appearing on WP3 branch as untracked.
**Root cause:** Writing files without committing, then switching branches — untracked files persist across checkouts.
**Fix:** Always commit before switching branches, OR use `git worktree` for true isolation. Worktrees are the RECOMMENDED pattern.

### 4. JavaScript `\b` Is ASCII-Only
**Symptom:** `/\bphí\b/i` fails to match "phí" in Vietnamese text.
**Root cause:** JavaScript `\b` uses `[a-zA-Z0-9_]` only — "í" (U+00ED) is not a word character.
**Fix:** Never use `\b` with Vietnamese words. Use `/phí/i` (no boundary) or `(?<![a-zA-Z0-9_\u00C0-\u1EF9])` for proper Unicode boundaries. See `vn-text-matching` skill.

### 5. TypeScript Union Syntax Has No Trailing Delimiter
**Symptom:** `TS1109: Expression expected` from `sed`-based edits to `contract.ts`.
**Fix:** Don't use `sed` for TypeScript type edits. Python with string replacement is safer. The union `|` pipe goes BEFORE each variant, not after.

### 6. PII Redaction Must Happen at Ingestion AND Export
**Symptom:** Betriebsrat C-001: WP3 sends raw text to LLM. Auditor A-002: WP7 stores PII in queue.
**Fix:** Two-tier PII protection — redact before external calls (WP2 → WP3 LLM), AND filter metadata at ingestion (WP7 analytics).

### 7. Stale Worktrees Block Branch Operations
**Symptom:** `fatal: already used by worktree at /path` blocking `git checkout -B`.
**Fix:** `git worktree remove ../wt-<name> --force` before trying to manipulate branch.

### 8. TypeScript Errors Hide in Agent-Built Code
**Symptom:** WP4-WP7 CI failures only visible after PR creation.
**Root cause:** `general` subagents don't run `tsc --noEmit` before commit.
**Fix:** ALL agents must run `pnpm typecheck && pnpm test` before `git push`. Make it part of the task brief.

### 9. The Betriebsrat Gate Works
**Symptom:** C-001 caught real PII leak: WP3 sent `normalised.lower` to LLM instead of `redacted.text`.
**Fix:** Always run Betriebsrat Phase 3 before execution. The co-determination gate catches design flaws early.

## Interface Contracts (Immutable Cross-WP Agreements)

```
WP1 → WP2:  InputBag { kind, text, url?, imageRef?, voiceRef?, mimeType?, source?, receivedAt }
WP2 → WP3:  PreprocessedInput { original, normalised {cleaned, ascii, lower}, entities, redacted }
WP4 → WP3:  TrustedAlert { id, source, sourceUrl, date, title, summary, signals[] }
WP3 → WP5:  AnalyzeOutput { riskLevel, redFlags[], verificationSteps[], nextAction, lessonCard?, disclaimer }
```

## File Checklist Per WP

```
src/api/<wp-name>/
├── index.ts         — barrel export with ASCII pipeline diagram
├── types.ts         — interfaces + validation (or contract.ts)
├── <core>.ts        — main logic (pure function, fully testable)
└── pipeline.ts      — orchestrator (if WP has multiple stages)

tests/unit/<wp-name>.test.ts  — 20+ tests covering all edge cases

package.json        — MUST be synced from main
pnpm-lock.yaml      — MUST match package.json
```

## Quick Reference

```bash
# Create parallel worktrees
for wp in 1-input 2-preprocess 4-evidence 7-analytics; do
  git worktree add ../wt-wp$wp feat/wp${wp%%,*}
done

# Sync lockfile to all branches (from main)
for branch in feat/wp1 feat/wp2 feat/wp3 feat/wp4 feat/wp5 feat/wp6 feat/wp7; do
  tmpd=$(mktemp -d) && git clone --depth 1 --branch $branch $REPO $tmpd
  cp pnpm-lock.yaml package.json $tmpd/
  git -C $tmpd add -f . && git -C $tmpd commit -m "chore: sync lockfile" && git -C $tmpd push
done

# Check all PRs
for pr in $(seq 22 29); do
  gh pr checks $pr --repo owner/repo
done
```
