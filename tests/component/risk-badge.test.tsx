import { render, screen } from '@testing-library/react';
import { RiskBadge } from '@/components/risk-badge';

describe('RiskBadge', () => {
  it('renders safe risk level text', () => {
    render(<RiskBadge level="safe" />);
    expect(screen.getByText('companion.result.safe')).toBeTruthy();
  });

  it('renders high_risk risk level text', () => {
    render(<RiskBadge level="high_risk" />);
    expect(screen.getByText('companion.result.highRisk')).toBeTruthy();
  });

  it('renders caution risk level text', () => {
    render(<RiskBadge level="caution" />);
    expect(screen.getByText('companion.result.caution')).toBeTruthy();
  });
});
