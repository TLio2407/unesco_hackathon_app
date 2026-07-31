/**
 * WP3 — Risk Pipeline
 *
 * Orchestrates the rule engine, LLM explainer, and RAG retrieval.
 * Transforms a PreprocessedInput into an AnalyzeOutput.
 */

import type {
  RiskPipelineInput,
  RiskPipelineOutput,
  MatchedSignal,
} from './contract';

export type { RiskPipelineInput, RiskPipelineOutput };

import { evaluateRules } from './rules';
import { scoreRisk } from './scorer';
import { generateExplanation } from './llm';
import { retrieveRag } from './rag';

// ── Pipeline ─────────────────────────────────────────────────────────────────

export interface RiskPipeline {
  run(input: RiskPipelineInput): Promise<RiskPipelineOutput>;
}

// ── Implementation ───────────────────────────────────────────────────────────

export class DefaultRiskPipeline implements RiskPipeline {
  async run(input: RiskPipelineInput): Promise<RiskPipelineOutput> {
    // Rule engine uses cleaned text (keeps diacritics for VN keyword matching)
    const text = input.preprocessed.normalised.cleaned;
    // LLM receives REDACTED text only — zero PII to external services
    const redactedText = input.preprocessed.redacted.text;

    // 1. Rule engine
    const signals = evaluateRules(text);

    // 2. RAG retrieval (if index available)
    const ragRetrieval = retrieveRag(
      { signals: signals.map((s) => s.signal) },
      input.ragIndex,
    );

    // 3. LLM explanation (uses REDACTED text — zero PII leaves the device)
    const lang = (input as any).language || 'en';
    const llmResponse = await generateExplanation(signals, redactedText, ragRetrieval.alerts, lang);

    // 4. Risk scoring
    const riskLevel = scoreRisk(signals);

    // 5. Build output
    const output: RiskPipelineOutput = {
      riskLevel,
      redFlags: signals.map((s) => ({ signal: s.signal, explanation: s.explanation })),
      verificationSteps: llmResponse.verificationSteps,
      nextAction: llmResponse.nextAction,
      lessonCard: this.buildLessonCard(signals, riskLevel),
      disclaimer:
        'AI chỉ hỗ trợ nhận diện dấu hiệu, không thay cô/chú quyết định và không đưa lời khuyên y tế/pháp lý/tài chính.',
      trace: {
        inputHash: this.hashInput(redactedText),
        rulesMatched: signals,
        llmPrompt: { system: 'REDACTED', user: 'REDACTED' }, // privacy
        llmResponse,
        ragRetrieved: ragRetrieval.alerts,
      },
    };

    return output;
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private buildLessonCard(signals: MatchedSignal[], riskLevel: string): any | undefined {
    // Only generate lesson for caution/high_risk
    if (riskLevel === 'safe' || riskLevel === 'insufficient_data') {
      return undefined;
    }

    const points: string[] = [];
    const seen = new Set<string>();

    for (const sig of signals) {
      const key = sig.signal;
      if (seen.has(key)) continue;
      seen.add(key);

      switch (sig.signal) {
        case 'urgency':
          points.push('Áp lực thời gian và yêu cầu giữ bí mật là chiêu thức phổ biến.');
          break;
        case 'authority_impersonation':
          points.push('Cơ quan nhà nước không hỏi OTP/mật khẩu qua tin nhắn.');
          break;
        case 'too_good_to_be_true':
          points.push('Lợi nhuận quá cao hoặc quà tặng bất thường thường là bẫy.');
          break;
        case 'upfront_payment':
          points.push('Không chuyển tiền trước khi xác minh qua kênh chính thức.');
          break;
        case 'personal_data_request':
          points.push('Không cung cấp thông tin cá nhân cho người lạ hoặc link lạ.');
          break;
        case 'suspicious_url':
          points.push('Không bấm link lạ; mở app/website chính thức thay thế.');
          break;
        case 'social_proof':
          points.push('Bình luận và ảnh lợi nhuận có thể bị tạo giả.');
          break;
      }
    }

    return {
      title: '3 dấu hiệu cần nhớ',
      points: points.slice(0, 3), // max 3
      quiz: {
        question: 'Khi nhận tin yêu cầu chuyển tiền gấp kèm link lạ, cô/chú nên làm gì?',
        answer: 'Dừng lại, xác minh qua kênh chính thức, không bấm link.',
      },
    };
  }

  private hashInput(text: string): string {
    // Simple hash for audit (not crypto)
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return `hash_${Math.abs(hash).toString(16)}`;
  }
}
