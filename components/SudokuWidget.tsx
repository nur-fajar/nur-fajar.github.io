'use client';

import { useEffect, useRef, useState } from 'react';
import { makePuzzle } from '@/lib/sudoku';

// level N leaves N*9 cells empty (9 / 18 / 27), so clues = 81 - empty
const LEVEL_CLUES: Record<number, number> = { 1: 72, 2: 63, 3: 54 };

type CellState = '' | 'correct' | 'wrong';

function formatTime(totalSeconds: number) {
  const mm = String((totalSeconds / 60) | 0).padStart(2, '0');
  const ss = String(totalSeconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

export default function SudokuWidget() {
  const [level, setLevel] = useState(1);
  const [solution, setSolution] = useState<number[]>([]);
  const [givens, setGivens] = useState<boolean[]>([]);
  const [values, setValues] = useState<number[]>([]);
  const [cellState, setCellState] = useState<CellState[]>([]);
  const [solved, setSolved] = useState(false);
  const [msg, setMsg] = useState('');
  const [elapsed, setElapsed] = useState(0);
  // Real value is set by startPuzzle()/resetPuzzle() before the timer effect
  // ever reads it — 0 here is just a pure placeholder for the first render.
  const startRef = useRef(0);

  function startPuzzle(n: number) {
    const { puzzle, solution: sol } = makePuzzle(LEVEL_CLUES[n]);
    setLevel(n);
    setSolution(sol);
    setGivens(puzzle.map((v) => v !== 0));
    setValues(puzzle.slice());
    setCellState(Array(81).fill(''));
    setSolved(false);
    setMsg('');
    startRef.current = Date.now();
    setElapsed(0);
  }

  function resetPuzzle() {
    if (!solution.length) return;
    setSolved(false);
    setMsg('');
    // a given cell's value is by definition its solution value, so the
    // original puzzle can be rebuilt exactly from solution + givens alone
    setValues(solution.map((v, i) => (givens[i] ? v : 0)));
    setCellState(Array(81).fill(''));
    startRef.current = Date.now();
    setElapsed(0);
  }

  function celebrate() {
    setSolved(true);
    setCellState(Array(81).fill('correct'));
    setMsg(`🎉 Solved in ${formatTime(elapsed)}!`);
  }

  function checkPuzzle() {
    if (solved) return;
    let allFilled = true;
    let allCorrect = true;
    const next: CellState[] = Array(81).fill('');
    for (let i = 0; i < 81; i++) {
      if (!values[i]) {
        allFilled = false;
        continue;
      }
      if (values[i] === solution[i]) next[i] = 'correct';
      else {
        next[i] = 'wrong';
        allCorrect = false;
      }
    }
    setCellState(next);
    if (allFilled && allCorrect) celebrate();
    else setMsg(allFilled ? 'Not quite — the highlighted cells are off.' : 'Fill every cell, then check again.');
  }

  function onCellInput(i: number, raw: string) {
    const digit = raw.replace(/[^1-9]/g, '').slice(-1);
    setValues((prev) => {
      const next = prev.slice();
      next[i] = digit ? Number(digit) : 0;
      return next;
    });
    setCellState((prev) => {
      if (!prev[i]) return prev;
      const next = prev.slice();
      next[i] = '';
      return next;
    });
    setMsg('');
  }

  // Generation only happens once, on mount — i.e. the first time the flip
  // card activates this page, since FlipCard doesn't render this component
  // before then. Visitors who never flip to it never pay for it. This has
  // to be an effect: makePuzzle() is a randomized backtracking search, not
  // something render can compute (or should re-compute on every re-render).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    startPuzzle(1);
  }, []);

  useEffect(() => {
    if (solved || !solution.length) return;
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startRef.current) / 1000)), 1000);
    return () => clearInterval(id);
  }, [solved, solution]);

  // Auto-celebrate the moment every cell is filled and correct, without
  // requiring the Check button. This is a real cross-field sync (81 cells
  // vs. one solved flag), not state that render could derive on its own.
  // Deliberately keyed on `values` alone — `solution`/`solved` only change
  // together with a fresh `values` array (new puzzle, or the solved-flip
  // this effect itself causes), and `celebrate` is intentionally excluded
  // since it's a plain function redefined every render, not a real input.
  useEffect(() => {
    if (solved || values.length !== 81) return;
    for (let i = 0; i < 81; i++) {
      if (!values[i] || values[i] !== solution[i]) return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    celebrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  return (
    <div className="sudoku" id="sudoku">
      <div className="sudoku-head">
        <div className="sudoku-levels mono" role="group" aria-label="Sudoku difficulty">
          {[1, 2, 3].map((n) => (
            <button key={n} type="button" data-level={n} aria-pressed={level === n} onClick={() => startPuzzle(n)}>
              {n}
            </button>
          ))}
        </div>
        <span className="sudoku-timer mono">{formatTime(elapsed)}</span>
      </div>
      <div className="sudoku-grid" id="sudoku-grid">
        {values.map((v, i) => {
          const r = (i / 9) | 0;
          const c = i % 9;
          const classes = ['sudoku-cell'];
          if (c % 3 === 2 && c !== 8) classes.push('b-right');
          if (r % 3 === 2 && r !== 8) classes.push('b-bottom');
          if (givens[i]) classes.push('given');
          if (cellState[i]) classes.push(cellState[i]);
          return (
            <div key={i} className={classes.join(' ')}>
              {givens[i] ? (
                v
              ) : (
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  autoComplete="off"
                  value={v ? String(v) : ''}
                  onChange={(e) => onCellInput(i, e.target.value)}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="sudoku-actions mono">
        <button type="button" id="sudoku-check" onClick={checkPuzzle}>
          Check
        </button>
        <button type="button" id="sudoku-reset" onClick={resetPuzzle}>
          Reset
        </button>
      </div>
      <p className="sudoku-msg mono" aria-live="polite">
        {msg}
      </p>
    </div>
  );
}
