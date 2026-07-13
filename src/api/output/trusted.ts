import type { RedFlag, RiskLevel } from '@/api/contract';
import { redact } from '@/lib/redact';

export interface TrustedCircleSummary {
  plainText: string;
  markdown: string;
  shareUrl?: string;
  redactionCount: number;
}

export function formatTrustedCircle(
  original: { text: string },
  riskLevel: RiskLevel,
  redFlags: RedFlag[],
): TrustedCircleSummary {
  const { text, redactions } = redact(original.text);
  const flagLines = redFlags.map((f) => `- ${f.explanation}`).join('\n');
  const plainText =
    `[KẾT QUẢ KIỂM TRA - ${riskLevel.toUpperCase()}]\n\n` +
    `${text}\n\n` +
    `Dấu hiệu:\n${flagLines}`;
  const markdown =
    `## Kết quả kiểm tra\n\n**Mức độ:** \`${riskLevel}\`\n\n` +
    `> ${text}\n\n` +
    `### Dấu hiệu phát hiện\n\n${flagLines}`;
  return { plainText, markdown, redactionCount: redactions };
}
