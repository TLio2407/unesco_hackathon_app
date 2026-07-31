import { describe, expect, it } from 'vitest';
import { getColorPalette, Colors } from '../../src/constants/theme';

describe('Color Blindness Theme System', () => {
  it('returns standard colors when mode is standard', () => {
    const lightStd = getColorPalette('light', 'standard');
    expect(lightStd.background).toBe(Colors.light.background);

    const darkStd = getColorPalette('dark', 'standard');
    expect(darkStd.background).toBe(Colors.dark.background);
  });

  it('adjusts colors for protanopia (red-blindness)', () => {
    const protanopia = getColorPalette('light', 'protanopia');
    expect(protanopia.riskHigh).not.toBe(Colors.light.riskHigh);
    expect(protanopia.riskHigh).toBe('#C026D3'); // Vivid Magenta
  });

  it('adjusts colors for deuteranopia (green-blindness)', () => {
    const deuteranopia = getColorPalette('light', 'deuteranopia');
    expect(deuteranopia.riskSafe).not.toBe(Colors.light.riskSafe);
    expect(deuteranopia.riskSafe).toBe('#0284C7'); // Cyan Blue
  });

  it('adjusts colors for tritanopia (blue-blindness)', () => {
    const tritanopia = getColorPalette('light', 'tritanopia');
    expect(tritanopia.primaryAction).not.toBe(Colors.light.primaryAction);
    expect(tritanopia.primaryAction).toBe('#0D9488'); // Deep Teal
  });

  it('provides maximum high contrast mode for low vision', () => {
    const highContrastDark = getColorPalette('dark', 'highContrast');
    expect(highContrastDark.background).toBe('#000000');
    expect(highContrastDark.text).toBe('#FFFFFF');
    expect(highContrastDark.riskHigh).toBe('#FF0000');

    const highContrastLight = getColorPalette('light', 'highContrast');
    expect(highContrastLight.background).toBe('#FFFFFF');
    expect(highContrastLight.text).toBe('#000000');
  });
});
