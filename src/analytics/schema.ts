export type AnalyticsEventKind =
  | 'analyze_requested'
  | 'analyze_completed'
  | 'lesson_viewed'
  | 'quiz_completed'
  | 'trusted_circle_shared'
  | 'safe_decision_reported';

export interface AnalyticsEvent {
  kind: AnalyticsEventKind;
  sessionId: string;
  timestamp: number;
  metadata?: Record<string, string | number | boolean>;
}

/** Whitelist: only these metadata keys may enter the analytics pipeline. */
export const VALID_META_KEYS = new Set([
  'riskLevel',
  'redFlagCount',
  'lessonShown',
  'signal',
  'count',
]);

/** Strip non-whitelisted metadata keys at ingestion time. */
export function filterMeta(
  meta: Record<string, any> | undefined
): Record<string, string | number | boolean> | undefined {
  if (!meta) return undefined;
  const filtered: Record<string, string | number | boolean> = {};
  let kept = false;
  for (const key of Object.keys(meta)) {
    if (VALID_META_KEYS.has(key)) {
      filtered[key] = meta[key];
      kept = true;
    }
  }
  return kept ? filtered : undefined;
}
