import type {
  AnalyzeClient,
  AnalysisInput,
  AnalyzeOutput,
  RedFlag,
  RedFlagSignal,
} from './contract';

interface Rule {
  signal: RedFlagSignal;
  weight: 'high' | 'medium';
  keywords: RegExp[];
  explanation: string;
}

const RULES: Rule[] = [
  {
    signal: 'urgency',
    weight: 'high',
    keywords: [/10\s*phút/i, /ngay\s*lập\s*tức/i, /khẩn/i, /hết\s*hạn/i, /bí\s*mật/i, /\bgấp\b/i],
    explanation: 'Tin nhắn đang ép cô/chú quyết định thật nhanh. Lừa đảo thường dùng áp lực thời gian.',
  },
  {
    signal: 'upfront_payment',
    weight: 'high',
    keywords: [/chuyển\s*tiền/i, /đặt\s*cọc/i, /\bphí\b/i, /trước\s*khi/i, /nạp\s*tiền/i],
    explanation: 'Yêu cầu chuyển tiền trước khi có xác minh là dấu hiệu rủi ro cao.',
  },
  {
    signal: 'authority_impersonation',
    weight: 'high',
    keywords: [/công\s*an/i, /ngân\s*hàng/i, /\bbộ\b/i, /cơ\s*quan/i, /VNeID/i, /tòa\s*án/i, /chính\s*phủ/i],
    explanation: 'Cơ quan chính thức thường không yêu cầu OTP/mật khẩu/chuyển tiền qua tin nhắn lạ.',
  },
  {
    signal: 'suspicious_url',
    weight: 'medium',
    keywords: [/bit\.ly/i, /tinyurl/i, /bấm\s*link/i, /đường\s*link\s*lạ/i, /link\s*ở\s*trên/i],
    explanation: 'Đường link không giống trang chính thức; hãy mở qua app/website chính thống.',
  },
  {
    signal: 'too_good_to_be_true',
    weight: 'medium',
    keywords: [/lợi\s*nhuận/i, /%\s*\/\s*tháng/i, /quà\s*tặng/i, /trúng\s*thưởng/i, /ưu\s*đãi\s*đặc\s*biệt/i, /lương\s*cao/i],
    explanation: 'Lời hứa lợi ích quá hấp dẫn là trigger thường gặp trong scam.',
  },
  {
    signal: 'personal_data_request',
    weight: 'high',
    keywords: [/\bOTP\b/i, /CCCD/i, /mật\s*khẩu/i, /tài\s*khoản\s*ngân\s*hàng/i, /ảnh\s*mặt/i],
    explanation: 'Không cung cấp mã OTP/thông tin định danh cho người lạ hoặc link lạ.',
  },
  {
    signal: 'social_proof',
    weight: 'medium',
    keywords: [/nhiều\s*người/i, /đã\s*nhận/i, /testimonial/i, /đánh\s*giá\s*tốt/i],
    explanation: 'Bình luận và ảnh lợi nhuận có thể bị tạo giả hoặc dàn dựng.',
  },
];

const VERIFICATION_STEPS = [
  'Dừng lại 2 phút, không chuyển tiền hay cung cấp thông tin ngay.',
  'Mở app/website chính thức của cơ quan hoặc ngân hàng (không qua link trong tin nhắn).',
  'Gọi số hotline trên website chính thức để xác nhận.',
  'Nếu chưa chắc, hỏi con/cháu hoặc người thân tin cậy.',
];

const NEXT_ACTION = 'Dừng lại 2 phút – Không chuyển tiền ngay – Xác nhận qua kênh độc lập.';

const DISCLAIMER =
  'AI chỉ hỗ trợ nhận diện dấu hiệu, không thay cô/chú quyết định và không đưa lời khuyên y tế/pháp lý/tài chính.';

function lessonCard(): AnalyzeOutput['lessonCard'] {
  return {
    title: '3 dấu hiệu cần nhớ',
    points: [
      'Áp lực thời gian và yêu cầu giữ bí mật là chiêu thức phổ biến.',
      'Cơ quan nhà nước không hỏi OTP/mật khẩu qua tin nhắn.',
      'Lợi nhuận quá cao hoặc quà tặng bất thường thường là bẫy.',
    ],
    quiz: {
      question: 'Khi nhận tin yêu cầu chuyển tiền gấp kèm link lạ, cô/chú nên làm gì?',
      answer: 'Dừng lại, xác minh qua kênh chính thức, không bấm link.',
    },
  };
}

function analyzeText(text: string): AnalyzeOutput {
  const hits: RedFlag[] = [];
  for (const rule of RULES) {
    if (rule.keywords.some((re) => re.test(text))) {
      hits.push({ signal: rule.signal, explanation: rule.explanation });
    }
  }
  const highCount = hits.filter(
    (h) => RULES.find((r) => r.signal === h.signal)?.weight === 'high'
  ).length;
  const riskLevel: AnalyzeOutput['riskLevel'] =
    highCount >= 2 ? 'high_risk' : hits.length > 0 ? 'caution' : 'safe';

  const risky = riskLevel === 'high_risk' || riskLevel === 'caution';

  return {
    riskLevel,
    redFlags: hits,
    verificationSteps: VERIFICATION_STEPS,
    nextAction: NEXT_ACTION,
    lessonCard: risky ? lessonCard() : undefined,
    disclaimer: DISCLAIMER,
  };
}

export const mockAnalyze: AnalyzeClient['analyze'] = async (
  input: AnalysisInput
): Promise<AnalyzeOutput> => {
  if (input.kind === 'text') return analyzeText(input.text);
  if (input.kind === 'url') {
    const suspicious = /bit\.ly|tinyurl|http/i.test(input.url);
    return analyzeText(
      suspicious ? `bấm link ${input.url} ngay để nhận quà tặng` : 'trang web chính thức'
    );
  }
  // image: OCR is backend; mock cannot read pixels
  return {
    riskLevel: 'insufficient_data',
    redFlags: [],
    verificationSteps: ['Hãy mô tả nội dung ảnh hoặc paste văn bản để AI hỗ trợ kiểm chứng.'],
    nextAction: 'Nếu chưa chắc, hỏi người thân trước khi làm theo nội dung ảnh.',
    disclaimer: 'Ảnh cần được trích xuất văn bản (OCR) ở phía máy chủ trước khi phân tích.',
  };
};
