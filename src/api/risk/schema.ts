/**
 * WP3 — Risk Reasoning Schema (Versioned)
 *
 * Zod schemas for risk engine input/output, signals, scoring, RAG.
 *
 * @module api/risk/schema
 * @version 1.0.0
 */

import { z } from 'zod';

// ── Version ──────────────────────────────────────────────────────────────────

/** Contract version — increment on breaking changes. */
export const VERSION = '1.0.0' as const;

// ── Red Flag Signal (re-export from WP0 contract) ───────────────────────────

import { RedFlagSignalSchema, RedFlagSchema } from '@/api/contract';

// ── Matched Signal ───────────────────────────────────────────────────────────

/** A rule-matched signal with explanation and weight. */
export const MatchedSignalSchema = z.object({
  signal: RedFlagSignalSchema,
  explanation: z.string(),
  weight: z.enum(['high', 'medium']),
});
export type MatchedSignal = z.infer<typeof MatchedSignalSchema>;

// ── Risk Engine Input ────────────────────────────────────────────────────────

/** Input to the risk reasoning engine. */
export const RiskEngineInputSchema = z.object({
  text: z.string(),
  entities: z.any(), // ExtractedEntity[] from WP2
  ragContext: z.array(z.any()).optional(), // TrustedAlert[] from WP4
});
export type RiskEngineInput = z.infer<typeof RiskEngineInputSchema>;

// ── Risk Engine Output ───────────────────────────────────────────────────────

/** Output from the risk reasoning engine. */
export const RiskEngineOutputSchema = z.object({
  signals: z.array(MatchedSignalSchema),
  riskLevel: z.enum(['safe', 'caution', 'high_risk', 'insufficient_data']),
  verificationSteps: z.array(z.string()),
  nextAction: z.string(),
  lessonCard: z
    .object({
      title: z.string(),
      points: z.array(z.string()),
      quiz: z.object({ question: z.string(), answer: z.string() }).optional(),
    })
    .optional(),
  disclaimer: z.string(),
});
export type RiskEngineOutput = z.infer<typeof RiskEngineOutputSchema>;

// ── LLM ──────────────────────────────────────────────────────────────────────

/** LLM prompt structure. */
export const LlmPromptSchema = z.object({
  system: z.string(),
  user: z.string(),
});
export type LlmPrompt = z.infer<typeof LlmPromptSchema>;

/** LLM response structure. */
export const LlmResponseSchema = z.object({
  explanation: z.string(),
  verificationSteps: z.array(z.string()),
  nextAction: z.string(),
});
export type LlmResponse = z.infer<typeof LlmResponseSchema>;

/** LLM client interface. */
export interface LlmClient {
  generate(prompt: LlmPrompt): Promise<LlmResponse>;
}

// ── RAG ──────────────────────────────────────────────────────────────────────

/** RAG retrieval request. */
export const RagRetrievalSchema = z.object({
  signals: z.array(RedFlagSignalSchema),
  limit: z.number().optional(),
});
export type RagRetrieval = z.infer<typeof RagRetrievalSchema>;

/** RAG retrieval result. */
export const RagResultSchema = z.object({
  alerts: z.array(z.any()), // TrustedAlert[] from WP4
});
export type RagResult = z.infer<typeof RagResultSchema>;

// ── Risk Pipeline ────────────────────────────────────────────────────────────

/** Risk pipeline input. */
export const RiskPipelineInputSchema = z.object({
  preprocessed: z.any(), // PreprocessedInput from WP2
  ragIndex: z.any().optional(), // AlertsIndex from WP4
});
export type RiskPipelineInput = z.infer<typeof RiskPipelineInputSchema>;

/** Risk pipeline output with audit trace. */
export const RiskPipelineOutputSchema = z.object({
  riskLevel: z.enum(['safe', 'caution', 'high_risk', 'insufficient_data']),
  redFlags: z.array(RedFlagSchema),
  verificationSteps: z.array(z.string()),
  nextAction: z.string(),
  lessonCard: z
    .object({
      title: z.string(),
      points: z.array(z.string()),
      quiz: z.object({ question: z.string(), answer: z.string() }).optional(),
    })
    .optional(),
  disclaimer: z.string(),
  trace: z.object({
    inputHash: z.string(),
    rulesMatched: z.array(MatchedSignalSchema),
    llmPrompt: LlmPromptSchema.optional(),
    llmResponse: LlmResponseSchema.optional(),
    ragRetrieved: z.array(z.any()).optional(),
  }),
});
export type RiskPipelineOutput = z.infer<typeof RiskPipelineOutputSchema>;

// ── Risk Pipeline Interface ──────────────────────────────────────────────────

export interface RiskPipeline {
  run(input: RiskPipelineInput): Promise<RiskPipelineOutput>;
}

// ── Scoring ──────────────────────────────────────────────────────────────────

/** Configurable scoring thresholds. */
export const ScoringThresholdsSchema = z.object({
  highRiskMinHighCount: z.number(),
  highRiskMinTotalWithHigh: z.number(),
});
export type ScoringThresholds = z.infer<typeof ScoringThresholdsSchema>;

export const DEFAULT_THRESHOLDS: ScoringThresholds = {
  highRiskMinHighCount: 2,
  highRiskMinTotalWithHigh: 2,
};

// ── Error ────────────────────────────────────────────────────────────────────

/** Error codes for risk engine failures. */
export const RiskEngineErrorCodeSchema = z.enum([
  'RULES_FAILED',
  'LLM_FAILED',
  'RAG_FAILED',
]);

export class RiskEngineError extends Error {
  constructor(
    public readonly code: z.infer<typeof RiskEngineErrorCodeSchema>,
    message: string,
  ) {
    super(message);
    this.name = 'RiskEngineError';
  }
}
