# Frontend Developer Guide — An Tâm Số / SilverTrust MIL Companion

## Quick Start

```bash
cd /home/shayneeo/Downloads/Documents/Coding/UNESCO/unesco_hackathon_app
pnpm install
pnpm expo start --tunnel    # For Expo Go testing
# or
pnpm expo export --platform web  # Production build
```

## Project Structure

```
src/
├── app/
│   ├── _layout.tsx          # Root stack navigator
│   ├── index.tsx            # Redirect to /(tabs)
│   ├── scan.tsx             # QR/URL/text analysis screen
│   ├── alert.tsx            # Scam alerts feed
│   ├── circle.tsx           # Trusted Circle sharing
│   ├── events.tsx           # Community events
│   ├── explore.tsx          # Explore page
│   ├── resources.tsx        # Learning resources
│   ├── auth/
│   │   ├── login.tsx
│   │   └── verify-otp.tsx
│   └── tabs/
│       ├── _layout.tsx      # Tab navigator (5 tabs)
│       ├── index.tsx        # Companion (home)
│       ├── learning.tsx     # Micro-lessons
│       ├── trusted_circle.tsx
│       ├── community.tsx
│       └── profile.tsx
├── api/
│   ├── client.ts            # API client (mock + real)
│   ├── contract.ts          # Zod schemas: AnalysisInput, AnalyzeOutput
│   ├── input/               # WP1: text/url/image/voice input
│   ├── preprocess/          # WP2: normalize, extract entities, redact PII
│   ├── risk/                # WP3: rules + LLM + RAG
│   ├── evidence/            # WP4: 61 curated scam alerts
│   ├── output/              # WP5: assemble output, lesson, trusted circle
│   ├── privacy/             # WP6: session, consent, audit
│   └── analytics/           # WP7: events, export
├── components/              # Reusable UI components
├── hooks/                   # Custom React hooks
├── i18n/                    # i18n setup (vi/en)
├── locales/
│   ├── vi.json              # Vietnamese translations
│   └── en.json              # English translations
├── theme/
│   └── tokens.ts            # Design tokens (Colors, Spacing, Accessibility)
└── constants/
    └── theme.ts             # Theme constants
```

## Key Files to Know

| File | Purpose |
|------|---------|
| `src/app/_layout.tsx` | Root stack navigator with all routes |
| `src/app/(tabs)/_layout.tsx` | Tab navigator (5 tabs) |
| `src/app/index.tsx` | Redirects to `/(tabs)` |
| `src/app/scan.tsx` | Manual text/URL analysis screen |
| `src/theme/tokens.ts` | **All design tokens** (Colors, Spacing, Accessibility) |
| `src/api/contract.ts` | Shared Zod schemas for API |
| `src/api/client.ts` | API client (mock + real) |

## Design Tokens (Use These!)

```typescript
import { Colors, Spacing, Accessibility } from '@/theme/tokens';

// Colors
Colors.primaryAction        // #208AEF
Colors.primaryActionText    // #FFFFFF
Colors.riskHigh             // #B22222
Colors.riskCaution          // #B8860B
Colors.riskSafe             // #1B7B3A
Colors.calmText             // #2C2C2C
Colors.calmTextSecondary    // #555555
Colors.surfaceCard          // #FFFFFF

// Spacing
Spacing.one    // 4
Spacing.two    // 8
Spacing.three  // 16
Spacing.four   // 24

// Accessibility
Accessibility.fontSize.normal   // 18
Accessibility.fontSize.large    // 22
Accessibility.minTouchSize      // 48
```

## Theming

```tsx
import { ThemedView, ThemedText } from '@/components';

<ThemedView style={styles.container}>
  <ThemedText type="title">Title</ThemedText>
  <ThemedText type="subtitle">Subtitle</ThemedText>
  <ThemedText type="body">Body text</ThemedText>
</ThemedView>
```

## API Client Usage

