import type { CSSProperties } from 'react';
import type { HatId, V6StageMode } from '@/content/v6-hats';

/**
 * PixelCharacter: sprite pixel-art 16x22 yang digambar langsung sebagai SVG
 * (aset placeholder di kode — ganti dengan <img> ke PNG sprite kapan saja,
 * struktur komponennya tidak berubah).
 *
 * Satu base body, lima pakaian: netral, trainer (mortarboard + buku),
 * creative (beanie + stylus), ai (helm + visor neon), unicorn (ketiganya).
 * Peta pikselnya string per baris, satu huruf = satu warna dari palette.
 */

/** Palet warna bersama, SNES-ish: outline gelap, skin hangat, aksen terang. */
const PALETTE: Record<string, string> = {
  k: '#1a1c2c', // outline / gelap
  h: '#3a3554', // rambut
  s: '#eec39a', // kulit
  e: '#1a1c2c', // mata
  t: '#5a6988', // kaos netral
  p: '#34435e', // celana
  b: '#1a1c2c', // sepatu
  c: '#e0e4f0', // kemeja trainer
  o: '#b13e53', // buku
  O: '#e8613c', // beanie
  Q: '#f4a259', // band beanie
  n: '#2f6f6f', // apron creative
  g: '#9aa5b5', // stylus
  v: '#8a5cf5', // helm AI
  C: '#59d5ff', // visor neon
  j: '#232640', // jaket AI
  N: '#59d5ff', // trim neon
  Y: '#ffd447', // kuning (tassel / aksen)
  r: '#e05c5c', // pelangi
  R: '#5cb8e0', // pelangi
  u: '#8ac96a', // pelangi
  x: '#c96ab8', // pelangi
};

/** Peta piksel, satu string = satu baris. '.' = transparan. */
const BASE_MAPS: Record<Exclude<V6StageMode, 'neutral'>, string[]> = {
  trainer: [
    '.kkkkkkkkkkkkkk.',
    '.kBBBBBBBBBBBYk.',
    '...kBBBBBBBBk...',
    '...khhhhhhhhk...',
    '..khhhhhhhhhhk..',
    '..khsssssssshk..',
    '..khssessesshk..',
    '..khsssssssshk..',
    '...ksskkksssk...',
    '..kcccccccccck..',
    '.kcccccccccccck.',
    '.kccsooosccccck.',
    '.kccsooosccccck.',
    '.kcccccccccccck.',
    '..kcccccccccck..',
    '..kppppppppppk..',
    '..kppppppppppk..',
    '..kpppk..kpppk..',
    '..kpppk..kpppk..',
    '..kpppk..kpppk..',
    '..kbbbk..kbbbk..',
    '.kbbbbk..kbbbbk.',
  ],
  creative: [
    '................',
    '....kkkkkkkk....',
    '...kOOOOOOOOk...',
    '..kOOOOOOOOOOk..',
    '..kQQQQQQQQQQk..',
    '..khsssssssshk..',
    '..khssessesshk..',
    '..khsssssssshk..',
    '...ksskkksssk...',
    '..knnnnnnnnnngk.',
    '.knnnnnnnnnnngk.',
    '.knnnnnnnnnnngk.',
    '.knnnnnnnnnnngk.',
    '.knnnnnnnnnnssk.',
    '..knnnnnnnnnnk..',
    '..kppppppppppk..',
    '..kppppppppppk..',
    '..kpppk..kpppk..',
    '..kpppk..kpppk..',
    '..kpppk..kpppk..',
    '..kbbbk..kbbbk..',
    '.kbbbbk..kbbbbk.',
  ],
  ai: [
    '..........Y.....',
    '...kkkkkkkkYk...',
    '..kvvvvvvvvvvk..',
    '..kvvvvvvvvvvk..',
    '..kvvvvvvvvvvk..',
    '..kvCCCCCCCCvk..',
    '..kvCCkkkkCCvk..',
    '..kvssssssssvk..',
    '...kssssssssk...',
    '..kjjjjjjjjjjk..',
    '.kjjNNNNNNNNjjk.',
    '.kjjjjjjjjjjjjk.',
    '.kjjjjjjjjjjjjk.',
    '.kjsjjjjjjjjjsk.',
    '..kjjjjjjjjjjk..',
    '..kppppppppppk..',
    '..kppppppppppk..',
    '..kpppk..kpppk..',
    '..kpppk..kpppk..',
    '..kpppk..kpppk..',
    '..kbbbk..kbbbk..',
    '.kbbbbk..kbbbbk.',
  ],
  unicorn: [
    '.kkkkkkkkkkkkkk.',
    '.kBBBBBBBBBBBYk.',
    '...kOOOOOOOOk.Y.',
    '..kOOOOOOOOOOk..',
    '..kQQQQQQQQQQk..',
    '..khsssssssshk..',
    '..khssessesshk..',
    '..khsssssssshk..',
    '...ksskkksssk...',
    '..krrrrRRRRrrk..',
    '.krrRRRRRRRRrrk.',
    '.kRRRRuuuuRRRRk.',
    '.kRRuuuuuuuuRRk.',
    '.kuuxxxxxxxxxuk.',
    '..kxxxxxxxxxxk..',
    '..kppppppppppk..',
    '..kppppppppppk..',
    '..kpppk..kpppk..',
    '..kpppk..kpppk..',
    '..kpppk..kpppk..',
    '..kbbbk..kbbbk..',
    '.kbbbbk..kbbbbk.',
  ],
};

