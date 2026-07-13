export type RiskLevel = 'safe' | 'caution' | 'high_risk' | 'insufficient_data';

export type AnalysisInput =
  | { kind: 'text'; text: string }
  | { kind: 'url'; url: string }
  | { kind: 'image'; ref: string };
  | { kind: 'voice'; data: string; mimeType: string; durationMs?: number };

export type RedFlagSignal =
  | 'urgency'
  | 'upfront_payment'
  | 'authority_impersonation'
  | 'suspicious_url'
  | 'too_good_to_be_true'
  | 'personal_data_request'
  | 'social_proof';

export interface RedFlag {
  signal: RedFlagSignal;
  explanation: string;
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
  nextAction: string;
  lessonCard?: LessonCard;
  disclaimer?: string;
}

export interface AnalyzeClient {
  analyze(input: AnalysisInput): Promise<AnalyzeOutput>;
}
