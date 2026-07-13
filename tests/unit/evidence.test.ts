import { describe, expect, it } from 'vitest';
import type { AlertSchema } from '../../src/api/evidence/schema';
import { AlertsIndex } from '../../src/api/evidence/index';
import { validateAlerts } from '../../src/api/evidence/cli';
import alertsData from '../../data/evidence/alerts.json';

const typedAlerts = alertsData as AlertSchema[];

describe('AlertsIndex', () => {
  const index = new AlertsIndex(typedAlerts);

  it('search by signal returns matching alerts', () => {
    const results = index.search(['urgency']);
    expect(results.length).toBeGreaterThanOrEqual(5);
    for (const r of results) {
      expect(r.signals).toContain('urgency');
    }
  });

  it('search with multiple signals returns alerts matching any', () => {
    const results = index.search(['urgency', 'suspicious_url']);
    for (const r of results) {
      const hasAny = r.signals.includes('urgency') || r.signals.includes('suspicious_url');
      expect(hasAny).toBe(true);
    }
  });

  it('search empty signals returns all alerts', () => {
    expect(index.search([]).length).toBe(typedAlerts.length);
  });

  it('search unknown signal returns empty', () => {
    expect(index.search(['nonexistent_signal']).length).toBe(0);
  });

  it('random returns requested count', () => {
    expect(index.random(5).length).toBe(5);
    expect(index.random(0).length).toBe(0);
  });

  it('random does not return more than total alerts', () => {
    const r = index.random(9999);
    expect(r.length).toBe(typedAlerts.length);
  });

  it('all seed data passes validation', () => {
    const errs = validateAlerts(typedAlerts);
    expect(errs).toEqual([]);
  });
});

describe('validateAlerts', () => {
  const valid: AlertSchema = {
    id: 'test-001',
    source: 'BoCA',
    sourceUrl: 'https://example.com',
    date: '2026-01-15',
    title: 'Test Alert',
    summary: 'This is a test alert summary',
    category: 'health',
    signals: ['urgency'],
    region: 'VN',
  };

  it('passes a valid alert', () => {
    expect(validateAlerts([valid])).toEqual([]);
  });

  it('rejects invalid source', () => {
    const errs = validateAlerts([{ ...valid, source: 'UnknownSource' }]);
    expect(errs.some((e) => e.includes('invalid source'))).toBe(true);
  });

  it('rejects invalid date', () => {
    const errs = validateAlerts([{ ...valid, date: 'not-a-date' }]);
    expect(errs.some((e) => e.includes('invalid ISO date'))).toBe(true);
  });

  it('rejects empty title', () => {
    const errs = validateAlerts([{ ...valid, title: '' }]);
    expect(errs.some((e) => e.includes('empty title'))).toBe(true);
  });

  it('rejects empty summary', () => {
    const errs = validateAlerts([{ ...valid, summary: '' }]);
    expect(errs.some((e) => e.includes('empty summary'))).toBe(true);
  });

  it('rejects invalid category', () => {
    const errs = validateAlerts([{ ...valid, category: 'bogus' as any }]);
    expect(errs.some((e) => e.includes('invalid category'))).toBe(true);
  });

  it('rejects invalid signal', () => {
    const errs = validateAlerts([{ ...valid, signals: ['bogus_signal'] }]);
    expect(errs.some((e) => e.includes('invalid signal'))).toBe(true);
  });

  it('rejects empty signals', () => {
    const errs = validateAlerts([{ ...valid, signals: [] }]);
    expect(errs.some((e) => e.includes('no signals'))).toBe(true);
  });

  it('rejects invalid region', () => {
    const errs = validateAlerts([{ ...valid, region: 'EU' as any }]);
    expect(errs.some((e) => e.includes('invalid region'))).toBe(true);
  });

  it('rejects duplicate ids', () => {
    const errs = validateAlerts([valid, valid]);
    expect(errs.some((e) => e.includes('Duplicate'))).toBe(true);
  });

  it('rejects empty sourceUrl', () => {
    const errs = validateAlerts([{ ...valid, sourceUrl: '' }]);
    expect(errs.some((e) => e.includes('empty sourceUrl'))).toBe(true);
  });

  it('rejects multiple errors in one alert', () => {
    const bad = { ...valid, source: 'Nope', date: 'bad', title: '' };
    const errs = validateAlerts([bad]);
    expect(errs.length).toBeGreaterThanOrEqual(3);
  });
});
