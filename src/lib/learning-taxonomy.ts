/**
 * Structured Study & Micro-Learning Taxonomy Module
 */

export type ModuleCategory = 'banking' | 'impersonation' | 'ecommerce' | 'privacy';

export interface TaxonomyModule {
  id: ModuleCategory;
  title: string;
  description: string;
  icon: string; // Ionicons name
  color: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface MicroLesson {
  id: number;
  moduleId: ModuleCategory;
  title: string;
  summary: string;
  points: string[];
  quiz: QuizQuestion;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  requiredModule?: ModuleCategory;
  minCompletedLessons?: number;
}

export interface DigitalCertificate {
  certificateId: string;
  userName: string;
  issuedAt: number;
  scorePercent: number;
  totalCompleted: number;
  verifiedBy: string;
}

export const TAXONOMY_MODULES: TaxonomyModule[] = [
  {
    id: 'banking',
    title: 'An toàn Ngân hàng',
    description: 'Bảo vệ tài khoản ngân hàng, mã OTP và giao dịch tài chính',
    icon: 'card-outline',
    color: '#1D4ED8',
  },
  {
    id: 'impersonation',
    title: 'Nhận diện Giả mạo',
    description: 'Phát hiện cuộc gọi, tin nhắn giả danh Công an, Ngân hàng, Người thân',
    icon: 'shield-checkmark-outline',
    color: '#B91C1C',
  },
  {
    id: 'ecommerce',
    title: 'Mua sắm & Việc làm',
    description: 'Cảnh giác bẫy tuyển CTV chốt đơn, trúng thưởng và hàng giả',
    icon: 'basket-outline',
    color: '#B45309',
  },
  {
    id: 'privacy',
    title: 'Bảo vệ Dữ liệu Cá nhân',
    description: 'Giữ an toàn CCCD, mật khẩu và quyền riêng tư thiết bị',
    icon: 'lock-closed-outline',
    color: '#15803D',
  },
];

export const STRUCTURED_LESSONS: MicroLesson[] = [
  {
    id: 1,
    moduleId: 'banking',
    title: 'Bảo vệ Mã OTP Ngân hàng',
    summary: 'Mã OTP là chìa khóa 1 lần để rút tiền. Không bao giờ cung cấp OTP cho bất cứ ai.',
    points: [
      'Ngân hàng thật KHÔNG BAO GIỜ yêu cầu cô/chú đọc mã OTP qua điện thoại.',
      'Không nhập mã OTP vào các đường link nhận qua SMS/Zalo.',
      'Nếu lỡ đọc OTP cho người lạ, hãy gọi ngay hotline ngân hàng để khóa thẻ khẩn cấp.',
    ],
    quiz: {
      question: 'Khi có người gọi tự xưng là nhân viên ngân hàng yêu cầu đọc mã OTP để hủy giao dịch treo, cô/chú nên làm gì?',
      options: ['Đọc ngay mã OTP', 'Tuyệt đối không đọc OTP và cúp máy', 'Gửi OTP qua tin nhắn SMS'],
      correctIndex: 1,
      explanation: 'Mã OTP là mật khẩu bảo mật tối quan trọng. Ngân hàng không bao giờ hỏi OTP của khách hàng.',
    },
  },
  {
    id: 2,
    moduleId: 'banking',
    title: 'Nhận biết Mã QR Chuyển tiền Giả mạo',
    summary: 'Cảnh giác với mã QR dán đè tại cửa hàng hoặc gửi qua mạng.',
    points: [
      'Kiểm tra kỹ tên người nhận hiển thị trên màn hình trước khi nhấn xác nhận chuyển tiền.',
      'Không quét các mã QR lạ hứa hẹn tặng quà hoặc hoàn tiền.',
      'Quan sát xem tem dán mã QR tại quầy thanh toán có dấu hiệu bị dán đè hay không.',
    ],
    quiz: {
      question: 'Trước khi bấm "Chuyển tiền" sau khi quét mã QR, cô/chú cần làm bước nào quan trọng nhất?',
      options: ['Nhập số tiền thật nhanh', 'Đối chiếu đúng tên người nhận trên màn hình', 'Gửi ảnh mã QR cho người lạ'],
      correctIndex: 1,
      explanation: 'Luôn kiểm tra đúng tên tài khoản người nhận trên màn hình app ngân hàng trước khi xác nhận.',
    },
  },
  {
    id: 3,
    moduleId: 'impersonation',
    title: 'Nhận diện Cuộc gọi Giả danh Công an',
    summary: 'Công an và cơ quan pháp luật làm việc trực tiếp tại trụ sở, không gọi điện đe dọa đòi nộp phạt.',
    points: [
      'Cơ quan công an không làm việc qua điện thoại hay yêu cầu chuyển tiền vào tài khoản "tạm giữ".',
      'Nếu nhận cuộc gọi đe dọa nợ tiền phạt nguội hoặc liên quan án ma túy, hãy giữ bình tĩnh cúp máy.',
      'Đến công an phường/xã gần nhất để nhờ trợ giúp xác minh.',
    ],
    quiz: {
      question: 'Số lạ gọi điện dọa cô/chú đang nợ tiền phạt vi phạm giao thông 5 triệu và bắt chuyển khoản ngay, cô/chú nên làm gì?',
      options: ['Chuyển tiền nộp phạt ngay', 'Tắt máy ngay và không chuyển tiền', 'Cung cấp số CCCD cho họ'],
      correctIndex: 1,
      explanation: 'Công an không làm việc nộp phạt qua cuộc gọi điện thoại hay tài khoản cá nhân.',
    },
  },
  {
    id: 4,
    moduleId: 'impersonation',
    title: 'Cảnh giác Lừa đảo Deepfake Giả giọng Người thân',
    summary: 'Kẻ xấu có thể tạo video và giọng nói giống hệt con cháu để hỏi vay tiền gấp.',
    points: [
      'Gọi điện thoại thông thường hoặc liên hệ qua kênh khác để xác nhận lại với người thân.',
      'Hỏi một câu hỏi riêng tư chỉ có người thân thật mới biết.',
      'Không chuyển tiền ngay khi chỉ nghe giọng nói hoặc thấy video ngắn bị mờ/giật.',
    ],
    quiz: {
      question: 'Thấy video chat người thân gọi hỏi vay tiền gấp nhưng hình ảnh bị giật mờ và giọng nói đứt quãng, cô/chú làm gì?',
      options: ['Chuyển tiền ngay', 'Gọi lại vào số điện thoại thường của người thân để hỏi trực tiếp', 'Mượn tiền hàng xóm để gửi'],
      correctIndex: 1,
      explanation: 'Hãy gọi lại trực tiếp qua số di động của người thân để tránh bẫy công nghệ Deepfake.',
    },
  },
  {
    id: 5,
    moduleId: 'ecommerce',
    title: 'Cảnh giác Bẫy Tuyển CTV Chốt đơn Lương cao',
    summary: 'Tuyệt đối không nạp tiền trước để làm nhiệm vụ hưởng hoa hồng mua hàng.',
    points: [
      'Các lời mời làm việc nhẹ nhàng nhận hàng triệu đồng mỗi ngày đều là bẫy lừa đảo.',
      'Kẻ lừa đảo thường cho rút tiền thưởng nhỏ lần đầu để lấy lòng tin, sau đó ép nạp số tiền lớn rồi chặn liên lạc.',
      'Không chuyển tiền đặt cọc nhận việc làm online.',
    ],
    quiz: {
      question: 'Quảng cáo tuyển người chốt đơn online nạp 500k nhận 700k hoa hồng ngay, đây là hình thức gì?',
      options: ['Công việc uy tín', 'Bẫy lừa đảo chốt đơn nạp tiền', 'Khuyến mãi mua sắm'],
      correctIndex: 1,
      explanation: 'Yêu cầu nạp tiền trước để làm nhiệm vụ hưởng hoa hồng là chiêu thức lừa đảo phổ biến.',
    },
  },
  {
    id: 6,
    moduleId: 'privacy',
    title: 'Bảo vệ Thông tin Căn cước và VNeID',
    summary: 'Không chụp ảnh CCCD đăng lên mạng xã hội hoặc gửi cho các đường link lạ.',
    points: [
      'Hình ảnh CCCD có thể bị kẻ xấu dùng để đăng ký vay tín dụng đen hoặc mở tài khoản ma.',
      'Chỉ cài đặt ứng dụng VNeID từ CH Play (Android) hoặc App Store (iPhone).',
      'Không bấm vào các file ứng dụng lạ có đuôi .APK gửi qua SMS hay Zalo.',
    ],
    quiz: {
      question: 'Nhận được tin nhắn SMS gửi đường link yêu cầu tải file .APK để cập nhật VNeID mức 2, cô/chú nên làm gì?',
      options: ['Bấm link tải ngay', 'Xóa tin nhắn, không bấm link lạ', 'Gửi link cho bạn bè cùng tải'],
      correctIndex: 1,
      explanation: 'Không tải file .APK từ đường link SMS. VNeID chỉ được cập nhật chính thức qua cửa hàng ứng dụng.',
    },
  },
];

export function getLessonsByModule(moduleId: ModuleCategory | 'all'): MicroLesson[] {
  if (moduleId === 'all') return STRUCTURED_LESSONS;
  return STRUCTURED_LESSONS.filter((item) => item.moduleId === moduleId);
}

export function calculateProgress(completedIds: number[]): {
  total: number;
  completed: number;
  percent: number;
  moduleProgress: Record<ModuleCategory, { completed: number; total: number; percent: number }>;
} {
  const total = STRUCTURED_LESSONS.length;
  const completedSet = new Set(completedIds);
  const completed = STRUCTURED_LESSONS.filter((l) => completedSet.has(l.id)).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const moduleProgress: Record<ModuleCategory, { completed: number; total: number; percent: number }> = {
    banking: { completed: 0, total: 0, percent: 0 },
    impersonation: { completed: 0, total: 0, percent: 0 },
    ecommerce: { completed: 0, total: 0, percent: 0 },
    privacy: { completed: 0, total: 0, percent: 0 },
  };

  for (const mod of TAXONOMY_MODULES) {
    const modLessons = STRUCTURED_LESSONS.filter((l) => l.moduleId === mod.id);
    const modCompleted = modLessons.filter((l) => completedSet.has(l.id)).length;
    const modTotal = modLessons.length;
    moduleProgress[mod.id] = {
      completed: modCompleted,
      total: modTotal,
      percent: modTotal > 0 ? Math.round((modCompleted / modTotal) * 100) : 0,
    };
  }

  return { total, completed, percent, moduleProgress };
}

export function evaluateBadges(completedIds: number[]): Badge[] {
  const { completed, percent, moduleProgress } = calculateProgress(completedIds);

  return [
    {
      id: 'rookie',
      name: 'Tập sự Cảnh giác',
      description: 'Hoàn thành bài học an toàn số đầu tiên',
      icon: 'star',
      unlocked: completed >= 1,
      minCompletedLessons: 1,
    },
    {
      id: 'bank-guardian',
      name: 'Vệ sĩ Ngân hàng',
      description: 'Hoàn thành 100% module An toàn Ngân hàng',
      icon: 'shield-checkmark',
      unlocked: moduleProgress.banking.percent === 100,
      requiredModule: 'banking',
    },
    {
      id: 'anti-fraud',
      name: 'Chuyên gia Giả mạo',
      description: 'Hoàn thành 100% module Nhận diện Giả mạo',
      icon: 'eye',
      unlocked: moduleProgress.impersonation.percent === 100,
      requiredModule: 'impersonation',
    },
    {
      id: 'data-protector',
      name: 'Hiệp sĩ Dữ liệu',
      description: 'Hoàn thành 100% module Bảo vệ Dữ liệu Cá nhân',
      icon: 'lock-closed',
      unlocked: moduleProgress.privacy.percent === 100,
      requiredModule: 'privacy',
    },
    {
      id: 'grandmaster',
      name: 'Bậc thầy An tâm Số',
      description: 'Tốt nghiệp tất cả bài học và đạt 100% tiến độ',
      icon: 'trophy',
      unlocked: percent === 100,
    },
  ];
}

export function generateCertificate(
  userName: string,
  completedIds: number[]
): DigitalCertificate {
  const { completed, percent } = calculateProgress(completedIds);
  const stamp = Date.now();
  const certId = `UNESCO-MIL-${stamp.toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;

  return {
    certificateId: certId,
    userName: userName || 'Học viên An tâm Số',
    issuedAt: stamp,
    scorePercent: percent,
    totalCompleted: completed,
    verifiedBy: 'UNESCO MIL Digital Inclusion & Safety Program',
  };
}
