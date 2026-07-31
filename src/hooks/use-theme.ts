import { useState, useEffect } from 'react';
import { getColorPalette, ColorBlindnessMode } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

let currentMode: ColorBlindnessMode = 'standard';
const listeners = new Set<(mode: ColorBlindnessMode) => void>();

export function getColorBlindnessMode(): ColorBlindnessMode {
  return currentMode;
}

export function setColorBlindnessMode(mode: ColorBlindnessMode) {
  currentMode = mode;
  listeners.forEach((l) => l(mode));
}

export function useColorBlindnessMode(): [ColorBlindnessMode, (mode: ColorBlindnessMode) => void] {
  const [mode, setMode] = useState<ColorBlindnessMode>(currentMode);

  useEffect(() => {
    const handler = (newMode: ColorBlindnessMode) => setMode(newMode);
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  return [mode, setColorBlindnessMode];
}

export function useTheme() {
  const scheme = useColorScheme();
  const theme = scheme === 'unspecified' ? 'light' : scheme;
  const [cbMode] = useColorBlindnessMode();

  return getColorPalette(theme, cbMode);
}
