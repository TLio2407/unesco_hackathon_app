#!/usr/bin/env bash
# Generate QR codes for deployed app URLs

set -euo pipefail

WEB_URL="${1:-http://[sgp1.w9.nu]:8081}"
API_URL="${2:-http://[sgp1.w9.nu]:3000}"

# Install qrencode if not present
if ! command -v qrencode &> /dev/null; then
    if command -v apt-get &> /dev/null; then
        apt-get update && apt-get install -y qrencode
    elif command -v apk &> /dev/null; then
        apk add qrencode
    else
        echo "qrencode not found. Install manually."
        exit 1
    fi
fi

echo "=== QR Codes for An Tâm Số ==="
echo
echo "Web App (for users):"
echo "$WEB_URL"
qrencode -t ANSIUTF8 "$WEB_URL"
echo

echo "API Health Check:"
echo "$API_URL/health"
qrencode -t ANSIUTF8 "$API_URL/health"
echo

echo "Save these QR codes for easy access:"
echo "- Web URL QR: users scan to open app"
echo "- API Health QR: devs scan to verify API"
