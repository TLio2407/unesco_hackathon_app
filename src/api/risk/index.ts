/**
 * WP3 — Risk Reasoning Layer
 *
 * Core intelligence: rules + LLM explanation + RAG.
 *
 * ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
 * │ Preprocessed  │────▶│  Rule Engine  │────▶│   LLM       │────▶│ AnalyzeOutput │
 * │ Input (WP2)    │     │  (rules.ts)   │     │ (llm.ts)    │     │ (contract.ts) │
 * └──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
 *                                      │                              ▲
 *                                      ▼                              │
 *                                ┌──────────────┐              │
 *                                │   RAG       │──────────────┘
 *                                │ (rag.ts)    │
 *                                └──────────────┘
 *                                      ▲
 *                                      │
 *                                ┌──────────────┐
 *                                │ Evidence     │
 *                                │ Layer (WP4)  │
 *                                └──────────────┘
 *
 * @module api/risk
 */

export { evaluateRules, getRule, listSignals } from './rules';
export type { Rule } from './rules';

export { scoreRisk, isRisky, DEFAULT_THRESHOLDS } from './scorer';
export type { ScoringThresholds } from './scorer';

export { generateExplanation, MockLlmClient } from './llm';
export type { LlmClient, LlmPrompt, LlmResponse } from './llm';

export { retrieveRag, buildRagContext } from './rag';
export type { AlertsIndex, RagRetrieval, RagResult } from './rag';

export { DefaultRiskPipeline } from './pipeline';
export type { RiskPipeline, RiskPipelineInput, RiskPipelineOutput } from './pipeline';

export type {
  RedFlagSignal,
  MatchedSignal,
  LessonCard,
  TrustedAlert,
  RiskEngineInput,
  RiskEngineOutput,
  RiskEngineError,
} from './contract';
