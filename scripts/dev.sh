#!/usr/bin/env bash
set -euo pipefail

# Get local IP (works on Linux/macOS, uses ip route as fallback)
if command -v ip >/dev/null 2>&1; then
  MY_IP=$(ip route show default 2>/dev/null | awk '{print $9}' | head -1)
elif command -v hostname >/dev/null 2>&1; then
  MY_IP=$(hostname -I 2>/dev/null | awk '{print $1}')
fi

BACKEND_URL="http://${MY_IP:-localhost}:3000"

echo "=== Starting Backend (AI: real) ==="
echo "Backend URL: ${BACKEND_URL}"
echo ""

# Start backend in background
AI_STUDIO_API_KEY="$AI_STUDIO_API_KEY" \
pnpm start:server &
SERVER_PID=$!
disown $SERVER_PID 2>/dev/null || true

# Wait for server ready
sleep 2
curl -sf "${BACKEND_URL}/health" > /dev/null || { echo "Backend failed to start"; exit 1; }

echo "=== Starting Expo (tunnel, wired to backend) ==="
echo "Frontend will call: ${BACKEND_URL}/api/analyze"
echo ""

# Cleanup on exit — kill backend when user presses Ctrl+C
trap "kill $SERVER_PID 2>/dev/null; exit 0" INT TERM

# Start Expo with tunnel so phone can reach it
EXPO_PUBLIC_API_BASE_URL="${BACKEND_URL}" \
pnpm start --tunnel
