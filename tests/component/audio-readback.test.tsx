import { render, screen, fireEvent } from '@testing-library/react';
import { AudioReadback } from '@/components/audio-readback';

describe('AudioReadback Component', () => {
  it('renders audio readback button with accessible label', () => {
    render(<AudioReadback text="Thông báo an toàn" label="Đọc thông báo" />);
    const btn = screen.getByRole('button', { name: /Đọc âm thanh: Đọc thông báo/i });
    expect(btn).toBeTruthy();
  });

  it('handles button press without crashing', () => {
    render(<AudioReadback text="Thông báo an toàn" label="Nghe lại" />);
    const btn = screen.getByRole('button');
    fireEvent.click(btn);
    expect(btn).toBeTruthy();
  });
});
