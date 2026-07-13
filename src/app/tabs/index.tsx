import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LessonCard } from '@/components/lesson-card';
import { RedFlagList } from '@/components/red-flag-list';
import { RiskBadge } from '@/components/risk-badge';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { createAnalyzeClient } from '@/api/client';
import type { AnalyzeOutput, AnalysisInput } from '@/api/contract';
import { redact } from '@/lib/redact';
import { t } from '@/i18n';
import { Accessibility } from '@/theme/tokens';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

const client = createAnalyzeClient();
type Mode = 'text' | 'url';

export default function CompanionScreen() {
  const [mode, setMode] = useState<Mode>('text');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    const raw = value.trim();
    if (!raw || loading) return;
    setLoading(true);
    setError(null);
    const input: AnalysisInput =
      mode === 'url' ? { kind: 'url', url: raw } : { kind: 'text', text: redact(raw).text };
    try {
      setResult(await client.analyze(input));
    } catch {
      setError(t('common.error'));
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          style={styles.scroll}>
          <ThemedText type="subtitle" style={styles.title}>
            {t('companion.title')}
          </ThemedText>

          <View style={styles.modeRow}>
            <ModeButton active={mode === 'text'} label={t('companion.sourceText')} onPress={() => setMode('text')} />
            <ModeButton active={mode === 'url'} label={t('companion.sourceUrl')} onPress={() => setMode('url')} />
          </View>

          <TextInput
            style={styles.input}
            value={value}
            onChangeText={setValue}
            placeholder={t('companion.inputPlaceholder')}
            placeholderTextColor="#9A9A9A"
            multiline
            textAlignVertical="top"
            autoCapitalize="none"
            keyboardType={mode === 'url' ? 'url' : 'default'}
          />

          <Pressable
            style={({ pressed }) => [styles.submit, pressed && styles.submitPressed]}
            onPress={onSubmit}
            disabled={loading || !value.trim()}>
            <ThemedText style={styles.submitText}>
              {loading ? t('common.loading') : t('companion.submit')}
            </ThemedText>
          </Pressable>

          {loading && <ActivityIndicator style={styles.loader} size="large" color={Accessibility.colors.primaryAction} />}
          {error && (
            <ThemedText style={[styles.body, { color: Accessibility.colors.riskHigh }]}>{error}</ThemedText>
          )}

          {result && <ResultCard result={result} />}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function ModeButton({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.modeBtn,
        active && styles.modeBtnActive,
        pressed && styles.modeBtnPressed,
      ]}
      onPress={onPress}>
      <ThemedText style={[styles.modeLabel, active && { color: Accessibility.colors.primaryActionText }]}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

function ResultCard({ result }: { result: AnalyzeOutput }) {
  return (
    <View style={styles.result}>
      <RiskBadge level={result.riskLevel} />
      <RedFlagList flags={result.redFlags} />

      {result.verificationSteps.length > 0 && (
        <Section titleKey="companion.result.verificationSteps" items={result.verificationSteps} />
      )}

      {result.nextAction && (
        <View style={styles.block}>
          <ThemedText type="subtitle" style={styles.blockTitle}>
            {t('companion.result.nextAction')}
          </ThemedText>
          <ThemedText style={styles.body}>{result.nextAction}</ThemedText>
        </View>
      )}

      {result.lessonCard && <LessonCard card={result.lessonCard} />}

      {result.disclaimer && (
        <ThemedText style={styles.disclaimer}>{result.disclaimer}</ThemedText>
      )}
    </View>
  );
}

function Section({ titleKey, items }: { titleKey: string; items: string[] }) {
  return (
    <View style={styles.block}>
      <ThemedText type="subtitle" style={styles.blockTitle}>
        {t(titleKey)}
      </ThemedText>
      {items.map((s, i) => (
        <View key={i} style={styles.item}>
          <ThemedText style={styles.bullet}>•</ThemedText>
          <ThemedText style={styles.body}>{s}</ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    gap: Spacing.three,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
    paddingBottom: BottomTabInset + Spacing.five,
  },
  title: { fontSize: Accessibility.fontSize.title },
  modeRow: { flexDirection: 'row', gap: Spacing.two },
  modeBtn: {
    flex: 1,
    minHeight: Accessibility.minTouchSize,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Spacing.four,
    borderWidth: 2,
    borderColor: Accessibility.colors.primaryAction,
    backgroundColor: Accessibility.colors.surfaceCard,
  },
  modeBtnActive: { backgroundColor: Accessibility.colors.primaryAction },
  modeBtnPressed: { opacity: 0.8 },
  modeLabel: { fontSize: Accessibility.fontSize.normal, fontWeight: '600' },
  input: {
    minHeight: 120,
    borderRadius: Spacing.four,
    borderWidth: 2,
    borderColor: Accessibility.colors.calmTextSecondary,
    padding: Spacing.three,
    fontSize: Accessibility.fontSize.normal,
    color: Accessibility.colors.calmText,
    backgroundColor: Accessibility.colors.surfaceCard,
    textAlignVertical: 'top',
  },
  submit: {
    minHeight: Accessibility.minTouchSize,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Spacing.four,
    backgroundColor: Accessibility.colors.primaryAction,
  },
  submitPressed: { opacity: 0.85 },
  submitText: { color: Accessibility.colors.primaryActionText, fontSize: Accessibility.fontSize.large, fontWeight: '700' },
  loader: { alignSelf: 'center', marginVertical: Spacing.three },
  result: { gap: Spacing.four, alignSelf: 'stretch', marginTop: Spacing.two },
  block: { gap: Spacing.two, alignSelf: 'stretch' },
  blockTitle: { fontSize: Accessibility.fontSize.large },
  item: { flexDirection: 'row', gap: Spacing.two, alignItems: 'flex-start' },
  bullet: { fontSize: Accessibility.fontSize.normal, lineHeight: 28 },
  body: { flex: 1, fontSize: Accessibility.fontSize.normal, lineHeight: 28 },
  disclaimer: {
    fontSize: Accessibility.fontSize.small,
    fontStyle: 'italic',
    color: Accessibility.colors.calmTextSecondary,
    lineHeight: 24,
  },
});
