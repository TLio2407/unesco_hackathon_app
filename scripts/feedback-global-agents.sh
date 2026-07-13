#!/usr/bin/env bash
# feedback-global-agents.sh — extract mission patterns → update global agent prompts
# Run after each Company Architect mission completes.
# Usage: ./scripts/feedback-global-agents.sh [session-id]
# Defaults to parsing the most recent .opencode-state/sessions/ directory.

set -euo pipefail
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
GLOBAL_AGENTS="${HOME}/.config/opencode/agents"
GLOBAL_SKILLS="${HOME}/.config/opencode/skills"
SESSION="${1:-$(ls -d "${PROJECT_ROOT}/.opencode-state/sessions/"*/ | sort | tail -1 | xargs basename)}"
SESSION_DIR="${PROJECT_ROOT}/.opencode-state/sessions/${SESSION}"

[ -d "$SESSION_DIR" ] || { echo "ERROR: session ${SESSION} not found"; exit 1; }

echo "=== Feedback Global Agents — Session ${SESSION} ==="

# ── 1. Extract patterns from decision-log ────────────────────────────────────
DECISIONS="${SESSION_DIR}/decision-log.md"
if [ -f "$DECISIONS" ]; then
  echo "Parsing decisions from ${DECISIONS}..."
  grep -q "D-01\|D-02\|D-03" "$DECISIONS" && echo "  Found architectural decisions"
fi

# ── 2. Parse Betriebsrat findings ────────────────────────────────────────────
BR="${PROJECT_ROOT}/.opencode-state/betriebsrat"
if [ -d "$BR" ]; then
  echo "Checking Betriebsrat state..."
  for v in "$BR"/vetoes/*.json 2>/dev/null; do
    [ -f "$v" ] || continue
    status=$(python3 -c "import json; print(json.load(open('$v')).get('status','?'))")
    echo "  Veto $(basename $v): ${status}"
  done
fi

# ── 3. Known patterns → inject into company-worker.md ────────────────────────
WORKER_MD="${GLOBAL_AGENTS}/company-worker.md"
MARKER_START="## Project-Specific Patterns (Auto-Generated)"
MARKER_END="## END Project Patterns"

PATTERNS=$(cat << 'HEREDOC'
### CI/Lockfile
- Before ANY branch work: ensure pnpm-lock.yaml matches package.json
- `pnpm install --frozen-lockfile` must pass in CI
- Pin expo deps to `~` (tilde), never `^` (caret)
- Commit lockfile with every dependency change

### JavaScript/Vietnamese Regex
- `\b` is ASCII-only in JavaScript — never use with Vietnamese words
- Use `/word/i` without boundary, or `(?<!\p{L})word(?!\p{L})/u`
- Normalize text to NFC before regex matching: `text.normalize('NFC')`

### PII/Privacy
- Redact before ANY external call (LLM, API, log)
- Two-tier: ingress filter (before call) + export filter (before save)
- Metadata whitelist enforced at BOTH boundaries
- Never send raw user text to external services

### Git
- Use `git worktree` for branch isolation — never `git checkout` across branches
- Clean worktrees after merge: `git worktree remove ../wt-<name> --force`
- Commit only your WP's files

### CI Readiness
- Run `pnpm typecheck` AND `pnpm test` before every commit
- TypeScript union: pipe goes BEFORE each variant — `| { kind: 'voice' }`
- `;` after `}` closes the union — don't add it mid-union
- Don't use `sed` for TypeScript edits — Python `str.replace()` is safer

### Anti-Patterns
- NEVER use `general` subagent_type — only `company-*` or `swarm-*`
- NEVER skip Betriebsrat Phase 3 before execution
- NEVER skip typecheck/tests before pushing
HEREDOC
)

# Inject patterns if not already present
if [ -f "$WORKER_MD" ] && ! grep -q "$MARKER_START" "$WORKER_MD" 2>/dev/null; then
  echo ""
  echo "Injecting project patterns into ${WORKER_MD}..."
  echo "$MARKER_START" >> "$WORKER_MD"
  echo "$PATTERNS" >> "$WORKER_MD"
  echo "$MARKER_END" >> "$WORKER_MD"
  echo "  Done. Worker now has $(wc -l < "$WORKER_MD") lines."
else
  echo "  Patterns already present or worker.md missing. Skipping."
fi

# ── 4. Check if new skill categories needed ──────────────────────────────────
NEEDED_SKILLS=()
for pattern in "ci-lockfile-sync" "vn-text-matching" "privacy-by-design" "git-worktree-isolation"; do
  skill_dir="${GLOBAL_SKILLS}/${pattern}"
  [ -d "$skill_dir" ] || NEEDED_SKILLS+=("$pattern")
done

if [ ${#NEEDED_SKILLS[@]} -gt 0 ]; then
  echo ""
  echo "=== New skill categories detected: ${NEEDED_SKILLS[*]} ==="
  echo "Project has skills in .agent/skills/ — consider copying to ${GLOBAL_SKILLS}/"
  echo "Run: cp -r .agent/skills/<name> ${GLOBAL_SKILLS}/"
fi

echo ""
echo "=== Feedback Complete ==="
echo "Session: ${SESSION}"
echo "Worker prompt: ${WORKER_MD}"
echo "Next: manually review changes, then git commit/push to opencode_configs"
