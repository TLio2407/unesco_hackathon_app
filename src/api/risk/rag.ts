/**
 * WP3 — RAG Retrieval
 *
 * Retrieves relevant trusted alerts from the evidence layer (WP4).
 * Used to ground LLM explanations in official sources.
 *
 * Design: pure function, no external calls (WP4 provides index).
 */

import type { RedFlagSignal, TrustedAlert, RagRetrieval, RagResult } from './contract';

export type { RagRetrieval, RagResult };

// ── RAG index interface (from WP4) ───────────────────────────────────────────

export interface AlertsIndex {
  alerts: TrustedAlert[];
  search(signals: RedFlagSignal[]): TrustedAlert[];
}

// ── RAG retriever ────────────────────────────────────────────────────────────

/**
 * Retrieve alerts relevant to the matched signals.
 */
export function retrieveRag(
  retrieval: RagRetrieval,
  index?: AlertsIndex,
): RagResult {
  if (!index) {
    return { alerts: [] };
  }

  const alerts = index.search(retrieval.signals);

  // Limit results
  const limit = retrieval.limit ?? 3;

  return { alerts: alerts.slice(0, limit) };
}

/**
 * Build RAG context string for LLM prompt.
 */
export function buildRagContext(alerts: TrustedAlert[]): string {
  if (alerts.length === 0) return '';

  return alerts
    .map(
      (a, i) =>
        `${i + 1}. ${a.title} (${a.source}, ${a.date}): ${a.summary} ` +
        `(Nguồn: ${a.sourceUrl})`,
    )
    .join('\n\n');
}
