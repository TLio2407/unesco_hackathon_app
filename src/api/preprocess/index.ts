/**
 * WP2 — Pre-processing Layer
 *
 * ┌──────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
 * │ InputBag │────▶│  Normaliser  │────▶│   Entities   │────▶│     Redact       │──▶ WP3
 * └──────────┘     └──────────────┘     └──────────────┘     └──────────────────┘
 *
 * @module api/preprocess
 */

export { normalise, foldDiacritics, collapseWhitespace, stripInvisible } from './normalizer';
export type { NormalisedText } from './normalizer';

export { extractEntities, extractPhones, extractCccd, extractEmails, extractMoney, extractUrls } from './entities';
export type {
  ExtractedEntity,
  VnPhone,
  VnCccd,
  VnBankAccount,
  EmailAddress,
  VnMoney,
  WebUrl,
  ExtractionResult,
} from './entities';

export { redactPii } from './redact';
export type { PiiKind, Redaction, RedactResult } from './redact';

export { DefaultPreprocessPipeline } from './pipeline';
export type { PreprocessPipeline, PreprocessedInput } from './pipeline';