/** Kaos netral: baris 0-4 rambut polos, badan kaos 't'. */
const NEUTRAL_MAP: string[] = [
  '................',
  '................',
  '....kkkkkkkk....',
  '...khhhhhhhhk...',
  '..khhhhhhhhhhk..',
  '..khsssssssshk..',
  '..khssessesshk..',
  '..khsssssssshk..',
  '...ksskkksssk...',
  '..kttttttttttk..',
  '.kttttttttttttk.',
  '.kttttttttttttk.',
  '.kttttttttttttk.',
  '.ksttttttttttsk.',
  '..kttttttttttk..',
  '..kppppppppppk..',
  '..kppppppppppk..',
  '..kpppk..kpppk..',
  '..kpppk..kpppk..',
  '..kpppk..kpppk..',
  '..kbbbk..kbbbk..',
  '.kbbbbk..kbbbbk.',
];

/** Palet tambahan per pakaian, digabung dengan PALETTE saat render. */
const EXTRA_PALETTE: Record<Exclude<V6StageMode, 'neutral'>, Record<string, string>> = {
  trainer: { B: '#2b3a67' },
  creative: {},
  ai: {},
  unicorn: {},
};

function mapFor(mode: V6StageMode): string[] {
  return mode === 'neutral' ? NEUTRAL_MAP : BASE_MAPS[mode];
}

/** Satu peta piksel → <rect> per run horizontal (DOM tetap kecil). */
function PixelMap({
  map,
  extra,
  style,
  className,
}: {
  map: string[];
  extra?: Record<string, string>;
  style?: CSSProperties;
  className?: string;
}) {
  const colors = extra ? { ...PALETTE, ...extra } : PALETTE;
  const w = Math.max(...map.map((row) => row.length));
  const h = map.length;
  const rects: { x: number; y: number; w: number; fill: string }[] = [];
  map.forEach((row, y) => {
    let run = -1;
    let runColor = '';
    for (let x = 0; x <= row.length; x++) {
      const color = colors[row[x] ?? '.'];
      if (color && run >= 0 && color === runColor) continue;
      if (run >= 0) rects.push({ x: run, y, w: x - run, fill: runColor });
      run = color ? x : -1;
      runColor = color;
    }
  });
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      style={{ ...style, shapeRendering: 'crispEdges' }}
      aria-hidden="true"
      focusable="false"
    >
      {rects.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={1} fill={r.fill} />
      ))}
    </svg>
  );
}

export default function PixelCharacter({ mode, className }: { mode: V6StageMode; className?: string }) {
  return <PixelMap map={mapFor(mode)} extra={mode === 'neutral' ? undefined : EXTRA_PALETTE[mode]} className={className} />;
}

/** Peta topi kecil (untuk ikon terbang dari selector ke kepala), 12x7. */
export const HAT_FLY_MAPS: Record<HatId, string[]> = {
  trainer: [
    '.kkkkkkkkkkk.',
    '.kBBBBBBBBBYk',
    '.kBBBBBBBBBk.',
    '...kkkkkkk...',
  ],
  creative: [
    '...kkkkkk...',
    '..kOOOOOOk..',
    '.kOOOOOOOOk.',
    '.kQQQQQQQQk.',
  ],
  ai: [
    '..........Y..',
    '..kkkkkkkkk..',
    '.kvvvvvvvvvk.',
    '.kvCkkkkCvvk.',
  ],
};

/** Palet topi kecil (subset). */
export const HAT_FLY_PALETTE = {
  k: PALETTE.k,
  B: '#2b3a67',
  Y: PALETTE.Y,
  O: PALETTE.O,
  Q: PALETTE.Q,
  v: PALETTE.v,
  C: PALETTE.C,
};

export function HatGlyph({ hat, className }: { hat: HatId; className?: string }) {
  return (
    <PixelMap map={HAT_FLY_MAPS[hat]} extra={HAT_FLY_PALETTE} className={className} />
  );
}
