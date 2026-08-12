import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AREAS, ORG } from '@/lib/retro/content';
import { PlatformerScene } from './PlatformerScene';

const area = AREAS.find((a) => a.key === 'org')!;

describe('PlatformerScene', () => {
  it.each([0, 1, 2, area.steps - 1])('renders an <svg> without throwing at step %i', (step) => {
    const { container } = render(<PlatformerScene area={area} data={ORG} step={step} />);
    expect(container.querySelector('svg')).toBeTruthy();
  });
});
