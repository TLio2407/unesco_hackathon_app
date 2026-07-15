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
 * The text is normalized (diacritics folded to ASCII) before matching.
 */

import type { RedFlagSignal, MatchedSignal } from './contract';

// ── Rule definition ────────────────────────────────────────────────────────

export interface Rule {
  signal: RedFlagSignal;
  weight: 'high' | 'medium';
  keywords: RegExp[];
  explanation: string;
}

// ── ASCII-fold helper (same as normalizer.foldDiacritics) ────────────────────

function foldDiacritics(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

// ── Rules (patterns for ASCII-folded text) ──────────────────────────────────

const RULES: Rule[] = [
  {
    signal: 'urgency',
    weight: 'high',
    keywords: [
      /10\s*phut/i,
      /ngay\s*lap\s*tuc/i,
      /khan/i,
      /het\s*han/i,
      /bi\s*mat/i,
      /gap/i,
      /trong\s+vong\s+\d+\s*(phut|gio)/i,
    ],
    explanation: 'Tin nhắn đang ép cô/chú quyết định thật nhanh. Lừa đảo thường dùng áp lực thời gian.',
  },
  {
    signal: 'upfront_payment',
    weight: 'high',
    keywords: [
      /chuyen\s*tien/i,
      /dat\s*coc/i,
      /phi/i,
      /truoc\s*khi/i,
      /nap\s*tien/i,
      /thanh\s*toan\s*truoc/i,
      /dong\s*phi\s*dang\s*ky/i,
    ],
    explanation: 'Yêu cầu chuyển tiền trước khi có xác minh là dấu hiệu rủi ro cao.',
  },
  {
    signal: 'authority_impersonation',
    weight: 'high',
    keywords: [
      /cong\s*an/i,
      /ngan\s*hang/i,
      /bo/i,
      /co\s*quan/i,
      /vneid/i,
      /toa\s*an/i,
      /chinh\s*phu/i,
      /bao\s*hiem\s*xa\s*hoi/i,
      /cuc\s*thue/i,
    ],
    explanation: 'Cơ quan chính thức thường không yêu cầu OTP/mật khẩu/chuyển tiền qua tin nhắn lạ.',
  },
  {
    signal: 'suspicious_url',
    weight: 'medium',
    keywords: [
      /bit\.ly/i,
      /tinyurl/i,
      /bam\s*link/i,
      /duong\s*link\s*la/i,
      /link\s*o\s*tren/i,
      /click\s*here/i,
      /http:\/\/(?!www\.|[a-z]{2,}\.)/i,
    ],
    explanation: 'Đường link không giống trang chính thức; hãy mở qua app/website chính thống.',
  },
  {
    signal: 'too_good_to_be_true',
    weight: 'medium',
    keywords: [
      /loi\s*nhuan/i,
      /%\s*\/\s*thang/i,
      /qua\s*tang/i,
      /trung\s*thuong/i,
      /uu\s*dai\s*dac\s*biet/i,
      /luong\s*cao/i,
      /viec\s*nhe\s*luong\s*cao/i,
      /tien\s*lai\s*cao/i,
      /khong\s*can\s*von/i,
    ],
    explanation: 'Lời hứa lợi ích quá hấp dẫn là trigger thường gặp trong scam.',
  },
  {
    signal: 'personal_data_request',
    weight: 'high',
    keywords: [
      /\botp\b/i,
      /cccd/i,
      /mat\s*khaus?/i,
      /tai\s*khoan\s*ngan\s*hang/i,
      /anh\s*mat/i,
      /so\s*the\s*ngan\s*hang/i,
      /ma\s*pin/i,
      /thong\s*tin\s*ca\s*nhan/i,
    ],
    explanation: 'Không cung cấp mã OTP/thông tin định danh cho người lạ hoặc link lạ.',
  },
  {
    signal: 'social_proof',
    weight: 'medium',
    keywords: [
      /nhieu\s*nguoi/i,
      /da\s*nhan/i,
      /testimonial/i,
      /danh\s*gia\s*tot/i,
      /hai\s*long\s*100%/i,
      /khach\s*hang\s*thoa\s*man/i,
      /binh\s*luan\s*tich\s*cuc/i,
    ],
    explanation: 'Bình luận và ảnh lợi nhuận có thể bị tạo giả hoặc dàn dựng.',
  },
];

// ── Rule engine ─────────────────────────────────────────────────────────────

/**
 * Evaluate text against all rules.
 * Text is auto-normalized (diacritics folded) before matching.
 * Returns matched signals with explanations and weights.
 */
export function evaluateRules(text: string): MatchedSignal[] {
  // Normalize text before matching (diacritics folded to ASCII)
  const normalized = foldDiacritics(text).toLowerCase();
  const hits: MatchedSignal[] = [];
  for (const rule of RULES) {
    if (rule.keywords.some((re) => re.test(normalized))) {
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
