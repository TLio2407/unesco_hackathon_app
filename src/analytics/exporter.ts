import type { AnalyticsEvent } from './schema';

export interface AnalyticsSummary {
  totalAnalyses: number;
  riskDistribution: Record<string, number>;
  lessonCompletionRate: number;
  topSignals: Array<{ signal: string; count: number }>;
  trustedCircleShareRate: number;
}

const VALID_META_KEYS = new Set([
  'riskLevel',
  'redFlagCount',
  'lessonShown',
]);

export class AnalyticsExporter {
  exportJsonl(events: AnalyticsEvent[]): string {
    return events
      .map((e) => JSON.stringify(stripPii(e)))
      .join('\n') + '\n';
  }

  exportCsv(events: AnalyticsEvent[]): string {
    const headers = [
      'kind',
      'sessionId',
      'timestamp',
      'riskLevel',
      'redFlagCount',
      'lessonShown',
    ];
    const rows = events.map((e) => {
      const meta = filterMeta(e.metadata);
      return [
        escapeCsv(e.kind),
        escapeCsv(e.sessionId),
        String(e.timestamp),
        escapeCsv(meta.riskLevel ?? ''),
        String(meta.redFlagCount ?? ''),
        String(meta.lessonShown ?? ''),
      ].join(',');
    });
    return headers.join(',') + '\n' + rows.join('\n') + '\n';
  }

  aggregate(events: AnalyticsEvent[]): AnalyticsSummary {
    const analysisEvents = events.filter(
      (e) => e.kind === 'analyze_requested' || e.kind === 'analyze_completed',
    );
    const lessonViews = events.filter((e) => e.kind === 'lesson_viewed');
    const quizCompletions = events.filter((e) => e.kind === 'quiz_completed');
    const circleShares = events.filter(
      (e) => e.kind === 'trusted_circle_shared',
    );

    const totalAnalyses = analysisEvents.length;

    const riskDistribution: Record<string, number> = {};
    for (const e of analysisEvents) {
      const rl = filterMeta(e.metadata).riskLevel;
      if (rl) {
        riskDistribution[rl] = (riskDistribution[rl] ?? 0) + 1;
      }
    }

    const lessonCompletionRate =
      lessonViews.length > 0
        ? quizCompletions.length / lessonViews.length
        : 0;

    const signalCounts: Record<string, number> = {};
    for (const e of analysisEvents) {
      const rc = filterMeta(e.metadata).redFlagCount;
      if (typeof rc === 'number' && rc > 0) {
        signalCounts['red_flags'] = (signalCounts['red_flags'] ?? 0) + rc;
      }
    }
    const topSignals = Object.entries(signalCounts)
      .map(([signal, count]) => ({ signal, count }))
      .sort((a, b) => b.count - a.count);

    const trustedCircleShareRate =
      totalAnalyses > 0 ? circleShares.length / totalAnalyses : 0;

    return {
      totalAnalyses,
      riskDistribution,
      lessonCompletionRate,
      topSignals,
      trustedCircleShareRate,
    };
  }
}

function filterMeta(
  meta: Record<string, string | number | boolean> | undefined,
): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  if (!meta) return out;
  for (const k of Object.keys(meta)) {
    if (VALID_META_KEYS.has(k)) {
      out[k] = meta[k];
    }
  }
  return out;
}

function stripPii(event: AnalyticsEvent): AnalyticsEvent {
  return {
    ...event,
    sessionId: event.sessionId,
    metadata: event.metadata ? filterMeta(event.metadata) : undefined,
  };
}

function escapeCsv(val: string): string {
  if (val.includes(',') || val.includes('"') || val.includes('\n')) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}
