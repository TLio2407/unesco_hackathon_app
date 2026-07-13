/**
 * @module api/preprocess — PreprocessInput staging contract
 *
 * Minimal type stub for the preprocess layer consumed by WP3 (risk reasoning).
 * Once WP2 lands in main, this file is replaced by src/api/preprocess/index.ts
 * from feat/wp2-preprocess.
 */
export interface PreprocessedInput {
  original: any;
  normalised: { cleaned: string; ascii: string; lower: string };
  entities: any;
  redacted: { text: string; redactions: any[]; count: number };
}
