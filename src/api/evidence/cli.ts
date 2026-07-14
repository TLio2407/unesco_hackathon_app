import { VALID_SOURCES, VALID_SIGNALS, VALID_CATEGORIES } from './schema';

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function validateAlerts(alerts: unknown[]): string[] {
  const errors: string[] = [];
  const seen = new Set<string>();

  for (const item of alerts) {
    const a = item as Record<string, any>;
    if (!a.id) errors.push(`Alert missing id`);
    if (seen.has(a.id)) errors.push(`Duplicate id: ${a.id}`);
    seen.add(a.id);

    if (!VALID_SOURCES.includes(a.source as any)) {
      errors.push(`"${a.id}": invalid source "${a.source}"`);
    }

    if (!ISO_DATE_RE.test(a.date)) {
      errors.push(`"${a.id}": invalid ISO date "${a.date}"`);
    }

    if (!a.title || a.title.trim().length === 0) {
      errors.push(`"${a.id}": empty title`);
    }

    if (!a.summary || a.summary.trim().length === 0) {
      errors.push(`"${a.id}": empty summary`);
    }

    if (!VALID_CATEGORIES.includes(a.category as any)) {
      errors.push(`"${a.id}": invalid category "${a.category}"`);
    }

    if (!a.signals || a.signals.length === 0) {
      errors.push(`"${a.id}": no signals`);
    } else {
      for (const s of a.signals) {
        if (!VALID_SIGNALS.includes(s as any)) {
          errors.push(`"${a.id}": invalid signal "${s}"`);
        }
      }
    }

    if (!a.sourceUrl || a.sourceUrl.trim().length === 0) {
      errors.push(`"${a.id}": empty sourceUrl`);
    }

    if (a.region !== 'VN' && a.region !== 'global') {
      errors.push(`"${a.id}": invalid region "${a.region}"`);
    }
  }

  return errors;
}
