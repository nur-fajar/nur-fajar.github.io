import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CONTACT } from '@/lib/retro/content';
import { TetrisScene } from './TetrisScene';

describe('TetrisScene', () => {
  it.each([0, 1, 2, CONTACT.length, CONTACT.length + 1])('renders an <svg> without throwing at step %i', (step) => {
    const { container } = render(<TetrisScene data={CONTACT} step={step} />);
    expect(container.querySelector('svg')).toBeTruthy();
  });
});
