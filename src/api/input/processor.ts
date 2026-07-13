/**
 * WP1 — InputProcessor
 *
 * Validates and normalizes raw input into an `InputBag`.
 * All channels (text, url, image, voice) flow through here
 * before reaching the pre-processing layer.
 *
 * Design: pure functions, no I/O, no side effects.
 * File/blob handling is the caller's responsibility.
 */

import type {
  RawInput,
  InputBag,
  InputLimits,
} from './types';

import {
  DEFAULT_LIMITS,
  InputValidationError,
  ALLOWED_IMAGE_MIMES,
  ALLOWED_VOICE_MIMES,
  sanitizeText,
  normalizeUrl,
  isAllowedMime,
} from './types';

// ── Processor interface ──────────────────────────────────────────────────────

export interface ProcessResult {
  bag: InputBag;
}

export interface InputProcessor {
  process(raw: RawInput): ProcessResult;
}

// ── Implementation ───────────────────────────────────────────────────────────

export class DefaultInputProcessor implements InputProcessor {
  constructor(private readonly limits: InputLimits = DEFAULT_LIMITS) {}

  process(raw: RawInput): ProcessResult {
    const receivedAt = Date.now();

    switch (raw.kind) {
      case 'text':
        return this.processText(raw, receivedAt);
      case 'url':
        return this.processUrl(raw, receivedAt);
      case 'image':
        return this.processImage(raw, receivedAt);
      case 'voice':
        return this.processVoice(raw, receivedAt);
      default: {
        const _exhaustive: never = raw;
        throw new InputValidationError(
          'EMPTY_INPUT',
          `Unsupported input kind: ${(raw as RawInput).kind}`,
        );
      }
    }
  }

  // ── Per-kind processors ───────────────────────────────────────────────────

  private processText(raw: RawInput & { kind: 'text' }, ts: number): ProcessResult {
    if (!raw.text || raw.text.trim().length === 0) {
      throw new InputValidationError('EMPTY_INPUT', 'Text input is empty');
    }
    if (raw.text.length > this.limits.maxTextChars) {
      throw new InputValidationError(
        'TEXT_TOO_LONG',
        `Text exceeds ${this.limits.maxTextChars} characters`,
      );
    }

    return {
      bag: {
        kind: 'text',
        text: sanitizeText(raw.text),
        source: raw.source,
        receivedAt: ts,
      },
    };
  }

  private processUrl(raw: RawInput & { kind: 'url' }, ts: number): ProcessResult {
    if (!raw.url || raw.url.trim().length === 0) {
      throw new InputValidationError('EMPTY_INPUT', 'URL input is empty');
    }
    if (raw.url.length > this.limits.maxUrlChars) {
      throw new InputValidationError(
        'URL_TOO_LONG',
        `URL exceeds ${this.limits.maxUrlChars} characters`,
      );
    }

    const normalized = normalizeUrl(raw.url);

    // Validate URL structure
    try {
      new URL(normalized);
    } catch {
      throw new InputValidationError('INVALID_URL', `Cannot parse URL: ${raw.url}`);
    }

    return {
      bag: {
        kind: 'url',
        text: normalized, // text of url = the URL itself (WP2 will fetch)
        url: normalized,
        source: raw.source,
        receivedAt: ts,
      },
    };
  }

  private processImage(raw: RawInput & { kind: 'image' }, ts: number): ProcessResult {
    if (!raw.data || raw.data.length === 0) {
      throw new InputValidationError('EMPTY_INPUT', 'Image input is empty');
    }
    if (!isAllowedMime(raw.mimeType, ALLOWED_IMAGE_MIMES)) {
      throw new InputValidationError(
        'UNSUPPORTED_MIME',
        `Unsupported image type: ${raw.mimeType}`,
      );
    }
    if (raw.data.length > this.limits.maxImageBytes) {
      throw new InputValidationError(
        'IMAGE_TOO_LARGE',
        `Image exceeds ${this.limits.maxImageBytes} bytes`,
      );
    }

    // Generate a deterministic ref from data (hash-free, simple)
    const imageRef = `img_${ts}_${raw.data.length}`;

    return {
      bag: {
        kind: 'image',
        text: '', // WP2 OCR will populate
        imageRef,
        mimeType: raw.mimeType,
        source: raw.source,
        receivedAt: ts,
      },
    };
  }

  private processVoice(raw: RawInput & { kind: 'voice' }, ts: number): ProcessResult {
    if (!raw.data || raw.data.length === 0) {
      throw new InputValidationError('EMPTY_INPUT', 'Voice input is empty');
    }
    if (!isAllowedMime(raw.mimeType, ALLOWED_VOICE_MIMES)) {
      throw new InputValidationError(
        'UNSUPPORTED_MIME',
        `Unsupported voice type: ${raw.mimeType}`,
      );
    }
    if (raw.durationMs && raw.durationMs > this.limits.maxVoiceDurationMs) {
      throw new InputValidationError(
        'VOICE_TOO_LONG',
        `Voice exceeds ${this.limits.maxVoiceDurationMs}ms`,
      );
    }
    if (raw.data.length > this.limits.maxVoiceBytes) {
      throw new InputValidationError(
        'VOICE_TOO_LARGE',
        `Voice exceeds ${this.limits.maxVoiceBytes} bytes`,
      );
    }

    const voiceRef = `voice_${ts}_${raw.data.length}`;

    return {
      bag: {
        kind: 'voice',
        text: '', // WP2 STT will populate
        voiceRef,
        mimeType: raw.mimeType,
        durationMs: raw.durationMs,
        source: raw.source,
        receivedAt: ts,
      },
    };
  }
}
