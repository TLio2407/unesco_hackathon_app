/**
 * WP3 — Risk Scorer
 *
 * Calculates risk level from matched signals.
 * Rules:
 * - high_count >= 2 → high_risk
 * - 1 high + any other signal → high_risk
 * - any signal(s) → caution
 * - no signals → safe
 *
 * Rationale: a single High-weight signal (upfront_payment, authority
 * impersonation, personal data request) combined with ANY other signal
 * is serious enough to warrant high_risk.  This errs on the side of
 * protecting elderly users — better to over-warn than under-warn.
 *
 * Design: pure function, configurable thresholds.
 */

import type { MatchedSignal } from './contract';

// ── Scoring thresholds ──────────────────────────────────────────────────────

export interface ScoringThresholds {
  /** Minimum high signals for high_risk (standalone) */
  highRiskMinHighCount: number;
  /** With this many total signals, a single high triggers high_risk */
  highRiskMinTotalWithHigh: number;
}

export const DEFAULT_THRESHOLDS: ScoringThresholds = {
  highRiskMinHighCount: 2,
  highRiskMinTotalWithHigh: 2, // 1 high + 1 other = high_risk
};

// ── Scorer ───────────────────────────────────────────────────────────────────

/**
 * Score risk level from matched signals.
 */
export function scoreRisk(
  signals: MatchedSignal[],
  thresholds: ScoringThresholds = DEFAULT_THRESHOLDS,
): 'safe' | 'caution' | 'high_risk' | 'insufficient_data' {
  if (signals.length === 0) return 'safe';

  const highCount = signals.filter((s) => s.weight === 'high').length;

  if (highCount >= thresholds.highRiskMinHighCount) return 'high_risk';
  if (highCount >= 1 && signals.length >= thresholds.highRiskMinTotalWithHigh) return 'high_risk';

  return 'caution'; // any match = caution
}

/**
 * Quick check: is this risk level "risky" (caution or high_risk)?
 */
export function isRisky(
  level: 'safe' | 'caution' | 'high_risk' | 'insufficient_data',
): boolean {
  return level === 'caution' || level === 'high_risk';
}
