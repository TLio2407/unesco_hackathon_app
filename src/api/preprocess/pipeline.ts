/**
 * WP2 — Pre-processing Pipeline
 *
 * Composes the normalizer, entity extractor, and PII redactor into
 * a single pipeline that transforms an InputBag into a PreprocessedInput
 * ready for the risk reasoning layer (WP3).
 */

import type { InputBag } from '@/api/input';
import { normalise, type NormalisedText } from './normalizer';
import { extractEntities, type ExtractionResult } from './entities';
import { redactPii, type RedactResult } from './redact';

// ── Pre-processed output ─────────────────────────────────────────────────────

export interface PreprocessedInput {
  /** Original input bag (for audit trace) */
  original: InputBag;
  /** Normalised text (three views) */
  normalised: NormalisedText;
  /** Extracted entities */
  entities: ExtractionResult;
  /** Redacted plain text (PII-free, safe to send to LLM / share) */
  redacted: RedactResult;
}

// ── Pipeline ─────────────────────────────────────────────────────────────────

export interface PreprocessPipeline {
  run(bag: InputBag): PreprocessedInput;
}

export class DefaultPreprocessPipeline implements PreprocessPipeline {
  run(bag: InputBag): PreprocessedInput {
    // For image/voice inputs where text is not yet populated (handled by
    // OCR/STT in a real backend), we normalise whatever text we have.
    const normalised = normalise(bag.text || '');
    const entities = extractEntities(normalised.lower);
    const redacted = redactPii(normalised.cleaned);

    return { original: bag, normalised, entities, redacted };
  }
}
