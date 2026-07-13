import { randomBytes } from 'crypto';

export interface ConsentRequest {
  token: string;
  action: string;
  granted: boolean;
  expiresAt: number;
}

interface PendingToken {
  action: string;
  sessionId: string;
  expiresAt: number;
}

const ONE_HOUR_MS = 60 * 60 * 1000;

export class ConsentManager {
  private pending = new Map<string, PendingToken>();
  private revoked = new Set<string>();

  requireConsent(sessionId: string, action: 'share' | 'log' | 'analytics'): ConsentRequest {
    const token = randomBytes(16).toString('hex');
    const expiresAt = Date.now() + ONE_HOUR_MS;
    this.pending.set(token, { action, sessionId, expiresAt });
    return { token, action, granted: false, expiresAt };
  }

  grantConsent(token: string): boolean {
    if (this.revoked.has(token)) return false;
    const pending = this.pending.get(token);
    if (!pending) return false;
    if (Date.now() > pending.expiresAt) {
      this.pending.delete(token);
      return false;
    }
    this.pending.delete(token);
    return true;
  }

  revokeConsent(sessionId: string): void {
    for (const [token, p] of this.pending) {
      if (p.sessionId === sessionId) {
        this.revoked.add(token);
        this.pending.delete(token);
      }
    }
  }
}
