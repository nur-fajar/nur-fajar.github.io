/**
 * Membuat contact sheet (mosaik thumbnail berlabel) dari semua kandidat
 * media di _inbox, supaya pemilihan file bisa dilakukan secara visual
 * dengan minimal pembacaan gambar.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const DIR = 'public/v6/sprites/_inbox';
const files = readdirSync(DIR)
  .filter((f) => f.startsWith('db-'))
  .sort((a, b) => Number(a.match(/db-(\d+)/)[1]) - Number(b.match(/db-(\d+)/)[1]));

const TILE_W = 300;
const TILE_H = 220;
const COLS = 4;

async function tilesOf(file) {
  const buf = readFileSync(join(DIR, file));
  const img = sharp(buf, { failOn: 'none' }).rotate();
  const meta = await img.metadata();
  return img
    .resize(TILE_W - 10, TILE_H - 30, { fit: 'inside' })
    .png()
    .toBuffer()
    .then((data) => ({ file, buf, data, meta }));
}

async function main() {
  const tiles = [];
  for (const file of files) {
    try {
      tiles.push(await tilesOf(file));
    } catch {
      console.log('skip', file);
    }
  }
  const perSheet = 12;
  let idx = 0;
  let sheetNo = 0;
  while (idx < tiles.length) {
    const chunk = tiles.slice(idx, idx + perSheet);
    const rows = Math.ceil(perSheet / COLS);
    const canvasWidth = COLS * TILE_W;
    const canvasHeight = rows * TILE_H;
    const comps = [];
    for (let i = 0; i < chunk.length; i += 1) {
      const t = chunk[i];
      const colX = (i % COLS) * TILE_W;
      const rowY = Math.floor(i / COLS) * TILE_H;
      const tw = Math.min(TILE_W - 10, (await sharp(t.data).metadata()).width);
      const th = Math.min(TILE_H - 30, (await sharp(t.data).metadata()).height);
      comps.push({
        input: t.data,
        left: colX + Math.floor((TILE_W - tw) / 2),
        top: rowY + 24,
      });
      const label = Buffer.from(
        `<svg width="${TILE_W}" height="22"><rect width="100%" height="100%" fill="#ffffff"/><text x="6" y="16" font-family="monospace" font-size="13" fill="#000000">${idx + i} ${t.file.slice(0, 38)}</text></svg>`,
      );
      comps.push({ input: label, left: colX, top: rowY });
    }
    const sheet = join(DIR, `_contact-${sheetNo}.png`);
    await sharp({
      create: { width: canvasWidth, height: canvasHeight, channels: 3, background: { r: 245, g: 245, b: 245 } },
    })
      .composite(comps)
      .png()
      .toFile(sheet);
    console.log(sheet, `items ${idx}..${idx + chunk.length - 1}`);
    sheetNo += 1;
    idx += perSheet;
  }
}

main();
