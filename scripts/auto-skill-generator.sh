#!/usr/bin/env bash
# auto-skill-generator.sh — run at end of Company Architect session
# Extracts new patterns, creates global skills, commits to opencode_configs
# Usage: ./scripts/auto-skill-generator.sh [session-id]

set -euo pipefail
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SESSION="${1:-$(ls -d "${PROJECT_ROOT}/.opencode-state/sessions/"*/ 2>/dev/null | sort | tail -1 | xargs basename)}"
SESSION_DIR="${PROJECT_ROOT}/.opencode-state/sessions/${SESSION}"
GLOBAL_SKILLS="${HOME}/.config/opencode/skills"
DEFAULT_DESC="Auto-generated from Company Architect session ${SESSION}"

[ -d "$SESSION_DIR" ] || { echo "No session state found. Run after a Company Architect mission."; exit 0; }

echo "=== Auto Skill Generator — Session ${SESSION} ==="

# ── Step 1: Extract new patterns from decision-log ───────────────────────────
DECISIONS="${SESSION_DIR}/decision-log.md"
if [ -f "$DECISIONS" ]; then
  echo "Scanning decisions..."
  DEC_COUNT=$(grep -c "D-" "$DECISIONS" 2>/dev/null) || DEC_COUNT=0
  echo "  ${DEC_COUNT} decisions found"
else
  echo "  No decision-log.md — skipping pattern extraction"
fi

# ── Step 2: Check Betriebsrat for new policy patterns ────────────────────────
BR="${PROJECT_ROOT}/.opencode-state/betriebsrat"
NEW_POLICIES=()
for f in "$BR"/policy_* "$BR"/sop_* "$BR"/whistleblower.md 2>/dev/null; do
  [ -f "$f" ] || continue
  policy_name=$(basename "$f" .md)
  if [ ! -d "${GLOBAL_SKILLS}/${policy_name}" ]; then
    NEW_POLICIES+=("$policy_name")
  fi
done

if [ ${#NEW_POLICIES[@]} -gt 0 ]; then
  echo "New Betriebsrat policies: ${NEW_POLICIES[*]}"
fi

# ── Step 3: Extract CI failure patterns from analyst output ──────────────────
ANALYST_OUT="${SESSION_DIR}/outputs/retrospective.md"
if [ -f "$ANALYST_OUT" ]; then
  echo "Scanning retrospective..."
  FAILURES=$(grep -c "FAIL\|CRITICAL\|MAJOR" "$ANALYST_OUT" 2>/dev/null || echo 0)
  echo "  ${FAILURES} findings in retrospective"
else
  # Try company-analyst output
  ANALYST_OUT2="${SESSION_DIR}/outputs/analyst-report.md"
  if [ -f "$ANALYST_OUT2" ]; then
    echo "Scanning analyst report..."
  fi
fi

# ── Step 4: Check if any new skill categories needed ─────────────────────────
PROJECT_SKILLS="${PROJECT_ROOT}/.agent/skills"
NEW_SKILLS=()
if [ -d "$PROJECT_SKILLS" ]; then
  for skill_dir in "$PROJECT_SKILLS"/*/; do
    skill_name=$(basename "$skill_dir")
    global_skill="${GLOBAL_SKILLS}/${skill_name}"
    if [ ! -d "$global_skill" ]; then
      NEW_SKILLS+=("$skill_name")
    fi
  done
fi

# ── Step 5: Create new global skills ─────────────────────────────────────────
if [ ${#NEW_SKILLS[@]} -gt 0 ]; then
  echo ""
  echo "=== NEW SKILLS DETECTED: ${NEW_SKILLS[*]} ==="
  for skill in "${NEW_SKILLS[@]}"; do
    src="${PROJECT_SKILLS}/${skill}"
    dst="${GLOBAL_SKILLS}/${skill}"
    if [ -d "$src" ]; then
      mkdir -p "$dst"
      cp "${src}/SKILL.md" "${dst}/SKILL.md"
      echo "  ✅ ${skill} → ${dst}/SKILL.md"
    fi
  done
  echo "  Run: cd ${GLOBAL_SKILLS}/.. && git add skills/ && git commit -m 'auto: new skills from session ${SESSION}'"
else
  echo "  No new skills needed — all already global."
fi

# ── Step 6: Inject patterns into company-worker.md ───────────────────────────
WORKER_MD="${HOME}/.config/opencode/agents/company-worker.md"
MARKER="## Project-Specific Patterns (Auto-Generated)"
if [ -f "$WORKER_MD" ] && ! grep -q "$MARKER" "$WORKER_MD" 2>/dev/null; then
  echo ""
  echo "=== Injecting project patterns into company-worker.md ==="
  # Run the dedicated feedback script
  if [ -f "${PROJECT_ROOT}/scripts/feedback-global-agents.sh" ]; then
    bash "${PROJECT_ROOT}/scripts/feedback-global-agents.sh" "$SESSION"
  fi
fi

echo ""
echo "=== Auto Skill Generator Complete ==="
echo "Session: ${SESSION}"
echo "New skills: ${#NEW_SKILLS[@]}"
echo "Next: commit to opencode_configs repo"
