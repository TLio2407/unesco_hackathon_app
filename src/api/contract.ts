/**
 * WP0 — Core API Contract (Versioned)
 *
 * Central contract shared across all WPs.
 * All public interfaces use Zod schemas for runtime validation.
 *
 * @module api/contract
 * @version 1.0.0
 */

import { z } from 'zod';

// ── Version ──────────────────────────────────────────────────────────────────

/** Contract version — increment on breaking changes. */
export const VERSION = '1.0.0' as const;

// ── Risk Level ───────────────────────────────────────────────────────────────

/** Risk assessment levels from safest to highest concern. */
export const RiskLevelSchema = z.enum([
  'safe',
  'caution',
  'high_risk',
  'insufficient_data',
]);
export type RiskLevel = z.infer<typeof RiskLevelSchema>;

// ── Analysis Input ───────────────────────────────────────────────────────────

/**
 * Union type for all supported input channels.
 * Each variant carries only the fields it needs.
 */
export const AnalysisInputSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('text'), text: z.string(), language: z.string().optional() }),
  z.object({ kind: z.literal('url'), url: z.string().url(), language: z.string().optional() }),
  z.object({ kind: z.literal('image'), ref: z.string(), language: z.string().optional() }),
  z.object({
    kind: z.literal('voice'),
    data: z.string(),
    mimeType: z.string(),
    durationMs: z.number().optional(),
    language: z.string().optional(),
  }),
]);
export type AnalysisInput = z.infer<typeof AnalysisInputSchema>;

// ── Red Flag Signal ──────────────────────────────────────────────────────────

/** Recognized scam indicator signals. */
export const RedFlagSignalSchema = z.enum([
  'urgency',
  'upfront_payment',
  'authority_impersonation',
  'suspicious_url',
  'too_good_to_be_true',
  'personal_data_request',
  'social_proof',
]);
export type RedFlagSignal = z.infer<typeof RedFlagSignalSchema>;

// ── Red Flag ─────────────────────────────────────────────────────────────────

/** A matched red flag with explanation for the user. */
export const RedFlagSchema = z.object({
  signal: RedFlagSignalSchema,
  explanation: z.string(),
});
export type RedFlag = z.infer<typeof RedFlagSchema>;

// ── Lesson Card ──────────────────────────────────────────────────────────────

/** Micro-learning card shown alongside risk results. */
export const LessonCardSchema = z.object({
  title: z.string(),
  points: z.array(z.string()),
  quiz: z
    .object({ question: z.string(), answer: z.string() })
    .optional(),
});
export type LessonCard = z.infer<typeof LessonCardSchema>;

// ── Analyze Output ───────────────────────────────────────────────────────────

/**
 * Final output from the risk analysis pipeline.
 * Validated before reaching the UI layer.
 */
export const AnalyzeOutputSchema = z.object({
  riskLevel: RiskLevelSchema,
  redFlags: z.array(RedFlagSchema),
  verificationSteps: z.array(z.string()),
  nextAction: z.string(),
  lessonCard: LessonCardSchema.optional(),
  disclaimer: z.string().optional(),
});
export type AnalyzeOutput = z.infer<typeof AnalyzeOutputSchema>;

// ── Analyze Client Interface ─────────────────────────────────────────────────

/**
 * Interface for clients that perform risk analysis.
 * Implementations may be local (mock) or remote (API).
 */
export interface AnalyzeClient {
  /**
   * Analyze input for scam indicators.
   * @param input — text, URL, image, or voice input
   * @returns risk assessment output
   */
  analyze(input: AnalysisInput): Promise<AnalyzeOutput>;
}

// ── Validation Helper ────────────────────────────────────────────────────────

/**
 * Validate an arbitrary value against the AnalyzeOutput schema.
 * Returns `{ ok: true, data }` or `{ ok: false, error }`.
 */
export function safeParseAnalyzeOutput(
  value: unknown,
):
  | { ok: true; data: AnalyzeOutput }
  | { ok: false; error: z.ZodError } {
  const result = AnalyzeOutputSchema.safeParse(value);
  if (result.success) return { ok: true, data: result.data };
  return { ok: false, error: result.error };
}
