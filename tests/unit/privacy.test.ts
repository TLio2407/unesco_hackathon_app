import { describe, it, expect, vi } from 'vitest';
import { SessionManager } from '../../src/api/privacy/session';
import { redactText, redactObject } from '../../src/api/privacy/guard';
import { ConsentManager } from '../../src/api/privacy/consent';
import { AuditLogger } from '../../src/api/privacy/audit';

describe('SessionManager', () => {
  it('create returns sessionId', () => {
    const sm = new SessionManager();
    const { sessionId } = sm.create({ foo: 'bar' });
    expect(sessionId).toBeTruthy();
    expect(typeof sessionId).toBe('string');
  });

  it('get returns cloned data', () => {
    const sm = new SessionManager();
    const { sessionId } = sm.create({ x: 1 });
    const got = sm.get(sessionId);
    expect(got).not.toBeNull();
    expect(got!.data).toEqual({ x: 1 });
    got!.data.x = 99;
    const got2 = sm.get(sessionId);
    expect(got2!.data).toEqual({ x: 1 });
  });

  it('get returns null for missing session', () => {
    const sm = new SessionManager();
    expect(sm.get('nonexistent')).toBeNull();
  });

  it('destroy removes session', () => {
    const sm = new SessionManager();
    const { sessionId } = sm.create({});
    sm.destroy(sessionId);
    expect(sm.get(sessionId)).toBeNull();
  });

  it('get returns null for expired session', async () => {
    const sm = new SessionManager(1);
    const { sessionId } = sm.create({});
    await new Promise((r) => setTimeout(r, 10));
    expect(sm.get(sessionId)).toBeNull();
  });

  it('cleanup removes expired sessions', async () => {
    const sm = new SessionManager(1);
    sm.create({ a: 1 });
    sm.create({ b: 2 });
    sm.create({ c: 3 });
    await new Promise((r) => setTimeout(r, 10));
    const count = sm.cleanup();
    expect(count).toBe(3);
    expect(sm.cleanup()).toBe(0);
  });
});

describe('redactText', () => {
  it('redacts phone, CCCD, email', () => {
    const out = redactText('SĐT 0912345678 email a@b.com');
    expect(out).not.toContain('0912345678');
    expect(out).not.toContain('a@b.com');
    expect(out).toContain('[ĐÃ CHE]');
  });

  it('leaves safe text unchanged', () => {
    const out = redactText('Xin chào bạn');
    expect(out).toBe('Xin chào bạn');
  });
});

describe('redactObject', () => {
  it('redacts default sensitive keys', () => {
    const obj = { text: 'SĐT 0912345678', other: 'hello' };
    const out = redactObject(obj);
    expect(out.text).not.toContain('0912345678');
    expect(out.text).toContain('[ĐÃ CHE]');
    expect(out.other).toBe('hello');
  });

  it('does not mutate original', () => {
    const obj = { text: 'SĐT 0912345678' };
    const out = redactObject(obj);
    expect(obj.text).toBe('SĐT 0912345678');
    expect(out.text).not.toBe(obj.text);
  });

  it('supports custom sensitive keys', () => {
    const obj = { msg: 'email a@b.com', text: 'safe' };
    const out = redactObject(obj, ['msg']);
    expect(out.msg).not.toContain('a@b.com');
    expect(out.text).toBe('safe');
  });
});

describe('ConsentManager', () => {
  it('requireConsent returns pending request', () => {
    const cm = new ConsentManager();
    const req = cm.requireConsent('sess-1', 'share');
    expect(req.token).toBeTruthy();
    expect(req.action).toBe('share');
    expect(req.granted).toBe(false);
    expect(req.expiresAt).toBeGreaterThan(Date.now());
  });

  it('grantConsent returns true for valid token', () => {
    const cm = new ConsentManager();
    const { token } = cm.requireConsent('sess-1', 'share');
    expect(cm.grantConsent(token)).toBe(true);
  });

  it('grantConsent returns false for unknown token', () => {
    const cm = new ConsentManager();
    expect(cm.grantConsent('bogus')).toBe(false);
  });

  it('grantConsent returns false for expired token', async () => {
    const cm = new ConsentManager();
    const { token } = cm.requireConsent('sess-1', 'share');
    // cheat expiry by fast-forwarding time
    const fakeFuture = Date.now() + 61 * 60 * 1000;
    vi.spyOn(Date, 'now').mockReturnValue(fakeFuture);
    try {
      expect(cm.grantConsent(token)).toBe(false);
    } finally {
      vi.restoreAllMocks();
    }
  });

  it('revokeConsent revokes all tokens for session', () => {
    const cm = new ConsentManager();
    const { token: t1 } = cm.requireConsent('sess-1', 'share');
    const { token: t2 } = cm.requireConsent('sess-1', 'log');
    cm.revokeConsent('sess-1');
    expect(cm.grantConsent(t1)).toBe(false);
    expect(cm.grantConsent(t2)).toBe(false);
  });
});

describe('AuditLogger', () => {
  it('log appends entry', () => {
    const al = new AuditLogger();
    al.log({ timestamp: Date.now(), sessionId: 's1', action: 'analyze' });
    expect(al.getEntries()).toHaveLength(1);
  });

  it('getEntries filters by session', () => {
    const al = new AuditLogger();
    al.log({ timestamp: 1, sessionId: 's1', action: 'a' });
    al.log({ timestamp: 2, sessionId: 's2', action: 'b' });
    expect(al.getEntries('s1')).toHaveLength(1);
    expect(al.getEntries('s1')[0].action).toBe('a');
  });

  it('export jsonl produces newline-separated JSON', () => {
    const al = new AuditLogger();
    al.log({ timestamp: 1, sessionId: 's1', action: 'a' });
    al.log({ timestamp: 2, sessionId: 's2', action: 'b' });
    const lines = al.export('jsonl').split('\n').filter(Boolean);
    expect(lines).toHaveLength(2);
    expect(() => lines.map((s: string) => JSON.parse(s) as any)).not.toThrow();
  });

  it('export json produces array', () => {
    const al = new AuditLogger();
    al.log({ timestamp: 1, sessionId: 's1', action: 'a' });
    const out = JSON.parse(al.export('json'));
    expect(out).toBeInstanceOf(Array);
    expect(out).toHaveLength(1);
  });

  it('no PII in audit entries', () => {
    const al = new AuditLogger();
    al.log({
      timestamp: 1,
      sessionId: 's1',
      action: 'analyze',
      inputHash: 'abc123',
      consentToken: 'my-secret-token',
    });
    const entry = al.getEntries()[0];
    expect(entry.consentToken).not.toBe('my-secret-token');
    expect(entry.inputHash).toBe('abc123');
    expect(entry.timestamp).toBe(1);
  });
});
