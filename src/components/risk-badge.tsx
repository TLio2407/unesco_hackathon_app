import { StyleSheet, View } from 'react-native';

import { ThemedText } from './themed-text';
import { t } from '@/i18n';
import { riskMeta } from '@/lib/risk-meta';
import type { RiskLevel } from '@/api/contract';
import { Accessibility } from '@/theme/tokens';
import { Spacing } from '@/constants/theme';

import { useTheme } from '@/hooks/use-theme';

export function RiskBadge({ level }: { level: RiskLevel }) {
  const theme = useTheme();
  const meta = riskMeta(level, theme);
  return (
    <View style={[styles.badge, { backgroundColor: meta.background, borderColor: meta.color }]}>
      <View style={[styles.dot, { backgroundColor: meta.color }]} />
      <ThemedText style={[styles.label, { color: meta.color }]}>{t(meta.labelKey)}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    alignSelf: 'flex-start',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.four,
    borderWidth: 2,
    minHeight: Accessibility.minTouchSize,
  },
  dot: { width: 16, height: 16, borderRadius: 8 },
  label: { fontSize: Accessibility.fontSize.large, fontWeight: '700' },
});
