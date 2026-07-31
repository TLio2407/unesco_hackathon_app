import { render, screen } from '@testing-library/react';
import { View, Text } from 'react-native';
import { DualPane } from '@/components/dual-pane';

describe('DualPane Component', () => {
  it('renders master and detail panes', () => {
    render(
      <DualPane
        master={<Text>Master Content</Text>}
        detail={<Text>Detail Content</Text>}
      />
    );

    expect(screen.getByText('Master Content')).toBeTruthy();
    expect(screen.getByText('Detail Content')).toBeTruthy();
  });
});
