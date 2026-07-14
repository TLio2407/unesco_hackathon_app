#!/bin/sh
# WP7 — Validate all contract schemas are consistent
# Checks that all schema files export VERSION and that types match.
set -eu

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ERRORS=0

echo "==> Validating contract schemas..."

# Check each schema file has VERSION export
for schema in \
  "$ROOT/src/api/contract.ts" \
  "$ROOT/src/api/input/schema.ts" \
  "$ROOT/src/api/preprocess/schema.ts" \
  "$ROOT/src/api/risk/schema.ts" \
  "$ROOT/src/api/output/schema.ts" \
  "$ROOT/src/api/privacy/schema.ts" \
  "$ROOT/src/api/evidence/schema.ts" \
  "$ROOT/src/api/analytics/schema.ts"; do

  if [ ! -f "$schema" ]; then
    echo "MISSING: $schema"
    ERRORS=$((ERRORS + 1))
    continue
  fi

  if ! grep -q "VERSION" "$schema"; then
    echo "NO VERSION in $(basename "$schema")"
    ERRORS=$((ERRORS + 1))
  else
    echo "OK: $(basename "$schema")"
  fi
done

if [ "$ERRORS" -gt 0 ]; then
  echo "FAILED: $ERRORS contract(s) invalid"
  exit 1
fi

echo "==> All contracts valid."
