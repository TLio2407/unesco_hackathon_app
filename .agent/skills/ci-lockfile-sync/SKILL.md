# CI Lockfile Sync — Prevention & Remediation

## When To Use
Whenever CI fails with `ERR_PNPM_OUTDATED_LOCKFILE` across multiple branches, or when package.json diverges between main and feature branches.

## Root Cause Checklist

| Symptom | Diagnosis | Fix |
|---------|-----------|-----|
| `ERR_PNPM_OUTDATED_LOCKFILE` | lockfile hash ≠ package.json hash | Regenerate lockfile from package.json |
| `expo: ^57.0.4` vs lockfile `~57.0.4` | `^` range mismatch | Pin to `~` (tilde) in package.json |
| `pnpm install --frozen-lockfile` fails | CI uses frozen mode | Generate lockfile locally, commit it |
| Lockfile SHA differs across branches | WP branches started from old main | Sync package.json + lockfile to all branches |

## Prevention Pattern

### 1. Never Branch From Stale Main
```bash
# BEFORE creating feature branches
git pull origin main
pnpm install --no-frozen-lockfile  # ensure lockfile is fresh
git add pnpm-lock.yaml && git commit -m "chore: freshen lockfile"
git push origin main

# THEN create branches
git checkout -b feat/wpN-new main
```

### 2. Sync Lockfile to All Branches
```bash
# Canonical lockfile from main
CANONICAL_LOCK=$(shasum pnpm-lock.yaml | awk '{print $1}')

for branch in feat/wp1 feat/wp2 feat/wp3 feat/wp4 feat/wp5 feat/wp6 feat/wp7; do
  # Clone fresh, apply canonical files, force push
  TMP=$(mktemp -d)
  git clone --depth 1 --branch "$branch" "$REPO" "$TMP"
  
  # Copy canonical package.json + lockfile
  cp package.json pnpm-lock.yaml "$TMP/"
  
  cd "$TMP"
  git config user.email "bot@ci" && git config user.name "CI Sync"
  git add -f package.json pnpm-lock.yaml
  git commit -m "chore: sync lockfile from main for CI" || true
  git push origin HEAD:"$branch" --force
  
  # Verify
  B_SHA=$(shasum pnpm-lock.yaml | awk '{print $1}')
  [ "$B_SHA" = "$CANONICAL_LOCK" ] && echo "$branch: MATCH" || echo "$branch: MISMATCH"
  rm -rf "$TMP"
done
```

### 3. Package Version Pinning Rules
```json
{
  "expo": "~57.0.4",           // ✓ tilde: patch-level only
  "expo-splash-screen": "~57.0.2"  // ✓ tilde: patch-level only
}
// NOT:
// "expo": "^57.0.4"           // ✗ caret: allows minor bumps, breaks lockfile
```

### 4. CI Workflow That Won't Break
```yaml
- name: Install dependencies
  run: pnpm install --frozen-lockfile  # enforces lockfile integrity
  
# If frozen-lockfile fails due to CI environment mismatch (rare):
# Add fallback:
- name: Install dependencies
  run: pnpm install --frozen-lockfile || (echo "Regenerating lockfile..." && rm pnpm-lock.yaml && pnpm install && git diff --exit-code pnpm-lock.yaml)
```

## Remediation When Already Broken

### Quick Fix (Single Branch)
```bash
git checkout feat/wpN-broken
rm -f pnpm-lock.yaml
pnpm install --no-frozen-lockfile
git add pnpm-lock.yaml
git commit -m "chore: regenerate lockfile for CI"
git push
```

### Mass Fix (All Branches)
```bash
# Generate canonical lockfile on main
git checkout main && git pull
rm -f pnpm-lock.yaml node_modules
pnpm install --no-frozen-lockfile
git add pnpm-lock.yaml && git commit -m "chore: canonical lockfile" && git push

# Apply to all branches via temp clones (needs git config in clone)
for branch in $(gh pr list --json headRefName -q '.[].headRefName'); do
  TMP=$(mktemp -d)
  git clone --branch "$branch" "$REPO" "$TMP" 2>&1 | tail -1
  cp package.json pnpm-lock.yaml "$TMP/"
  git -C "$TMP" config user.email "ci@bot" && git -C "$TMP" config user.name "CI Bot"
  git -C "$TMP" add -f . && git -C "$TMP" commit -m "chore: sync lockfile" || true
  git -C "$TMP" push origin HEAD:"$branch" --force
  rm -rf "$TMP"
done
```

## Verification Script
```bash
# After sync, verify all PRs
for pr in $(seq 22 29); do
  status=$(gh pr checks $pr --repo owner/repo --json 'conclusion' -q '.[0].conclusion' 2>/dev/null)
  echo "PR #$pr: ${status:-NO_CHECKS}"
done
```

## Why This Matters
- 8 PRs failed CI simultaneously because lockfile was stale
- 3 iterations of fixes, 20+ CI runs, ~15 minutes wasted
- Root cause: branches were created from an old main where package.json had different dependencies
- Prevention cost: 30 seconds to sync lockfile before creating branches
