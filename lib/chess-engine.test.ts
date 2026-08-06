import { describe, expect, it } from 'vitest';
import {
  applyMove,
  chooseAIMove,
  gameStatus,
  isSquareAttacked,
  legalMoves,
  START,
  type Board,
} from './chess-engine';

function emptyBoard(): Board {
  return Array.from({ length: 8 }, () => Array(8).fill('')) as Board;
}

function hasMove(moves: { from: [number, number]; to: [number, number] }[], from: [number, number], to: [number, number]) {
  return moves.some((m) => m.from[0] === from[0] && m.from[1] === from[1] && m.to[0] === to[0] && m.to[1] === to[1]);
}

describe('chess engine', () => {
  it('start position has exactly 20 legal moves for each side', () => {
    expect(legalMoves(START, true)).toHaveLength(20);
    expect(legalMoves(START, false)).toHaveLength(20);
  });

  it("reaches checkmate via fool's mate — 1.f3 e5 2.g4 Qh4#", () => {
    let b = START;
    b = applyMove(b, { from: [6, 5], to: [5, 5] }); // f2-f3
    b = applyMove(b, { from: [1, 4], to: [3, 4] }); // e7-e5
    b = applyMove(b, { from: [6, 6], to: [4, 6] }); // g2-g4
    b = applyMove(b, { from: [0, 3], to: [4, 7] }); // Qd8-h4
    expect(gameStatus(b, true)).toBe('checkmate');
  });

  it('Qh5 in the scholar’s-mate setup attacks f7 but does not check the king (f7 pawn blocks the diagonal)', () => {
    let b = START;
    b = applyMove(b, { from: [6, 4], to: [4, 4] }); // e2-e4
    b = applyMove(b, { from: [1, 4], to: [3, 4] }); // e7-e5
    b = applyMove(b, { from: [7, 5], to: [4, 2] }); // Bf1-c4
    b = applyMove(b, { from: [1, 1], to: [2, 1] }); // b7-b6 (irrelevant black move)
    b = applyMove(b, { from: [7, 3], to: [3, 7] }); // Qd1-h5
    expect(gameStatus(b, false)).toBe('ongoing');
    expect(isSquareAttacked(b, 1, 5, true)).toBe(true);
  });

  it('Level 1 puzzle position is a genuine forced mate in 2: 1.Qb6+ Ka8 (forced) 2.Qb7#', () => {
    const puzzle = emptyBoard();
    puzzle[2][2] = 'K'; // c6
    puzzle[7][1] = 'Q'; // b1
    puzzle[1][0] = 'k'; // a7

    const m1 = { from: [7, 1] as [number, number], to: [2, 1] as [number, number] }; // Qb1-b6+
    expect(hasMove(legalMoves(puzzle, true), m1.from, m1.to)).toBe(true);

    const afterM1 = applyMove(puzzle, m1);
    expect(gameStatus(afterM1, false)).toBe('check');

    const blackReplies = legalMoves(afterM1, false);
    expect(blackReplies).toHaveLength(1);
    expect(blackReplies[0].to).toEqual([0, 0]); // Ka7-a8 is the only legal reply

    const afterReply = applyMove(afterM1, blackReplies[0]);
    const m2 = { from: [2, 1] as [number, number], to: [1, 1] as [number, number] }; // Qb6-b7#
    expect(hasMove(legalMoves(afterReply, true), m2.from, m2.to)).toBe(true);

    const mated = applyMove(afterReply, m2);
    expect(gameStatus(mated, false)).toBe('checkmate');
  });

  it('AI never returns an illegal / self-check move from a mid-game position', () => {
    let midGame = START;
    midGame = applyMove(midGame, { from: [6, 4], to: [4, 4] });
    const aiMove = chooseAIMove(midGame, false, 2);
    expect(aiMove).not.toBeNull();
    expect(hasMove(legalMoves(midGame, false), aiMove!.from, aiMove!.to)).toBe(true);
  });

  it('detects a classic K vs K+Q stalemate', () => {
    const stale = emptyBoard();
    stale[0][7] = 'k'; // h8
    stale[2][6] = 'Q'; // g6
    stale[2][5] = 'K'; // f6
    expect(gameStatus(stale, false)).toBe('stalemate');
  });
});
