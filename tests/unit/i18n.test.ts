import { describe, it, expect } from 'vitest';
import vi from '../../src/locales/vi.json';
import en from '../../src/locales/en.json';

function flattenKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      return flattenKeys(value as Record<string, unknown>, path);
    }
    return path;
  });
}

describe('i18n locale parity', () => {
  it('vi.json and en.json have identical key structure', () => {
    const viKeys = flattenKeys(vi as unknown as Record<string, unknown>);
    const enKeys = flattenKeys(en as unknown as Record<string, unknown>);
    expect(viKeys.sort()).toEqual(enKeys.sort());
  });

  it('all key values are non-empty strings', () => {
    const check = (obj: Record<string, unknown>, path = '') => {
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;
        if (typeof value === 'object' && value !== null) {
          check(value as Record<string, unknown>, currentPath);
        } else {
          expect(typeof value).toBe('string');
          if (value !== '') {
            expect((value as string).length).toBeGreaterThan(0);
          }
        }
      }
    };
    check(vi as unknown as Record<string, unknown>, 'vi');
    check(en as unknown as Record<string, unknown>, 'en');
  });
});
