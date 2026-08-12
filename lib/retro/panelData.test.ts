import { describe, expect, it } from 'vitest';
import { AREAS } from './content';
import { totalSteps } from './gameState';
import { buildPanelData } from './panelData';

// Table-driven: walk every valid (area, step) pair across all 5 areas plus the
// map screen (before/after everything is done), and assert buildPanelData
// never throws and always returns non-empty title/body — the off-by-one-prone
// piece of logic final-review I9 asked to be covered directly.
describe('buildPanelData', () => {
  it('never throws and always returns a non-empty title/body on the map screen', () => {
    for (const done of [new Set<number>(), new Set(AREAS.map((a) => a.id))]) {
      const data = buildPanelData({ area: null, step: 0 }, done);
      expect(data.title.length).toBeGreaterThan(0);
      expect(data.body.length).toBeGreaterThan(0);
      expect(data.body.every((p) => p.length > 0)).toBe(true);
    }
  });

  it('never throws and always returns a non-empty title/body for every step of every area', () => {
    for (const area of AREAS) {
      for (let step = 0; step < area.steps; step++) {
        for (const done of [new Set<number>(), new Set([area.id])]) {
          const data = buildPanelData({ area: area.id, step }, done);
          expect(data.title.length).toBeGreaterThan(0);
          expect(data.body.length).toBeGreaterThan(0);
          expect(data.body.every((p) => p.length > 0)).toBe(true);
        }
      }
    }
  });

  it('total number of (area, step) pairs walked matches totalSteps(AREAS)', () => {
    const count = AREAS.reduce((sum, a) => sum + a.steps, 0);
    expect(count).toBe(totalSteps(AREAS));
  });

  it('adds a link to the hire area contact-card steps (final-review I2)', () => {
    const hire = AREAS.find((a) => a.key === 'hire')!;
    for (let step = 1; step <= hire.itemCount; step++) {
      const data = buildPanelData({ area: hire.id, step }, new Set());
      expect(data.link).toBeDefined();
      expect(data.link!.href.length).toBeGreaterThan(0);
      expect(data.link!.label.length).toBeGreaterThan(0);
    }
  });

  it('does not add a link to the hire area closing "line clear" step', () => {
    const hire = AREAS.find((a) => a.key === 'hire')!;
    const data = buildPanelData({ area: hire.id, step: hire.steps - 1 }, new Set());
    expect(data.link).toBeUndefined();
  });
});
