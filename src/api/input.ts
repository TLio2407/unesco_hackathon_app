/**
 * @module api/input — InputBag staging contract
 *
 * Minimal type stub used by WP2 (preprocessing) and other layers that need
 * the InputBag shape before the full WP1 input module is merged.
 * Once WP1 lands in main, this file is replaced by the real src/api/input/index.ts.
 */
export interface InputBag {
  kind: 'text' | 'url' | 'image' | 'voice';
  text: string;
  url?: string;
  imageRef?: string;
  voiceRef?: string;
  mimeType?: string;
  source?: string;
  receivedAt: number;
}
