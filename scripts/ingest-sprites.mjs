/**
 * Ingest sheet sprite hasil image-gen (Gemini dsb.) menuju sprite siap stage.
 *
 * Input : public/v6/sprites/_inbox/{person}-source.png  (sheet 3 sel, latar
 *         magenta, pembatas hitam, urutan [walkA, walkB, front])
 * Output: public/v6/sprites/{person}.png                (sheet 3 sel, transparan,
 *         urutan [front, walkA, walkB]) + perbarui content/v6-sprite-geometry.ts
 *
 * Tahap: flood-fill magenta dari tepi â†’ deteksi pembatas hitam â†’ potong 3 sel
 * â†’ bbox per sel â†’ ukur ukuran piksel logis (GCD langkah transisi warna) â†’
 * downscale integer â†’ align bawah â†’ tulis sheet + manifest geometri.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const INBOX = join(ROOT, 'public', 'v6', 'sprites', '_inbox');
const OUTDIR = join(ROOT, 'public', 'v6', 'sprites');
const GEOMETRY_FILE = join(ROOT, 'content', 'v6-sprite-geometry.ts');

const PERSON_BY_SOURCE = {
  'learning-source.png': 'ld',
  'automation-source.png': 'ai',
  'web-source.png': 'web',
  'design-source.png': 'design',
  'video-source.png': 'video',
};

/** Jarak warna euclidean kuadrat. */
function dist2(px, i, r, g, b) {
  const dr = px[i] - r;
  const dg = px[i + 1] - g;
  const db2 = px[i + 2] - b;
  return dr * dr + dg * dg + db2 * db2;
}

/** Flood-fill latar dari semua tepi: blob latar jadi transparan.
 *  Predikat: magenta dominan (r & b tinggi, g rendah) â€” menangkap juga
 *  bayangan pink yang lebih gelap, tapi berhenti di outline gelap karakter. */
function removeBackground(w, h, px) {
  const visited = new Uint8Array(w * h);
  const queue = [];
  const isPink = (i) => {
    const r = px[i];
    const g = px[i + 1];
    const b = px[i + 2];
    return r > 110 && b > 110 && g < (r + b) / 4 + 30 && Math.abs(r - b) < 90;
  };
  const push = (x, y) => {
    const idx = y * w + x;
    if (visited[idx]) return;
    if (!isPink(idx * 4)) return;
    visited[idx] = 1;
    px[idx * 4 + 3] = 0;
    queue.push([x, y]);
  };
  for (let x = 0; x < w; x += 1) {
    push(x, 0);
    push(x, h - 1);
  }
  for (let y = 0; y < h; y += 1) {
    push(0, y);
    push(w - 1, y);
  }
  while (queue.length) {
    const [cx, cy] = queue.pop();
    if (cx > 0) push(cx - 1, cy);
    if (cx < w - 1) push(cx + 1, cy);
    if (cy > 0) push(cx, cy - 1);
    if (cy < h - 1) push(cx, cy + 1);
  }
}

/** Sampel warna atas kiri (mengabaikan tepi 2px). */
function pickBgColor(w, h, px) {
  let sum = [0, 0, 0];
  let count = 0;
  for (let x = 2; x < 12; x += 1) {
    for (const y of [2, Math.floor(h / 2), h - 3]) {
      const i = (y * w + x) * 4;
      sum = [sum[0] + px[i], sum[1] + px[i + 1], sum[2] + px[i + 2]];
      count += 1;
    }
  }
  return [Math.round(sum[0] / count), Math.round(sum[1] / count), Math.round(sum[2] / count)];
}

/** Kolom-kolom yang isinya hitam murni hampir full-height (pembatas antar sel).
 *  Threshold ketat: rambut/celana karakter juga gelap, tapi tidak full-height. */
