import { createHash } from 'crypto';

export interface AuditEntry {
  timestamp: number;
  sessionId: string;
  action: string;
  riskLevel?: string;
  redactionCount?: number;
  consentToken?: string;
  inputHash?: string;
}

export class AuditLogger {
  private entries: AuditEntry[] = [];

  log(entry: AuditEntry): void {
    const safe: AuditEntry = {
      timestamp: entry.timestamp,
      sessionId: entry.sessionId,
      action: entry.action,
      ...(entry.riskLevel !== undefined && { riskLevel: entry.riskLevel }),
      ...(entry.redactionCount !== undefined && { redactionCount: entry.redactionCount }),
      ...(entry.consentToken !== undefined && {
        consentToken: createHash('sha256').update(entry.consentToken).digest('hex').slice(0, 12),
      }),
      ...(entry.inputHash !== undefined && { inputHash: entry.inputHash }),
    };
    this.entries.push(safe);
  }

  getEntries(sessionId?: string): AuditEntry[] {
    if (!sessionId) return [...this.entries];
    return this.entries.filter((e) => e.sessionId === sessionId);
  }

  export(format: 'jsonl' | 'json'): string {
    if (format === 'jsonl') {
      return this.entries.map((e) => JSON.stringify(e)).join('\n');
    }
    return JSON.stringify(this.entries, null, 2);
  }
}
