import { StyleSheet, View } from 'react-native';

import { ThemedText } from './themed-text';
import { t } from '@/i18n';
import type { RedFlag } from '@/api/contract';
import { Accessibility } from '@/theme/tokens';
import { Spacing } from '@/constants/theme';

import { useTheme } from '@/hooks/use-theme';

export function RedFlagList({ flags }: { flags: RedFlag[] }) {
  const theme = useTheme();
  if (!flags.length) return null;
  return (
    <View style={styles.container}>
      <ThemedText type="subtitle" style={[styles.heading, { color: theme.riskHigh }]}>
        {t('companion.result.redFlags')}
      </ThemedText>
      {flags.map((f, i) => (
        <View key={`${f.signal}-${i}`} style={styles.item}>
          <ThemedText style={[styles.bullet, { color: theme.riskHigh }]}>•</ThemedText>
          <ThemedText style={styles.explanation}>{f.explanation}</ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.two, alignSelf: 'stretch' },
  heading: { fontSize: Accessibility.fontSize.large },
  item: { flexDirection: 'row', gap: Spacing.two, alignItems: 'flex-start' },
  bullet: { fontSize: Accessibility.fontSize.normal, lineHeight: 28 },
  explanation: { flex: 1, fontSize: Accessibility.fontSize.normal, lineHeight: 28 },
});
