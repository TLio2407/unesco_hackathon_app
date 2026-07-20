import { render, screen } from '@testing-library/react';
import { ThemedText } from '@/components/themed-text';

describe('ThemedText', () => {
  it('renders children', () => {
    render(<ThemedText>Xin chào</ThemedText>);
    expect(screen.getByText('Xin chào')).toBeTruthy();
  });

  it('applies type prop (title) — size style wired via RNW class', () => {
    render(<ThemedText type="title">Xin chào</ThemedText>);
    const el = screen.getByText('Xin chào');
    expect(el).toBeTruthy();
    // RNW serializes StyleSheet to class names (fontSize/lineHeight tokens)
    expect(el.className).toMatch(/fontSize/);
    expect(el.className).toMatch(/lineHeight/);
  });

  it('default type wires a font size token (elderly accessibility)', () => {
    render(<ThemedText>Hello</ThemedText>);
    const el = screen.getByText('Hello');
    expect(el.className).toMatch(/fontSize/);
  });
});
