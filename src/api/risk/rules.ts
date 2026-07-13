/**
 * WP3 — Rule Engine
 *
 * Rule-based red flag detection.  Each rule has:
 * - signal: which red flag it detects
 * - weight: high/medium for scoring
 * - keywords: regex patterns to match
 * - explanation: plain Vietnamese explanation for user
 *
 * Design: pure functions, no external deps, fully unit-testable.
 */

import type { RedFlagSignal, MatchedSignal } from './contract';

// ── Rule definition ────────────────────────────────────────────────────────

interface Rule {
  signal: RedFlagSignal;
  weight: 'high' | 'medium';
  keywords: RegExp[];
  explanation: string;
}

// ── Rules (ported from mock.ts, enhanced) ────────────────────────────────────

const RULES: Rule[] = [
  {
    signal: 'urgency',
    weight: 'high',
    keywords: [
      /10\s*phút/i,
      /ngay\s*lập\s*tức/i,
      /khẩn/i,
      /hết\s*hạn/i,
      /bí\s*mật/i,
      /gấp/i,
      /trong\s+vòng\s+\d+\s*(phút|giờ)/i,
    ],
    explanation: 'Tin nhắn đang ép cô/chú quyết định thật nhanh. Lừa đảo thường dùng áp lực thời gian.',
  },
  {
    signal: 'upfront_payment',
    weight: 'high',
    keywords: [
      /chuyển\s*tiền/i,
      /đặt\s*cọc/i,
      /phí/i,
      /trước\s*khi/i,
      /nạp\s*tiền/i,
      /thanh\s*toán\s*trước/i,
      /đóng\s*phí\s*đăng\s*ký/i,
    ],
    explanation: 'Yêu cầu chuyển tiền trước khi có xác minh là dấu hiệu rủi ro cao.',
  },
  {
    signal: 'authority_impersonation',
    weight: 'high',
    keywords: [
      /công\s*an/i,
      /ngân\s*hàng/i,
      /bộ/i,
      /cơ\s*quan/i,
      /VNeID/i,
      /tòa\s*án/i,
      /chính\s*phủ/i,
      /bảo\s*hiểm\s*xã\s*hội/i,
      /cục\s*thuế/i,
    ],
    explanation: 'Cơ quan chính thức thường không yêu cầu OTP/mật khẩu/chuyển tiền qua tin nhắn lạ.',
  },
  {
    signal: 'suspicious_url',
    weight: 'medium',
    keywords: [
      /bit\.ly/i,
      /tinyurl/i,
      /bấm\s*link/i,
      /đường\s*link\s*lạ/i,
      /link\s*ở\s*trên/i,
      /click\s*here/i,
      /http:\/\/(?!www\.|[a-z]{2,}\.)/i, // http without domain
    ],
    explanation: 'Đường link không giống trang chính thức; hãy mở qua app/website chính thống.',
  },
  {
    signal: 'too_good_to_be_true',
    weight: 'medium',
    keywords: [
      /lợi\s*nhuận/i,
      /%\s*\/\s*tháng/i,
      /quà\s*tặng/i,
      /trúng\s*thưởng/i,
      /ưu\s*đãi\s*đặc\s*biệt/i,
      /lương\s*cao/i,
      /việc\s*nhẹ\s*lương\s*cao/i,
      /tiền\s*lãi\s*cao/i,
      /không\s*cần\s*vốn/i,
    ],
    explanation: 'Lời hứa lợi ích quá hấp dẫn là trigger thường gặp trong scam.',
  },
  {
    signal: 'personal_data_request',
    weight: 'high',
    keywords: [
      /\bOTP\b/i,
      /CCCD/i,
      /mật\s*khẩu/i,
      /tài\s*khoản\s*ngân\s*hàng/i,
      /ảnh\s*mặt/i,
      /số\s*thẻ\s*ngân\s*hàng/i,
      /mã\s*pin/i,
      /thông\s*tin\s*cá\s*nhân/i,
    ],
    explanation: 'Không cung cấp mã OTP/thông tin định danh cho người lạ hoặc link lạ.',
  },
  {
    signal: 'social_proof',
    weight: 'medium',
    keywords: [
      /nhiều\s*người/i,
      /đã\s*nhận/i,
      /testimonial/i,
      /đánh\s*giá\s*tốt/i,
      /hài\s*lòng\s*100%/i,
      /khách\s*hàng\s*thỏa\s*mãn/i,
      /bình\s*luận\s*tích\s*cực/i,
    ],
    explanation: 'Bình luận và ảnh lợi nhuận có thể bị tạo giả hoặc dàn dựng.',
  },
];

// ── Rule engine ─────────────────────────────────────────────────────────────

/**
 * Evaluate text against all rules.
 * Returns matched signals with explanations and weights.
 */
export function evaluateRules(text: string): MatchedSignal[] {
  const hits: MatchedSignal[] = [];
  for (const rule of RULES) {
    if (rule.keywords.some((re) => re.test(text))) {
      hits.push({
        signal: rule.signal,
        explanation: rule.explanation,
        weight: rule.weight,
      });
    }
  }
  return hits;
}

/**
 * Get rule by signal (for testing).
 */
export function getRule(signal: RedFlagSignal): Rule | undefined {
  return RULES.find((r) => r.signal === signal);
}

/**
 * List all signals (for RAG retrieval).
 */
export function listSignals(): RedFlagSignal[] {
  return RULES.map((r) => r.signal);
}
