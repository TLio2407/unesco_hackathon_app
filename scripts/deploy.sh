#!/usr/bin/env bash
# Deploy to sgp1.w9.nu via SSH (IPv6 only, SSH-only access)

set -euo pipefail

SERVER="root@sgp1.w9.nu"
SSH_PORT=2201
REMOTE_DIR="/opt/unesco-hackathon"

echo "=== Deploying to $SERVER ==="

# Sync files via rsync over SSH
echo "Syncing files..."
rsync -avz --delete \
  -e "ssh -p $SSH_PORT" \
  --exclude node_modules \
  --exclude .git \
  --exclude .expo \
  --exclude dist \
  --exclude .turbo \
  --exclude "*.log" \
  . "$SERVER:$REMOTE_DIR/"

# Copy .env file
echo "Copying .env..."
scp -P $SSH_PORT .env "$SERVER:$REMOTE_DIR/.env"

# Deploy on remote
echo "Building and starting containers..."
ssh -p $SSH_PORT "$SERVER" << 'REMOTE_EOF'
set -euo pipefail
cd /opt/unesco-hackathon

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
fi

# Install docker-compose if not present
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# Build and start
docker-compose down || true
docker-compose build --no-cache
docker-compose up -d

# Show status
docker-compose ps
docker-compose logs --tail=50
REMOTE_EOF

echo "=== Deployment complete ==="
echo "API: http://[sgp1.w9.nu]:3000"
echo "Web: http://[sgp1.w9.nu]:8081"
