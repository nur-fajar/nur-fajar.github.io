/**
 * Generator sprite pixel untuk CharacterStage v6 — tanpa dependency.
 *
 * Semua gambar ditulis per SEL lewat R(x, ch, n) (posisi eksplisit), bukan
 * run-length, supaya bentuk tiap baris terbaca langsung dari kode. Per
 * karakter: 3 frame (idle depan / jalan A / jalan B), headwear + prop sebagai
 * overlay yang menimpa sel, palet per persona. Kulit kuning-langsat (2 shade)
 * dipakai semua karakter; baju memakai warna aksen persona.
 *
 * Sheet hasil: 54 sel lebar (3 frame × 18), tinggi 25 sel, skala 3 → PNG
 * 162 × 75, latar transparan. Urutan sel: kiri = idle depan, tengah = jalan
 * A, kanan = jalan B (dipakai CSS background-position).
 *
 * Pakai:  node scripts/make-sprites.mjs              (tulis PNG)
 *         node scripts/make-sprites.mjs --preview    (print ASCII)
 */
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const W = 18;
const H = 25;
const SCALE = 4; // sprite programatik dirender 72×100, seimbang dengan sheet Gemini (~73×135)

const O = 'O'; // tinta: outline, kacamata, mata, border prop
const h = 'h'; // rambut
const s = 's'; // kulit dasar (kuning langsat cerah)
const d = 'd'; // bayangan kulit
const a = 'a'; // aksen persona (baju / topi)
const x = 'x'; // aksen gelap persona
const w = 'w'; // putih prop
const P = 'P'; // celana
const k = 'k'; // sepatu
const _ = '.';

// Baris dari triple [x, ch, n]. Tanpa ini, baris = transparan penuh.
const R = (...cells) => {
  const arr = Array(W).fill(_);
  for (const cellSpec of cells) {
    const [x0, ch, n = 1] = cellSpec;
    for (let i = 0; i < n; i += 1) {
      const px = x0 + i;
      if (px < 0 || px >= W) throw new Error(`sel ${px} di luar W=${W}`);
      arr[px] = ch;
    }
  }
  return arr.join('');
};

