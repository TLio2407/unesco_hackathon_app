import type { AnalyzeOutput, RedFlag, RiskLevel } from '@/api/contract';
import { generateLesson } from './lesson';

export interface AssembleOptions {
  verificationSteps?: string[];
  nextAction?: string;
  disclaimer?: string;
}

const DISCLAIMER =
  'AI chỉ hỗ trợ nhận diện dấu hiệu, không thay cô/chú quyết định và không đưa lời khuyên y tế/pháp lý/tài chính.';

const DEFAULT_NEXT_ACTION =
  'Dừng lại 2 phút – Không chuyển tiền ngay – Xác nhận qua kênh độc lập.';

const DEFAULT_VERIFICATION_STEPS = [
  'Dừng lại 2 phút, không chuyển tiền hay cung cấp thông tin ngay.',
  'Mở app/website chính thức của cơ quan hoặc ngân hàng (không qua link trong tin nhắn).',
  'Gọi số hotline trên website chính thức để xác nhận.',
  'Nếu chưa chắc, hỏi con/cháu hoặc người thân tin cậy.',
];

export class OutputAssembler {
  assemble(
    riskLevel: RiskLevel,
    redFlags: RedFlag[],
    verificationSteps: string[] = DEFAULT_VERIFICATION_STEPS,
    nextAction: string = DEFAULT_NEXT_ACTION,
    signals: RedFlag[] = redFlags,
    options?: AssembleOptions,
  ): AnalyzeOutput {
    const risky = riskLevel === 'caution' || riskLevel === 'high_risk';
    return {
      riskLevel,
      redFlags,
      verificationSteps: options?.verificationSteps ?? verificationSteps,
      nextAction: options?.nextAction ?? nextAction,
      lessonCard: risky ? generateLesson(signals) : undefined,
      disclaimer: options?.disclaimer ?? DISCLAIMER,
    };
  }
}