function blackColumnBands(w, h, px) {
  let opaque = 0;
  for (let y = 0; y < h; y += 1) if (px[(y * w + 0) * 4 + 3] > 30) opaque += 1;
  void opaque;
  const flags = [];
  for (let x = 0; x < w; x += 1) {
    let dark = 0;
    for (let y = 0; y < h; y += 1) {
      const i = (y * w + x) * 4;
      const lum = 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];
      if (lum < 40 && px[i + 3] > 30) dark += 1;
    }
    flags.push(dark / h > 0.9);
  }
  const bands = [];
  let start = -1;
  for (let x = 0; x < w; x += 1) {
    if (flags[x] && start === -1) start = x;
    if (!flags[x] && start !== -1) {
      if (x - start <= 24 && start > 0 && x < w - 1) bands.push([start, x - 1]);
      start = -1;
    }
  }
  return bands;
}

/**
 * Rentang sel: kolom konten (ada piksel non-transparan) digroup jadi run;
 * band pembatas dipaksa transparan dahulu supaya tidak menyambung sel.
 */
function contentRanges(w, h, px) {
  const content = new Array(w).fill(false);
  for (let x = 0; x < w; x += 1) {
    let count = 0;
    for (let y = 0; y < h; y += 1) {
      if (px[(y * w + x) * 4 + 3] > 25) {
        count += 1;
        if (count > 3) break;
      }
    }
    content[x] = count > 3;
  }
  const runs = [];
  let start = -1;
  for (let x = 0; x < w; x += 1) {
    if (content[x] && start === -1) start = x;
    if (!content[x] && start !== -1) {
      runs.push([start, x]);
      start = -1;
    }
  }
  if (start !== -1) runs.push([start, w]);
  /* gabungkan run yang restart gap-nya < 8px (noise AA) */
  const merged = [runs[0]];
  for (const r of runs.slice(1)) {
    const last = merged[merged.length - 1];
    if (r[0] - last[1] < 8) last[1] = r[1];
    else merged.push(r);
  }
  return merged.map(([a, b]) => [a, b]).filter(([a, b]) => b - a >= 60);
}

