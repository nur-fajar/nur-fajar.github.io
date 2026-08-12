import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SKILLS } from '@/lib/retro/content';
import { PuzzleScene } from './PuzzleScene';

describe('PuzzleScene', () => {
  it.each([0, 1, 3, 8])('renders an <svg> without throwing at step %i', (step) => {
    const { container } = render(<PuzzleScene data={SKILLS} step={step} />);
    expect(container.querySelector('svg')).toBeTruthy();
  });
});
