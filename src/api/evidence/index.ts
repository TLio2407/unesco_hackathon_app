import type { AlertSchema } from './schema';

export class AlertsIndex {
  private alerts: AlertSchema[];

  constructor(alerts: AlertSchema[]) {
    this.alerts = alerts;
  }

  search(signals: string[]): AlertSchema[] {
    if (signals.length === 0) return this.alerts;
    const set = new Set(signals);
    return this.alerts.filter((a) => a.signals.some((s) => set.has(s)));
  }

  random(limit: number): AlertSchema[] {
    const shuffled = [...this.alerts].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, limit);
  }
}
