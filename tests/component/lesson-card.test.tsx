import { render, screen } from '@testing-library/react';
import { LessonCard } from '@/components/lesson-card';
import type { LessonCard as LessonCardData } from '@/api/contract';

const card: LessonCardData = {
  title: 'Tránh lừa đảo',
  points: ['Không chuyển tiền', 'Xác minh nguồn'],
  quiz: { question: 'Nên làm gì?', answer: 'Gọi xác minh' },
};

describe('LessonCard', () => {
  it('renders title', () => {
    render(<LessonCard card={card} />);
    expect(screen.getByText(/Tránh lừa đảo/)).toBeTruthy();
  });

  it('renders all points', () => {
    render(<LessonCard card={card} />);
    expect(screen.getByText('Không chuyển tiền')).toBeTruthy();
    expect(screen.getByText('Xác minh nguồn')).toBeTruthy();
  });

  it('renders quiz when present', () => {
    render(<LessonCard card={card} />);
    expect(screen.getByText(/Nên làm gì\?/)).toBeTruthy();
    expect(screen.getByText(/Gọi xác minh/)).toBeTruthy();
  });

  it('renders without quiz', () => {
    render(<LessonCard card={{ title: 'Tiêu đề', points: ['Điểm'] }} />);
    expect(screen.getByText(/Tiêu đề/)).toBeTruthy();
    expect(screen.getByText('Điểm')).toBeTruthy();
  });
});
