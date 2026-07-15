#!/usr/bin/env bash
# Release automation script
# Usage: ./scripts/release.sh [patch|minor|major] [--dry-run]

set -euo pipefail

VERSION_TYPE="${1:-patch}"
DRY_RUN="${2:-}"

if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]]; then
  echo "Usage: $0 [patch|minor|major] [--dry-run]"
  exit 1
fi

echo "=== Release Script ==="
echo "Version type: $VERSION_TYPE"
echo "Dry run: ${DRY_RUN:-false}"

# Verify we're on main
CURRENT_BRANCH=$(git branch --show-current)
if [[ "$CURRENT_BRANCH" != "main" ]]; then
  echo "Error: Must be on main branch (currently on $CURRENT_BRANCH)"
  exit 1
fi

# Verify clean working tree
if [[ -n $(git status --porcelain) ]]; then
  echo "Error: Working tree not clean. Commit or stash changes first."
  exit 1
fi

# Run CI checks
echo "Running CI checks..."
pnpm typecheck
pnpm test
pnpm lint

# Get previous tag
PREV_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
echo "Previous tag: ${PREV_TAG:-none}"

# Generate changelog
if [[ -z "$PREV_TAG" ]]; then
  CHANGELOG=$(git log --oneline --pretty=format:"- %s" HEAD)
else
  CHANGELOG=$(git log --oneline --pretty=format:"- %s" "$PREV_TAG"..HEAD)
fi

echo "Changelog since $PREV_TAG:"
echo "$CHANGELOG"

# Bump version
if [[ "$DRY_RUN" == "--dry-run" ]]; then
  echo "=== DRY RUN ==="
  echo "Would run: npm version $VERSION_TYPE -m \"chore: release v%s\""
  echo "Would create tag and push"
  echo "Would create GitHub Release with changelog"
  echo "Would build EAS Update for production branch"
  exit 0
fi

# Actual release
npm version "$VERSION_TYPE" -m "chore: release v%s"
git push origin main --tags

# Create GitHub Release
gh release create "v$(node -p "require('./package.json').version")" \
  --title "Release v$(node -p "require('./package.json').version")" \
  --notes "$CHANGELOG" \
  --latest

# Build EAS Update
if command -v eas &> /dev/null; then
  eas update --branch production --message "Release v$(node -p "require('./package.json').version")"
else
  echo "Warning: eas CLI not found, skipping EAS Update"
fi

echo "=== Release Complete ==="
