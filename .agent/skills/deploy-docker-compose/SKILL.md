# Skill: Deploy Docker Compose to VPS with NAT-only IPv4

## When to Use
- Deploying Expo + API to VPS with only NAT IPv4 (SSH-only access)
- Need HTTPS + custom domain for production
- Server has IPv6 but no public IPv4

## Architecture

```
Internet → Cloudflare Edge → Cloudflare Tunnel (cloudflared) → Docker Network → Web/API Containers
                                                    ↓
                                              Local VPS (IPv6 + NAT IPv4)
```

## Prerequisites
- VPS with Docker + Docker Compose
- Cloudflare account (free tier works)
- Domain managed by Cloudflare (or use trycloudflare for dev)

## Step 1: Install cloudflared on VPS

```bash
# Debian/Ubuntu
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64.deb -o /tmp/cloudflared.deb
sudo dpkg -i /tmp/cloudflared.deb

# Verify
cloudflared --version
```

## Step 2: Authenticate with Cloudflare

```bash
cloudflared tunnel login
# Opens browser → select domain → authorize
```

## Step 3: Create Tunnel

```bash
cloudflared tunnel create unesco-hackathon
# Output: Tunnel ID (e.g., abc123-def456)
```

## Step 4: Configure DNS

```bash
# Point subdomain to tunnel
cloudflared tunnel route dns unesco-hackathon app.yourdomain.com
```

## Step 5: Create Config

```yaml
# /etc/cloudflared/config.yml
tunnel: abc123-def456  # from step 3
credentials-file: /root/.cloudflared/abc123-def456.json

ingress:
  - hostname: app.yourdomain.com
    service: http://localhost:8081
    originRequest:
      noTLSVerify: true
  - service: http_status:404
```

## Step 6: Run as Service

```bash
sudo cloudflared service install
sudo systemctl enable cloudflared
sudo systemctl start cloudflared
sudo systemctl status cloudflared
```

## Step 7: Update Docker Compose

Remove public port mapping from web service:

```yaml
# docker-compose.yml
services:
  web:
    build: .
    # ports: []  # REMOVE: "8081:80"
    environment:
      - API_BASE_URL=http://api:3000
    depends_on:
      api:
        condition: service_healthy
  api:
    # No public ports needed
```

## QR Code / Expo Go Access

After tunnel is live:
- App URL: `https://app.yourdomain.com`
- Expo Go scans QR → loads `https://app.yourdomain.com`
- API calls go through Cloudflare → tunnel → Docker network → API container

## Development (No Domain)

Use TryCloudflare (no auth needed):

```bash
cloudflared tunnel --url http://localhost:8081
# Output: https://random-name.trycloudflare.com
# Scan this QR in Expo Go
```

## Security Notes

- Tunnel encrypts traffic end-to-end
- Only port 8081/3000 exposed internally
- VPS firewall: only SSH (2201) + Docker internal
- API key stays in .env on VPS (never in repo)

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Tunnel not connecting | Check `cloudflared tunnel info <id>` |
| 502 Bad Gateway | Ensure web container healthy (`docker ps`) |
| DNS not resolving | Wait 5 min, check `dig app.domain.com` |
| Expo Go won't connect | Must use HTTPS URL (Expo Go requires HTTPS) |
| Tunnel won't start | `journalctl -u cloudflared -f` for logs |

## References
- [Cloudflare Tunnel Docs](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)
- [TryCloudflare](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/get-started/create-local-tunnel/)
