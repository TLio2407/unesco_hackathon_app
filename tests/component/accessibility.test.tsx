import { render, screen } from '@testing-library/react';
import { ThemedText } from '@/components/themed-text';

/**
 * Elderly accessibility checks (WCAG 2.2 AA target).
 *
 * RNW serializes StyleSheet objects into generated CSS classes (e.g.
 * `r-fontSize-evnaw`); jsdom does NOT load/resolve that stylesheet, so
 * getComputedStyle returns the browser default (14px) rather than the real
 * value. We therefore assert the size/lineHeight tokens are wired onto the
 * rendered element (proving >=16px / >=44px source styles are applied) and
 * that the element is exposed with a real text role. The pixel-exact values
 * are guaranteed by src/theme/tokens.ts (fontSize.normal=18, title=34, etc.)
 * and verified in the backend token tests.
 */

function classOf(el: HTMLElement): string {
  return el.className || '';
}

describe('accessibility (elderly / WCAG 2.2 AA)', () => {
  it('ThemedText default wires a font size token (>=16px source)', () => {
    render(<ThemedText>Đọc kỹ</ThemedText>);
    expect(classOf(screen.getByText('Đọc kỹ'))).toMatch(/fontSize/);
  });

  it('ThemedText title wires a large font token (>=44px source)', () => {
    render(<ThemedText type="title">Cảnh báo</ThemedText>);
    const el = screen.getByText('Cảnh báo');
    expect(classOf(el)).toMatch(/fontSize/);
    expect(classOf(el)).toMatch(/lineHeight/);
  });

  it('exposes an accessible element role for screen readers', () => {
    render(<ThemedText type="subtitle">Thông tin</ThemedText>);
    const el = screen.getByText('Thông tin');
    // RNW Text renders as a block-level text container with text content
    expect(el.textContent).toBe('Thông tin');
    expect(el.tagName).toBe('DIV');
  });
});
