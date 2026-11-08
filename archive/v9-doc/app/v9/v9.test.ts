/**
 * Guard halaman /v9 — menjaga LINGKUP, sumber teks, dan jalur fallback.
 *
 * Pola yang sama dengan tes versi sebelumnya, plus tiga hal yang khas v9:
 *   1. Ban em-dash berlaku untuk copy yang dirender (string literal di
 *      berkas v9), bukan untuk komentar.
 *   2. Halaman v9 tidak boleh mengetik ulang angka yang milik ledger.
 *   3. Shader wajib punya jalur tanpa WebGL dan jalur reduced motion.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (p: string) => readFileSync(join(root, p), 'utf8');

const V9_FILES = [
  'app/v9/page.tsx',
  'app/v9/layout.tsx',
  'app/v9/v9.css',
  'content/v9.ts',
  'components/v9/Shader.tsx',
  'components/v9/Motion.tsx',
  'components/v9/Nav.tsx',
  'components/v9/Hero.tsx',
  'components/v9/Bio.tsx',
  'components/v9/WorkBento.tsx',
  'components/v9/History.tsx',
  'components/v9/Praise.tsx',
  'components/v9/Footer.tsx',
];

/**
 * Buang komentar tanpa merusak string di dalamnya.
 *
 * Scanner kecil, bukan regex: kalau string literal berisi "//" (URL) atau
 * "/*" (bagian dari URL), versi regex akan memotong string jadi pseudo
 * dan 검사 ban em-dash jadi tidak frenzy.
 */
function stripComments(source: string): string {
  let out = '';
  let i = 0;
  while (i < source.length) {
    const c = source[i];
    const next = source[i + 1];
    if (c === '/' && next === '/') {
      while (i < source.length && source[i] !== '\n') i++;
      continue;
    }
    if (c === '/' && next === '*') {
      i += 2;
      while (i < source.length && !(source[i] === '*' && source[i + 1] === '/')) i++;
      i += 2;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') {
      const quote = c;
      out += c;
      i++;
      while (i < source.length) {
        if (source[i] === '\\') {
          out += source[i] + (source[i + 1] ?? '');
          i += 2;
          continue;
        }
        out += source[i];
        if (source[i] === quote) {
          i++;
          break;
        }
        i++;
      }
      continue;
    }
    out += c;
    i++;
  }
  return out;
}

/** Semua string literal di berkas, setelah komentar dibuang. */
function literals(source: string): string[] {
  const clean = stripComments(source);
  return [...clean.matchAll(/'([^'\n]*)'|"([^"\n]*)"|`([^`]*)`/g)].map(
    (m) => m[1] ?? m[2] ?? m[3] ?? '',
  );
}

