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

// ── Prompt templates ─────────────────────────────────────────────────────────

const SYSTEM_PROMPT_EN = `You are a digital safety assistant for senior citizens. Your task: analyze messages/URLs for scam indicators and report the risk level.

MUST RESPOND IN PLAIN, SIMPLE ENGLISH. NO TECHNICAL JARGON.
Do NOT give medical, legal, or financial advice.
ALWAYS advise verification through official channels.

PROVIDE A CLEAR 3-PART RESPONSE:
Part 1: Short explanation of why the message/link is suspicious.
Part 2: Action steps - write each step on a new line starting with a hyphen (-).
Part 3: Next action - a single summary sentence.

Example structure:
Explanation: [Reason why suspicious in 1-2 simple sentences]
Action steps:
- Pause for 2 minutes, do not send money or OTP immediately.
- Open the official app or website to confirm.
- Call the official customer hotline to verify.
Next action: [1 short action sentence]`;

const SYSTEM_PROMPT_VI = `Bạn là trợ lý an toàn cho người cao tuổi Việt Nam. Nhiệm vụ: phân tích tin nhắn và báo mức độ lừa đảo.

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

function buildTemplateExplanation(signals: MatchedSignal[], lang: string = 'vi'): LlmResponse {
  const isEn = lang === 'en';
  const explanations = signals.map((s) => s.explanation);
  const unique = [...new Set(explanations)];
  const explanation = unique.join(' ') || (isEn ? 'Potential scam indicators detected.' : 'Phát hiện dấu hiệu đáng nghi.');

  const verificationSteps = isEn
    ? [
        'Pause for 2 minutes. Do not send money, OTP, or passwords immediately.',
        'Open the official website or mobile app directly (do not click links in messages).',
        'Call the official customer service hotline to verify.',
        'If unsure, consult a trusted family member or friend.',
      ]
    : [
        'Dừng lại 2 phút, không chuyển tiền hay cung cấp thông tin ngay.',
        'Mở app/website chính thức của cơ quan hoặc ngân hàng (không qua link trong tin nhắn).',
        'Gọi số hotline trên website chính thức để xác nhận.',
        'Nếu chưa chắc, hỏi con/cháu hoặc người thân tin cậy.',
      ];

  const nextAction = isEn
    ? 'Pause – Do not transfer money immediately – Verify via official channels.'
    : 'Dừng lại 2 phút – Không chuyển tiền ngay – Xác nhận qua kênh độc lập.';

  return { explanation, verificationSteps, nextAction };
}

// ── LLM client interface ──────────────────────────────────────────────────────

export interface LlmClient {
  generate(prompt: LlmPrompt): Promise<LlmResponse>;
}

// Mock client for testing
export class MockLlmClient implements LlmClient {
  async generate(prompt: LlmPrompt): Promise<LlmResponse> {
    const signals: MatchedSignal[] = [];
    const match = prompt.user.match(/Dấu hiệu: ([\w,]+)/) || prompt.user.match(/Signals: ([\w,]+)/);
    if (match) {
      const sigs = match[1].split(',').map((s) => s.trim() as any);
      for (const sig of sigs) {
        const rule = getRule(sig);
        if (rule) {
          signals.push({ signal: sig, explanation: rule.explanation, weight: rule.weight });
        }
      }
    }
    const isEn = prompt.system.includes('ENGLISH');
    return buildTemplateExplanation(signals, isEn ? 'en' : 'vi');
  }
}

// ── LLM client registry ──────────────────────────────────────────────────────

let _llmClient: LlmClient | undefined;

async function loadLlmClient(): Promise<LlmClient> {
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
  _ragContext?: any[],
  lang: string = 'vi',
): Promise<LlmResponse> {
  const isEn = lang === 'en';
  if (signals.length === 0) {
    return {
      explanation: isEn ? 'No suspicious scam indicators detected.' : 'Không phát hiện dấu hiệu đáng nghi.',
      verificationSteps: [],
      nextAction: isEn ? 'Message appears safe.' : 'Tin nhắn an toàn.',
    };
  }

  const signalList = signals.map((s) => s.signal).join(', ');
  const userPrompt = isEn
    ? `Language: English\nSignals: ${signalList}\n\nMessage content: ${text}`
    : `Dấu hiệu: ${signalList}\n\nNội dung tin nhắn: ${text}`;

  const prompt: LlmPrompt = {
    system: isEn ? SYSTEM_PROMPT_EN : SYSTEM_PROMPT_VI,
    user: userPrompt,
  };

  try {
    const client = await loadLlmClient();
    return await client.generate(prompt);
  } catch {
    return buildTemplateExplanation(signals, lang);
  }
}

// Re-export for tests
import { getRule } from './rules';
