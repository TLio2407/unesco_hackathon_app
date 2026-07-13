import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { t } from '@/i18n';
import { Accessibility } from '@/theme/tokens';
import { MaxContentWidth, Spacing } from '@/constants/theme';

export default function LearningScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ThemedView style={styles.inner}>
          <ThemedText type="title" style={styles.title}>
            {t('learning.title')}
          </ThemedText>
          <ThemedText style={styles.body}>{t('learning.placeholder')}</ThemedText>
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  inner: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    gap: Spacing.three,
    justifyContent: 'center',
  },
  title: { fontSize: Accessibility.fontSize.title },
  body: {
    fontSize: Accessibility.fontSize.normal,
    lineHeight: 28,
    color: Accessibility.colors.calmText,
  },
});
