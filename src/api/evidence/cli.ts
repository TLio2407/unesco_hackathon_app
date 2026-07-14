import { VALID_SOURCES, VALID_SIGNALS, VALID_CATEGORIES } from './schema';

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function validateAlerts(alerts: unknown[]): string[] {
  const errors: string[] = [];
  const seen = new Set<string>();

  for (const item of alerts) {
    const a = item as Record<string, unknown>;
    const id = String(a.id ?? '');

    if (!a.id) errors.push(`Alert missing id`);
    if (seen.has(id)) errors.push(`Duplicate id: ${id}`);
    seen.add(id);

    if (!VALID_SOURCES.includes(a.source as any)) {
      errors.push(`"${id}": invalid source "${String(a.source)}"`);
    }

    if (!ISO_DATE_RE.test(String(a.date ?? ''))) {
      errors.push(`"${id}": invalid ISO date "${String(a.date)}"`);
    }

    if (!a.title || String(a.title).trim().length === 0) {
      errors.push(`"${id}": empty title`);
    }

    if (!a.summary || String(a.summary).trim().length === 0) {
      errors.push(`"${id}": empty summary`);
    }

    if (!VALID_CATEGORIES.includes(a.category as any)) {
      errors.push(`"${id}": invalid category "${String(a.category)}"`);
    }

    const signals = a.signals as unknown[] | undefined;
    if (!signals || signals.length === 0) {
      errors.push(`"${id}": no signals`);
    } else {
      for (const s of signals) {
        if (!VALID_SIGNALS.includes(s as any)) {
          errors.push(`"${id}": invalid signal "${String(s)}"`);
        }
      }
    }

    const sourceUrl = String(a.sourceUrl ?? '');
    if (!sourceUrl.trim()) {
      errors.push(`"${id}": empty sourceUrl`);
    }

    if (a.region !== 'VN' && a.region !== 'global') {
      errors.push(`"${id}": invalid region "${String(a.region)}"`);
    }
  }

  return errors;
}
