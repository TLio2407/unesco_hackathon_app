import { RiskLevel } from '@/api/contract';
import { Colors } from '@/constants/theme';
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

export function riskMeta(level: RiskLevel, theme: any = Colors.light) {
  const activeTheme = theme || Colors.light;
  switch (level) {
    case 'high_risk':
      return {
        labelKey: 'companion.result.highRisk',
        color: activeTheme.riskHigh,
        background: activeTheme.riskHighBg || '#FEF2F2',
        icon: 'alert-circle' as const,
      };
    case 'caution':
      return {
        labelKey: 'companion.result.caution',
        color: activeTheme.riskCaution,
        background: activeTheme.riskCautionBg || '#FFFBEB',
        icon: 'warning' as const,
      };
    case 'safe':
      return {
        labelKey: 'companion.result.safe',
        color: activeTheme.riskSafe,
        background: activeTheme.riskSafeBg || '#F0FDF4',
        icon: 'shield-checkmark' as const,
      };
    default:
      return {
        labelKey: 'companion.result.insufficientData',
        color: activeTheme.riskInsufficient,
        background: activeTheme.riskInsufficientBg || '#F1F5F9',
        icon: 'help-circle' as const,
      };
  }
}
