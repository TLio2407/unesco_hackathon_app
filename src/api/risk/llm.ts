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

const SYSTEM_PROMPT = `Bạn là trợ lý AI hỗ trợ người cao tuổi Việt Nam nhận diện rủi ro trong tin nhắn.

Hướng dẫn:
- Giải thích bằng tiếng Việt đơn giản, không dùng thuật ngữ kỹ thuật.
- Không đưa lời khuyên y tế, pháp lý, tài chính.
- Luôn khuyến nghị người dùng xác minh qua kênh chính thức.
- Giữ tone bình tĩnh, không gây hoảng loạn.

Cấu trúc trả lời:
1. Giải thích ngắn gọn vì sao tin nhắn đáng nghi (dựa trên các dấu hiệu được cung cấp).
2. Đề xuất 3-5 bước hành động cụ thể (ví dụ: "Dừng lại 2 phút", "Mở app chính thức", "Gọi hotline", "Hỏi người thân").
3. Tóm tắt hành động tiếp theo trong 1 câu ngắn.

Ví dụ:
Dấu hiệu: urgency, upfront_payment
Giải thích: Tin nhắn đang ép bạn quyết định nhanh và yêu cầu chuyển tiền trước. Đây là chiêu thức phổ biến của lừa đảo.
Bước hành động:
- Dừng lại 2 phút, không chuyển tiền ngay.
- Mở app ngân hàng chính thức (không qua link trong tin nhắn).
- Gọi số hotline trên website chính thức để xác nhận.
- Nếu chưa chắc, hỏi con/cháu hoặc người thân tin cậy.
Hành động tiếp theo: Dừng lại 2 phút – Không chuyển tiền ngay – Xác nhận qua kênh độc lập.`;

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
  try {
    // In browser/Cloudflare Workers, use global fetch
    if (typeof fetch === 'function') {
      // Use Cloudflare Workers AI or OpenAI-compatible
      return new CloudflareLlmClient();
    }
    // In Node.js, use OpenAI SDK
    // openai not a dependency in this project; use mock only
    return new MockLlmClient();
  } catch {
    return new MockLlmClient();
  }
}

// Cloudflare Workers AI client
class CloudflareLlmClient implements LlmClient {
  async generate(prompt: LlmPrompt): Promise<LlmResponse> {
    // In a real implementation, call Cloudflare Workers AI
    // For now, use mock
    return new MockLlmClient().generate(prompt);
  }
}

// OpenAI SDK client
class OpenaiLlmClient implements LlmClient {
  constructor(private readonly openai: any) {}
  async generate(prompt: LlmPrompt): Promise<LlmResponse> {
    // In a real implementation, call OpenAI API
    // For now, use mock
    return new MockLlmClient().generate(prompt);
  }
}

// ── Explanation generator ────────────────────────────────────────────────────

/**
 * Generate explanation using LLM or fallback to template.
 */
export async function generateExplanation(
  signals: MatchedSignal[],
  text: string,
  ragContext?: any[], // TrustedAlert[] from WP4
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
  } catch (e) {
    // Fallback to template
    return buildTemplateExplanation(signals);
  }
}

// Re-export for tests
import { getRule } from './rules';
