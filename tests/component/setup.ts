import { vi } from 'vitest';
import React from 'react';

// Ensure __DEV__ is defined for Expo modules in test environment
(globalThis as any).__DEV__ = true;

vi.mock('@/i18n', () => {
  const t = (key: string, fallback?: string) => fallback ?? key;
  return {
    t,
    useI18n: () => ({ t: (k: string, f?: string) => f ?? k }),
    i18n: { t, locale: 'vi', defaultLocale: 'vi', enableFallback: true },
    translations: { vi: {}, en: {} },
  };
});

vi.mock('expo-localization', () => ({
  getLocales: () => [{ languageCode: 'vi', textDirection: 'ltr', currencyCode: 'VND', regionCode: 'VN', isRTL: false }],
}));

vi.mock('@expo/vector-icons', () => ({
  Ionicons: (p: any) => React.createElement('i', p),
}));

vi.mock('expo-speech', () => ({
  speak: vi.fn(),
  stop: vi.fn().mockResolvedValue(undefined),
  isSpeakingAsync: vi.fn().mockResolvedValue(false),
}));
