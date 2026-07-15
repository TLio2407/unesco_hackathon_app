import { describe, it, expect, vi } from 'vitest';
import { createAnalyzeClient } from '../../src/api/client';
import { safeParseAnalyzeOutput } from '../../src/api/contract';

describe('createAnalyzeClient', () => {
  it('falls back to mock when no API_BASE_URL', async () => {
    const client = createAnalyzeClient('');
    const out = await client.analyze({ kind: 'text', text: 'công an yêu cầu OTP ngay' });
    expect(out.riskLevel).toBe('high_risk');
  });

  it('validates API response with safeParseAnalyzeOutput', async () => {
    const validResponse = {
      riskLevel: 'high_risk',
      redFlags: [{ signal: 'urgency', explanation: 'test' }],
      verificationSteps: ['step1'],
      nextAction: 'Dừng lại',
      lessonCard: { title: 'Test', points: ['point1'] },
      disclaimer: 'test',
    };

    const client = createAnalyzeClient('https://api.example.com');
    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(validResponse),
    });

    const result = await client.analyze({ kind: 'text', text: 'test' });
    expect(result.riskLevel).toBe('high_risk');
    global.fetch = originalFetch;
  });

  it('throws on invalid API response', async () => {
    const invalidResponse = { not: 'valid' };

    const client = createAnalyzeClient('https://api.example.com');
    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(invalidResponse),
    });

    await expect(client.analyze({ kind: 'text', text: 'test' })).rejects.toThrow(
      'Invalid analyze response',
    );
    global.fetch = originalFetch;
  });
});