/** bbox konten non-transparan dalam rentang [x0, x1). */
function bboxIn(w, h, px, x0, x1) {
  let minX = x1;
  let maxX = x0;
  let minY = h;
  let maxY = 0;
  for (let y = 0; y < h; y += 1) {
    for (let x = x0; x < x1; x += 1) {
      const a = px[(y * w + x) * 4 + 3];
      if (a > 20) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (minX > maxX || minY > maxY) return null;
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

/**
 * Deteksi jumlah sel: coba 3 lalu 4 (sheet model bisa 3-frame atau
 * 4-frame walk cycle + pose depan). Diterima kalau semua sel punya konten
 * dan karakter tidak meluber ke sel tetangga (bbox â‰¤ 85% lebar rentang).
 */
function detectCellRanges(w, h, px) {
  for (const n of [3, 4]) {
    const wn = Math.floor(w / n);
    const ranges = [];
    let ok = true;
    for (let i = 0; i < n; i += 1) {
      const box = bboxIn(w, h, px, wn * i, i === n - 1 ? w : wn * (i + 1));
      if (!box || box.w > wn * 0.97) {
        ok = false;
        break;
      }
      ranges.push([wn * i, i === n - 1 ? w : wn * (i + 1)]);
    }
    if (ok) return { n, ranges, wn };
  }
  throw new Error('Jumlah sel tidak terdeteksi (coba 3 & 4, keduanya gagal)');
}

/** Ukuran piksel logis: GCD jarak antar transisi warna pada beberapa baris. */
function logicalPixelSize(w, h, px) {
  const steps = [];
  const sampleRows = [];
  for (let y = Math.floor(h / 4); y < h; y += Math.max(1, Math.floor(h / 24))) sampleRows.push(y);
  for (const y of sampleRows) {
    let last = -1;
    for (let x = 1; x < w; x += 1) {
      const i = (y * w + x) * 4;
      const prev = (y * w + x - 1) * 4;
      const delta =
        Math.abs(px[i] - px[prev]) + Math.abs(px[i + 1] - px[prev + 1]) + Math.abs(px[i + 2] - px[prev + 2]) + Math.abs(px[i + 3] - px[prev + 3]);
      if (delta > 40) {
        if (last !== -1) steps.push(x - last);
        last = x;
      }
    }
  }
  const counts = new Map();
  for (const st of steps) {
    if (st < 2 || st > 60) continue;
    const bucket = Math.round(st);
    counts.set(bucket, (counts.get(bucket) ?? 0) + 1);
  }
  let best = 2;
  let bestCount = -1;
  for (const [size, count] of counts) {
    if (count > bestCount) {
      best = size;
      bestCount = count;
    }
  }
  return best;
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

/**
 * Beda persen band kaki (bawah yFrac) antara dua frame jalan, TAHAN translasi:
 * band masing-masing di-crop, lalu dicoba geser horizontal -MAX..+MAX dan
 * diambil diff terkecil. Tanpa ini, frame B yang kontennya geser beberapa
 * piksel saja terbaca "sangat beda" padahal posenya sama.
 */
function bandDiff(boxA, bufA, boxB, bufB, yFrac = 0.82) {
  const bandA = Math.round(boxA.h * (1 - yFrac));
  const bandB = Math.round(boxB.h * (1 - yFrac));
  const hb = Math.min(bandA, bandB);
  if (hb <= 0) return 1;
  const wA = boxA.w;
  const wB = boxB.w;
  const MAX_SHIFT = 24;
  let best = 1;
  for (let shift = -MAX_SHIFT; shift <= MAX_SHIFT; shift += 2) {
    let diff = 0;
    let total = 0;
    for (let y = 0; y < hb; y += 1) {
      for (let x = 0; x < Math.min(wA, wB); x += 1) {
        const sx = x + shift;
        if (sx < 0 || sx >= wB) continue;
        const iA = ((boxA.h - hb + y) * wA + x) * 4;
        const iB = ((boxB.h - hb + y) * wB + sx) * 4;
        const opA = bufA[iA + 3] > 20;
        const opB = bufB[iB + 3] > 20;
        if (opA !== opB) {
          diff += 1;
        } else if (opA) {
          const d = Math.abs(bufA[iA] - bufB[iB]) + Math.abs(bufA[iA + 1] - bufB[iB + 1]) + Math.abs(bufA[iA + 2] - bufB[iB + 2]);
          if (d > 60) diff += 1;
        }
        total += 1;
      }
    }
    if (total) best = Math.min(best, diff / total);
  }
  return best;
}

/** Mirror horizontal band kaki (di bawah yFrac) di sekitar pusat bbox band. */
function mirrorLegBand(box, buf, yFrac = 0.82) {
  const out = Buffer.from(buf);
  const yStart = Math.round(box.h * yFrac);
  // bbox horizontal konten dalam band:
  let minX = box.w;
  let maxX = 0;
  for (let y = yStart; y < box.h; y += 1) {
    for (let x = 0; x < box.w; x += 1) {
      if (buf[(y * box.w + x) * 4 + 3] > 20) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
      }
    }
  }
  if (minX > maxX) return out;
  for (let y = yStart; y < box.h; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const src = (y * box.w + x) * 4;
      const dst = (y * box.w + (minX + maxX - x)) * 4;
      out[dst] = buf[src];
      out[dst + 1] = buf[src + 1];
      out[dst + 2] = buf[src + 2];
      out[dst + 3] = buf[src + 3];
    }
  }
  return out;
}

/** Ambil cell sebagai buffer RGBA terpisah. */
function sliceCell(buf, meta, box) {
  const ch = meta.channels >= 4 ? 4 : 4;
  const out = Buffer.alloc(box.w * box.h * 4);
  for (let y = 0; y < box.h; y += 1) {
    for (let x = 0; x < box.w; x += 1) {
      const src = ((box.y + y) * meta.width + (box.x + x)) * 4;
      const dst = (y * box.w + x) * 4;
      out[dst] = buf[src];
      out[dst + 1] = buf[src + 1];
      out[dst + 2] = buf[src + 2];
      out[dst + 3] = buf[src + 3];
    }
  }
  void ch;
  return out;
}

/** Cari ukuran piksel dari sheet: gabungkan GCD semua sel. */
function sheetPixelSize(cells) {
  const sizes = cells.map((c) => c.p).filter((p) => p >= 2 && p <= 60);
  if (!sizes.length) return 1;
  const g = sizes.reduce(gcd);
  return g >= 2 ? g : sizes[0];
}

async function ingestOne(sourceName, targetId) {
  const srcPath = join(INBOX, sourceName);
  const buf = readFileSync(srcPath);
  const img = sharp(buf, { failOn: 'none' }).ensureAlpha();
  const meta = await img.raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = meta.info;
  const px = meta.data;

  const bgP = pickBgColor(w, h, px);
  void bgP;
  removeBackground(w, h, px);

  const bands = blackColumnBands(w, h, px);
  for (const [x0, x1] of bands) {
    for (let y = 0; y < h; y += 1) {
      for (let x = x0; x <= x1; x += 1) px[(y * w + x) * 4 + 3] = 0;
    }
  }
  /* Sel = pembagian rata (3 atau 4). Deteksi otomatis; bbox per sel yang
     mengambil konten. Sel terakhir selalu pose depan; sisanya kandidat jalan. */
  const detected = detectCellRanges(w, h, px);
  const cellRanges = detected.ranges;
  const cells = [];
  for (const [x0, x1] of cellRanges) {
    const box = bboxIn(w, h, px, x0, x1);
    if (!box) continue;
    const sub = sliceCell(px, { width: w }, { ...box });
    const p = logicalPixelSize(box.w, box.h, sub);
    cells.push({ box, buf: sub, p });
  }
  if (cells.length !== detected.n) {
    throw new Error(
      `${sourceName}: terdeteksi ${cells.length}/${detected.n} sel. Range: ${JSON.stringify(cellRanges)}`,
    );
  }

  const P = sheetPixelSize(cells);
  /* Frame jalan = semua sel KECUALI terakhir (pose depan). Dua frame siklus:
     pilih pasangan dengan band kaki PALING berbeda â€” artis sheet 4-frame
     mengirim 3 fase, dan dua yang paling berbeda itulah siklusnya. */
  const walkCandidates = cells.slice(0, -1);
  const frontCell = cells[cells.length - 1];
  let bestPair = [walkCandidates[0], walkCandidates[1]];
  let bestDiff = -1;
  if (walkCandidates.length > 2) {
    for (let i = 0; i < walkCandidates.length; i += 1) {
      for (let j = i + 1; j < walkCandidates.length; j += 1) {
        const diff = bandDiff(walkCandidates[i].box, walkCandidates[i].buf, walkCandidates[j].box, walkCandidates[j].buf);
        if (diff > bestDiff) {
          bestDiff = diff;
          bestPair = [walkCandidates[i], walkCandidates[j]];
        }
      }
    }
  } else {
    bestDiff = bandDiff(walkCandidates[0].box, walkCandidates[0].buf, walkCandidates[1].box, walkCandidates[1].buf);
  }
  const [walkA, walkB0] = bestPair;
  let walkB = walkB0;
  let walkBNote = 'sumber';
  if (bestDiff < 0.1) {
    /* Frame jalan tidak benar-benar berbeda (art model gagal swap): sintesis
       frame B dari A dengan mirror band kaki. Seluruh entri sel diganti
       (bbox ikut A) â€” jika hanya buffer-nya, beda lebar bbox menggeser
       tiap baris (artefak scanline). */
    walkB = { box: walkA.box, buf: mirrorLegBand(walkA.box, walkA.buf), p: walkB.p };
    walkBNote = `sinthesis-mirror (legDiff ${(bestDiff * 100).toFixed(1)}%)`;
  } else {
    walkBNote = `sumber (legDiff ${(bestDiff * 100).toFixed(1)}%)`;
  }
  console.log(`  sel: ${detected.n}, walk B: ${walkBNote}`);
  const synthCells = [frontCell, walkA, walkB];
  /* Downscale integer benar-benar terjadi (nearest per blok PÃ—P). */
  const framesRaw = await Promise.all(
    synthCells.map(async (cell) => {
      const fw = Math.round(cell.box.w / P);
      const fh = Math.round(cell.box.h / P);
      const frame = await sharp(cell.buf, { raw: { width: cell.box.w, height: cell.box.h, channels: 4 } })
        .resize(fw, fh, { kernel: 'nearest' })
        .raw()
        .toBuffer();
      if (process.env.INGEST_DEBUG) {
        await sharp(cell.buf, { raw: { width: cell.box.w, height: cell.box.h, channels: 4 } })
          .resize({ width: 260, kernel: 'nearest' })
          .flatten({ background: '#ffffff' })
          .png()
          .toFile(join('C:/Users/ASUS/AppData/Local/Temp/opencode', `${targetId}-cell-${cells.indexOf(cell)}.png`));
      }
      return { w: fw, h: fh, buf: frame };
    }),
  );
  /* urutan final sheet: [pose depan, jalan A, jalan B] â€” dipakai CSS cell0 = depan */
  const ordered = framesRaw;

  const frameW = Math.max(...ordered.map((f) => f.w)) + 2;
  const frameH = Math.max(...ordered.map((f) => f.h)) + 2;
  const sheetW = frameW * 3;
  const canvas = Buffer.alloc(sheetW * frameH * 4);
  ordered.forEach((frame, fi) => {
    const offsetX = fi * frameW + Math.floor((frameW - frame.w) / 2);
    const offsetY = frameH - frame.h; // align bawah (lantai)
    for (let y = 0; y < frame.h; y += 1) {
      for (let x = 0; x < frame.w; x += 1) {
        const src = (y * frame.w + x) * 4;
        const dst = ((offsetY + y) * sheetW + offsetX + x) * 4;
        canvas[dst] = frame.buf[src];
        canvas[dst + 1] = frame.buf[src + 1];
        canvas[dst + 2] = frame.buf[src + 2];
        canvas[dst + 3] = frame.buf[src + 3];
      }
    }
  });

  /* Pasca-bersih: sisa piksel pink dominan (AA latar) jadi transparan. */
  for (let i = 0; i < canvas.length; i += 4) {
    const r = canvas[i];
    const g = canvas[i + 1];
    const b = canvas[i + 2];
    if (canvas[i + 3] > 0 && r > 140 && b > 140 && g < (r + b) / 4 && Math.abs(r - b) < 90) {
      canvas[i + 3] = 0;
    }
  }

  const png = await sharp(canvas, { raw: { width: sheetW, height: frameH, channels: 4 } }).png().toBuffer();
  writeFileSync(join(OUTDIR, `${targetId}.png`), png);
  console.log(`${targetId}.png  sheet ${sheetW}x${frameH} (frame ${frameW}x${frameH}, pixel ${P})`);
  return { id: targetId, frameW, frameH, P };
}

function updateGeometry(entries) {
  const existing = {};
  if (existsSync(GEOMETRY_FILE)) {
    const text = readFileSync(GEOMETRY_FILE, 'utf8');
    for (const match of text.matchAll(/['"`]([a-z]+)['"`]:\s*\{\s*w:\s*(\d+),\s*h:\s*(\d+),\s*p:\s*(\d+)/g)) {
      existing[match[1]] = { w: Number(match[2]), h: Number(match[3]), p: Number(match[4]) };
    }
  }
  for (const e of entries) existing[e.id] = { w: e.frameW, h: e.frameH, p: e.P };
  const ids = ['ld', 'ai', 'web', 'design', 'video'];
  const lines = ids
    .filter((id) => existing[id])
    .map((id) => `  ${JSON.stringify(id)}: { w: ${existing[id].w}, h: ${existing[id].h}, p: ${existing[id].p} },`);
  const body = `/**
 * Geometri sprite per karakter (SEL, bukan piksel PNG): w/h = ukuran satu
 * frame, p = ukuran satu piksel logis di file asli (untuk downscale).
 *
 * File ini DIHASILKAN: scripts/make-sprites.mjs dan scripts/ingest-sprites.mjs
 * menulisnya ulang setiap dijalankan; jangan edit manual.
 */

export const V6_SPRITE_GEOMETRY: Record<string, { w: number; h: number; p: number }> = {
${lines.join('\n')}
};
`;
  writeFileSync(GEOMETRY_FILE, body);
  console.log(`geometry: ${Object.keys(existing).join(', ')}`);
}

async function main() {
  const sources = readdirSync(INBOX).filter((f) => f.endsWith('-source.png') && PERSON_BY_SOURCE[f]);
  if (!sources.length) {
    console.log('Tidak ada *-source.png di inbox.');
    return;
  }
  const entries = [];
  for (const source of sources) {
    entries.push(await ingestOne(source, PERSON_BY_SOURCE[source]));
  }
  updateGeometry(entries);
}

main();

