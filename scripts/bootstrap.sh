#!/bin/sh
# WP7 — Bootstrap project for 50-year maintainability
# Sets up REUSE metadata, validates contracts, runs typecheck.
set -eu

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "==> Bootstrapping SilverTrust backend..."

# 1. Validate contract schemas
echo "--- Contracts ---"
"$SCRIPT_DIR/validate-contracts.sh"

# 2. Validate ADRs
echo "--- ADRs ---"
"$SCRIPT_DIR/adr-validate.sh"

# 3. Typecheck
echo "--- Typecheck ---"
"$SCRIPT_DIR/typecheck-all.sh"

# 4. Run tests
echo "--- Tests ---"
cd "$ROOT" && pnpm test

echo "==> Bootstrap complete."
