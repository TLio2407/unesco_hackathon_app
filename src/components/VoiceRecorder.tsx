import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { Spacing } from '@/constants/theme';
import { t } from '@/i18n';
import { Accessibility } from '@/theme/tokens';
import { ThemedText } from './themed-text';

interface VoiceRecorderProps {
  onRecordingComplete: (uri: string) => void;
  disabled?: boolean;
}

export function VoiceRecorderButton({ onRecordingComplete, disabled }: VoiceRecorderProps) {
  const [recording, setRecording] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);

  async function startRecording() {
    try {
      // Lazy load expo-av to avoid native module errors on start
      const { Audio } = require('expo-av');

      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
      setDuration(0);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    if (!recording) return;
    setIsRecording(false);
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      if (uri) {
        onRecordingComplete(uri);
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        isRecording && styles.recording,
        disabled && styles.disabled,
      ]}
      onPress={isRecording ? stopRecording : startRecording}
      disabled={disabled}>
      <Ionicons
        name={isRecording ? 'stop-circle' : 'mic'}
        size={32}
        color={isRecording ? Accessibility.colors.riskHigh : Accessibility.colors.primaryAction}
      />
      <ThemedText style={styles.label}>
        {isRecording ? t('companion.recording') : t('companion.sourceVoice')}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    minHeight: Accessibility.minTouchSize,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Spacing.four,
    borderWidth: 2,
    borderColor: Accessibility.colors.primaryAction,
    backgroundColor: Accessibility.colors.surfaceCard,
    padding: Spacing.two,
    gap: Spacing.one,
  },
  pressed: { opacity: 0.8 },
  recording: { borderColor: Accessibility.colors.riskHigh, backgroundColor: '#FFF5F5' },
  disabled: { opacity: 0.5 },
  label: {
    fontSize: Accessibility.fontSize.normal,
    fontWeight: '600',
    color: Accessibility.colors.calmText,
  },
});
