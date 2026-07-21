/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0F172A', // Deep slate navy for high contrast
    background: '#FDFBF7', // Soft cream off-white to prevent glare
    backgroundElement: '#F1EFE9', // Subtle warm container
    backgroundSelected: '#E2DEC9',
    textSecondary: '#475569', // Slate-gray with high contrast ratio (7.2:1)

    primaryAction: '#1D4ED8', // Solid high-contrast royal blue
    primaryActionText: '#FFFFFF',
    surfaceCard: '#FFFFFF',
    surfaceElevated: '#F8F6F0',
    cardBorder: '#E2E8F0',

    riskSafe: '#15803D',
    riskCaution: '#B45309',
    riskHigh: '#B91C1C',
    riskInsufficient: '#64748B',

    riskSafeBg: '#F0FDF4',
    riskCautionBg: '#FFFBEB',
    riskHighBg: '#FEF2F2',
    riskInsufficientBg: '#F1F5F9',
  },
  dark: {
    text: '#F8FAFC', // Crisp soft white to prevent glare/halo effect
    background: '#18181B', // Deep zinc charcoal background instead of harsh black
    backgroundElement: '#27272A', // Elevated warm zinc container
    backgroundSelected: '#3F3F46',
    textSecondary: '#CBD5E1', // High contrast soft slate silver (11.2:1)

    primaryAction: '#3B82F6', // High visibility vibrant blue
    primaryActionText: '#FFFFFF',
    surfaceCard: '#27272A',
    surfaceElevated: '#3F3F46',
    cardBorder: '#3F3F46',

    riskSafe: '#4ADE80',
    riskCaution: '#FBBF24',
    riskHigh: '#F87171',
    riskInsufficient: '#94A3B8',

    riskSafeBg: '#143821',
    riskCautionBg: '#382A0C',
    riskHighBg: '#3B1E1E',
    riskInsufficientBg: '#334155',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
