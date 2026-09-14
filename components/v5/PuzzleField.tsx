/**
 * Latar hero: puzzle penuh + tiga cahaya yang mengembara lintas keping.
 *
 * Semua geometri deterministik (seed tetap) supaya SSR dan client identik
 * tanpa efek. Rute cahaya adalah random walk di lattice seam dan memakai
 * vektor tonjolan yang SAMA dengan keping dasar, jadi cahayanya duduk
 * persis di atas garis puzzle, dari puzzle ke puzzle. Server component.
 */

const COLS = 7;
const ROWS = 5;
const CELL = 100;
/** Slot kosong: kanan-tengah, terlihat di desktop maupun crop HP. */
const HOLE = { c: 5, r: 2 };
/** False = puzzle tampil penuh. True = satu slot dikosongkan lagi. */
const SHOW_HOLE = false;

const SEAM = '#d9d3c3';
const HOLE_FILL = '#ddd2b8';

/** Kuning, merah, biru vivid. Sengaja bukan token situs: merah/biru brand
    terlalu gelap untuk dibaca sebagai cahaya. */
const ROUTES = [
  { color: '#ffc400', seed: 21, start: [1, 4] as const, steps: 16, speed: 65 },
  { color: '#ff3b30', seed: 42, start: [4, 1] as const, steps: 18, speed: 75 },
  { color: '#2f7bff', seed: 77, start: [6, 3] as const, steps: 16, speed: 70 },
] as const;

function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (n: number) => Math.round(n * 10) / 10;

/**
 * Satu sisi dari (ax,ay) ke (bx,by) dengan tonjolan (gx,gy) di tengah.
 * Tonjolan yang sama menghasilkan kurva yang sama, di keping maupun rute.
 */
function seg2(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  gx: number,
  gy: number,
): string {
  if (!gx && !gy) return `L${f(bx)} ${f(by)}`;
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const p1x = ax + dx * 0.36;
  const p1y = ay + dy * 0.36;
  const p2x = ax + dx * 0.64;
  const p2y = ay + dy * 0.64;
  const apx = (p1x + p2x) / 2 + gx;
  const apy = (p1y + p2y) / 2 + gy;
  return (
    `L${f(p1x)} ${f(p1y)}` +
    `C${f(p1x + gx * 0.35)} ${f(p1y + gy * 0.35)} ` +
    `${f(apx - ux * len * 0.09)} ${f(apy - uy * len * 0.09)} ${f(apx)} ${f(apy)}` +
    `C${f(apx + ux * len * 0.09)} ${f(apy + uy * len * 0.09)} ` +
    `${f(p2x + gx * 0.35)} ${f(p2y + gy * 0.35)} ${f(p2x)} ${f(p2y)}` +
    `L${f(bx)} ${f(by)}`
  );
}

const isHole = (c: number, r: number) => SHOW_HOLE && c === HOLE.c && r === HOLE.r;

interface Seams {
  /** vSeam[r][c]: tonjolan sisi kanan sel (r,c), arah +x. */
  v: number[][];
  /** hSeam[r][c]: tonjolan sisi bawah sel (r,c), arah +y. */
  h: number[][];
}

function buildSeams(): Seams {
  const rand = mulberry32(7);
  return {
    v: Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS - 1 }, () => (rand() > 0.5 ? 1 : -1)),
    ),
    h: Array.from({ length: ROWS - 1 }, () =>
      Array.from({ length: COLS }, () => (rand() > 0.5 ? 1 : -1)),
    ),
  };
}

const SEAMS = buildSeams();
/** Flat minimal: tonjolan sangat dangkal, tekstur nyaris datar. */
const K = CELL * 0.08;

interface Cell {
  c: number;
  r: number;
  d: string;
  fill: string;
}

function buildCells(): Cell[] {
  const fills = ['#f7f3ea', '#faf8f2', '#f4efe2'];
  const cells: Cell[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (isHole(c, r)) continue;
      const x0 = c * CELL;
      const y0 = r * CELL;
      const x1 = x0 + CELL;
      const y1 = y0 + CELL;
      /* Tepi menghadap lubang dipotong lurus, seperti keping asli. */
      const top = r === 0 || isHole(c, r - 1) ? 0 : SEAMS.h[r - 1][c] * K;
      const right = c === COLS - 1 || isHole(c + 1, r) ? 0 : SEAMS.v[r][c] * K;
      const bottom = r === ROWS - 1 || isHole(c, r + 1) ? 0 : SEAMS.h[r][c] * K;
      const left = c === 0 || isHole(c - 1, r) ? 0 : SEAMS.v[r][c - 1] * K;
      const d =
        `M${x0} ${y0}` +
        seg2(x0, y0, x1, y0, 0, top) +
        seg2(x1, y0, x1, y1, right, 0) +
        seg2(x1, y1, x0, y1, 0, bottom) +
        seg2(x0, y1, x0, y0, left, 0) +
        'Z';
      cells.push({ c, r, d, fill: fills[(r * COLS + c) % fills.length] });
    }
  }
  return cells;
}

