/**
 * WP1 — Input Layer Schema (Versioned)
 *
 * Zod schemas for all input types: text, URL, image, voice.
 * Runtime validation at the input boundary prevents malformed data
 * from propagating downstream.
 *
 * @module api/input/schema
 * @version 1.0.0
 */

import { z } from 'zod';

// ── Version ──────────────────────────────────────────────────────────────────

/** Contract version — increment on breaking changes. */
export const VERSION = '1.0.0' as const;

// ── Input Kind ───────────────────────────────────────────────────────────────

/** Canonical input channel kinds. */
export const InputKindSchema = z.enum(['text', 'url', 'image', 'voice']);
export type InputKind = z.infer<typeof InputKindSchema>;

// ── Raw Input Variants ───────────────────────────────────────────────────────

/** Raw text input before validation. */
export const RawTextInputSchema = z.object({
  kind: z.literal('text'),
  text: z.string(),
  source: z.string().optional(),
});
export type RawTextInput = z.infer<typeof RawTextInputSchema>;

/** Raw URL input before validation. */
export const RawUrlInputSchema = z.object({
  kind: z.literal('url'),
  url: z.string(),
  source: z.string().optional(),
});
export type RawUrlInput = z.infer<typeof RawUrlInputSchema>;

/** Raw image input before validation. */
export const RawImageInputSchema = z.object({
  kind: z.literal('image'),
  data: z.string(),
  mimeType: z.string(),
  source: z.string().optional(),
});
export type RawImageInput = z.infer<typeof RawImageInputSchema>;

/** Raw voice input before validation. */
export const RawVoiceInputSchema = z.object({
  kind: z.literal('voice'),
  data: z.string(),
  mimeType: z.string(),
  durationMs: z.number().optional(),
  source: z.string().optional(),
});
export type RawVoiceInput = z.infer<typeof RawVoiceInputSchema>;

/** Union of all raw input types. */
export const RawInputSchema = z.discriminatedUnion('kind', [
  RawTextInputSchema,
  RawUrlInputSchema,
  RawImageInputSchema,
  RawVoiceInputSchema,
]);
export type RawInput = z.infer<typeof RawInputSchema>;

// ── Validated Input Bag ──────────────────────────────────────────────────────

/**
 * Normalized input bag produced after validation.
 * Downstream WPs consume InputBag, never RawInput.
 */
export const InputBagSchema = z.object({
  kind: InputKindSchema,
  text: z.string(),
  url: z.string().url().optional(),
  imageRef: z.string().optional(),
  voiceRef: z.string().optional(),
  durationMs: z.number().optional(),
  mimeType: z.string().optional(),
  source: z.string().optional(),
  receivedAt: z.number(),
});
export type InputBag = z.infer<typeof InputBagSchema>;

// ── Validation Error ─────────────────────────────────────────────────────────

/** Error codes for input validation failures. */
export const InputErrorCodeSchema = z.enum([
  'EMPTY_INPUT',
  'TEXT_TOO_LONG',
  'IMAGE_TOO_LARGE',
  'VOICE_TOO_LONG',
  'VOICE_TOO_LARGE',
  'URL_TOO_LONG',
  'UNSUPPORTED_MIME',
  'INVALID_URL',
]);
export type InputErrorCode = z.infer<typeof InputErrorCodeSchema>;

export class InputValidationError extends Error {
  constructor(
    public readonly code: InputErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'InputValidationError';
  }
}

// ── Size Limits ──────────────────────────────────────────────────────────────

/** Configurable input size limits. */
export const InputLimitsSchema = z.object({
  maxTextChars: z.number().positive(),
  maxImageBytes: z.number().positive(),
  maxVoiceDurationMs: z.number().positive(),
  maxVoiceBytes: z.number().positive(),
  maxUrlChars: z.number().positive(),
});
export type InputLimits = z.infer<typeof InputLimitsSchema>;

export const DEFAULT_LIMITS: InputLimits = {
  maxTextChars: 10_000,
  maxImageBytes: 5 * 1024 * 1024,
  maxVoiceDurationMs: 120_000,
  maxVoiceBytes: 3 * 1024 * 1024,
  maxUrlChars: 2_048,
};

// ── Allowed MIME Types ───────────────────────────────────────────────────────

export const ALLOWED_IMAGE_MIMES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
]);

export const ALLOWED_VOICE_MIMES = new Set([
  'audio/webm',
  'audio/mp4',
  'audio/mpeg',
  'audio/ogg; codecs=opus',
  'audio/wav',
]);

// ── Validation Helpers ───────────────────────────────────────────────────────

/**
 * Validate raw input and produce an InputBag.
 * Throws InputValidationError on failure.
 */
export function validateRawInput(raw: unknown): z.infer<typeof RawInputSchema> {
  return RawInputSchema.parse(raw);
}

/**
 * Validate a processed InputBag.
 * Returns { ok: true, data } or { ok: false, error }.
 */
export function safeParseInputBag(value: unknown):
  | { ok: true; data: InputBag }
  | { ok: false; error: z.ZodError } {
  const result = InputBagSchema.safeParse(value);
  if (result.success) return { ok: true, data: result.data };
  return { ok: false, error: result.error };
}
