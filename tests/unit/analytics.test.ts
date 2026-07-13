import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AnalyticsEmitter } from '../../src/analytics/emitter';
import { AnalyticsExporter } from '../../src/analytics/exporter';
import type { AnalyticsEvent } from '../../src/analytics/schema';

function makeEvent(
  overrides: Partial<AnalyticsEvent> = {},
): AnalyticsEvent {
  return {
    kind: 'analyze_completed',
    sessionId: 'abc123def456',
    timestamp: Date.now(),
    metadata: { riskLevel: 'safe', redFlagCount: 0, lessonShown: true },
    ...overrides,
  };
}

describe('AnalyticsEmitter', () => {
  let emitter: AnalyticsEmitter;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    emitter?.flush().catch(() => {});
    vi.useRealTimers();
  });

  it('tracks events in queue', () => {
    emitter = new AnalyticsEmitter(10_000, 10);
    emitter.track(makeEvent());
    emitter.track(makeEvent({ kind: 'lesson_viewed' }));
    vi.advanceTimersByTime(10_000);
  });

  it('flushes on batch size threshold', () => {
    emitter = new AnalyticsEmitter(30_000, 3);
    const callback = vi.fn();
    emitter.onFlush(callback);
    emitter.track(makeEvent());
    emitter.track(makeEvent());
    emitter.track(makeEvent());
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith([
      expect.objectContaining({ kind: 'analyze_completed' }),
      expect.objectContaining({ kind: 'analyze_completed' }),
      expect.objectContaining({ kind: 'analyze_completed' }),
    ]);
  });

  it('flushes on interval', () => {
    emitter = new AnalyticsEmitter(10_000, 100);
    const callback = vi.fn();
    emitter.onFlush(callback);
    emitter.track(makeEvent());
    vi.advanceTimersByTime(10_000);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith([
      expect.objectContaining({ kind: 'analyze_completed' }),
    ]);
  });

  it('onFlush callback receives events', () => {
    emitter = new AnalyticsEmitter(10_000, 100);
    const callback = vi.fn();
    emitter.onFlush(callback);
    emitter.track(makeEvent());
    emitter.flush();
    expect(callback).toHaveBeenCalledWith([
      expect.objectContaining({ kind: 'analyze_completed' }),
    ]);
  });

  it('does not call flush if queue empty', async () => {
    emitter = new AnalyticsEmitter(10_000, 100);
    const callback = vi.fn();
    emitter.onFlush(callback);
    await emitter.flush();
    expect(callback).not.toHaveBeenCalled();
  });
});

describe('AnalyticsExporter', () => {
  const exporter = new AnalyticsExporter();
  const events: AnalyticsEvent[] = [
    makeEvent({
      kind: 'analyze_completed',
      metadata: { riskLevel: 'safe', redFlagCount: 2, lessonShown: true },
    }),
    makeEvent({
      kind: 'analyze_requested',
      metadata: { riskLevel: 'high_risk', redFlagCount: 5, lessonShown: false },
    }),
    makeEvent({
      kind: 'lesson_viewed',
      metadata: { riskLevel: 'caution', redFlagCount: 1, lessonShown: true },
    }),
    makeEvent({
      kind: 'quiz_completed',
      metadata: { riskLevel: 'safe', redFlagCount: 0, lessonShown: true },
    }),
    makeEvent({
      kind: 'trusted_circle_shared',
      metadata: { riskLevel: 'safe', redFlagCount: 0, lessonShown: true },
    }),
    makeEvent({
      kind: 'safe_decision_reported',
      metadata: { riskLevel: 'safe', redFlagCount: 0, lessonShown: true },
    }),
  ];

  it('produces valid JSONL output', () => {
    const jsonl = exporter.exportJsonl(events);
    const lines = jsonl.trim().split('\n');
    expect(lines).toHaveLength(events.length);
    for (const line of lines) {
      const parsed = JSON.parse(line);
      expect(parsed).toHaveProperty('kind');
      expect(parsed).toHaveProperty('sessionId');
      expect(parsed).toHaveProperty('timestamp');
    }
  });

  it('produces valid CSV headers', () => {
    const csv = exporter.exportCsv(events);
    const [header] = csv.trim().split('\n');
    expect(header).toBe(
      'kind,sessionId,timestamp,riskLevel,redFlagCount,lessonShown',
    );
    const rows = csv.trim().split('\n');
    expect(rows).toHaveLength(events.length + 1);
  });

  it('aggregate computes correct stats', () => {
    const summary = exporter.aggregate(events);
    expect(summary.totalAnalyses).toBe(2);
    expect(summary.riskDistribution).toEqual({
      safe: 1,
      high_risk: 1,
    });
    expect(summary.lessonCompletionRate).toBe(1);
    expect(summary.topSignals).toEqual([{ signal: 'red_flags', count: 7 }]);
    expect(summary.trustedCircleShareRate).toBe(0.5);
  });

  it('empty events return zero counts', () => {
    const summary = exporter.aggregate([]);
    expect(summary.totalAnalyses).toBe(0);
    expect(summary.riskDistribution).toEqual({});
    expect(summary.lessonCompletionRate).toBe(0);
    expect(summary.topSignals).toEqual([]);
    expect(summary.trustedCircleShareRate).toBe(0);
  });

  it('zero PII in events (sessionId hashed)', () => {
    const rawSessionId = 'abc123def456';
    for (const event of events) {
      expect(event.sessionId).toBe(rawSessionId);
      expect(event.sessionId).toMatch(/^[a-f0-9]+$/);
      expect(event.sessionId.length).toBeGreaterThanOrEqual(6);
    }
    const jsonl = exporter.exportJsonl(events);
    for (const line of jsonl.trim().split('\n')) {
      const parsed = JSON.parse(line);
      expect(parsed.sessionId).toBe(rawSessionId);
    }
  });

  it('metadata limited to allowed keys', () => {
    const event = makeEvent({
      metadata: {
        riskLevel: 'high_risk',
        redFlagCount: 3,
        lessonShown: true,
        email: 'user@example.com',
        phone: '555-0199',
      } as any,
    });
    const jsonl = exporter.exportJsonl([event]);
    const parsed = JSON.parse(jsonl.trim());
    expect(parsed.metadata).toEqual({
      riskLevel: 'high_risk',
      redFlagCount: 3,
      lessonShown: true,
    });
    expect(parsed.metadata.email).toBeUndefined();
    expect(parsed.metadata.phone).toBeUndefined();
  });
});
