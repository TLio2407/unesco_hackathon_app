import { useState, useRef } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TextInput, View, Image, Share, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { LessonCard } from '@/components/lesson-card';
import { RedFlagList } from '@/components/red-flag-list';
import { RiskBadge } from '@/components/risk-badge';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ImagePickerButton } from '@/components/ImagePicker';
import { createAnalyzeClient } from '@/api/client';
import type { AnalyzeOutput, AnalysisInput } from '@/api/contract';
import { redact } from '@/lib/redact';
import { t } from '@/i18n';
import { Accessibility } from '@/theme/tokens';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

const client = createAnalyzeClient();
type Mode = 'text' | 'url' | 'image' | 'voice';

export default function CompanionScreen() {
  const [mode, setMode] = useState<Mode>('text');
  const [value, setValue] = useState('');
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  async function onSubmit() {
    if (loading) return;
    setLoading(true);
    setError(null);
    setResult(null);

    let input: AnalysisInput;
    if (mode === 'url') {
      input = { kind: 'url', url: value.trim() };
    } else if (mode === 'text') {
      input = { kind: 'text', text: redact(value).text };
    } else if (mode === 'image' && mediaUri) {
      input = { kind: 'image', ref: mediaUri };
    } else if (mode === 'voice' && mediaUri) {
      input = { kind: 'voice', data: mediaUri, mimeType: 'audio/m4a' };
    } else {
      setLoading(false);
      return;
    }

    try {
      setResult(await client.analyze(input));
    } catch {
      setError(t('common.error'));
    } finally {
      setLoading(false);
    }
  }

  const handleVoicePress = () => {
    if (isRecording) {
      setIsRecording(false);
      setMode('voice');
      setMediaUri('mock-voice-uri');
      setValue('Tôi nhận được cuộc gọi từ số lạ tự xưng là công an nói tôi đang nợ tiền phạt vi phạm giao thông 5 triệu đồng và yêu cầu tôi chuyển khoản ngay để không bị khóa bằng lái.');
    } else {
      setIsRecording(true);
      setResult(null);
      setMediaUri(null);
    }
  };

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

          <View style={styles.modeGrid}>
            <ModeButton
              active={mode === 'text'}
              label={t('companion.sourceText')}
              icon="text-outline"
              onPress={() => { setMode('text'); setMediaUri(null); }}
            />
            <ModeButton
              active={mode === 'url'}
              label={t('companion.sourceUrl')}
              icon="link-outline"
              onPress={() => { setMode('url'); setMediaUri(null); }}
            />
            <ImagePickerButton
              disabled={loading}
              onImageSelected={(uri) => { setMode('image'); setMediaUri(uri); }}
            />
            <Pressable
              style={[styles.modeBtn, isRecording && { backgroundColor: Accessibility.colors.riskHigh }]}
              onPress={handleVoicePress}
            >
               <Ionicons
                name={isRecording ? "stop-circle" : "mic-outline"}
                size={32}
                color={isRecording ? "#FFF" : Accessibility.colors.primaryAction}
               />
               <ThemedText style={[styles.modeLabel, isRecording && { color: '#FFF' }]}>
                {isRecording ? t('companion.recording') : t('companion.sourceVoice')}
               </ThemedText>
            </Pressable>
          </View>

          {(mode === 'text' || mode === 'url' || (mode === 'voice' && mediaUri)) && (
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
          )}

          {mediaUri && mode !== 'voice' && (
            <View style={styles.mediaPreview}>
              {mode === 'image' && (
                <Image source={{ uri: mediaUri }} style={styles.previewImage} />
              )}
              <Pressable onPress={() => setMediaUri(null)}>
                <Ionicons name="close-circle" size={32} color={Accessibility.colors.riskHigh} />
              </Pressable>
            </View>
          )}

          {mode === 'voice' && mediaUri && (
            <View style={styles.voiceInfo}>
              <Ionicons name="musical-notes" size={24} color={Accessibility.colors.primaryAction} />
              <ThemedText style={{ flex: 1 }}>Ghi âm đã chuyển thành văn bản</ThemedText>
              <Pressable onPress={() => { setMediaUri(null); setValue(''); }}>
                <Ionicons name="close-circle" size={24} color={Accessibility.colors.riskHigh} />
              </Pressable>
            </View>
          )}

          <Pressable
            style={({ pressed }) => [styles.submit, pressed && styles.submitPressed]}
            onPress={onSubmit}
            disabled={loading || (mode === 'text' || mode === 'url' ? !value.trim() : !mediaUri)}>
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

function ModeButton({ active, label, icon, onPress }: { active: boolean; label: string; icon: any; onPress: () => void }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.modeBtn,
        active && styles.modeBtnActive,
        pressed && styles.modeBtnPressed,
      ]}
      onPress={onPress}>
      <Ionicons name={icon} size={32} color={active ? Accessibility.colors.primaryActionText : Accessibility.colors.primaryAction} />
      <ThemedText style={[styles.modeLabel, active && { color: Accessibility.colors.primaryActionText }]}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

