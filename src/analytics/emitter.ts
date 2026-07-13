import type { AnalyticsEvent } from './schema';

const DEFAULT_INTERVAL = 30_000;
const DEFAULT_BATCH_SIZE = 100;

export class AnalyticsEmitter {
  private queue: AnalyticsEvent[] = [];
  private intervalMs: number;
  private batchSize: number;
  private onFlushCallback: ((events: AnalyticsEvent[]) => void) | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(intervalMs = DEFAULT_INTERVAL, batchSize = DEFAULT_BATCH_SIZE) {
    this.intervalMs = intervalMs;
    this.batchSize = batchSize;
    this.startTimer();
  }

  private startTimer() {
    this.stopTimer();
    if (this.onFlushCallback) {
      this.timer = setInterval(() => this.flush(), this.intervalMs);
    }
  }

  private stopTimer() {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  track(event: AnalyticsEvent): void {
    this.queue.push(event);
    if (this.queue.length >= this.batchSize) {
      this.flush().catch(() => {});
    }
  }

  async flush(): Promise<void> {
    if (this.queue.length === 0) return;
    const batch = this.queue.splice(0);
    if (this.onFlushCallback) {
      this.onFlushCallback(batch);
    }
  }

  onFlush(callback: (events: AnalyticsEvent[]) => void): void {
    this.onFlushCallback = callback;
    if (!this.timer) {
      this.startTimer();
    }
  }
}