describe('/v9 scope and canon', () => {
  it('menurunkan seluruh teksnya dari kanon content/v9', () => {
    const page = read('app/v9/page.tsx');
    expect(page).toContain("from '@/content/v9'");
    // Email tidak diketik ulang di halaman, lewat kanon.
    expect(page).not.toMatch(/hi@nurfajar\.com/);
  });

  it('menjaga ban em-dash di string literal yang dirender', () => {
    for (const file of V9_FILES) {
      for (const text of literals(read(file))) {
        expect(text, `${file}: ${text}`).not.toMatch(/—/);
      }
    }
  });

  it('tidak mengetik ulang angka yang milik ledger', () => {
    const forbidden = ['300+', '9.0/10', '96%', '150+', '100+', '~11h', '24 posts'];
    for (const file of V9_FILES) {
      if (!file.endsWith('.ts') && !file.endsWith('.tsx')) continue;
      const source = stripComments(read(file));
      for (const needle of forbidden) {
        expect(source, `${file} memuat "${needle}"`).not.toContain(needle);
      }
    }
  });

  it('menjaga CSS v9 bernama-prefiks v9- (dan skip-link bersama)', () => {
    const css = read('app/v9/v9.css')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/url\([^)]*\)/g, '');
    const classes = [...css.matchAll(/\.([a-zA-Z][\w-]*)/g)].map((m) => m[1]);
    const foreign = classes.filter(
      (c) => c !== 'v9-root' && !c.startsWith('v9-') && c !== 'skip-link',
    );
    expect(foreign).toEqual([]);
  });

  it('menjaga scope: v9 tidak mengimpor komponen versi lain', () => {
    for (const file of V9_FILES) {
      if (!file.endsWith('.ts') && !file.endsWith('.tsx')) continue;
      const source = stripComments(read(file));
      expect(source, `${file} mengimpor versi lain`).not.toMatch(
        /@\/components\/(v[3-8]|site)\//,
      );
    }
  });

  it('menjaga shader punya jalur fallback dan jalur reduced motion', () => {
    const shader = read('components/v9/Shader.tsx');
    expect(shader).toContain('prefers-reduced-motion');
    // Canvas adalah dekorasi: harus disembunyikan dari screen reader.
    expect(shader).toContain('aria-hidden');
    // Tanpa WebGL, latar tetap ada: fallback CSS di komponen hero.
    expect(read('components/v9/Hero.tsx')).toContain('v9-hero__fallback');
    expect(read('app/v9/v9.css')).toContain('.v9-hero__fallback');
  });

  it('menjaga halaman tetap terbaca tanpa JavaScript', () => {
    // Menu mobile memakai <details> bawaan browser, bukan state React.
    const nav = read('components/v9/Nav.tsx');
    expect(nav).toContain('<details');
    // Teks tidak boleh disembunyikan lewat CSS sebagai state awal: semua
    // efek masuk dari state GSAP saat runtime, bukan dari CSS.
    const motion = read('components/v9/Motion.tsx');
    expect(motion).toContain("gsap.from");
  });

  it('menjaga grid testimoni: isi tidak pernah berputar, gerak mengikuti sistem', () => {
    const praise = stripComments(read('components/v9/Praise.tsx'));
    // Yang menyala hanya kartu yang dibaca manusia. UI yang bergerak
    // sendiri (timer) adalah tanda "dari template" (audit 2026-10-20).
    expect(praise).not.toMatch(/setInterval|setTimeout|framer-motion/);
    // Kutipannya harus datang dari kanon, bukan ditulis di komponen.
    expect(read('components/v9/Praise.tsx')).toContain("from '@/content/v9'");
  });

  it('menjaga satu keluarga gerak saja di halaman v9', () => {
    // Tiga gerak: shader (ambient), mask reveal (hero + dua judul), dan
    // reveal polos. Tidak ada framer-motion, tidak ada sorotan berputar.
    for (const file of V9_FILES) {
      if (!file.endsWith('.tsx')) continue;
      const source = stripComments(read(file));
      expect(source, `${file} memakai framer-motion`).not.toMatch(/from 'framer-motion'/);
    }
    // Mask reveal hanya di hero dan dua judul utama, bukan di semua judul.
    const markup =
      read('components/v9/Hero.tsx') +
      read('components/v9/WorkBento.tsx') +
      read('components/v9/Praise.tsx') +
      read('components/v9/Bio.tsx') +
      read('components/v9/History.tsx');
    expect([...markup.matchAll(/data-mask="scroll"/g)].length).toBe(2);
  });

  it('menjaga kartu testimoni terbaca tanpa perlu menggulir', () => {
    // GSAP menyetel opacity:0 saat runtime, jadi kalau reduced motion
    // dinyalakan di tengah sesi, atau section terlewati saat lompat
    // scroll, isinya harus tetap bisa dibaca.
    const css = read('app/v9/v9.css');
    expect(css).toMatch(
      /prefers-reduced-motion[\s\S]*?\.v9-quote\s*\{[^}]*opacity:\s*1\s*!important/,
    );
  });
});
