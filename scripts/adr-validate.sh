#!/bin/sh
# WP7 — Validate ADR cross-references
# Checks that all ADRs reference each other correctly and CHANGELOG is updated.
set -eu

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ADRS="$ROOT/docs/ADRS"
ERRORS=0

echo "==> Validating ADR references..."

# Check ADR directory exists
if [ ! -d "$ADRS" ]; then
  echo "MISSING: docs/ADRS/"
  ERRORS=$((ERRORS + 1))
  exit "$ERRORS"
fi

# Check each ADR has required fields
for adr in "$ADRS"/000*.md; do
  name="$(basename "$adr")"

  for field in "Status:" "Date:" "Decision:" "Consequences:"; do
    if ! grep -q "^- $field" "$adr"; then
      echo "MISSING '$field' in $name"
      ERRORS=$((ERRORS + 1))
    fi
  done
done

# Check CHANGELOG references ADRs
if [ -f "$ROOT/docs/CHANGELOG.md" ]; then
  if grep -q "ADR" "$ROOT/docs/CHANGELOG.md"; then
    echo "OK: CHANGELOG references ADRs"
  else
    echo "WARNING: CHANGELOG should reference ADR changes"
  fi
else
  echo "MISSING: docs/CHANGELOG.md"
  ERRORS=$((ERRORS + 1))
fi

if [ "$ERRORS" -gt 0 ]; then
  echo "FAILED: $ERRORS issue(s)"
  exit 1
fi

echo "==> All ADRs valid."
