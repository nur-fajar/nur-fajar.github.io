/**
 * Guard halaman /v8 — menjaga LINGKUP dan sumber teks, bukan jumlah baris.
 * Pola yang sama dengan tes versi sebelumnya:
 *   1. Seluruh teks v8 diturunkan dari kanon content/v7 (tidak ada kalimat
 *      yang diketik ulang di halaman).
 *   2. Ban em-dash berlaku untuk copy yang dirender (string literal di
 *      berkas v8 — komentar bebas memakainya, seperti kanon).
 *   3. CSS v8 tersimulasi penuh di prefiks kelasnya sendiri (tidak bocor
 *      ke dunia lain) — komentar dan data-URI dikecualikan.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (p: string) => readFileSync(join(root, p), 'utf8');

const V8_FILES = [
  'app/v8/page.tsx',
  'app/v8/layout.tsx',
  'app/v8/v8.css',
  'components/v8/Motion.tsx',
  'components/v8/Nav.tsx',
];

describe('/v8 scope and canon', () => {
  it('menurunkan seluruh teksnya dari kanon content/v7', () => {
    const page = read('app/v8/page.tsx');
    expect(page).toContain("from '@/content/v7'");
    // Email tidak diketik ulang di halaman — lewat CONTACT/V5_FOUNDER_MAILTO.
    expect(page).not.toMatch(/hi@nurfajar\.com/);
  });

  it('menjaga ban em-dash di string literal yang dirender', () => {
    for (const file of V8_FILES) {
      const source = read(file);
      const literals = [
        ...source.matchAll(/'([^'\n]*)'|"([^"\n]*)"|`([^`]*)`/g),
      ].map((m) => m[1] ?? m[2] ?? m[3] ?? '');
      for (const text of literals) {
        expect(text, `${file}: ${text}`).not.toMatch(/—/);
      }
    }
  });

  it('menjaga CSS v8 bernama-prefiks v8- (dan skip-link bersama)', () => {
    const css = read('app/v8/v8.css')
      // komentar dan data-URI bukan selector
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/url\([^)]*\)/g, '');
    const classes = [...css.matchAll(/\.([a-zA-Z][\w-]*)/g)].map((m) => m[1]);
    const foreign = classes.filter(
      (c) => c !== 'v8' && !c.startsWith('v8-') && c !== 'skip-link',
    );
    expect(foreign).toEqual([]);
  });
});
