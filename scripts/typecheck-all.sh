#!/bin/sh
# WP7 — Typecheck all modules
# Runs TypeScript compiler in noEmit mode across all WP configs.
# Exit on first error.
set -eu

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "==> Typechecking WP0..WP7..."

# WP0-WP7: core API modules
tsc -p "$ROOT/tsconfig.wp2.json" --noEmit

echo "==> All modules typecheck OK."