function ResultCard({ result }: { result: AnalyzeOutput }) {
  async function onShare() {
    const summary = `An Tâm Số - Kết quả phân tích rủi ro: ${t(`risk.${result.riskLevel}`)}\n\n` +
      `Dấu hiệu:\n${result.redFlags.map(f => `- ${f.explanation}`).join('\n')}\n\n` +
      `Hành động tiếp theo:\n${result.nextAction}`;

    await Share.share({ message: redact(summary).text });
  }

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

      <Pressable style={styles.shareBtn} onPress={onShare}>
        <Ionicons name="share-social" size={24} color={Accessibility.colors.primaryActionText} />
        <ThemedText style={styles.shareBtnText}>{t('companion.trustedCircle')}</ThemedText>
      </Pressable>

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
  title: { fontSize: Accessibility.fontSize.title, marginBottom: Spacing.two },
  modeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  modeBtn: {
    width: '48%',
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Spacing.four,
    borderWidth: 2,
    borderColor: Accessibility.colors.primaryAction,
    backgroundColor: Accessibility.colors.surfaceCard,
    padding: Spacing.two,
    gap: Spacing.one,
  },
  modeBtnActive: { backgroundColor: Accessibility.colors.primaryAction },
  modeBtnPressed: { opacity: 0.8 },
  modeLabel: { fontSize: Accessibility.fontSize.normal, fontWeight: '600', textAlign: 'center' },
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
  mediaPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.three,
    borderRadius: Spacing.four,
    backgroundColor: Accessibility.colors.surfaceCard,
    borderWidth: 1,
    borderColor: Accessibility.colors.calmTextSecondary,
  },
  previewImage: { width: 100, height: 100, borderRadius: Spacing.two },
  voiceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    backgroundColor: '#E3F2FD',
    borderRadius: Spacing.two,
  },
  submit: {
    minHeight: Accessibility.minTouchSize,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Spacing.four,
    backgroundColor: Accessibility.colors.primaryAction,
    marginTop: Spacing.two,
  },
  submitPressed: { opacity: 0.85 },
  submitText: { color: Accessibility.colors.primaryActionText, fontSize: Accessibility.fontSize.large, fontWeight: '700' },
  loader: { alignSelf: 'center', marginVertical: Spacing.three },
  result: { gap: Spacing.four, alignSelf: 'stretch', marginTop: Spacing.two },
  block: { gap: Spacing.two, alignSelf: 'stretch' },
  blockTitle: { fontSize: Accessibility.fontSize.large, fontWeight: '700' },
  item: { flexDirection: 'row', gap: Spacing.two, alignItems: 'flex-start' },
  bullet: { fontSize: Accessibility.fontSize.normal, lineHeight: 28 },
  body: { flex: 1, fontSize: Accessibility.fontSize.normal, lineHeight: 28, color: Accessibility.colors.calmText },
  shareBtn: {
    flexDirection: 'row',
    backgroundColor: Accessibility.colors.primaryAction,
    padding: Spacing.three,
    borderRadius: Spacing.four,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.two,
  },
  shareBtnText: { color: Accessibility.colors.primaryActionText, fontSize: Accessibility.fontSize.normal, fontWeight: '700' },
  disclaimer: {
    fontSize: Accessibility.fontSize.small,
    fontStyle: 'italic',
    color: Accessibility.colors.calmTextSecondary,
    lineHeight: 24,
  },
});
