/**
 * WP5 — Output Layer Schema (Versioned)
 *
 * Zod schemas for final output assembly, lesson cards, trusted circle summaries.
 *
 * @module api/output/schema
 * @version 1.0.0
 */

import { z } from 'zod';

// ── Version ──────────────────────────────────────────────────────────────────

/** Contract version — increment on breaking changes. */
export const VERSION = '1.0.0' as const;

// ── Lesson Card ──────────────────────────────────────────────────────────────

/** Micro-learning card with quiz option. */
export const LessonCardSchema = z.object({
  title: z.string(),
  points: z.array(z.string()),
  quiz: z
    .object({ question: z.string(), answer: z.string() })
    .optional(),
});
export type LessonCard = z.infer<typeof LessonCardSchema>;

// ── Trusted Circle Summary ───────────────────────────────────────────────────

/**
 * PII-redacted summary for sharing with trusted contacts.
 * Contains both plain text and markdown formats.
 */
export const TrustedCircleSummarySchema = z.object({
  plainText: z.string(),
  markdown: z.string(),
  shareUrl: z.string().url().optional(),
  redactionCount: z.number(),
});
export type TrustedCircleSummary = z.infer<typeof TrustedCircleSummarySchema>;

// ── Output Assembler Options ─────────────────────────────────────────────────

export const AssembleOptionsSchema = z.object({
  verificationSteps: z.array(z.string()).optional(),
  nextAction: z.string().optional(),
  disclaimer: z.string().optional(),
});
export type AssembleOptions = z.infer<typeof AssembleOptionsSchema>;

// ── Validation ───────────────────────────────────────────────────────────────

/**
 * Validate an output object against the AnalyzeOutput schema.
 * Returns { ok: true, data } or { ok: false, error }.
 */
export function safeParseOutput(value: unknown):
  | { ok: true; data: Record<string, unknown> }
  | { ok: false; error: z.ZodError } {
  const result = LessonCardSchema.safeParse(value);
  if (result.success) return { ok: true, data: result.data };
  return { ok: false, error: result.error };
}
