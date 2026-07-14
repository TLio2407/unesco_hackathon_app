/**
 * WP2 — Preprocessing Layer Schema (Versioned)
 *
 * Zod schemas for normalised text, extracted entities, PII redaction results.
 *
 * @module api/preprocess/schema
 * @version 1.0.0
 */

import { z } from 'zod';

// ── Version ──────────────────────────────────────────────────────────────────

/** Contract version — increment on breaking changes. */
export const VERSION = '1.0.0' as const;

// ── Normalised Text ──────────────────────────────────────────────────────────

/** Three views of normalised text for different use cases. */
export const NormalisedTextSchema = z.object({
  /** Display-safe text (keeps diacritics, clean punctuation) */
  cleaned: z.string(),
  /** ASCII-folded text for search / keyword matching */
  ascii: z.string(),
  /** Lowercased ascii for case-insensitive matching */
  lower: z.string(),
});
export type NormalisedText = z.infer<typeof NormalisedTextSchema>;

// ── Extracted Entity ─────────────────────────────────────────────────────────

/** Discriminated union of all entity kinds extracted from text. */
export const ExtractedEntitySchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('phone'), value: z.string() }),
  z.object({ kind: z.literal('cccd'), value: z.string() }),
  z.object({ kind: z.literal('bank_account'), value: z.string() }),
  z.object({ kind: z.literal('email'), value: z.string() }),
  z.object({
    kind: z.literal('money'),
    value: z.string(),
    amountRaw: z.string(),
    currency: z.enum(['VND', 'USD', 'unknown']),
  }),
  z.object({
    kind: z.literal('web_url'),
    value: z.string(),
    host: z.string().optional(),
  }),
]);
export type ExtractedEntity = z.infer<typeof ExtractedEntitySchema>;

/** Result of entity extraction. */
export const ExtractionResultSchema = z.object({
  entities: z.array(ExtractedEntitySchema),
});
export type ExtractionResult = z.infer<typeof ExtractionResultSchema>;

// ── PII Redaction ────────────────────────────────────────────────────────────

/** Single PII redaction record for audit. */
export const RedactionSchema = z.object({
  kind: z.enum(['phone', 'cccd', 'email', 'bank_account', 'otp']),
  original: z.string(),
  position: z.number(),
});
export type Redaction = z.infer<typeof RedactionSchema>;

/** Result of PII redaction. */
export const RedactResultSchema = z.object({
  text: z.string(),
  redactions: z.array(RedactionSchema),
  count: z.number(),
});
export type RedactResult = z.infer<typeof RedactResultSchema>;

// ── Preprocessed Input ───────────────────────────────────────────────────────

/**
 * Complete preprocessed input ready for risk reasoning (WP3).
 * Composed of InputBag + normalised text + entities + redaction result.
 */
export const PreprocessedInputSchema = z.object({
  original: z.any(), // InputBag — circular ref, validated separately
  normalised: NormalisedTextSchema,
  entities: ExtractionResultSchema,
  redacted: RedactResultSchema,
});
export type PreprocessedInput = z.infer<typeof PreprocessedInputSchema>;

// ── Pipeline Interface ───────────────────────────────────────────────────────

export interface PreprocessPipeline {
  /** Run the full preprocessing pipeline on an input bag. */
  run(bag: z.infer<typeof InputBagSchema>): PreprocessedInput;
}

// ── Import InputBag schema (re-export for convenience) ───────────────────────

import { InputBagSchema } from '@/api/input/schema';
