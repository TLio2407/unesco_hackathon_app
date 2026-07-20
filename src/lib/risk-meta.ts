import { RiskLevel } from '@/api/contract';
import { Accessibility } from '@/theme/tokens';

/**
 * Metadata for risk levels used in Alerts and Analysis results.
 */
export const RiskLevels = {
  high_risk: {
    labelKey: 'companion.result.highRisk',
    color: Accessibility.colors.riskHigh,
    background: Accessibility.colors.errorBackground,
    icon: 'alert-circle',
  },
  caution: {
    labelKey: 'companion.result.caution',
    color: Accessibility.colors.riskCaution,
    background: Accessibility.colors.warningBackground,
    icon: 'warning',
  },
  safe: {
    labelKey: 'companion.result.safe',
    color: Accessibility.colors.riskSafe,
    background: Accessibility.colors.successBackground,
    icon: 'shield-checkmark',
  },
  insufficient_data: {
    labelKey: 'companion.result.insufficientData',
    color: Accessibility.colors.riskInsufficient,
    background: '#EEE',
    icon: 'help-circle',
  }
} as const;

export type RiskLevelKey = keyof typeof RiskLevels;

export function riskMeta(level: RiskLevel) {
  return RiskLevels[level] ?? RiskLevels.insufficient_data;
}
