/* ── Sudoku: generator + solver ────────────────────────────────────────────
   Every puzzle is generated fresh with Math.random() at the moment the
   widget mounts (i.e. the first time the flip-card page is activated) —
   nothing is seeded by user, date, or session, and nothing is persisted.
   That alone guarantees two different visitors (or the same visitor on two
   different days) never see the same puzzle. */

const boxOf = (r: number, c: number) => Math.floor(r / 3) * 3 + Math.floor(c / 3);

function shuffledDigits(): number[] {
  const a = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Randomized backtracking fill of an empty 9x9 -> one valid solved grid. */
export function generateSolved(): number[] {
  const grid = new Array(81).fill(0);
  const rowMask = new Array(9).fill(0);
  const colMask = new Array(9).fill(0);
  const boxMask = new Array(9).fill(0);

  function place(pos: number): boolean {
    if (pos === 81) return true;
    const r = (pos / 9) | 0;
    const c = pos % 9;
    const b = boxOf(r, c);
    for (const d of shuffledDigits()) {
      const bit = 1 << d;
      if (rowMask[r] & bit || colMask[c] & bit || boxMask[b] & bit) continue;
      grid[pos] = d;
      rowMask[r] |= bit;
      colMask[c] |= bit;
      boxMask[b] |= bit;
      if (place(pos + 1)) return true;
      grid[pos] = 0;
      rowMask[r] &= ~bit;
      colMask[c] &= ~bit;
      boxMask[b] &= ~bit;
    }
    return false;
  }
  place(0);
  return grid;
}

/** Counts solutions up to `cap` (stops early) using an MRV backtracking solver. */
export function countSolutions(startGrid: number[], cap: number): number {
  const g = startGrid.slice();
  const rowMask = new Array(9).fill(0);
  const colMask = new Array(9).fill(0);
  const boxMask = new Array(9).fill(0);
  for (let i = 0; i < 81; i++) {
    if (!g[i]) continue;
    const r = (i / 9) | 0;
    const c = i % 9;
    const b = boxOf(r, c);
    const bit = 1 << g[i];
    rowMask[r] |= bit;
    colMask[c] |= bit;
    boxMask[b] |= bit;
  }
  let count = 0;

  function candidatesOf(pos: number): number[] {
    const r = (pos / 9) | 0;
    const c = pos % 9;
    const b = boxOf(r, c);
    const used = rowMask[r] | colMask[c] | boxMask[b];
    const list: number[] = [];
    for (let d = 1; d <= 9; d++) if (!(used & (1 << d))) list.push(d);
    return list;
  }

  function solve() {
    if (count >= cap) return;
    let best = -1;
    let bestCands: number[] | null = null;
    for (let i = 0; i < 81; i++) {
      if (g[i]) continue;
      const cands = candidatesOf(i);
      if (cands.length === 0) {
        best = i;
        bestCands = cands;
        break;
      }
      if (!bestCands || cands.length < bestCands.length) {
        best = i;
        bestCands = cands;
      }
    }
    if (best === -1) {
      count++;
      return;
    }
    if (!bestCands || bestCands.length === 0) return;
    const r = (best / 9) | 0;
    const c = best % 9;
    const b = boxOf(r, c);
    for (const d of bestCands) {
      if (count >= cap) return;
      const bit = 1 << d;
      g[best] = d;
      rowMask[r] |= bit;
      colMask[c] |= bit;
      boxMask[b] |= bit;
      solve();
      g[best] = 0;
      rowMask[r] &= ~bit;
      colMask[c] &= ~bit;
      boxMask[b] &= ~bit;
    }
  }
  solve();
  return count;
}

export interface Puzzle {
  puzzle: number[];
  solution: number[];
  clues: number;
}

/** Pokes holes into a solved grid, one at a time in random order, keeping
    each removal only if the puzzle still has exactly one solution. Stops
    once `clueTarget` is reached or no further safe removal exists. */
export function makePuzzle(clueTarget: number): Puzzle {
  const solved = generateSolved();
  const puzzle = solved.slice();
  const order = Array.from({ length: 81 }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  let clues = 81;
  for (const pos of order) {
    if (clues <= clueTarget) break;
    const backup = puzzle[pos];
    puzzle[pos] = 0;
    if (countSolutions(puzzle, 2) === 1) clues--;
    else puzzle[pos] = backup;
  }
  return { puzzle, solution: solved, clues };
}