const CELLS = buildCells();

/** Tepi lattice menyentuh slot kosong: dilewati rute bila lubang tampil. */
function touchesHole(c1: number, r1: number, c2: number, r2: number): boolean {
  if (!SHOW_HOLE) return false;
  const cells: [number, number][] =
    c1 === c2
      ? [
          [c1 - 1, Math.min(r1, r2)],
          [c1, Math.min(r1, r2)],
        ]
      : [
          [Math.min(c1, c2), r1 - 1],
          [Math.min(c1, c2), r1],
        ];
  return cells.some(([c, r]) => c === HOLE.c && r === HOLE.r);
}

interface Route {
  d: string;
  length: number;
}

/** Random walk di titik lattice; tiap langkah mengikuti seam asli. */
function buildRoute(seed: number, startC: number, startR: number, steps: number): Route {
  const rand = mulberry32(seed);
  let c = startC;
  let r = startR;
  let dc = 0;
  let dr = 0;
  const used = new Set<string>();
  let d = `M${c * CELL} ${r * CELL}`;
  let length = 0;
  for (let s = 0; s < steps; s++) {
    const opts = (
      [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ] as const
    ).filter(([a, b]) => {
      const nc = c + a;
      const nr = r + b;
      if (nc < 0 || nc > COLS || nr < 0 || nr > ROWS) return false;
      if (a === -dc && b === -dr) return false;
      if (touchesHole(c, r, nc, nr)) return false;
      const key = a !== 0 ? `h${Math.min(c, nc)}-${r}` : `v${c}-${Math.min(r, nr)}`;
      return !used.has(key);
    });
    if (!opts.length) break;
    /* Lurus 3x lebih mungkin: rute mengalir, bukan zigzag gelisah. */
    const straight = opts.filter(([a, b]) => a === dc && b === dr);
    const pool = [...opts, ...straight, ...straight];
    const [a, b] = pool[Math.floor(rand() * pool.length)];
    const nc = c + a;
    const nr = r + b;
    let gx = 0;
    let gy = 0;
    let tab = 0;
    if (a !== 0) {
      const cc = Math.min(c, nc);
      if (r > 0 && r < ROWS) tab = SEAMS.h[r - 1][cc];
      gy = tab * K;
    } else {
      const rr = Math.min(r, nr);
      if (c > 0 && c < COLS) tab = SEAMS.v[rr][c - 1];
      gx = tab * K;
    }
    d += seg2(c * CELL, r * CELL, nc * CELL, nr * CELL, gx, gy);
    length += CELL + (tab ? 38 : 0);
    used.add(a !== 0 ? `h${Math.min(c, nc)}-${r}` : `v${c}-${Math.min(r, nr)}`);
    c = nc;
    r = nr;
    dc = a;
    dr = b;
  }
  return { d, length };
}

const PATHS = ROUTES.map((t) => ({ ...t, ...buildRoute(t.seed, t.start[0], t.start[1], t.steps) }));

export default function PuzzleField() {
  return (
    <div className="v5-puzzlefield" aria-hidden="true">
      <svg className="v5-puzzlefield__base" viewBox={`0 0 ${COLS * CELL} ${ROWS * CELL}`} preserveAspectRatio="xMidYMid slice" focusable="false">
        {SHOW_HOLE ? (
          <rect
            x={HOLE.c * CELL}
            y={HOLE.r * CELL}
            width={CELL}
            height={CELL}
            fill={HOLE_FILL}
          />
        ) : null}
        {CELLS.map((cell) => (
          <path key={`${cell.c}-${cell.r}`} d={cell.d} fill={cell.fill} stroke={SEAM} strokeWidth="2" strokeLinejoin="round" />
        ))}
      </svg>
      {/* Tiga cahaya, tiap rute satu segmen yang mengembara lintas keping.
          Periode dash = panjang rute, jadi loop-nya mulus. */}
      <svg className="v5-puzzlefield__lights" viewBox={`0 0 ${COLS * CELL} ${ROWS * CELL}`} preserveAspectRatio="xMidYMid slice" focusable="false">
        {PATHS.map((p, i) => (
          <path
            key={p.color}
            d={p.d}
            className="v5-route"
            style={{
              stroke: p.color,
              strokeDasharray: `170 ${Math.max(p.length - 170, 10)}`,
              ['--loop' as string]: `${p.length}px`,
              animationDuration: `${(p.length / p.speed).toFixed(2)}s`,
              animationDelay: `${(-i * 3.7).toFixed(2)}s`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
