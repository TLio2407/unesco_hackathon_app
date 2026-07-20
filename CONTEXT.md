# SilverTrust MIL Companion — Project Map for Agents

*Last updated: 2026-07-15. Maintained by Company Architect workflow.*

## What This Is
An AI companion for Vietnamese older adults (55+) to detect scams, misinformation, and AI-generated deceptive content. UNESCO Youth Hackathon 2026 entry.

## Quick Facts
| Field | Value |
|-------|-------|
| **App name** | An Tâm Số / El-Ed |
| **Team** | Beyond Limits (5 members) |
| **Stack** | Expo SDK 57 + TypeScript + pnpm + Vitest |
| **Node** | 22+ |
| **CI** | GitHub Actions (.github/workflows/ci.yml) |
| **LLM** | gemma-4-26b-a4b-it via Google AI Studio (testing only, key in .env, NOT committed) |
| **Tests** | 216+ across 14 test files |

## Deployment (Production)
| Service | URL | Status |
|---------|-----|--------|
| **Web App** | https://unesco.w9.nu | ✅ Live |
| **API** | https://unesco-api.w9.nu | ✅ Live |
| **QR Scanner** | https://unesco.w9.nu/scan | ✅ Working |

**Infrastructure:**
- VPS: sgp1.w9.nu (ARM64, IPv6 + NAT IPv4, SSH port 2201)
- Cloudflare Tunnel: `45988ce5-cab0-47b2-bb85-4bcad78e8311`
- Docker Compose: Web (port 8081) + API (port 3000)
- Cloudflare DNS: CNAME → tunnel.cfargotunnel.com (Proxied)

## Repository Map

```
unesco_hackathon_app/
├── src/
│   ├── api/
│   │   ├── contract.ts              ← Master interface contract (AnalysisInput, AnalyzeOutput, RedFlag, RiskLevel)
│   │   ├── input/                   ← WP1: unified input ingestion (text/url/image/voice)
│   │   │   ├── types.ts             InputBag, InputValidationError, sanitizers
│   │   │   └── processor.ts         DefaultInputProcessor (pure, testable)
│   │   ├── preprocess/              ← WP2: text normalization, entity extraction, PII redaction
│   │   │   ├── normalizer.ts        Text cleanup, VN diacritics folding
│   │   │   ├── entities.ts          VN phone, CCCD, email, bank, money, URL extraction
│   │   │   ├── redact.ts            Tier-1 PII redaction with audit metadata
│   │   │   └── pipeline.ts          Composes normalizer + entities + redact
│   │   ├── risk/                    ← WP3: core intelligence (rules + LLM + RAG)
│   │   │   ├── contract.ts          Risk-specific types (MatchedSignal, TrustedAlert, etc.)
│   │   │   ├── rules.ts             7-rule engine with Vietnamese regex patterns
│   │   │   ├── scorer.ts            Risk scoring (2+ high OR 1 high + any other → high_risk)
│   │   │   ├── llm.ts               LLM explainer (template fallback, Gemma 4 26B)
│   │   │   ├── rag.ts               RAG retrieval from evidence layer
│   │   │   └── pipeline.ts          Orchestrates rules → score → LLM → output
│   │   ├── evidence/                ← WP4: curated trusted alerts for RAG
│   │   ├── output/                  ← WP5: AnalyzeOutput assembly, lesson cards, Trusted Circle
│   │   └── privacy/                 ← WP6: session, consent, audit, PII guard
│   ├── analytics/                   ← WP7: event collection, aggregation, UNESCO export
│   ├── components/                  ← React Native UI components
│   ├── hooks/                       ← React hooks
│   ├── i18n/                        ← Vietnamese + English translations
│   ├── lib/                         ← Legacy libs (redact.ts, risk-meta.ts)
│   ├── locales/                     ← Translation files (vi.json, en.json)
│   └── theme/                       ← Design tokens
├── tests/
│   ├── unit/                        ← 13 test files, 204+ tests
│   └── integration/                 ← Cross-WP pipeline tests
├── data/evidence/alerts.json        ← 61 curated scam alert database
├── .agent/skills/                   ← Project skills
│   ├── deploy-docker-compose/       ← VPS Docker Compose deployment
│   ├── backend-parallel-branch/     ← WP branching workflow
│   ├── vn-text-matching/            ← Vietnamese regex patterns
│   ├── ci-lockfile-sync/            ← CI lockfile prevention
│   ├── company-arch-workflow/       ← German 3-layer delegation
│   └── privacy-by-design/           ← PII redaction patterns
├── .opencode-state/                 ← Session state for Company Architect
├── .github/workflows/
│   ├── ci.yml                       ← PR validation: typecheck + test + lint
│   └── release.yml                  ← EAS Update release pipeline
└── An_Tam_So_UNESCO_Youth_Hackathon_Report.md
```

## Architecture: Data Flow

```
User Input (text/url/image/voice)
  ↓
WP1 Input Layer → InputBag { kind, text, source, receivedAt }
  ↓
WP2 Pre-process → PreprocessedInput { normalised, entities, redacted }
  ↓                  ↓
WP4 Evidence → TrustedAlert[] → WP3 Risk Reasoning → AnalyzeOutput { riskLevel, redFlags, lessonCard }
  ↓                              ↓
                               WP5 Output → Trusted Circle + Lesson Card
  ↓                              ↓
WP6 Privacy → Session + Consent + Audit
  ↓                              ↓
WP7 Analytics → Events → Export (JSONL/CSV)
```

