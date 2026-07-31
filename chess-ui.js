/* ── Chess flip-card page: board render, click-to-move UI, level switcher ──
   Level 1 is a scripted "3 moves left" puzzle — verified in
   chess-engine.test.js to be a genuine forced mate in 2 (Qb6+ Ka8 Qb7#).
   Level 2 is a full game against the same engine's shallow AI from the
   standard starting position. The player is always White. */
'use strict';

if (typeof document !== 'undefined') {
  const E = window.ChessEngine;

  const WHITE_GLYPHS = { K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙' };
  const BLACK_GLYPHS = { K: '♚', Q: '♛', R: '♜', B: '♝', N: '♞', P: '♟' };
  const glyphOf = (p) => (E.isWhitePiece(p) ? WHITE_GLYPHS[p] : BLACK_GLYPHS[p.toUpperCase()]);

  function puzzleBoard() {
    const b = Array.from({ length: 8 }, () => Array(8).fill(''));
    b[2][2] = 'K'; // c6
    b[7][1] = 'Q'; // b1
    b[1][0] = 'k'; // a7
    return b;
  }

  const boardEl = document.getElementById('chess-board');
  const statusEl = document.getElementById('chess-status');
  const msgEl = document.getElementById('chess-msg');
  const levelButtons = document.querySelectorAll('#chess [data-clevel]');
  const resetBtn = document.getElementById('chess-reset');

  let board = null;
  let level = 1;
  let selected = null;      // [r, c] or null
  let legalForSelected = []; // moves available from `selected`
  let gameOver = false;
  let aiThinking = false;
  let initialized = false;

  function kingSquare(b, white) {
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) if (b[r][c] === (white ? 'K' : 'k')) return [r, c];
    return null;
  }

  function render() {
    boardEl.innerHTML = '';
    const inCheckKing = E.isInCheck(board, true) ? kingSquare(board, true) : null;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'chess-cell ' + ((r + c) % 2 === 0 ? 'light' : 'dark');
        cell.disabled = gameOver || aiThinking;
        if (selected && selected[0] === r && selected[1] === c) cell.classList.add('selected');
        if (inCheckKing && inCheckKing[0] === r && inCheckKing[1] === c) cell.classList.add('in-check');
        const hint = legalForSelected.find((m) => m.to[0] === r && m.to[1] === c);
        if (hint) cell.classList.add(board[r][c] ? 'capture-hint' : 'move-hint');
        const piece = board[r][c];
        if (piece) {
          cell.textContent = glyphOf(piece);
          cell.classList.add(E.isWhitePiece(piece) ? 'white-piece' : 'black-piece');
        }
        cell.addEventListener('click', () => onSquareClick(r, c));
        boardEl.appendChild(cell);
      }
    }
  }

  function onSquareClick(r, c) {
    if (gameOver || aiThinking) return;
    const hit = legalForSelected.find((m) => m.to[0] === r && m.to[1] === c);
    if (hit) { makeMove(hit); return; }
    const piece = board[r][c];
    if (piece && E.isWhitePiece(piece)) {
      selected = [r, c];
      legalForSelected = E.legalMoves(board, true).filter((m) => m.from[0] === r && m.from[1] === c);
    } else {
      selected = null;
      legalForSelected = [];
    }
    render();
  }

  function makeMove(move) {
    board = E.applyMove(board, move);
    selected = null;
    legalForSelected = [];
    render();
    const status = E.gameStatus(board, false); // Black to reply
    if (status === 'checkmate') {
      gameOver = true;
      statusEl.textContent = 'Checkmate';
      msgEl.textContent = '🎉 Checkmate — you win!';
      return;
    }
    if (status === 'stalemate') {
      gameOver = true;
      statusEl.textContent = 'Stalemate';
      msgEl.textContent = 'Stalemate — a draw.';
      return;
    }
    statusEl.textContent = 'AI is thinking…';
    aiThinking = true;
    render();
    setTimeout(aiTurn, 450);
  }

  function aiTurn() {
    const move = E.chooseAIMove(board, false, 2);
    aiThinking = false;
    if (!move) { render(); return; } // shouldn't happen — status was checked before scheduling
    board = E.applyMove(board, move);
    render();
    const status = E.gameStatus(board, true);
    if (status === 'checkmate') {
      gameOver = true;
      statusEl.textContent = 'Checkmate';
      msgEl.textContent = 'Checkmate — the AI wins. Reset to try again.';
    } else if (status === 'stalemate') {
      gameOver = true;
      statusEl.textContent = 'Stalemate';
      msgEl.textContent = 'Stalemate — a draw.';
    } else {
      statusEl.textContent = status === 'check' ? 'Check! Your move' : 'Your move';
    }
  }

  function startLevel(n) {
    level = n;
    board = n === 1 ? puzzleBoard() : E.cloneBoard(E.START);
    selected = null;
    legalForSelected = [];
    gameOver = false;
    aiThinking = false;
    statusEl.textContent = n === 1 ? '3 moves from a win — your move' : 'Your move';
    msgEl.textContent = '';
    render();
  }

  levelButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      levelButtons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      startLevel(Number(btn.dataset.clevel));
    });
  });
  resetBtn.addEventListener('click', () => startLevel(level));

  // lazy init on first activation, same pattern as the Sudoku page
  window.initChessPage = function initChessPage() {
    if (initialized) return;
    initialized = true;
    startLevel(1);
  };
}
