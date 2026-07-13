import { randomUUID } from 'crypto';

interface SessionEntry {
  data: any;
  createdAt: number;
}

export class SessionManager {
  private sessions = new Map<string, SessionEntry>();

  constructor(private ttlMs: number = 15 * 60 * 1000) {}

  create(input: any): { sessionId: string } {
    const sessionId = randomUUID();
    this.sessions.set(sessionId, { data: structuredClone(input), createdAt: Date.now() });
    return { sessionId };
  }

  get(sessionId: string): { data: any } | null {
    const entry = this.sessions.get(sessionId);
    if (!entry) return null;
    if (Date.now() - entry.createdAt > this.ttlMs) {
      this.sessions.delete(sessionId);
      return null;
    }
    return { data: structuredClone(entry.data) };
  }

  destroy(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  cleanup(): number {
    const now = Date.now();
    let removed = 0;
    for (const [id, entry] of this.sessions) {
      if (now - entry.createdAt > this.ttlMs) {
        this.sessions.delete(id);
        removed++;
      }
    }
    return removed;
  }
}