/** Grid 18×25 dari peta {y: rowString}; baris tanpa ket = transparan. */
function grid(map = {}) {
  const out = Array.from({ length: H }, () => R());
  for (const [yStr, lineText] of Object.entries(map)) {
    const y = Number(yStr);
    if (Number.isNaN(y) || y < 0 || y >= H) throw new Error(`y ${yStr} di luar H=${H}`);
    if (lineText.length !== W) throw new Error(`baris ${y} panjang ${lineText.length}, bukan ${W}`);
    out[y] = lineText;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Bebas untuk seluruh karakter (proporsi kepala besar ala platformer retro)
// ---------------------------------------------------------------------------

const bodyFront = grid({
  1: R([6, O, 6]),
  2: R([5, O], [6, h, 6], [12, O]),
  3: R([4, O], [5, h, 8], [13, O]),
  4: R([4, O], [5, h, 8], [13, O]),
  5: R([4, O], [5, h], [6, s, 6], [12, h], [13, O]),
  6: R([4, O], [5, O, 8], [13, O]), // kacamata: batang penuh
  7: R([4, O], [5, s], [6, O], [7, s, 3], [10, O], [11, s], [12, O], [13, O]), // lensa + dua mata
  8: R([4, O], [5, h], [6, s, 2], [8, d], [9, s, 3], [12, h], [13, O]),
  9: R([4, O], [5, h], [6, s, 6], [12, h], [13, O]),
  10: R([5, O], [6, s, 2], [8, d, 2], [10, s, 2], [12, O]),
  11: R([6, O], [7, s, 4], [11, O]),
  12: R([5, O], [6, a, 6], [12, O]), // kerah
  13: R([3, O], [4, a, 10], [14, O]),
  14: R([3, O], [4, a, 10], [14, O]),
  15: R([3, O], [4, s], [5, a, 8], [13, s], [14, O]), // dua tangan
  16: R([3, O], [4, a, 10], [14, O]),
  17: R([4, O], [5, a, 8], [13, O]), // hem
  18: R([4, O], [5, P, 8], [13, O]),
  19: R([4, O], [5, P, 8], [13, O]),
  20: R([4, O], [5, P, 3], [10, P, 3], [13, O]), // celana terbelah
  21: R([4, O], [5, P, 3], [10, P, 3], [13, O]),
  22: R([3, O], [4, k, 4], [10, k, 4], [14, O]), // sepatu melebar
  23: R([3, O], [4, k, 4], [10, k, 4], [14, O]),
});

const bodySideU = grid({
  1: R([6, O, 5]),
  2: R([5, O], [6, h, 4], [10, O]),
  3: R([5, O], [6, h], [7, s, 4], [11, O]), // wajah menonjol ke kanan
  4: R([5, O], [6, h], [7, s, 4], [11, O]),
  5: R([5, O], [6, h], [7, O, 4], [11, O]), // kacamata samping
  6: R([5, O], [6, h], [7, s, 3], [10, O], [11, O]), // mata di depan
  7: R([5, O], [6, h], [7, s, 2], [9, d], [10, s], [11, O]), // hidung
  8: R([5, O], [6, h], [7, s, 4], [11, O]),
  9: R([6, O], [7, s, 4], [11, O]), // dagu
  10: R([6, O], [7, a, 3], [10, O]), // leher
  11: R([3, O], [4, a, 10], [14, O]), // bahu
  12: R([3, O], [4, a, 10], [14, O]),
  13: R([3, O], [4, a, 9], [13, s], [14, O]), // tangan di depan
  14: R([3, O], [4, a, 10], [14, O]),
  15: R([3, O], [4, a, 10], [14, O]),
  16: R([4, O], [5, a, 8], [13, O]), // hem
  17: R([4, O], [5, P, 8], [13, O]), // pinggul
});

const legsSideBase = {
  18: R([4, O], [5, P, 3], [10, P, 3], [13, O]),
  19: R([4, O], [5, P, 3], [10, P, 3], [13, O]),
  20: R([3, O], [4, k, 4], [9, O], [10, k, 3], [13, O]),
  21: R([3, O], [4, k, 4], [10, k, 4], [14, O]),
};
const legsStride = {
  18: { ...legsSideBase }[18],
  19: R([4, O], [5, P], [6, O], [9, O], [10, P, 3], [13, O]), // kaki belakang terangkat, depan maju
  20: R([3, O], [4, k], [5, O], [9, O], [10, k, 3], [13, O]),
  21: R([2, O], [3, k], [4, O], [9, O], [10, k, 3], [13, O]),
};
const legsStand = legsSideBase;

const SIDE_A = grid({ ...bodySideU, ...legsStride });
const SIDE_B = grid({ ...bodySideU, ...legsStand });

// ---------------------------------------------------------------------------
// Overlay headwear: grid kecil yang juga penuh 18×25, '.' = kepala dasar
// ---------------------------------------------------------------------------

const HEAD_PLAIN = grid();

const HEAD_ANTENNA_FRONT = grid({
  0: R([9, a]),
  1: R([9, O]),
});
const HEAD_ANTENNA_SIDE = grid({
  0: R([8, a]),
  1: R([8, O]),
});

const HEAD_BERET_FRONT = grid({
  0: R([3, O], [4, a, 6], [10, O]),
  1: R([3, O], [4, a], [5, O]),
});
const HEAD_BERET_SIDE = grid({
  0: R([4, O], [5, a, 5], [10, O]),
  1: R([4, O], [5, a], [6, O]),
});

const HEAD_CAP_FRONT = grid({
  0: R([3, O], [4, a, 6], [10, O]),
  1: R([4, O], [5, x], [6, x], [12, O]),
});
const HEAD_CAP_SIDE = grid({
  0: R([4, O], [5, a, 6]),
  1: R([4, O], [5, x]),
});

// ---------------------------------------------------------------------------
// Overlay prop (front & side)
// ---------------------------------------------------------------------------

const NONE = grid();

const CLIPBOARD_FRONT = grid({
  12: R([7, O], [8, x, 4], [12, O]), // klip
  13: R([6, O], [7, w, 6], [13, O]),
  14: R([6, O], [7, w, 6], [13, O]),
  15: R([6, O], [7, w, 6], [13, O]),
  16: R([6, O], [7, w, 6], [13, O]),
});
const CLIPBOARD_SIDE = grid({
  12: R([10, O], [11, w, 4], [15, O]),
  13: R([10, O], [11, w, 4], [15, O]),
});

const LAPTOP_FRONT = grid({
  12: R([7, O], [8, a, 3], [11, O]),
  13: R([7, O], [8, x], [9, a, 2], [11, O]),
  14: R([6, O], [7, w, 6], [13, O]),
  15: R([6, O], [7, O, 6], [13, O]),
});
const LAPTOP_SIDE = grid({
  10: R([8, O], [9, a], [10, O]),
  11: R([7, O], [8, x], [9, O]),
  12: R([6, O], [7, w, 3], [10, O]),
});

const APRON_FRONT = grid({
  12: R([7, w], [10, w]), // tali skep
  13: R([6, O], [7, w, 6], [13, O]),
  14: R([5, O], [6, w, 6], [12, O]),
  15: R([5, O], [6, w, 6], [12, O]),
  16: R([5, O], [6, w, 6], [12, O]),
  17: R([6, O], [7, w, 4], [11, O]),
});

const TERMINAL_FRONT = grid({
  13: R([6, O], [7, x], [8, w], [9, a], [10, O]), // toolbar
  14: R([6, O], [7, w, 4], [11, O]),
  15: R([6, O], [7, w, 2], [9, x], [10, w], [11, O]), // prompt kecil: █|_
  16: R([6, O], [7, w, 4], [11, O]),
});

const CLAPBOARD_FRONT = grid({
  12: R([6, O], [7, x], [8, w], [9, x], [10, w], [11, O]), // strip clap
  13: R([6, O], [7, w, 4], [11, O]),
  14: R([6, O], [7, w, 4], [11, O]),
  15: R([6, O], [7, w, 4], [11, O]),
});
const CLAPBOARD_SIDE = grid({
  12: R([9, O], [10, x], [11, w], [12, x], [13, w], [14, O]),
  13: R([9, O], [10, w, 4], [14, O]),
});

// ---------------------------------------------------------------------------
// Palet & karakter. Kulit langsat = 2 shade (BASE.s, BASE.d) semua karakter.
// ---------------------------------------------------------------------------

const BASE = {
  [O]: [43, 38, 32, 255],
  [h]: [46, 33, 25, 255],
  [s]: [241, 211, 160, 255],
  [d]: [214, 168, 106, 255],
  [w]: [247, 244, 236, 255],
  [P]: [65, 69, 78, 255],
  [k]: [35, 38, 44, 255],
};

const CHARACTERS = [
  {
    id: 'ld',
    palette: { [a]: [76, 154, 42, 255], [x]: [55, 114, 30, 255] }, // hijau daun
    headFront: HEAD_PLAIN, headSide: HEAD_PLAIN,
    extraFront: CLIPBOARD_FRONT, extraSide: CLIPBOARD_SIDE,
  },
  {
    id: 'ai',
    palette: { [a]: [63, 127, 193, 255], [x]: [44, 93, 143, 255] }, // biru baja
    headFront: HEAD_ANTENNA_FRONT, headSide: HEAD_ANTENNA_SIDE,
    extraFront: LAPTOP_FRONT, extraSide: LAPTOP_SIDE,
  },
  {
    id: 'web',
    palette: { [a]: [107, 91, 149, 255], [x]: [78, 65, 112, 255] }, // ungu slate
    headFront: HEAD_PLAIN, headSide: HEAD_PLAIN,
    extraFront: TERMINAL_FRONT, extraSide: NONE,
  },
  {
    id: 'design',
    palette: { [a]: [232, 97, 60, 255], [x]: [178, 74, 45, 255] }, // jingga terbakar
    headFront: HEAD_BERET_FRONT, headSide: HEAD_BERET_SIDE,
    extraFront: APRON_FRONT, extraSide: NONE,
  },
  {
    id: 'video',
    palette: { [a]: [200, 16, 46, 255], [x]: [143, 12, 33, 255] }, // merah crimson
    headFront: HEAD_CAP_FRONT, headSide: HEAD_CAP_SIDE,
    extraFront: CLAPBOARD_FRONT, extraSide: CLAPBOARD_SIDE,
  },
];

// ---------------------------------------------------------------------------
// Compose + encode PNG
// ---------------------------------------------------------------------------

function compose(bodies, head, extra) {
  return bodies.map((line, y) => {
    let out = '';
    for (let i = 0; i < W; i += 1) {
      let ch = line[i];
      if (head[y][i] !== _) ch = head[y][i];
      if (extra[y][i] !== _) ch = extra[y][i];
      out += ch;
    }
    return out;
  });
}

function crc32(buf) {
  let c = 0xffffffff;
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n += 1) {
    c = n;
    for (let i = 0; i < 8; i += 1) c = c & 1 ? (0xedb88320 ^ (c >>> 1)) : c >>> 1;
    table[n] = c;
  }
  c = 0xffffffff;
  for (const byte of buf) c = table[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encodePng(pixels, pxWidth, pxHeight) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(pxWidth, 0);
  ihdr.writeUInt32BE(pxHeight, 4);
  ihdr[8] = 8;
  ihdr[9] = 6; // RGBA
  const raw = Buffer.alloc(pxHeight * (1 + pxWidth * 4));
  let off = 0;
  for (let y = 0; y < pxHeight; y += 1) {
    raw[off] = 0;
    off += 1;
    for (let x = 0; x < pxWidth; x += 1) {
      const px = pixels[y * pxWidth + x];
      raw[off] = px[0];
      raw[off + 1] = px[1];
      raw[off + 2] = px[2];
      raw[off + 3] = px[3];
      off += 4;
    }
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', deflateSync(raw, { level: 9 })),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

function rasterize(frames, colors) {
  const sheetW = W * SCALE * frames.length;
  const pxHeight = H * SCALE;
  const transparent = [0, 0, 0, 0];
  const pixels = [];
  for (let y = 0; y < pxHeight; y += 1) {
    for (let x = 0; x < sheetW; x += 1) {
      const fi = Math.floor(x / (W * SCALE));
      const ch = frames[fi][Math.floor(y / SCALE)][Math.floor((x % (W * SCALE)) / SCALE)];
      pixels.push(ch === _ ? transparent : (colors[ch] ?? transparent));
    }
  }
  return { pixels, width: sheetW, height: pxHeight };
}

function drawPreview(id, frames) {
  console.log(`\n=== ${id} ===`);
  for (let y = 0; y < H; y += 1) {
    const parts = frames.map((f) => f[y].replaceAll('_', ' '));
    const line = parts.join('   ');
    if (line.trim()) console.log(String(y).padStart(2, ' '), '|', line);
  }
}

const preview = process.argv.includes('--preview');
const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'v6', 'sprites');
const geometryFile = join(dirname(fileURLToPath(import.meta.url)), '..', 'content', 'v6-sprite-geometry.ts');

for (const char of CHARACTERS) {
  const colors = { ...BASE, ...char.palette };
  const frames = [
    compose(bodyFront, char.headFront, char.extraFront),
    compose(SIDE_A, char.headSide, char.extraSide),
    compose(SIDE_B, char.headSide, char.extraSide),
  ];
  if (preview) {
    drawPreview(char.id, frames);
  } else {
    const { pixels, width, height } = rasterize(frames, colors);
    const png = encodePng(pixels, width, height);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, `${char.id}.png`), png);
    console.log(`${char.id}.png  ${width}x${height}  ${png.length} bytes`);
  }
}

/* Geometri programatik (SEL tampilan): W*SCALE × H*SCALE.
   Script ingest-sprites.mjs menimpa entri karakter yang di-ingest. */
const geometryLines = CHARACTERS.map(
  (char) => `  ${JSON.stringify(char.id)}: { w: ${W * SCALE}, h: ${H * SCALE}, p: ${SCALE} },`,
);
writeFileSync(
  geometryFile,
  `/**
 * Geometri sprite per karakter (SEL, bukan piksel PNG): w/h = ukuran satu
 * frame, p = ukuran satu piksel logis di file asli (untuk downscale).
 *
 * File ini DIHASILKAN: scripts/make-sprites.mjs dan scripts/ingest-sprites.mjs
 * menulisnya ulang setiap dijalankan; jangan edit manual.
 */

export const V6_SPRITE_GEOMETRY: Record<string, { w: number; h: number; p: number }> = {
${geometryLines.join('\n')}
};
`,
);
console.log('geometry: programatik 18x25 seluruhnya');
