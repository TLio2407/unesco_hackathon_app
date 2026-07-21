/**
 * WP3 — LLM Explainer
 *
 * Generates plain Vietnamese explanations using LLM.
 * Falls back to template-based explanations if LLM unavailable.
 *
 * Design: mockable interface, pure prompt building.
 */

import type { MatchedSignal, LlmPrompt, LlmResponse } from './contract';
export type { LlmPrompt, LlmResponse };

// ── Prompt templates ─────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `Bạn là trợ lý an toàn cho người cao tuổi Việt Nam. Nhiệm vụ: phân tích tin nhắn và báo mức độ lừa đảo.

PHẢI TRẢ VỀ TIẾNG VIỆT, ĐƠN GIẢN, KHÔNG THUẬT NGỮ KỸ THUẬT.
KHÔNG đưa lời khuyên y tế/pháp lý/tài chính.
LUÔN khuyên xác minh qua kênh chính thức.

TRẢ LỜI THEO 3 PHẦN RÕ RÀNG:
Phần 1: Giải thích ngắn gọn tại sao đáng nghi.
Phần 2: Bước hành động - viết mỗi bước trên 1 dòng bắt đầu bằng dấu gạch ngang (-).
Phần 3: Hành động tiếp theo - 1 câu duy nhất tóm tắt.

Ví dụ cấu trúc:
Giải thích: [lý do đáng nghi trong 1-2 câu]
Bước hành động:
- Dừng lại 2 phút, không chuyển tiền ngay.
- Mở app/website chính thức để xác nhận.
- Gọi hotline chính thức để kiểm tra.
Hành động tiếp theo: [1 câu ngắn]`;

// ── Template fallback (if LLM unavailable) ────────────────────────────────────

function buildTemplateExplanation(signals: MatchedSignal[]): LlmResponse {
  const explanations = signals.map((s) => s.explanation);
  const unique = [...new Set(explanations)];

  const explanation = unique.join(' ');

  const verificationSteps = [
    'Dừng lại 2 phút, không chuyển tiền hay cung cấp thông tin ngay.',
    'Mở app/website chính thức của cơ quan hoặc ngân hàng (không qua link trong tin nhắn).',
    'Gọi số hotline trên website chính thức để xác nhận.',
    'Nếu chưa chắc, hỏi con/cháu hoặc người thân tin cậy.',
  ];

  const nextAction = 'Dừng lại 2 phút – Không chuyển tiền ngay – Xác nhận qua kênh độc lập.';

  return { explanation, verificationSteps, nextAction };
}

// ── LLM client interface ──────────────────────────────────────────────────────

export interface LlmClient {
  generate(prompt: LlmPrompt): Promise<LlmResponse>;
}

// Mock client for testing
export class MockLlmClient implements LlmClient {
  async generate(prompt: LlmPrompt): Promise<LlmResponse> {
    // Extract signals from prompt (simple regex)
    const signals: MatchedSignal[] = [];
    const match = prompt.user.match(/Dấu hiệu: ([\w,]+)/);
    if (match) {
      const sigs = match[1].split(',').map((s) => s.trim() as any);
      for (const sig of sigs) {
        const rule = getRule(sig);
        if (rule) {
          signals.push({ signal: sig, explanation: rule.explanation, weight: rule.weight });
        }
      }
    }
    return buildTemplateExplanation(signals);
  }
}

// ── LLM client registry ──────────────────────────────────────────────────────

let _llmClient: LlmClient | undefined;

async function loadLlmClient(): Promise<LlmClient> {
  // Try real Google AI Studio client first
  try {
    const { getGoogleAiClient } = await import('../llm-client');
    const client = getGoogleAiClient();
    if (client.isConfigured) {
      return client;
    }
  } catch {
    // llm-client not available (e.g. in tests), fall through
  }
  return new MockLlmClient();
}

// ── Explanation generator ────────────────────────────────────────────────────

/**
 * Generate explanation using LLM or fallback to template.
 */
export async function generateExplanation(
  signals: MatchedSignal[],
  text: string,
  _ragContext?: any[], // TrustedAlert[] from WP4
): Promise<LlmResponse> {
  if (signals.length === 0) {
    return {
      explanation: 'Không phát hiện dấu hiệu đáng nghi.',
      verificationSteps: [],
      nextAction: 'Tin nhắn an toàn.',
    };
  }

  const signalList = signals.map((s) => s.signal).join(', ');

  const userPrompt = `Dấu hiệu: ${signalList}\n\nNội dung tin nhắn: ${text}`;

  const prompt: LlmPrompt = { system: SYSTEM_PROMPT, user: userPrompt };

  try {
    const client = await loadLlmClient();
    return await client.generate(prompt);
  } catch {
    // Fallback to template when LLM unavailable or fails
    return buildTemplateExplanation(signals);
  }
}

// Re-export for tests
import { getRule } from './rules';
