import { describe, it, expect } from 'vitest';
import { createAnalyzeClient } from '../../src/api/client';

describe('createAnalyzeClient', () => {
  it('falls back to mock when no API_BASE_URL', async () => {
    const client = createAnalyzeClient('');
    const out = await client.analyze({ kind: 'text', text: 'công an yêu cầu OTP ngay' });
    expect(out.riskLevel).toBe('high_risk');
  });
});
