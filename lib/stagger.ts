// Pure helpers behind the staggered reference-card stack (see
// components/ReferencesCarousel.tsx). Kept framework-free so the rotation
// and layout math can be unit-tested without touching React or the DOM.

/** One list item plus a React key. Rotating the list only mints a fresh key
 * for the item that wraps around — see rotateSlots. */
export interface Slot<T> {
  key: number;
  value: T;
}

export function toSlots<T>(values: T[], newKey: () => number): Slot<T>[] {
  return values.map((value) => ({ key: newKey(), value }));
}

/** Shifts the list by `steps` (front→back for positive, back→front for
 * negative), same as the array a stagger-card carousel cycles through on
 * click/arrow. The item that wraps around gets a fresh key from `newKey`
 * so React remounts it instead of animating it across the full stack. */
export function rotateSlots<T>(slots: Slot<T>[], steps: number, newKey: () => number): Slot<T>[] {
  const next = [...slots];
  if (steps > 0) {
    for (let i = steps; i > 0; i--) {
      const item = next.shift();
      if (!item) return slots;
      next.push({ key: newKey(), value: item.value });
    }
  } else if (steps < 0) {
    for (let i = steps; i < 0; i++) {
      const item = next.pop();
      if (!item) return slots;
      next.unshift({ key: newKey(), value: item.value });
    }
  }
  return next;
}

/** Offset of `index` from the stack's centre card (position 0 = active,
 * negative = to the left, positive = to the right). Deliberately not the
 * `index - (length + 1) / 2` split the source component uses for odd
 * lengths — that puts the active card one slot right of the true middle
 * and leaves the stack lopsided (e.g. length 5 gives -3..1). Flooring
 * instead keeps any length symmetric while still matching the source
 * formula for even lengths (its only tested case). */
export function centeredPosition(index: number, length: number): number {
  return index - Math.floor(length / 2);
}
