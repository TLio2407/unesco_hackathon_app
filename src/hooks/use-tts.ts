/**
 * Audio Readback (Text-to-Speech) Hook for Senior Accessibility
 * Uses expo-speech with slower rate (0.85x) tailored for 55+ users.
 */

import { useState, useEffect, useCallback } from 'react';
import * as Speech from 'expo-speech';

export interface TTSControls {
  isSpeaking: boolean;
  speak: (textToSpeak: string, language?: string) => Promise<void>;
  stop: () => Promise<void>;
}

export function useTTS(): TTSControls {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const stop = useCallback(async () => {
    try {
      await Speech.stop();
      setIsSpeaking(false);
    } catch {
      setIsSpeaking(false);
    }
  }, []);

  const speak = useCallback(
    async (textToSpeak: string, language: string = 'vi-VN') => {
      if (!textToSpeak || !textToSpeak.trim()) return;

      try {
        await Speech.stop();
        setIsSpeaking(true);

        Speech.speak(textToSpeak, {
          language,
          rate: 0.85, // Slower speaking rate tailored for elderly users
          pitch: 1.0,
          onDone: () => setIsSpeaking(false),
          onStopped: () => setIsSpeaking(false),
          onError: () => setIsSpeaking(false),
        });
      } catch {
        setIsSpeaking(false);
      }
    },
    []
  );

  useEffect(() => {
    return () => {
      Speech.stop().catch(() => {});
    };
  }, []);

  return { isSpeaking, speak, stop };
}
