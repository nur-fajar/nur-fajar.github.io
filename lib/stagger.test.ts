import { describe, expect, it } from 'vitest';
import { centeredPosition, rotateSlots, toSlots } from './stagger';

describe('centeredPosition', () => {
  it('centers an odd-length list symmetrically', () => {
    expect([0, 1, 2, 3, 4].map((i) => centeredPosition(i, 5))).toEqual([-2, -1, 0, 1, 2]);
  });

  it('matches the split the effect relies on for even lengths', () => {
    expect([0, 1, 2, 3].map((i) => centeredPosition(i, 4))).toEqual([-2, -1, 0, 1]);
  });
});

describe('rotateSlots', () => {
  it('moves the front item to the back on a forward step, with a fresh key', () => {
    let key = 100;
    const slots = rotateSlots(toSlots(['a', 'b', 'c'], () => key++), 1, () => key++);
    expect(slots.map((s) => s.value)).toEqual(['b', 'c', 'a']);
    expect(slots[2].key).toBe(103);
  });

  it('moves the back item to the front on a backward step, with a fresh key', () => {
    let key = 100;
    const slots = rotateSlots(toSlots(['a', 'b', 'c'], () => key++), -1, () => key++);
    expect(slots.map((s) => s.value)).toEqual(['c', 'a', 'b']);
    expect(slots[0].key).toBe(103);
  });

  it('is a no-op for zero steps', () => {
    let key = 0;
    const original = toSlots(['a', 'b'], () => key++);
    expect(rotateSlots(original, 0, () => 999)).toEqual(original);
  });

  it('wraps by more than one step in a single call', () => {
    let key = 0;
    const slots = rotateSlots(toSlots(['a', 'b', 'c', 'd'], () => key++), 2, () => key++);
    expect(slots.map((s) => s.value)).toEqual(['c', 'd', 'a', 'b']);
  });
});
