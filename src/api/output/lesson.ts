import type { LessonCard, RedFlag, RedFlagSignal } from '@/api/contract';

type MatchedSignal = RedFlag;

const LESSON_TEMPLATES: Record<RedFlagSignal, string> = {
  urgency: 'Áp lực thời gian và yêu cầu giữ bí mật là chiêu thức phổ biến.',
  authority_impersonation: 'Cơ quan nhà nước không hỏi OTP/mật khẩu qua tin nhắn.',
  too_good_to_be_true: 'Lợi nhuận quá cao hoặc quà tặng bất thường thường là bẫy.',
  upfront_payment: 'Không chuyển tiền trước khi xác minh qua kênh chính thức.',
  personal_data_request: 'Không cung cấp thông tin cá nhân cho người lạ hoặc link lạ.',
  suspicious_url: 'Không bấm link lạ; mở app/website chính thức thay thế.',
  social_proof: 'Bình luận và ảnh lợi nhuận có thể bị tạo giả.',
};

export function generateLesson(signals: MatchedSignal[]): LessonCard | undefined {
  if (signals.length === 0) return undefined;
  const points = signals
    .slice(0, 3)
    .map((s) => LESSON_TEMPLATES[s.signal])
    .filter(Boolean);
  if (points.length === 0) return undefined;
  return {
    title: '3 dấu hiệu cần nhớ',
    points,
    quiz: {
      question: 'Khi nhận tin yêu cầu chuyển tiền gấp kèm link lạ, cô/chú nên làm gì?',
      answer: 'Dừng lại, xác minh qua kênh chính thức, không bấm link.',
    },
  };
}
