import { describe, expect, it } from 'vitest';
import { spriteRects } from './sprite';

describe('spriteRects', () => {
  it('returns a non-empty list of rects at gear 0', () => {
    const rects = spriteRects(4, 0);
    expect(rects.length).toBeGreaterThan(5);
    for (const r of rects) {
      expect(r.w).toBeGreaterThan(0);
      expect(r.h).toBeGreaterThan(0);
      expect(r.fill).toMatch(/^#[0-9a-fA-F]{3,8}$/);
    }
  });

  it('adds more rects as gear increases (more gear = more visible gear)', () => {
    const base = spriteRects(4, 0).length;
    const withHat = spriteRects(4, 1).length;
    const withEverything = spriteRects(4, 4).length;
    expect(withHat).toBeGreaterThan(base);
    expect(withEverything).toBeGreaterThan(withHat);
  });

  it('scales rect coordinates linearly with the scale factor', () => {
    const at1 = spriteRects(1, 0)[0];
    const at2 = spriteRects(2, 0)[0];
    expect(at2.x).toBe(at1.x * 2);
    expect(at2.w).toBe(at1.w * 2);
  });
});
