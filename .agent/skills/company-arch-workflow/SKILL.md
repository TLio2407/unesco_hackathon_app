# Company Architect Workflow — German 3-Layer Delegation Cheat-Sheet

## Quick Start

```
INTAKE → STRATEGY → DESIGN → BETRIEBSRAT → FORK_WRITERS → FORK_WORKERS → 
  REVIEW → AUDIT → BENCHMARK → INTEGRATE → RETROSPECTIVE
```

## Phase-by-Phase

### Phase 0: INTAKE
Ask user: company name, industry, product, target, business model, team size, geography, regulations.
Classify: SMALL (2-tier collapsed) / MEDIUM-LARGE (3-tier full German model).

### Phase 1: STRATEGY → `company-strategist`
- Competitive analysis (SWOT, Porter)
- Vision/Mission/Values
- Strategic objectives (BSC/OKR)
- Board structure, committees

### Phase 2: DESIGN → `company-designer`
- Porter Value Chain
- Department IPO analysis
- Process decomposition
- Role/KPI definitions
- Corporate governance structure
- Risk management framework

### Phase 3: BETRIEBSRAT → `company-betriebsrat`
**GATE: must pass before execution.**
- Review work packages for fairness
- Co-determination clearance
- Whistleblower channel setup
- Veto mechanism: `.opencode-state/betriebsrat/vetoes/`
- Grievances: `.opencode-state/betriebsrat/grievances/`

### Phase 4: DECOMPOSITION → PARALLEL `company-writer`
**Fork one Writer per independent department simultaneously.**
```bash
# Each Writer gets:
#  - Own git branch (via git worktree)
#  - Task brief at .opencode-state/sessions/<id>/tasks/<taskId>.md
#  - Interface contract from Phase 2
Task(subagent_type="company-writer", prompt=task_brief, workdir=worktree_path)
```

### Phase 5: EXECUTION → `company-worker` (parallel)
```bash
# Each Worker:
#  1. Reads task brief from session state
#  2. Builds module (pure functions, testable)
#  3. Self-validates (runs tests)
#  4. Escalation right to Betriebsrat if task is unreasonable
Task(subagent_type="company-worker", prompt=atomic_task, workdir=worktree_path)
```

### Phase 6: FIRST-PASS REVIEW → `company-team-leader`
- Template adherence? Naming? Cross-links?
- Controls, RACI included?
- FAIL: send back to Worker (max 3 attempts)
- PASS: consolidate, report to Writer

### Phase 7: WORKS COUNCIL → `company-betriebsrat`
Workers escalate grievances during/after execution. Betriebsrat investigates, issues vetoes if needed.
All agents must check `.opencode-state/betriebsrat/vetoes/` before proceeding.

### Phase 8: CONSOLIDATION
Team Leaders → Writers → Architect (bottom-up result flow).

### Phase 9: QUALITY AUDIT — PARALLEL REVIEWERS
```bash
# One reviewer per WP simultaneously
Task(subagent_type="company-reviewer", prompt=review_brief, workdir=wt-path)
Task(subagent_type="company-auditor", prompt=audit_brief, ...)
Task(subagent_type="company-benchmarker", prompt=benchmark_brief, ...)
```

### Phase 10: INTEGRATION → `company-integrator`
- End-to-end value stream map
- Cross-department bottlenecks
- Handoff friction reduction

### Phase 11: RETROSPECTIVE → `company-analyst`
- Failure patterns, validation loops
- Efficiency trends
- Prompt/process improvements for next mission

## Agent Type Mapping

| Company Role | `subagent_type` | When | Does |
|-------------|-----------------|------|------|
| Aufsichtsrat | `company-strategist` | Phase 1 | Strategy, positioning |
| Vorstand | `company-designer` | Phase 2 | Architecture, governance |
| Betriebsrat | `company-betriebsrat` | Phase 3, 7 | Co-determination, veto, whistleblower |
| Abteilungsleiter | `company-writer` | Phase 4 | WP planning, delegation |
| Meister | `company-team-leader` | Phase 6 | First-pass review, consolidation |
| Mitarbeiter | `company-worker` | Phase 5 | Atomic file generation |
| Auditor | `company-reviewer` | Phase 9 | Per-WP quality validation |
| Compliance | `company-auditor` | Phase 9 | Regulatory (GDPR, ISO, accessibility) |
| Industry Expert | `company-benchmarker` | Phase 9 | Compare against best practices |
| Process Excellence | `company-integrator` | Phase 10 | Cross-WP optimization |
| PDCA Analyst | `company-analyst` | Phase 11 | Retrospective, improvement |

## NEVER Use `general` subagent_type
Using `general` agents broke the German 3-layer model:
- WP4-WP7 had TypeScript errors because general agents didn't run `tsc --noEmit`
- No Betriebsrat gate was applied
- No session state was created
- Cross-WP contracts weren't validated

## Session State: The Glue

Every delegated task MUST include a path to the session state. The Agent reads:
1. `.opencode-state/sessions/<id>/context-brief.md` — shared intent
2. `.opencode-state/sessions/<id>/tasks/<taskId>.md` — specific task brief
3. `.opencode-state/sessions/<id>/dependency-graph.json` — build order

The Agent writes output to:
- `.opencode-state/sessions/<id>/outputs/<taskId>.md` — artifact summary

## Git Worktree Pattern (Mandatory for Parallel)
```bash
# Create isolated worktree per WP
git worktree add ../wt-wp<N> feat/wp<N>-<name>

# Agent works in worktree
Task(subagent_type="company-writer", workdir="../wt-wp<N>", prompt=...)

# Clean up after merge
git worktree remove ../wt-wp<N> --force
```

## Anti-Patterns Causing Waste
1. **`git checkout` between branches** → untracked files follow, WP mix on wrong branches
2. **`general` subagent** → no governance, no typecheck, TypeScript errors in CI
3. **No lockfile sync** → `ERR_PNPM_OUTDATED_LOCKFILE` on every PR
4. **No Betriebsrat gate** → PII leaks (C-001: LLM got raw text instead of redacted)
5. **`sed` for TypeScript edits** → broken union syntax (`;` terminates type)
6. **Opening PRs without CI** → merge conflicts pile up unnoticed
