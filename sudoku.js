/* ── Sudoku: generator, solver, flip-card UI ──────────────────────────────
   Every puzzle is generated fresh with Math.random() at the moment the
   card is first flipped — nothing is seeded by user, date, or session, and
   nothing is persisted. That alone guarantees two different visitors (or
   the same visitor on two different days) never see the same puzzle. */
'use strict';

const boxOf = (r, c) => Math.floor(r / 3) * 3 + Math.floor(c / 3);

function shuffledDigits() {
  const a = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Randomized backtracking fill of an empty 9x9 -> one valid solved grid. */
function generateSolved() {
  const grid = new Array(81).fill(0);
  const rowMask = new Array(9).fill(0), colMask = new Array(9).fill(0), boxMask = new Array(9).fill(0);

  function place(pos) {
    if (pos === 81) return true;
    const r = (pos / 9) | 0, c = pos % 9, b = boxOf(r, c);
    for (const d of shuffledDigits()) {
      const bit = 1 << d;
      if (rowMask[r] & bit || colMask[c] & bit || boxMask[b] & bit) continue;
      grid[pos] = d;
      rowMask[r] |= bit; colMask[c] |= bit; boxMask[b] |= bit;
      if (place(pos + 1)) return true;
      grid[pos] = 0;
      rowMask[r] &= ~bit; colMask[c] &= ~bit; boxMask[b] &= ~bit;
    }
    return false;
  }
  place(0);
  return grid;
}

/** Counts solutions up to `cap` (stops early) using an MRV backtracking solver. */
function countSolutions(startGrid, cap) {
  const g = startGrid.slice();
  const rowMask = new Array(9).fill(0), colMask = new Array(9).fill(0), boxMask = new Array(9).fill(0);
  for (let i = 0; i < 81; i++) {
    if (!g[i]) continue;
    const r = (i / 9) | 0, c = i % 9, b = boxOf(r, c), bit = 1 << g[i];
    rowMask[r] |= bit; colMask[c] |= bit; boxMask[b] |= bit;
  }
  let count = 0;

  function candidatesOf(pos) {
    const r = (pos / 9) | 0, c = pos % 9, b = boxOf(r, c);
    const used = rowMask[r] | colMask[c] | boxMask[b];
    const list = [];
    for (let d = 1; d <= 9; d++) if (!(used & (1 << d))) list.push(d);
    return list;
  }

  function solve() {
    if (count >= cap) return;
    let best = -1, bestCands = null;
    for (let i = 0; i < 81; i++) {
      if (g[i]) continue;
      const cands = candidatesOf(i);
      if (cands.length === 0) { best = i; bestCands = cands; break; }
      if (!bestCands || cands.length < bestCands.length) { best = i; bestCands = cands; }
    }
    if (best === -1) { count++; return; }
    if (bestCands.length === 0) return;
    const r = (best / 9) | 0, c = best % 9, b = boxOf(r, c);
    for (const d of bestCands) {
      if (count >= cap) return;
      const bit = 1 << d;
      g[best] = d;
      rowMask[r] |= bit; colMask[c] |= bit; boxMask[b] |= bit;
      solve();
      g[best] = 0;
      rowMask[r] &= ~bit; colMask[c] &= ~bit; boxMask[b] &= ~bit;
    }
  }
  solve();
  return count;
}

/** Pokes holes into a solved grid, one at a time in random order, keeping
    each removal only if the puzzle still has exactly one solution. Stops
    once `clueTarget` is reached or no further safe removal exists. */
function makePuzzle(clueTarget) {
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

if (typeof module !== 'undefined') module.exports = { generateSolved, countSolutions, makePuzzle };

/* ── Flip-card UI ──────────────────────────────────────────────────────── */
if (typeof document !== 'undefined') {
  const LEVEL_CLUES = { 1: 38, 2: 30, 3: 24 };

  const flipCard = document.getElementById('flip-card');
  const flipBtn = document.getElementById('flip-btn');
  const frontFace = flipCard.querySelector('.flip-front');
  const backFace = flipCard.querySelector('.flip-back');
  const gridEl = document.getElementById('sudoku-grid');
  const timerEl = document.getElementById('sudoku-timer');
  const msgEl = document.getElementById('sudoku-msg');
  const levelButtons = document.querySelectorAll('#sudoku [data-level]');
  const checkBtn = document.getElementById('sudoku-check');
  const resetBtn = document.getElementById('sudoku-reset');

  let currentLevel = 1;
  let solution = null;
  let givens = null; // boolean[81]: true = clue, false = editable
  let timerInterval = null;
  let startTime = 0;
  let solved = false;
  let flipped = false;
  let initialized = false;

  function updateTimerDisplay() {
    const s = Math.floor((Date.now() - startTime) / 1000);
    const mm = String((s / 60) | 0).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    timerEl.textContent = `${mm}:${ss}`;
  }

  function renderGrid(values) {
    gridEl.innerHTML = '';
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const i = r * 9 + c;
        const cell = document.createElement('div');
        cell.className = 'sudoku-cell';
        if (c % 3 === 2 && c !== 8) cell.classList.add('b-right');
        if (r % 3 === 2 && r !== 8) cell.classList.add('b-bottom');
        if (givens[i]) {
          cell.classList.add('given');
          cell.textContent = values[i];
        } else {
          const input = document.createElement('input');
          input.type = 'text';
          input.inputMode = 'numeric';
          input.maxLength = 1;
          input.autocomplete = 'off';
          input.dataset.index = String(i);
          input.value = values[i] ? String(values[i]) : '';
          input.addEventListener('input', onCellInput);
          cell.appendChild(input);
        }
        gridEl.appendChild(cell);
      }
    }
  }

  function onCellInput(e) {
    const v = e.target.value.replace(/[^1-9]/g, '');
    e.target.value = v.slice(-1);
    e.target.closest('.sudoku-cell').classList.remove('correct', 'wrong');
    msgEl.textContent = '';
    maybeAutoCelebrate();
  }

  function maybeAutoCelebrate() {
    const inputs = gridEl.querySelectorAll('input');
    for (const input of inputs) {
      const i = Number(input.dataset.index);
      if (!input.value || Number(input.value) !== solution[i]) return;
    }
    celebrate();
  }

  function celebrate() {
    if (solved) return;
    solved = true;
    clearInterval(timerInterval);
    gridEl.querySelectorAll('.sudoku-cell').forEach((c) => c.classList.add('correct'));
    msgEl.textContent = `🎉 Solved in ${timerEl.textContent}!`;
  }

  function checkPuzzle() {
    if (solved) return;
    const inputs = gridEl.querySelectorAll('input');
    let allFilled = true, allCorrect = true;
    inputs.forEach((input) => {
      const i = Number(input.dataset.index);
      const cellEl = input.closest('.sudoku-cell');
      cellEl.classList.remove('correct', 'wrong');
      if (!input.value) { allFilled = false; return; }
      if (Number(input.value) === solution[i]) cellEl.classList.add('correct');
      else { cellEl.classList.add('wrong'); allCorrect = false; }
    });
    if (allFilled && allCorrect) celebrate();
    else msgEl.textContent = allFilled ? 'Not quite — the highlighted cells are off.' : 'Fill every cell, then check again.';
  }

  function startPuzzle(level) {
    currentLevel = level;
    clearInterval(timerInterval);
    const { puzzle, solution: sol } = makePuzzle(LEVEL_CLUES[level]);
    solution = sol;
    givens = puzzle.map((v) => v !== 0);
    solved = false;
    msgEl.textContent = '';
    renderGrid(puzzle);
    startTime = Date.now();
    updateTimerDisplay();
    timerInterval = setInterval(updateTimerDisplay, 1000);
  }

  function resetPuzzle() {
    if (!solution) return;
    clearInterval(timerInterval);
    solved = false;
    msgEl.textContent = '';
    // a given cell's value is by definition its solution value, so the
    // original puzzle can be rebuilt exactly from solution + givens alone
    renderGrid(solution.map((v, i) => (givens[i] ? v : 0)));
    startTime = Date.now();
    updateTimerDisplay();
    timerInterval = setInterval(updateTimerDisplay, 1000);
  }

  levelButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      levelButtons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      startPuzzle(Number(btn.dataset.level));
    });
  });
  checkBtn.addEventListener('click', checkPuzzle);
  resetBtn.addEventListener('click', resetPuzzle);

  function setFlipped(v) {
    flipped = v;
    flipCard.classList.toggle('flipped', v);
    frontFace.toggleAttribute('inert', v);
    backFace.toggleAttribute('inert', !v);
    flipBtn.setAttribute('aria-label', v ? 'Flip back to globe' : 'Flip for a Sudoku game');
    // generation only happens the first time someone actually flips the
    // card, so visitors who never touch it never pay for it
    if (v && !initialized) { initialized = true; startPuzzle(currentLevel); }
  }
  flipBtn.addEventListener('click', () => setFlipped(!flipped));

  // minimal hook for automated testing only — reads state, changes nothing
  window.__sudoku = { getSolution: () => solution, isSolved: () => solved };
}
