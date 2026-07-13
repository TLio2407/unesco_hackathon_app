/**
 * WP1 — Input Layer: Unified types for all input channels.
 *
 * Every input kind normalizes to an `InputBag` that downstream
 * layers consume without caring about the original channel.
 */

import type { AnalysisInput } from '@/api/contract';

// ── Input kinds ──────────────────────────────────────────────────────────────

export type InputKind = AnalysisInput['kind'];

// ── Raw input (before validation) ────────────────────────────────────────────

export interface RawTextInput {
  kind: 'text';
  text: string;
  source?: string; // e.g. "paste", "type", "zalo-forward"
}

export interface RawUrlInput {
  kind: 'url';
  url: string;
  source?: string;
}

export interface RawImageInput {
  kind: 'image';
  /** Base64 data-URL or blob ref (string key for in-memory storage) */
  data: string;
  mimeType: string;
  source?: string;
}

export interface RawVoiceInput {
  kind: 'voice';
  /** Base64 data-URL or blob ref */
  data: string;
  mimeType: string;
  durationMs?: number;
  source?: string;
}

export type RawInput = RawTextInput | RawUrlInput | RawImageInput | RawVoiceInput;

// ── Validated + normalized input bag ─────────────────────────────────────────

export interface InputBag {
  /** Canonical kind after routing */
  kind: InputKind;
  /** Normalized text (for text/url/voice) or OCR placeholder (for image) */
  text: string;
  /** URL if kind=url (normalized) */
  url?: string;
  /** Image ref for downstream OCR (WP2) */
  imageRef?: string;
  /** Voice ref for downstream STT (WP2) */
  voiceRef?: string;
  /** Duration in ms if voice */
  durationMs?: number;
  /** MIME type if media */
  mimeType?: string;
  /** Original source annotation (for audit) */
  source?: string;
  /** Timestamp of input receipt (epoch ms) */
  receivedAt: number;
}

// ── Validation errors ────────────────────────────────────────────────────────

export type InputErrorCode =
  | 'EMPTY_INPUT'
  | 'TEXT_TOO_LONG'
  | 'IMAGE_TOO_LARGE'
  | 'VOICE_TOO_LONG'
  | 'VOICE_TOO_LARGE'
  | 'URL_TOO_LONG'
  | 'UNSUPPORTED_MIME'
  | 'INVALID_URL';

export class InputValidationError extends Error {
  constructor(
    public readonly code: InputErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'InputValidationError';
  }
}

// ── Size limits (env-configurable) ───────────────────────────────────────────

export interface InputLimits {
  /** Max text length in characters */
  maxTextChars: number;
  /** Max image size in bytes */
  maxImageBytes: number;
  /** Max voice duration in ms */
  maxVoiceDurationMs: number;
  /** Max voice file size in bytes */
  maxVoiceBytes: number;
  /** Max URL length in characters */
  maxUrlChars: number;
}

export const DEFAULT_LIMITS: InputLimits = {
  maxTextChars: 10_000,
  maxImageBytes: 5 * 1024 * 1024, // 5 MB
  maxVoiceDurationMs: 120_000, // 2 minutes
  maxVoiceBytes: 3 * 1024 * 1024, // 3 MB
  maxUrlChars: 2_048,
};

/** Allowed image MIME types */
export const ALLOWED_IMAGE_MIMES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
]);

/** Allowed voice MIME types */
export const ALLOWED_VOICE_MIMES = new Set([
  'audio/webm',
  'audio/mp4',
  'audio/mpeg',
  'audio/ogg; codecs=opus',
  'audio/wav',
]);

// ── Cleanup helpers ──────────────────────────────────────────────────────────

/** Strip null bytes, trim, collapse whitespace runs */
export function sanitizeText(input: string): string {
  return input
    .replace(/\0/g, '')
    .trim()
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n');
}

/** Normalize URL: trim, add https:// if it looks like a domain, lowercase host. */
export function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  // Don't prepend scheme to strings that have spaces or are clearly not domains
  const looksLikeDomain = /^[a-zA-Z0-9][a-zA-Z0-9.-]*\.[a-zA-Z]{2,}/.test(trimmed);
  const u = looksLikeDomain && !/^https?:\/\//i.test(trimmed) ? 'https://' + trimmed : trimmed;
  try {
    const parsed = new URL(u);
    parsed.hostname = parsed.hostname.toLowerCase();
    return parsed.toString();
  } catch {
    return trimmed;
  }
}

/** Quick MIME type check without full parsing */
export function isAllowedMime(mimeType: string, allowed: Set<string>): boolean {
  const base = mimeType.split(';')[0].trim().toLowerCase();
  return allowed.has(base);
}
