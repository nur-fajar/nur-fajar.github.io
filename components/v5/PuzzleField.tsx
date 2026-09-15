'use client';

import { useEffect, useRef } from 'react';

/**
 * Latar hero: puzzle penuh + tiga cahaya yang mengembara lintas keping.
 *
 * Semua geometri deterministik (seed tetap) supaya SSR dan client identik
 * tanpa efek. Rute cahaya adalah random walk di lattice seam dan memakai
 * vektor tonjolan yang SAMA dengan keping dasar, jadi cahayanya duduk
 * persis di atas garis puzzle, dari puzzle ke puzzle.
 *
 * Lapisan interaksi (pointer halus saja): tilt 3D tipis + sorot radial
 * mengikuti kursor, dua-duanya lewat CSS variable dengan lerp di rAF —
 * reduced motion tidak pernah memasangnya.
 */

const COLS = 14;
const ROWS = 10;
const CELL = 100;

const SEAM = '#d9d3c3';

/** Kuning, merah, biru vivid. Sengaja bukan token situs: merah/biru brand
    terlalu gelap untuk dibaca sebagai cahaya. */
const ROUTES = [
  { color: '#ffc400', seed: 21, start: [1, 9] as const, steps: 32, speed: 135 },
  { color: '#ff3b30', seed: 42, start: [8, 1] as const, steps: 36, speed: 145 },
  { color: '#2f7bff', seed: 77, start: [13, 6] as const, steps: 32, speed: 140 },
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
 * Satu sisi dari (ax,ay) ke (bx,by) dengan knob klasik ala puzzle karton:
 * leher sempit + kepala bulat besar (tonjolan ~30% sel, bukan gundukan
 * dangkal). Arah tonjolan HANYA dari tanda (gx,gy) — besarnya konstan —
 * jadi kurva identik untuk keping maupun rute cahaya selama tandanya sama.
 * Simetris terhadap titik tengah sisi: dibalik arah pun jalurnya sama.
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
  const gl = Math.hypot(gx, gy);
  const nx = gx / gl;
  const ny = gy / gl;
  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2;
  /* Leher: 12 unit ke tiap sisi dari tengah; puncak: 30 unit keluar. */
  const axn = mx - ux * 12;
  const ayn = my - uy * 12;
  const bxn = mx + ux * 12;
  const byn = my + uy * 12;
  const hx = mx + nx * 30;
  const hy = my + ny * 30;
  return (
    `L${f(axn)} ${f(ayn)}` +
    `C${f(axn + nx * 15)} ${f(ayn + ny * 15)} ` +
    `${f(hx - ux * 15)} ${f(hy - uy * 15)} ${f(hx)} ${f(hy)}` +
    `C${f(hx + ux * 15)} ${f(hy + uy * 15)} ` +
    `${f(bxn + nx * 15)} ${f(byn + ny * 15)} ${f(bxn)} ${f(byn)}` +
    `L${f(bx)} ${f(by)}`
  );
}

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
/** Tanda arah tonjolan; besar knob konstan di seg2 (yang dipakai cuma tanda). */
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
      const x0 = c * CELL;
      const y0 = r * CELL;
      const x1 = x0 + CELL;
      const y1 = y0 + CELL;
      const top = r === 0 ? 0 : SEAMS.h[r - 1][c] * K;
      const right = c === COLS - 1 ? 0 : SEAMS.v[r][c] * K;
      const bottom = r === ROWS - 1 ? 0 : SEAMS.h[r][c] * K;
      const left = c === 0 ? 0 : SEAMS.v[r][c - 1] * K;
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
    length += CELL + (tab ? 45 : 0);
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
  const wrapRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<(SVGPathElement | null)[]>([]);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = wrapRef.current;
    if (!el) return;
    const lights = el.querySelector('.v5-puzzlefield__lights');
    const base = el.querySelector('.v5-puzzlefield__base');
    /* State tilt per keping: s = intensitas 0..1 (lerp menuju falloff),
       rest = 1 bila keping sudah diam (lewati tulis DOM). */
    const N = CELLS.length;
    const cur = new Float32Array(N);
    const rest = new Uint8Array(N).fill(1);
    let fx = 0;
    let fy = 0;
    let inField = false;
    /* Tilt global satu kesatuan DICABUT: ia menutupi tilt per keping.
       Yang tersisa tilt per keping + glow + laju cahaya. */
    let raf = 0;
    /* Energi zona: kecepatan pointer menaikkan tilt gain, glow, dan laju
       cahaya rute; meluruh sendiri ke 1 saat pointer diam. Semuanya lewat
       CSS var + playbackRate (kompositor), tanpa menyentuh geometri keping.
       ponytail: heuristik kasar (speed/2200, cap 3x), bukan fisika. */
    let energy = 1;
    let target = 1;
    let px = 0;
    let py = 0;
    let pt = 0;

    const settle = () => {
      el.style.setProperty('--v5-glow', '1');
      if (lights)
        lights.getAnimations().forEach((a) => {
          try {
            (a as Animation).playbackRate = 1;
          } catch {
            /* WAAPI belum siap: abaikan */
          }
        });
      raf = 0;
    };
    const tick = () => {
      energy += (target - energy) * 0.07;
      target += (1 - target) * 0.05;
      el.style.setProperty('--v5-glow', Math.min(0.6 + energy * 0.25, 1).toFixed(3));
      if (lights)
        lights.getAnimations().forEach((a) => {
          try {
            (a as Animation).playbackRate = energy;
          } catch {
            /* WAAPI belum siap: abaikan satu frame */
          }
        });
      /* Tilt per keping: yang dekat kursor terangkat + miring menjauhi
         pointer (falloff kuadrat, radius 210 unit viewBox). Mapping
         client→viewBox menghitung crop slice supaya tepat di semua
         aspek rasio. Cuma keping aktif yang disentuh DOM-nya. */
      let anyCell = false;
      if (base) {
        const r = base.getBoundingClientRect();
        const sc = Math.max(r.width / (COLS * CELL), r.height / (ROWS * CELL));
        const ox = (r.width - COLS * CELL * sc) / 2;
        const oy = (r.height - ROWS * CELL * sc) / 2;
        const sx = (fx - r.left - ox) / sc;
        const sy = (fy - r.top - oy) / sc;
        const R = 210;
        for (let i = 0; i < N; i++) {
          const cell = CELLS[i];
          const ccx = cell.c * CELL + CELL / 2;
          const ccy = cell.r * CELL + CELL / 2;
          let f = 0;
          let nx = 0;
          let ny = 0;
          if (inField) {
            const dx = ccx - sx;
            const dy = ccy - sy;
            const d = Math.hypot(dx, dy);
            if (d < R && d > 0.01) {
              const t = 1 - d / R;
              f = t * t;
              nx = dx / d;
              ny = dy / d;
            }
          }
          const c0 = cur[i];
          const c1 = c0 + (f - c0) * (f > c0 ? 0.18 : 0.1);
          if (c1 < 0.004) {
            if (!rest[i]) {
              rest[i] = 1;
              cur[i] = 0;
              cellRefs.current[i]?.style.setProperty('transform', '');
            }
            continue;
          }
          const node = cellRefs.current[i];
          if (!node) {
            cur[i] = 0;
            continue;
          }
          cur[i] = c1;
          rest[i] = 0;
          anyCell = true;
          node.style.transform =
            `translate3d(${(nx * 7 * c1).toFixed(2)}px, ${(ny * 7 * c1).toFixed(2)}px, ${(14 * c1).toFixed(2)}px) ` +
            `rotateX(${(-ny * 10 * c1).toFixed(2)}deg) rotateY(${(nx * 12 * c1).toFixed(2)}deg)`;
        }
      }
      if (Math.abs(target - 1) < 0.01 && Math.abs(energy - 1) < 0.01 && !anyCell)
        settle();
      else raf = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const move = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      fx = e.clientX;
      fy = e.clientY;
      inField =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      const now = performance.now();
      if (pt > 0) {
        const dt = Math.max((now - pt) / 1000, 0.001);
        const speed = Math.hypot(e.clientX - px, e.clientY - py) / dt;
        target = 1 + Math.min(speed / 2200, 2);
      }
      px = e.clientX;
      py = e.clientY;
      pt = now;
      el.style.setProperty('--v5-gx', `${(((e.clientX - rect.left) / rect.width) * 100).toFixed(1)}%`);
      el.style.setProperty('--v5-gy', `${(((e.clientY - rect.top) / rect.height) * 100).toFixed(1)}%`);
      el.classList.add('is-live');
      wake();
    };
    const leave = () => {
      target = 1;
      pt = 0;
      inField = false;
      el.classList.remove('is-live');
      wake();
    };

    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, []);

  return (
    <div className="v5-puzzlefield" aria-hidden="true" ref={wrapRef}>
      <svg className="v5-puzzlefield__base" viewBox={`0 0 ${COLS * CELL} ${ROWS * CELL}`} preserveAspectRatio="xMidYMid slice" focusable="false">
        {CELLS.map((cell, i) => (
          <path
            key={`${cell.c}-${cell.r}`}
            ref={(n) => {
              cellRefs.current[i] = n;
            }}
            d={cell.d}
            fill={cell.fill}
            stroke={SEAM}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
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
              strokeDasharray: `335 ${Math.max(p.length - 335, 10)}`,
              ['--loop' as string]: `${p.length}px`,
              animationDuration: `${(p.length / p.speed).toFixed(2)}s`,
              animationDelay: `${(-i * 3.7).toFixed(2)}s`,
            }}
          />
        ))}
      </svg>
      <span className="v5-puzzlefield__glow" />
    </div>
  );
}
