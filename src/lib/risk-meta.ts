import type { RiskLevel } from '@/api/contract';

export interface RiskMeta {
  level: RiskLevel;
  labelKey: string;
  color: string;
  background: string;
}

// Colors mirror src/theme/tokens.ts Accessibility.colors (kept inline so this
// pure module stays node-safe and unit-testable without React Native).
const META: Record<RiskLevel, RiskMeta> = {
  safe: { level: 'safe', labelKey: 'companion.result.safe', color: '#1B7B3A', background: '#F0FFF4' },
  caution: { level: 'caution', labelKey: 'companion.result.caution', color: '#B8860B', background: '#FFF8E1' },
  high_risk: { level: 'high_risk', labelKey: 'companion.result.highRisk', color: '#B22222', background: '#FFF0F0' },
  insufficient_data: {
    level: 'insufficient_data',
    labelKey: 'companion.result.insufficientData',
    color: '#5A5A5A',
    background: '#F8F9FA',
  },
};

/** Map a risk level to its label key + colors. Unknown levels fall back to insufficient_data. */
export function riskMeta(level: RiskLevel): RiskMeta {
  return META[level] ?? META.insufficient_data;
}
