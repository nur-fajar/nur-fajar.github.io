import { describe, expect, it } from 'vitest';
import {
  advanceCursor,
  buildAreas,
  globalStep,
  nextUndoneArea,
  totalSteps,
  type AreaBlueprint,
} from './gameState';

// Trois zones minimalistes : une "platformer" à 2 items (steps = 1 + 2*2 = 5),
// une "hire"-like à 3 items (steps = 1 + 3 + 1 = 5, règle spéciale "hire"),
// et une "puzzle" à 1 item (steps = 1 + 1*2 = 3).
const BLUEPRINTS: AreaBlueprint[] = [
  { id: 0, key: 'org', name: 'A', sectionLabel: 'A', genre: 'platformer', color: '#000', mapPos: [0, 0], icon: 'camp', intro: '', itemCount: 2 },
  { id: 1, key: 'hire', name: 'B', sectionLabel: 'B', genre: 'tetris', color: '#000', mapPos: [0, 0], icon: 'light', intro: '', itemCount: 3 },
  { id: 2, key: 'skill', name: 'C', sectionLabel: 'C', genre: 'puzzle', color: '#000', mapPos: [0, 0], icon: 'temple', intro: '', itemCount: 1 },
];

describe('buildAreas', () => {
  it('computes steps as 1 + items*2 for non-hire genres', () => {
    const areas = buildAreas(BLUEPRINTS);
    expect(areas[0].steps).toBe(5); // org, 2 items
    expect(areas[2].steps).toBe(3); // skill, 1 item
  });

  it('computes steps as 1 + items + 1 for the hire genre', () => {
    const areas = buildAreas(BLUEPRINTS);
    expect(areas[1].steps).toBe(5); // hire, 3 items -> 1+3+1
  });
});

describe('totalSteps', () => {
  it('sums every area step count', () => {
    const areas = buildAreas(BLUEPRINTS);
    expect(totalSteps(areas)).toBe(5 + 5 + 3);
  });
});

describe('globalStep', () => {
  it('is 0 when no area is entered', () => {
    const areas = buildAreas(BLUEPRINTS);
    expect(globalStep({ area: null, step: 0 }, areas)).toBe(0);
  });

  it('offsets by the steps of all prior areas, plus 1-indexed current step', () => {
    const areas = buildAreas(BLUEPRINTS);
    expect(globalStep({ area: 1, step: 0 }, areas)).toBe(5 + 1); // areas[0].steps + step 0 + 1
    expect(globalStep({ area: 2, step: 2 }, areas)).toBe(5 + 5 + 2 + 1);
  });
});

describe('advanceCursor', () => {
  it('leaves the cursor untouched when no area is entered (map navigation is external)', () => {
    const areas = buildAreas(BLUEPRINTS);
    const result = advanceCursor({ area: null, step: 0 }, areas, 1);
    expect(result).toEqual({ cursor: { area: null, step: 0 }, leftArea: false, completedAreaId: null });
  });

  it('moves forward within an area', () => {
    const areas = buildAreas(BLUEPRINTS);
    const result = advanceCursor({ area: 0, step: 1 }, areas, 1);
    expect(result).toEqual({ cursor: { area: 0, step: 2 }, leftArea: false, completedAreaId: null });
  });

  it('returns to the map without completion when stepping below 0', () => {
    const areas = buildAreas(BLUEPRINTS);
    const result = advanceCursor({ area: 0, step: 0 }, areas, -1);
    expect(result).toEqual({ cursor: { area: null, step: 0 }, leftArea: true, completedAreaId: null });
  });

  it('completes the area and returns to the map when stepping past the last step', () => {
    const areas = buildAreas(BLUEPRINTS);
    const last = areas[0].steps - 1;
    const result = advanceCursor({ area: 0, step: last }, areas, 1);
    expect(result).toEqual({ cursor: { area: null, step: 0 }, leftArea: true, completedAreaId: 0 });
  });
});

describe('nextUndoneArea', () => {
  it('returns the first area id not in the done set', () => {
    const areas = buildAreas(BLUEPRINTS);
    expect(nextUndoneArea(areas, new Set([0]))).toBe(1);
  });

  it('returns null once every area is done', () => {
    const areas = buildAreas(BLUEPRINTS);
    expect(nextUndoneArea(areas, new Set([0, 1, 2]))).toBeNull();
  });
});
