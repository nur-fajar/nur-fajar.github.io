const E = require('./chess-engine.js');

function assert(cond, msg) {
  if (!cond) { console.error('FAIL:', msg); process.exitCode = 1; }
  else console.log('ok  :', msg);
}

// 1. Starting position has exactly 20 legal moves for White.
assert(E.legalMoves(E.START, true).length === 20, 'start position: 20 legal white moves');
assert(E.legalMoves(E.START, false).length === 20, 'start position: 20 legal black moves');

// 2. Fool's mate: 1.f3 e5 2.g4 Qh4# — fastest checkmate in chess.
let b = E.START;
b = E.applyMove(b, { from: [6, 5], to: [5, 5] }); // f2-f3
b = E.applyMove(b, { from: [1, 4], to: [3, 4] }); // e7-e5
b = E.applyMove(b, { from: [6, 6], to: [4, 6] }); // g2-g4
b = E.applyMove(b, { from: [0, 3], to: [4, 7] }); // Qd8-h4
assert(E.gameStatus(b, true) === 'checkmate', "fool's mate reaches checkmate for White");

// 3. Qh5 in the scholar's-mate setup attacks f7 but does not check the king
//    (the f7 pawn blocks the e8 diagonal) — sanity check for line blocking.
let b2 = E.START;
b2 = E.applyMove(b2, { from: [6, 4], to: [4, 4] }); // e2-e4
b2 = E.applyMove(b2, { from: [1, 4], to: [3, 4] }); // e7-e5
b2 = E.applyMove(b2, { from: [7, 5], to: [4, 2] }); // Bf1-c4
b2 = E.applyMove(b2, { from: [1, 1], to: [2, 1] }); // b7-b6 (irrelevant black move)
b2 = E.applyMove(b2, { from: [7, 3], to: [3, 7] }); // Qd1-h5
assert(E.gameStatus(b2, false) === 'ongoing', 'Qh5 does not check the black king (f7 pawn blocks the diagonal)');
assert(E.isSquareAttacked(b2, 1, 5, true), 'Qh5 does attack f7, the classic scholar\'s-mate target square');

// 4. Level 1 puzzle position, verified by brute-force search to be a genuine
//    forced mate in 2: White Kc6/Qb1, Black Ka7. 1.Qb6+ Ka8 (forced) 2.Qb7#.
function emptyBoard() { return Array.from({ length: 8 }, () => Array(8).fill('')); }
let puzzle = emptyBoard();
puzzle[2][2] = 'K'; // c6
puzzle[7][1] = 'Q'; // b1
puzzle[1][0] = 'k'; // a7
const m1 = { from: [7, 1], to: [2, 1] }; // Qb1-b6+
assert(E.legalMoves(puzzle, true).some((m) => m.from[0] === m1.from[0] && m.from[1] === m1.from[1] && m.to[0] === m1.to[0] && m.to[1] === m1.to[1]),
  'Qb1-b6+ is a legal White move in the Level 1 puzzle');
let afterM1 = E.applyMove(puzzle, m1);
assert(E.gameStatus(afterM1, false) === 'check', 'Qb6 checks the Black king');
const blackReplies = E.legalMoves(afterM1, false);
assert(blackReplies.length === 1 && blackReplies[0].to[0] === 0 && blackReplies[0].to[1] === 0,
  'after Qb6+, Black king has exactly one legal reply: Ka7-a8');
let afterReply = E.applyMove(afterM1, blackReplies[0]);
const m2 = { from: [2, 1], to: [1, 1] }; // Qb6-b7#
assert(E.legalMoves(afterReply, true).some((m) => m.from[0] === m2.from[0] && m.from[1] === m2.from[1] && m.to[0] === m2.to[0] && m.to[1] === m2.to[1]),
  'Qb6-b7# is legal after Ka8');
let mated = E.applyMove(afterReply, m2);
assert(E.gameStatus(mated, false) === 'checkmate', 'Qb7 delivers checkmate — Level 1 puzzle is a genuine mate-in-2');

// 5. AI never returns an illegal / self-check move from a mid-game position.
let midGame = E.START;
midGame = E.applyMove(midGame, { from: [6, 4], to: [4, 4] });
const aiMove = E.chooseAIMove(midGame, false, 2);
assert(aiMove && E.legalMoves(midGame, false).some((m) => m.from[0] === aiMove.from[0] && m.from[1] === aiMove.from[1] && m.to[0] === aiMove.to[0] && m.to[1] === aiMove.to[1]),
  'chooseAIMove returns a move from the legal move set');

// 6. Stalemate detection: classic K vs K+Q stalemate — Black Kh8 has no
//    legal move and is not in check.
let stale = emptyBoard();
stale[0][7] = 'k'; // h8
stale[2][6] = 'Q'; // g6
stale[2][5] = 'K'; // f6
assert(E.gameStatus(stale, false) === 'stalemate', 'Kh8/Qg6/Kf6 is a stalemate for Black');

if (process.exitCode) { console.error('\nSOME TESTS FAILED'); } else { console.log('\nALL TESTS PASSED'); }
