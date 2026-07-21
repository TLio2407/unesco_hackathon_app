import { Platform } from 'react-native';

/**
 * Accessibility-first design tokens.
 * Per report §8.2: large font, high contrast, calm colors, simple Vietnamese.
 * WCAG 2.2 AA minimum compliance target.
 */
export const Accessibility = {
  fontSize: {
    small: 16,
    normal: 18,
    large: 22,
    xlarge: 28,
    title: 34,
  },
  maxFontSizeMultiplier: 1.5,
  lineHeight: {
    tight: 1.3,
    normal: 1.5,
    relaxed: 1.7,
  },
  /** Minimum touch target 48×48pt per WCAG */
  minTouchSize: 48,

  colors: {
    riskSafe: '#15803D',
    riskCaution: '#B45309',
    riskHigh: '#B91C1C',
    riskInsufficient: '#78716C',
    backgroundWarm: '#FCFBF9',
    primaryAction: '#1D4ED8',
    primaryActionText: '#FFFFFF',
    errorBackground: '#FFF0F0',
    warningBackground: '#FFF8E1',
    successBackground: '#F0FFF4',
    calmText: '#1C1917',
    calmTextSecondary: '#57534E',
    surfaceCard: '#FFFFFF',
    surfaceElevated: '#F5F5F4',
  },
} as const;

export const Colors = Accessibility.colors;

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