## Key Architectural Decisions

| ID | Decision | Rationale | Date |
|----|----------|-----------|------|
| D-01 | Aggressive scoring: 1 high + any other → high_risk | Better over-warn than under-warn for elderly | 2026-07-13 |
| D-02 | LLM: gemma-4-26b via Google AI Studio | Free tier, Vietnamese-capable, 26B params | 2026-07-13 |
| D-03 | Remove `\b` from VN regex patterns | JavaScript `\b` is ASCII-only, breaks on diacritics | 2026-07-13 |
| D-04 | Two-tier PII protection (ingress + export) | Defense-in-depth: prevent leaks at both boundaries | 2026-07-13 |
| D-05 | `company-*` subagents only, never `general` | German 3-layer governance ± BetrVG | 2026-07-13 |
| D-06 | Git worktrees for parallel branches | Untracked file isolation, true concurrency | 2026-07-13 |
| D-07 | Cloudflare Tunnel for NAT-only VPS | Free HTTPS + custom domain without public IPv4 | 2026-07-15 |

## Non-Negotiables (From Context Brief)
- **German 3-layer corporate governance** (Aufsichtsrat → Vorstand → Betriebsrat)
- **Betriebsrat co-determination gate** before execution
- **Whistleblower line** always preserved
- **Zero PII leaks** in any external call or log
- **Autonomy-first**: AI explains, user decides
- **Plain Vietnamese output**, no technical jargon
- **All pure functions 100% unit tested**
- **Privacy-by-design**: redaction before external calls
- **`company-*` subagent types only** — never `general`
- **Mock auth accepted hackathon MVP** — no real OTP validation (finding A-005)

## Testing
```bash
pnpm test            # All 216+ tests
pnpm typecheck       # tsc -p tsconfig.wp2.json --noEmit
pnpm lint            # expo lint (warnings allowed, continue-on-error in CI)
pnpm vitest run tests/unit/<file>.test.ts  # Run specific test file
pnpm vitest run tests/integration/  # Run integration tests
```

## Environment Variables (.env — NEVER COMMIT)
```
AI_STUDIO_API_KEY=...   # Google AI Studio key for Gemma 4 26B
AI_MODEL=gemma-4-26b-a4b-it
```

## Deployment Commands

```bash
# Deploy to VPS
cd /opt/unesco-hackathon
docker compose build --no-cache
docker compose up -d

# View logs
docker compose logs -f

# Restart
docker compose restart

# Cloudflare Tunnel (run as service)
sudo systemctl enable --now cloudflared
```

## Expo Go Testing
```bash
# Local tunnel (easiest)
pnpm expo start --tunnel
# Scan QR in terminal with Expo Go app

# EAS Update (production-like)
eas update --branch production
# In Expo Go: profile → "Enter update URL"

# Development build (best for testing)
eas build --profile development --platform android
```

## Common Pitfalls & Fixes

| Pitfall | Fix |
|---------|-----|
| `ERR_PNPM_OUTDATED_LOCKFILE` in CI | Sync `package.json` + `pnpm-lock.yaml` from main to all branches |
| `\b` doesn't match Vietnamese text | Omit `\b` for VN words; use `(?<!\p{L})` for unicode-aware boundary |
| Untracked files on wrong branch | Use `git worktree` for branch isolation |
| `tsc --noEmit` fails after `sed` edits | Don't use `sed` for TypeScript; Python string replace is safer |
| TypeScript union `;` breaks type | `| { kind };` closes union — pipe goes BEFORE each variant |
| WP PRs failing CI after agent build | All agents must run `pnpm typecheck && pnpm test` before push |
| `toHaveLengthGreaterThan` doesn't exist | Use `.length).toBeGreaterThan(0)` in vitest |
| Cloudflare Tunnel 502 | Check `docker ps` - service must be healthy |
| DNS not resolving | Add CNAME records in Cloudflare DNS (Proxied) |

## Skills Index
- Want to add a new backend module? → `backend-parallel-branch/SKILL.md`
- Writing Vietnamese regex? → `vn-text-matching/SKILL.md`
- CI failing with lockfile? → `ci-lockfile-sync/SKILL.md`
- Delegating to subagents? → `company-arch-workflow/SKILL.md`
- Handling user PII? → `privacy-by-design/SKILL.md`
- Parallel git branch workflow? → `parallel-branch-workflow/SKILL.md`
- Deploy to NAT-only VPS? → `deploy-docker-compose/SKILL.md`
- Cloudflare Tunnel setup? → `deploy-cloudflare-tunnel/SKILL.md` (global)

## Live Endpoints
| Endpoint | URL |
|----------|-----|
| Web App | https://unesco.w9.nu |
| QR Scanner | https://unesco.w9.nu/scan |
| API Analyze | https://unesco-api.w9.nu/api/analyze |
| API Health | https://unesco-api.w9.nu/health |
| Tunnel ID | 45988ce5-cab0-47b2-bb85-4bcad78e8311 |

