/**
 * WP4 — Evidence Layer Schema (Versioned)
 *
 * Zod schemas for trusted alerts used in RAG retrieval.
 *
 * @module api/evidence/schema
 * @version 1.0.0
 */

import { z } from 'zod';

// ── Version ──────────────────────────────────────────────────────────────────

/** Contract version — increment on breaking changes. */
export const VERSION = '1.0.0' as const;

// ── Alert Schema ─────────────────────────────────────────────────────────────

/**
 * A trusted alert from an authoritative source.
 * Used by RAG to ground LLM explanations in verified scam patterns.
 */
export const AlertSchema = z.object({
  id: z.string().uuid(),
  source: z.enum(['BoCA', 'VietNamNet', 'FTC', 'IC3', 'WHO', 'MoH']),
  sourceUrl: z.string().url(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  title: z.string().min(1),
  summary: z.string().min(1),
  category: z.enum([
    'authority_impersonation',
    'investment_scam',
    'health',
    'gift_scam',
    'tech_support',
  ]),
  signals: z.array(z.string()).min(1),
  region: z.enum(['VN', 'global']),
});
export type AlertSchema = z.infer<typeof AlertSchema>;

// ── Validated Enums ──────────────────────────────────────────────────────────

/** Allowed alert sources. */
export const VALID_SOURCES = [
  'BoCA',
  'VietNamNet',
  'FTC',
  'IC3',
  'WHO',
  'MoH',
] as const;

/** Allowed scam categories. */
export const VALID_CATEGORIES = [
  'authority_impersonation',
  'investment_scam',
  'health',
  'gift_scam',
  'tech_support',
] as const;

/** Allowed red flag signals (matches WP3). */
export const VALID_SIGNALS = [
  'urgency',
  'upfront_payment',
  'authority_impersonation',
  'suspicious_url',
  'too_good_to_be_true',
  'personal_data_request',
  'social_proof',
] as const;

// ── Validation Helpers ───────────────────────────────────────────────────────

/**
 * Validate a single alert.
 * Returns { ok: true, data } or { ok: false, error }.
 */
export function safeParseAlert(value: unknown):
  | { ok: true; data: AlertSchema }
  | { ok: false; error: z.ZodError } {
  const result = AlertSchema.safeParse(value);
  if (result.success) return { ok: true, data: result.data };
  return { ok: false, error: result.error };
}

/**
 * Validate an array of alerts. Returns list of error strings.
 */
export function validateAlerts(alerts: unknown[]): string[] {
  const errors: string[] = [];
  const seen = new Set<string>();

  for (const a of alerts) {
    const parsed = AlertSchema.safeParse(a);
    if (!parsed.success) {
      errors.push(`Invalid alert: ${parsed.error.message}`);
      continue;
    }

    if (seen.has(parsed.data.id)) {
      errors.push(`Duplicate id: ${parsed.data.id}`);
    }
    seen.add(parsed.data.id);

    if (!parsed.data.title.trim()) errors.push(`"${parsed.data.id}": empty title`);
    if (!parsed.data.summary.trim()) errors.push(`"${parsed.data.id}": empty summary`);
    if (!parsed.data.sourceUrl.trim()) errors.push(`"${parsed.data.id}": empty sourceUrl`);
    if (!parsed.data.signals.length) errors.push(`"${parsed.data.id}": no signals`);
    if (parsed.data.region !== 'VN' && parsed.data.region !== 'global') {
      errors.push(`"${parsed.data.id}": invalid region "${parsed.data.region}"`);
    }
  }

  return errors;
}
