/**
 * WP7 — Analytics Schema (Versioned)
 *
 * Zod schemas for analytics events, exporters, and summary metrics.
 *
 * @module api/analytics/schema
 * @version 1.0.0
 */

import { z } from 'zod';

// ── Version ──────────────────────────────────────────────────────────────────

/** Contract version — increment on breaking changes. */
export const VERSION = '1.0.0' as const;

// ── Event Kind ───────────────────────────────────────────────────────────────

/** Types of analytics events tracked by the system. */
export const AnalyticsEventKindSchema = z.enum([
  'analyze_requested',
  'analyze_completed',
  'lesson_viewed',
  'quiz_completed',
  'trusted_circle_shared',
  'safe_decision_reported',
]);
export type AnalyticsEventKind = z.infer<typeof AnalyticsEventKindSchema>;

// ── Analytics Event ──────────────────────────────────────────────────────────

/**
 * Single analytics event.
 * Metadata is whitelisted to prevent PII leakage.
 */
export const AnalyticsEventSchema = z.object({
  kind: AnalyticsEventKindSchema,
  sessionId: z.string(),
  timestamp: z.number(),
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
});
export type AnalyticsEvent = z.infer<typeof AnalyticsEventSchema>;

// ── Metadata Whitelist ───────────────────────────────────────────────────────

/** Only these keys may enter the analytics pipeline. */
export const VALID_META_KEYS = new Set([
  'riskLevel',
  'redFlagCount',
  'lessonShown',
  'signal',
  'count',
]);

/**
 * Filter metadata to only whitelisted keys.
 * Prevents accidental PII leakage into analytics.
 */
export function filterMeta(
  meta: Record<string, any> | undefined,
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

// ── Analytics Summary ────────────────────────────────────────────────────────

/** Aggregated analytics summary for dashboards. */
export const AnalyticsSummarySchema = z.object({
  totalAnalyses: z.number(),
  riskDistribution: z.record(z.string(), z.number()),
  lessonCompletionRate: z.number(),
  topSignals: z.array(z.object({ signal: z.string(), count: z.number() })),
  trustedCircleShareRate: z.number(),
});
export type AnalyticsSummary = z.infer<typeof AnalyticsSummarySchema>;
