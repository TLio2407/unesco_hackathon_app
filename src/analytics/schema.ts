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
