import { describe, expect, it } from 'vitest';
import type { RiskLevel } from '../../src/api/contract';

import { riskMeta } from '../../src/lib/risk-meta';

describe('riskMeta', () => {
  it('maps safe to the safe label and green', () => {
    const m = riskMeta('safe');
    expect(m.labelKey).toBe('companion.result.safe');
    expect(m.color).toBe('#15803D');
  });

  it('maps high_risk to red', () => {
    expect(riskMeta('high_risk').color).toBe('#B91C1C');
  });

  it('maps caution to amber', () => {
    expect(riskMeta('caution').color).toBe('#B45309');
  });

  it('falls back to insufficient_data for unknown levels', () => {
    expect(riskMeta('nope' as RiskLevel).labelKey).toBe('companion.result.insufficientData');
  });
});
