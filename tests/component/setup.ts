import { vi } from 'vitest';

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
  Ionicons: (p: any) => ({ type: 'i', props: p }),
}));