```typescript
import { createAnalyzeClient } from '@/api/client';

const client = createAnalyzeClient();

const result = await client.analyze({
  kind: 'text',
  text: 'Công an yêu cầu chuyển 500,000 VND trong 10 phút'
});

// Result type:
type AnalyzeOutput = {
  riskLevel: 'safe' | 'caution' | 'high_risk' | 'insufficient_data';
  redFlags: { signal: string; explanation: string }[];
  verificationSteps: string[];
  nextAction: string;
  lessonCard?: { title: string; points: string[]; quiz: { question: string; answer: string } };
  disclaimer: string;
};
```

## Internationalization

```tsx
import { t } from '@/i18n';

<Text>{t('scan.hint')}</Text>           // "Place QR/barcode in frame to scan"
<Text>{t('risk.highRisk')}</Text>       // "High Risk" / "Rủi ro cao"
```

### Adding Translations
Edit `src/locales/vi.json` and `src/locales/en.json` with matching keys.

## Running Commands

```bash
# Development
pnpm expo start              # Local
pnpm expo start --tunnel     # Expo Go on phone (any network)
pnpm expo start --dev-client # Development build

# Production
pnpm expo export --platform web    # Static web export
pnpm expo export --platform android # Android build

# Quality
pnpm test            # 216 tests
pnpm typecheck       # TypeScript check
pnpm lint            # ESLint
```

## Testing

```bash
pnpm test                    # All 216 tests
pnpm vitest run tests/unit/scan.test.ts
pnpm vitest run tests/integration/
```

## Deployment

```bash
# Web
pnpm expo export --platform web
# Deploy dist/ to any static host

# Native
eas build --profile production --platform android
eas build --profile production --platform ios
eas submit --platform android
```

## Environment Variables (.env — never commit)

```env
AI_STUDIO_API_KEY=...    # Google AI Studio key for Gemma 4 26B
AI_MODEL=gemma-4-26b-a4b-it
```

## Key Patterns

### 1. Screen Component
```tsx
import { ThemedView, ThemedText } from '@/components';
import { styles } from './styles';

export default function MyScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Title</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.four },
});
```

### 2. API Call with Error Handling
```tsx
const handleAnalyze = async (text: string) => {
  setLoading(true);
  try {
    const client = createAnalyzeClient();
    const result = await client.analyze({ kind: 'text', text });
    setResult(result);
  } catch {
    setError(t('common.error'));
  } finally {
    setLoading(false);
  }
};
```

### 3. Styles with Tokens
```tsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.four,
    backgroundColor: Colors.surfaceCard,
  },
  button: {
    backgroundColor: Colors.primaryAction,
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    minWidth: 160,
  },
});
```

## Navigation

```tsx
import { useRouter } from 'expo-router';

const router = useRouter();
router.push('/scan');
router.push('/learning');
router.back();
```

## Translation Keys (vi.json / en.json)

```json
{
  "common": { "appName": "An Tâm Số", "loading": "Đang xử lý...", "error": "Có lỗi xảy ra", "retry": "Thử lại" },
  "scan": { "title": "Quét mã", "hint": "Nhập URL hoặc văn bản", "submit": "Phân tích", "analyzing": "Đang phân tích...", "resultTitle": "Kết quả", "scanAgain": "Quét lại", "tryAgain": "Thử lại" },
  "risk": { "safe": "An toàn", "caution": "Cần cẩn trọng", "highRisk": "Rủi ro cao", "insufficientData": "Chưa đủ dữ liệu" }
}
```

## Git Workflow

```bash
# Feature branch
git checkout -b feat/my-feature

# Before commit
pnpm typecheck && pnpm test && pnpm lint

# Commit
git add -A
git commit -m "feat(scope): description"

# Push & PR
git push origin feat/my-feature
```

## Production Endpoints

| Endpoint | URL |
|----------|-----|
| Web App | https://unesco.w9.nu |
| QR Scanner | https://unesco.w9.nu/scan |
| API Analyze | https://unesco-api.w9.nu/api/analyze |
| API Health | https://unesco-api.w9.nu/health |
| Tunnel ID | 45988ce5-cab0-47b2-bb85-4bcad78e8311 |

## Expo Go Testing

```bash
# Local tunnel (easiest)
pnpm expo start --tunnel
# Scan QR in terminal with Expo Go app

# EAS Update (production-like)
eas update --branch production
# In Expo Go: profile → "Enter update URL"
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

