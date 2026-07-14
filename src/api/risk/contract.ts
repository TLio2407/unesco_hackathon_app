/**
 * WP3 — Risk Reasoning Contract
 *
 * Types shared between Risk Reasoning and other layers.
 * Extends the existing contract.ts with WP3-specific types.
 */

import type { AnalyzeOutput } from '@/api/contract';

// ── Red flag signals (from mock.ts, now typed) ────────────────────────────────

export type RedFlagSignal =
  | 'urgency'
  | 'upfront_payment'
  | 'authority_impersonation'
  | 'suspicious_url'
  | 'too_good_to_be_true'
  | 'personal_data_request'
  | 'social_proof';

// ── Matched signal with explanation ────────────────────────────────────────

export interface MatchedSignal {
  signal: RedFlagSignal;
  explanation: string;
  /** Weight: high/medium (from rules) */
  weight: 'high' | 'medium';
}

// ── Lesson card for micro-learning ────────────────────────────────────────

export interface LessonCard {
  title: string;
  points: string[];
  quiz?: { question: string; answer: string };
}

// ── Trusted alert from evidence layer ──────────────────────────────────────

export interface TrustedAlert {
  id: string;
  source: string;
  sourceUrl: string;
  date: string;
  title: string;
  summary: string;
  signals: RedFlagSignal[];
}

// ── Risk engine input/output ──────────────────────────────────────────────

export interface RiskEngineInput {
  /** Normalised text (from WP2) */
  text: string;
  /** Extracted entities (from WP2) */
  entities: any[]; // TODO: use ExtractedEntity from WP2
  /** RAG context (from WP4) */
  ragContext?: TrustedAlert[];
}

export interface RiskEngineOutput {
  /** Matched signals with explanations */
  signals: MatchedSignal[];
  /** Risk level */
  riskLevel: 'safe' | 'caution' | 'high_risk' | 'insufficient_data';
  /** Verification steps for user */
  verificationSteps: string[];
  /** One-line next action */
  nextAction: string;
  /** Micro-learning card (if risky) */
  lessonCard?: LessonCard;
  /** Disclaimer */
  disclaimer: string;
}

// ── LLM prompt/response ────────────────────────────────────────────────────

export interface LlmPrompt {
  system: string;
  user: string;
}

export interface LlmResponse {
  explanation: string;
  verificationSteps: string[];
  nextAction: string;
}

// ── RAG retrieval ──────────────────────────────────────────────────────────

export interface RagRetrieval {
  /** Signals to match */
  signals: RedFlagSignal[];
  /** Max results */
  limit?: number;
}

export interface RagResult {
  alerts: TrustedAlert[];
}

// ── Pipeline input/output ──────────────────────────────────────────────────

export interface RiskPipelineInput {
  /** Preprocessed input (from WP2) */
  preprocessed: any; // TODO: use PreprocessedInput from WP2
  /** RAG index (from WP4) */
  ragIndex?: any; // TODO: use AlertsIndex from WP4
}

export interface RiskPipelineOutput extends AnalyzeOutput {
  /** Full decision trace for audit */
  trace: {
    inputHash: string;
    rulesMatched: MatchedSignal[];
    llmPrompt?: LlmPrompt;
    llmResponse?: LlmResponse;
    ragRetrieved?: TrustedAlert[];
  };
}

// ── Errors ─────────────────────────────────────────────────────────────────

export class RiskEngineError extends Error {
  constructor(
    public readonly code: 'RULES_FAILED' | 'LLM_FAILED' | 'RAG_FAILED',
    message: string,
  ) {
    super(message);
    this.name = 'RiskEngineError';
  }
}
