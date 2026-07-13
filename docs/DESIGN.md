# An Tâm Số / SilverTrust MIL — Technical Design (WP1)

> Authoritative design contract for the Expo Go frontend build. Backend is built separately by the user.
> Decisions: Q1=B, Q2=A, Q3=C, Q4=C, Q5=B (see context-brief.md).

## 1. Company Architecture layers (applied)
- **Strategy Layer (Aufsichtsrat/Vorstand):** product report + context-brief.md. Source of truth.
- **Operations Layer (Abteilungen):**
  - DEPT-A Architecture & API contract (this doc, WP2)
  - DEPT-B Decision Companion feature (WP3)
  - DEPT-C i18n + accessibility (WP4)
  - DEPT-D Placeholder modules (WP5)
  - DEPT-E CI/CD + release (WP6)
- **Support Layer:** docs, implementation-notes, Works Council (privacy/accessibility clearance).
- **Works Council (Betriebsrat):** reviews privacy (no retention, redaction) + accessibility scope before release. Can veto.

## 2. Folder structure (extends existing expo-router tabs)
```
src/
  api/
    contract.ts     # shared types (backend-agnostic)
    client.ts       # typed client: analyze(); mock when no API_BASE_URL
    mock.ts         # offline mock with >=3 VN scenarios
  lib/
    redact.ts       # redact CCCD/phone/account for Trusted Circle summary (unit-tested)
  i18n/
    index.ts        # expo-localization + i18n-js setup
    keys.ts         # TYPED string-key catalog
  locales/
    vi.json
    en.json
  app/
    (tabs)/
      index.tsx        # home / entry
      companion.tsx    # WP3 Decision Companion
      alert.tsx        # WP5 placeholder
      community.tsx    # WP5 placeholder
      learning.tsx     # WP5 placeholder
      circle.tsx       # WP5 placeholder (redacted share preview)
    _layout.tsx
  components/
    RiskBadge.tsx
    RedFlagList.tsx
    VerificationSteps.tsx
    InputBar.tsx
  theme/
    tokens.ts          # large font, high contrast
  constants/theme.ts    # (existing)
tests/
  unit/                 # vitest
  component/            # RNTL
maestro/
  companion.yaml        # E2E flow
.github/workflows/
  ci.yml                # PR gate
  release.yml           # tag -> EAS Update
eas.json
```

## 3. API contract (src/api/contract.ts)
```ts
export type RiskLevel = 'safe' | 'caution' | 'high_risk' | 'insufficient_data';

export type AnalysisInput =
  | { kind: 'text'; text: string }
  | { kind: 'url'; url: string }
  | { kind: 'image'; ref: string }; // base64/local ref; OCR is backend

export interface RedFlag {
  signal:
    | 'urgency' | 'upfront_payment' | 'authority_impersonation'
    | 'suspicious_url' | 'too_good_to_be_true' | 'personal_data_request' | 'social_proof';
  explanation: string; // plain Vietnamese
}

export interface LessonCard {
  title: string;
  points: string[];
  quiz?: { question: string; answer: string };
}

export interface AnalyzeOutput {
  riskLevel: RiskLevel;
  redFlags: RedFlag[];
  verificationSteps: string[];
  nextAction: string; // autonomy-first, calm
  lessonCard?: LessonCard;
  disclaimer?: string; // "AI không chắc" / no medical-legal-financial advice
}

export interface AnalyzeClient {
  analyze(input: AnalysisInput): Promise<AnalyzeOutput>;
}
```
- Client uses `API_BASE_URL` env when present, else `mockAnalyze`.
- No sensitive data retained; summaries passed through `redact()` before any share.

## 4. Mock scenarios (src/api/mock.ts)
Covers report 9.3 signals. Examples:
1. **Fake authority / bank** ("Tài khoản sắp bị khóa, bấm link xác minh 10 phút") -> high_risk: urgency + authority_impersonation + suspicious_url + personal_data_request.
2. **Investment too-good-to-be-true** ("Lợi nhuận 30%/tháng, chuyển trước để giữ vị trí") -> high_risk: too_good_to_be_true + upfront_payment + social_proof.
3. **Benign family message** -> safe / insufficient_data.

## 5. i18n (WP4)
- `expo-localization` + `i18n-js`. `src/locales/vi.json` (default) + `en.json`.
- `src/i18n/keys.ts` exposes a typed `t(key)` so missing keys are compile errors.
- All component copy via `t(...)`; zero raw Vietnamese literals in components.

## 6. Test plan (Q3=C)
- **Unit (vitest):** mock returns valid contract; client routes to mock without env; `redact()` removes CCCD/phone/account; i18n key resolution.
- **Component (RNTL):** companion input + output render correctly; RiskBadge shows correct level; VN strings render from catalog.
- **E2E (Maestro):** `maestro/companion.yaml` — launch -> paste suspicious text -> assert high_risk visible -> tap next action.

## 7. CI/CD (Q3=C, Q4=C)
- **ci.yml** (on PR): `npm ci` -> `tsc --noEmit` -> `expo lint` -> `vitest run` -> RNTL -> **Maestro** (Android emulator on Linux via `reactivecircus/android-emulator-runner` or Maestro GH action). All required.
- **Tests offline:** mock only; never call backend.
- **release.yml** (on `v*` tag): re-run gate -> `eas update --channel go --message "$TAG"` using `EXPO_TOKEN` secret (user-supplied).
- **No release on plain merge** — only on tag.

## 8. Work packages -> GitHub issues
| Issue | WP | Owner |
|------|----|-------|
| #1 | scaffold (eas.json, CI skeletons, .gitignore) | architect |
| #2 | WP2 API contract + mock | worker |
| #3 | WP3 Decision Companion UI | worker |
| #4 | WP4 i18n + accessibility | worker |
| #5 | WP5 placeholder modules | worker |
| #6 | WP6 CI gate + tag release | writer |

## 9. Open risks / assumptions
- `EXPO_TOKEN` not yet in repo secrets; release.yml authored but EAS run needs it.
- Real `API_BASE_URL` TBD (backend on ssh root@sgp1.w9.nu:2201). Frontend uses mock until ready.
- Expo Go constraint: no custom native modules; OCR/risk/LLM are backend.
