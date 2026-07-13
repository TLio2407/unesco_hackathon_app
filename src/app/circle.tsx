import { useState } from 'react';
import { Pressable, Share, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { t } from '@/i18n';
import { redact } from '@/lib/redact';
import { Accessibility } from '@/theme/tokens';
import { MaxContentWidth, Spacing } from '@/constants/theme';

// Sample situation shared with a trusted contact. Redacted before display/share
// so phone/CCCD never leaves the device unredacted (privacy-by-design).
const SAMPLE_SUMMARY =
  'Cô nhận tin nhắn lạ, gọi SĐT 0912345678. Người gửi yêu cầu CCCD 012345678901 để xác minh.';

export default function CircleScreen() {
  const [shared, setShared] = useState(false);
  const { text: redactedText } = redact(SAMPLE_SUMMARY);

  async function onShare() {
    await Share.share({ message: redactedText });
    setShared(true);
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ThemedView style={styles.inner}>
          <ThemedText type="title" style={styles.title}>
            {t('circle.title')}
          </ThemedText>
          <ThemedText style={styles.body}>{t('circle.placeholder')}</ThemedText>

          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedText style={styles.redactedText}>{redactedText}</ThemedText>
            <ThemedText style={styles.notice}>{t('circle.redactedNotice')}</ThemedText>
          </ThemedView>

          <Pressable
            style={({ pressed }) => [styles.shareButton, pressed && styles.sharePressed]}
            onPress={onShare}
            accessibilityRole="button"
            accessibilityLabel={t('circle.shareButton')}>
            <ThemedText style={styles.shareLabel}>{t('circle.shareButton')}</ThemedText>
          </Pressable>

          {shared && <ThemedText style={styles.sharedNote}>{t('circle.redactedNotice')}</ThemedText>}
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
  },
  title: { fontSize: Accessibility.fontSize.title },
  body: {
    fontSize: Accessibility.fontSize.normal,
    lineHeight: 28,
    color: Accessibility.colors.calmText,
  },
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  redactedText: {
    fontSize: Accessibility.fontSize.normal,
    lineHeight: 28,
    color: Accessibility.colors.calmText,
  },
  notice: {
    fontSize: Accessibility.fontSize.small,
    fontStyle: 'italic',
    color: Accessibility.colors.calmTextSecondary,
  },
  shareButton: {
    minHeight: Accessibility.minTouchSize,
    minWidth: Accessibility.minTouchSize,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Spacing.four,
    backgroundColor: Accessibility.colors.primaryAction,
    paddingHorizontal: Spacing.four,
  },
  sharePressed: { opacity: 0.85 },
  shareLabel: {
    color: Accessibility.colors.primaryActionText,
    fontSize: Accessibility.fontSize.large,
    fontWeight: '700',
  },
  sharedNote: {
    fontSize: Accessibility.fontSize.small,
    color: Accessibility.colors.riskSafe,
  },
});
