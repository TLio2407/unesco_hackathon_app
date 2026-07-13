import { StyleSheet, View } from 'react-native';

import { ThemedText } from './themed-text';
import { t } from '@/i18n';
import type { LessonCard } from '@/api/contract';
import { Accessibility } from '@/theme/tokens';
import { Spacing } from '@/constants/theme';

export function LessonCard({ card }: { card: LessonCard }) {
  return (
    <View style={styles.card}>
      <ThemedText type="subtitle" style={styles.title}>
        {t('companion.result.lesson')}: {card.title}
      </ThemedText>
      {card.points.map((p, i) => (
        <View key={i} style={styles.item}>
          <ThemedText style={styles.bullet}>✓</ThemedText>
          <ThemedText style={styles.point}>{p}</ThemedText>
        </View>
      ))}
      {card.quiz && (
        <ThemedText style={styles.quiz}>
          {card.quiz.question} — {card.quiz.answer}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.two,
    alignSelf: 'stretch',
    padding: Spacing.four,
    borderRadius: Spacing.four,
    backgroundColor: Accessibility.colors.surfaceElevated,
    borderLeftWidth: 4,
    borderLeftColor: Accessibility.colors.primaryAction,
  },
  title: { fontSize: Accessibility.fontSize.large },
  item: { flexDirection: 'row', gap: Spacing.two, alignItems: 'flex-start' },
  bullet: { fontSize: Accessibility.fontSize.normal, color: Accessibility.colors.riskSafe, lineHeight: 28 },
  point: { flex: 1, fontSize: Accessibility.fontSize.normal, lineHeight: 28 },
  quiz: {
    fontSize: Accessibility.fontSize.small,
    fontStyle: 'italic',
    color: Accessibility.colors.calmTextSecondary,
    lineHeight: 24,
  },
});
