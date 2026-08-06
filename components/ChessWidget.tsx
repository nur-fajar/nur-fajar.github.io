'use client';

/* ── Chess flip-card page: board render, click-to-move UI, level switcher ──
   Level 1 is a scripted "3 moves left" puzzle — verified in
   chess-engine.test.ts to be a genuine forced mate in 2 (Qb6+ Ka8 Qb7#).
   Level 2 is a full game against the same engine's shallow AI from the
   standard starting position. The player is always White. */

import { useCallback, useState } from 'react';
import * as E from '@/lib/chess-engine';
import type { Board, Move, Piece, Square } from '@/lib/chess-engine';

const WHITE_GLYPHS: Record<string, string> = { K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙' };
const BLACK_GLYPHS: Record<string, string> = { K: '♚', Q: '♛', R: '♜', B: '♝', N: '♞', P: '♟' };
const glyphOf = (p: Piece) => (E.isWhitePiece(p) ? WHITE_GLYPHS[p] : BLACK_GLYPHS[p.toUpperCase()]);

function puzzleBoard(): Board {
  const b = Array.from({ length: 8 }, () => Array(8).fill('')) as Board;
  b[2][2] = 'K'; // c6
  b[7][1] = 'Q'; // b1
  b[1][0] = 'k'; // a7
  return b;
}

function kingSquare(b: Board, white: boolean): Square | null {
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) if (b[r][c] === (white ? 'K' : 'k')) return [r, c];
  return null;
}

export default function ChessWidget() {
  const [level, setLevel] = useState(1);
  const [board, setBoard] = useState<Board>(puzzleBoard);
  const [selected, setSelected] = useState<Square | null>(null);
  const [legalForSelected, setLegalForSelected] = useState<Move[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [status, setStatus] = useState('3 moves from a win — your move');
  const [msg, setMsg] = useState('');

  const startLevel = useCallback((n: number) => {
    setLevel(n);
    setBoard(n === 1 ? puzzleBoard() : E.cloneBoard(E.START));
    setSelected(null);
    setLegalForSelected([]);
    setGameOver(false);
    setAiThinking(false);
    setStatus(n === 1 ? '3 moves from a win — your move' : 'Your move');
    setMsg('');
  }, []);

  function aiTurn(afterPlayerMove: Board) {
    const move = E.chooseAIMove(afterPlayerMove, false, 2);
    setAiThinking(false);
    if (!move) return; // shouldn't happen — status was checked before scheduling
    const nb = E.applyMove(afterPlayerMove, move);
    setBoard(nb);
    const s = E.gameStatus(nb, true);
    if (s === 'checkmate') {
      setGameOver(true);
      setStatus('Checkmate');
      setMsg('Checkmate — the AI wins. Reset to try again.');
    } else if (s === 'stalemate') {
      setGameOver(true);
      setStatus('Stalemate');
      setMsg('Stalemate — a draw.');
    } else {
      setStatus(s === 'check' ? 'Check! Your move' : 'Your move');
    }
  }

  function makeMove(move: Move) {
    const nb = E.applyMove(board, move);
    setBoard(nb);
    setSelected(null);
    setLegalForSelected([]);
    const s = E.gameStatus(nb, false); // Black to reply
    if (s === 'checkmate') {
      setGameOver(true);
      setStatus('Checkmate');
      setMsg('🎉 Checkmate — you win!');
      return;
    }
    if (s === 'stalemate') {
      setGameOver(true);
      setStatus('Stalemate');
      setMsg('Stalemate — a draw.');
      return;
    }
    setStatus('AI is thinking…');
    setAiThinking(true);
    setTimeout(() => aiTurn(nb), 450);
  }

  function onSquareClick(r: number, c: number) {
    if (gameOver || aiThinking) return;
    const hit = legalForSelected.find((m) => m.to[0] === r && m.to[1] === c);
    if (hit) {
      makeMove(hit);
      return;
    }
    const piece = board[r][c];
    if (piece && E.isWhitePiece(piece)) {
      setSelected([r, c]);
      setLegalForSelected(E.legalMoves(board, true).filter((m) => m.from[0] === r && m.from[1] === c));
    } else {
      setSelected(null);
      setLegalForSelected([]);
    }
  }

  const inCheckKing = E.isInCheck(board, true) ? kingSquare(board, true) : null;

  return (
    <div className="chess" id="chess">
      <div className="chess-head">
        <div className="chess-levels mono" role="group" aria-label="Chess level">
          <button
            type="button"
            data-clevel="1"
            aria-pressed={level === 1}
            title="Mate in 2 — a scripted 3-move win"
            onClick={() => startLevel(1)}
          >
            1
          </button>
          <button
            type="button"
            data-clevel="2"
            aria-pressed={level === 2}
            title="Full game from the start"
            onClick={() => startLevel(2)}
          >
            2
          </button>
        </div>
        <span className="chess-status mono">{status}</span>
      </div>
      <div className="chess-board" id="chess-board">
        {board.map((row, r) =>
          row.map((piece, c) => {
            const isSelected = selected?.[0] === r && selected?.[1] === c;
            const inCheck = inCheckKing?.[0] === r && inCheckKing?.[1] === c;
            const hint = legalForSelected.find((m) => m.to[0] === r && m.to[1] === c);
            const classes = ['chess-cell', (r + c) % 2 === 0 ? 'light' : 'dark'];
            if (isSelected) classes.push('selected');
            if (inCheck) classes.push('in-check');
            if (hint) classes.push(piece ? 'capture-hint' : 'move-hint');
            if (piece) classes.push(E.isWhitePiece(piece) ? 'white-piece' : 'black-piece');
            return (
              <button
                key={`${r}-${c}`}
                type="button"
                className={classes.join(' ')}
                disabled={gameOver || aiThinking}
                onClick={() => onSquareClick(r, c)}
              >
                {piece ? glyphOf(piece) : ''}
              </button>
            );
          }),
        )}
      </div>
      <div className="chess-actions mono">
        <button type="button" onClick={() => startLevel(level)}>
          Reset
        </button>
      </div>
      <p className="chess-msg mono" aria-live="polite">
        {msg}
      </p>
    </div>
  );
}
