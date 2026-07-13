/**
 * WP1 — Input Layer
 *
 * Unified input ingestion for the Decision Companion.
 *
 * ┌─────────────┐     ┌──────────────┐     ┌─────────┐
 * │   RawInput   │────▶│ InputProcessor │────▶│ InputBag │──▶ WP2
 * └─────────────┘     └──────────────┘     └─────────┘
 *
 * @module api/input
 */

export { DefaultInputProcessor } from './processor';
export type { InputProcessor, ProcessResult } from './processor';

export {
  sanitizeText,
  normalizeUrl,
  isAllowedMime,
  InputValidationError,
  DEFAULT_LIMITS,
  ALLOWED_IMAGE_MIMES,
  ALLOWED_VOICE_MIMES,
} from './types';

export type {
  InputKind,
  RawInput,
  RawTextInput,
  RawUrlInput,
  RawImageInput,
  RawVoiceInput,
  InputBag,
  InputErrorCode,
  InputLimits,
} from './types';
