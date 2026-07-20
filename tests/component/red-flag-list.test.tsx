import { render, screen } from '@testing-library/react';
import { RedFlagList } from '@/components/red-flag-list';
import type { RedFlag } from '@/api/contract';

const flags: RedFlag[] = [
  { signal: 'urgency', explanation: 'Yêu cầu gấp' },
  { signal: 'upfront_payment', explanation: 'Yêu cầu chuyển tiền trước' },
];

describe('RedFlagList', () => {
  it('renders heading + all flag explanations', () => {
    render(<RedFlagList flags={flags} />);
    expect(screen.getByText('companion.result.redFlags')).toBeTruthy();
    expect(screen.getByText('Yêu cầu gấp')).toBeTruthy();
    expect(screen.getByText('Yêu cầu chuyển tiền trước')).toBeTruthy();
  });

  it('renders nothing when no flags', () => {
    const { container } = render(<RedFlagList flags={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
