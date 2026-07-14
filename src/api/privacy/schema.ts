/**
 * WP6 — Privacy Layer Schema (Versioned)
 *
 * Zod schemas for consent, audit, and session management.
 *
 * @module api/privacy/schema
 * @version 1.0.0
 */

import { z } from 'zod';

// ── Version ──────────────────────────────────────────────────────────────────

/** Contract version — increment on breaking changes. */
export const VERSION = '1.0.0' as const;

// ── Audit Entry ──────────────────────────────────────────────────────────────

/**
 * Immutable audit log entry.
 * Tokens are SHA-256 hashed (first 12 hex chars) for privacy.
 */
export const AuditEntrySchema = z.object({
  timestamp: z.number(),
  sessionId: z.string(),
  action: z.string(),
  riskLevel: z.string().optional(),
  redactionCount: z.number().optional(),
  consentToken: z.string().optional(),
  inputHash: z.string().optional(),
});
export type AuditEntry = z.infer<typeof AuditEntrySchema>;

// ── Consent Request ──────────────────────────────────────────────────────────

/** Token-based consent request for data sharing. */
export const ConsentRequestSchema = z.object({
  token: z.string(),
  action: z.enum(['share', 'log', 'analytics']),
  granted: z.boolean(),
  expiresAt: z.number(),
});
export type ConsentRequest = z.infer<typeof ConsentRequestSchema>;

// ── Session ──────────────────────────────────────────────────────────────────

/** Session entry with TTL-based expiration. */
export const SessionEntrySchema = z.object({
  data: z.any(),
  createdAt: z.number(),
});
export type SessionEntry = z.infer<typeof SessionEntrySchema>;
