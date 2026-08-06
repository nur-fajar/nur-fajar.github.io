/* ── Minimal legal chess engine ───────────────────────────────────────────
   Hand-rolled on purpose — this card exists to show what's actually built,
   not to wrap a library. Board is an 8x8 array, row 0 = rank 8 (black back
   rank) down to row 7 = rank 1 (white back rank), matching a top-down
   render with White at the bottom. Pieces: 'KQRBNP' = white, lowercase =
   black, '' = empty.

   ponytail: no castling, no en passant, promotion always auto-queens.
   Correct enough to play a full legal game against; the missing rules are
   the standard corners cut for a compact from-scratch demo engine — upgrade
   path is adding them as extra pseudo-legal move generators. */

export type Piece = '' | 'K' | 'Q' | 'R' | 'B' | 'N' | 'P' | 'k' | 'q' | 'r' | 'b' | 'n' | 'p';
export type Board = Piece[][];
export type Square = [number, number];
export interface Move {
  from: Square;
  to: Square;
}
export type GameStatus = 'ongoing' | 'check' | 'checkmate' | 'stalemate';

export const START: Board = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
];

export const isWhitePiece = (p: Piece) => p !== '' && p === p.toUpperCase();
export const isBlackPiece = (p: Piece) => p !== '' && p === p.toLowerCase();
const inBounds = (r: number, c: number) => r >= 0 && r < 8 && c >= 0 && c < 8;
export const cloneBoard = (b: Board): Board => b.map((row) => row.slice()) as Board;

const SLIDE_DIRS: Record<string, [number, number][]> = {
  B: [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ],
  R: [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ],
  Q: [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ],
};
const KNIGHT_OFFSETS: [number, number][] = [
  [-2, -1],
  [-2, 1],
  [-1, -2],
  [-1, 2],
  [1, -2],
  [1, 2],
  [2, -1],
  [2, 1],
];
const KING_OFFSETS: [number, number][] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, -1],
  [0, 1],
];

/** Pseudo-legal moves for the piece at (r,c) — ignores whether the move
    leaves the mover's own king in check. Used both for move generation
    (then filtered) and for attack-square checks (used as-is). */
export function pieceMoves(board: Board, r: number, c: number): Square[] {
  const p = board[r][c];
  if (!p) return [];
  const white = isWhitePiece(p);
  const kind = p.toUpperCase();
  const moves: Square[] = [];
  const canLand = (tr: number, tc: number) => {
    if (!inBounds(tr, tc)) return false;
    const t = board[tr][tc];
    return t === '' || isWhitePiece(t) !== white;
  };

  if (kind === 'P') {
    const dir = white ? -1 : 1;
    const startRow = white ? 6 : 1;
    if (inBounds(r + dir, c) && board[r + dir][c] === '') {
      moves.push([r + dir, c]);
      if (r === startRow && board[r + 2 * dir][c] === '') moves.push([r + 2 * dir, c]);
    }
    for (const dc of [-1, 1]) {
      const tr = r + dir;
      const tc = c + dc;
      if (inBounds(tr, tc) && board[tr][tc] !== '' && isWhitePiece(board[tr][tc]) !== white) {
        moves.push([tr, tc]);
      }
    }
  } else if (kind === 'N') {
    for (const [dr, dc] of KNIGHT_OFFSETS) if (canLand(r + dr, c + dc)) moves.push([r + dr, c + dc]);
  } else if (kind === 'K') {
    for (const [dr, dc] of KING_OFFSETS) if (canLand(r + dr, c + dc)) moves.push([r + dr, c + dc]);
  } else {
    for (const [dr, dc] of SLIDE_DIRS[kind]) {
      let tr = r + dr;
      let tc = c + dc;
      while (inBounds(tr, tc)) {
        const t = board[tr][tc];
        if (t === '') {
          moves.push([tr, tc]);
        } else {
          if (isWhitePiece(t) !== white) moves.push([tr, tc]);
          break;
        }
        tr += dr;
        tc += dc;
      }
    }
  }
  return moves;
}

/** Pawn attack squares only (diagonals) regardless of occupancy — needed
    for king-safety checks, since a pawn threatens those squares even when
    nothing currently sits on them. */
function pawnAttackSquares(r: number, c: number, white: boolean): Square[] {
  const dir = white ? -1 : 1;
  return ([
    [r + dir, c - 1],
    [r + dir, c + 1],
  ] as Square[]).filter(([tr, tc]) => inBounds(tr, tc));
}

