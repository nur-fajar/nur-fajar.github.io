import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PROJECT_CATEGORIES, PROJECTS } from '@/lib/retro/content';
import { PacmanScene } from './PacmanScene';

describe('PacmanScene', () => {
  it.each([0, 1, 2, 5, 10])('renders an <svg> without throwing at step %i', (step) => {
    const { container } = render(<PacmanScene data={PROJECTS} categories={PROJECT_CATEGORIES} step={step} />);
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('walks backward through steps without throwing (final-review I7 path logic)', () => {
    const { rerender, container } = render(
      <PacmanScene data={PROJECTS} categories={PROJECT_CATEGORIES} step={9} />,
    );
    rerender(<PacmanScene data={PROJECTS} categories={PROJECT_CATEGORIES} step={7} />);
    rerender(<PacmanScene data={PROJECTS} categories={PROJECT_CATEGORIES} step={3} />);
    expect(container.querySelector('svg')).toBeTruthy();
  });
});