export function isSquareAttacked(board: Board, r: number, c: number, byWhite: boolean): boolean {
  for (let sr = 0; sr < 8; sr++) {
    for (let sc = 0; sc < 8; sc++) {
      const p = board[sr][sc];
      if (!p || isWhitePiece(p) !== byWhite) continue;
      if (p.toUpperCase() === 'P') {
        if (pawnAttackSquares(sr, sc, byWhite).some(([tr, tc]) => tr === r && tc === c)) return true;
      } else if (pieceMoves(board, sr, sc).some(([tr, tc]) => tr === r && tc === c)) {
        return true;
      }
    }
  }
  return false;
}

function findKing(board: Board, white: boolean): Square | null {
  const target = white ? 'K' : 'k';
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) if (board[r][c] === target) return [r, c];
  return null;
}

export function isInCheck(board: Board, white: boolean): boolean {
  const king = findKing(board, white);
  if (!king) return false;
  return isSquareAttacked(board, king[0], king[1], !white);
}

export function applyMove(board: Board, move: Move): Board {
  const nb = cloneBoard(board);
  const { from, to } = move;
  let piece = nb[from[0]][from[1]];
  nb[from[0]][from[1]] = '';
  const promotesRow = isWhitePiece(piece) ? 0 : 7;
  if (piece.toUpperCase() === 'P' && to[0] === promotesRow) {
    piece = isWhitePiece(piece) ? 'Q' : 'q';
  }
  nb[to[0]][to[1]] = piece;
  return nb;
}

/** All fully legal moves for `white`, filtered so none leave their own king
    in check. */
export function legalMoves(board: Board, white: boolean): Move[] {
  const out: Move[] = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (!p || isWhitePiece(p) !== white) continue;
      for (const [tr, tc] of pieceMoves(board, r, c)) {
        const move: Move = { from: [r, c], to: [tr, tc] };
        const nb = applyMove(board, move);
        if (!isInCheck(nb, white)) out.push(move);
      }
    }
  }
  return out;
}

export function gameStatus(board: Board, white: boolean): GameStatus {
  const inCheck = isInCheck(board, white);
  const moves = legalMoves(board, white);
  if (moves.length > 0) return inCheck ? 'check' : 'ongoing';
  return inCheck ? 'checkmate' : 'stalemate';
}

/* ── Tiny AI: negamax with material eval, alpha-beta pruned ────────────── */
const VALUES: Record<string, number> = { P: 1, N: 3, B: 3.1, R: 5, Q: 9, K: 0 };

function evaluate(board: Board): number {
  let score = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (!p) continue;
      const v = VALUES[p.toUpperCase()];
      score += isWhitePiece(p) ? v : -v;
    }
  }
  return score;
}

/** Negamax from the perspective of `white` (true = maximize white's score). */
function negamax(board: Board, depth: number, white: boolean, alpha: number, beta: number): number {
  const moves = legalMoves(board, white);
  if (moves.length === 0) {
    if (isInCheck(board, white)) return white ? -100000 - depth : 100000 + depth;
    return 0;
  }
  if (depth === 0) return evaluate(board);

  let best = white ? -Infinity : Infinity;
  for (const m of moves) {
    const nb = applyMove(board, m);
    const score = negamax(nb, depth - 1, !white, alpha, beta);
    if (white) {
      best = Math.max(best, score);
      alpha = Math.max(alpha, best);
    } else {
      best = Math.min(best, score);
      beta = Math.min(beta, best);
    }
    if (beta <= alpha) break;
  }
  return best;
}

/** Picks a move for `white` side using a shallow search, with a little
    randomness among near-equal top choices so it doesn't play the exact
    same game every time. Depth 2 keeps it responsive in-browser and
    deliberately beatable — it's a portfolio demo, not an engine. */
export function chooseAIMove(board: Board, white: boolean, depth = 2): Move | null {
  const moves = legalMoves(board, white);
  if (moves.length === 0) return null;
  const scored = moves.map((m) => ({
    m,
    s: negamax(applyMove(board, m), depth - 1, !white, -Infinity, Infinity),
  }));
  scored.sort((a, b) => (white ? b.s - a.s : a.s - b.s));
  const best = scored[0].s;
  const top = scored.filter((x) => Math.abs(x.s - best) < 0.26);
  return top[Math.floor(Math.random() * top.length)].m;
}
