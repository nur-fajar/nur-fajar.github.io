import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { V6_HATS, V6_NEUTRAL, V6_UNICORN } from '@/content/v6-hats';

/**
 * Tes struktural untuk lapisan /v6 (hat-switching stage).
 *
 * Kontrak yang dipelihara:
 * 1. Scene tetap ringan: tepat satu client component (orkestrator), tanpa
 *    library animasi, keyframes hanya berprefiks v6-, token hanya di .v6-root.
 * 2. Konten tetap jujur: semua angka & tautan diturunkan dari ledger
 *    (content/v6-hats.ts), tidak ada klaim yang diketik ulang.
 */

const ROOT = process.cwd();
const CSS = readFileSync(path.join(ROOT, 'app', 'v6', 'v6.css'), 'utf8');
const LAYOUT = readFileSync(path.join(ROOT, 'app', 'v6', 'layout.tsx'), 'utf8');
const PAGE = readFileSync(path.join(ROOT, 'app', 'v6', 'page.tsx'), 'utf8');
const HATS_CONTENT = readFileSync(path.join(ROOT, 'content', 'v6-hats.ts'), 'utf8');

const MOTION_LIBS = ['framer-motion', 'gsap', 'lenis', 'three'];

function filesIn(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return filesIn(full);
    return entry.name.endsWith('.tsx') ? [full] : [];
  });
}

describe('v6 — janji desain scene', () => {
  it('token tema hidup di .v6-root, tidak pernah di :root', () => {
    const rootBlocks = [...CSS.matchAll(/^:root[^{]*\{([^}]*)\}/gm)].map((m) => m[1]);
    for (const block of rootBlocks) {
      expect(block, 'ada token --v6-* yang ditulis di :root').not.toMatch(/--v6-/);
    }
  });

  it('layout dan page tidak deklarasikan "use client"', () => {
    for (const [file, text] of [['layout.tsx', LAYOUT], ['page.tsx', PAGE]] as const) {
      expect(text, `${file} mendeklarasikan "use client"`).not.toMatch(/['"]use client['"]/);
    }
  });

  it('library animasi tidak diimpor di lapisan app/v6 maupun components/v6', () => {
    for (const lib of MOTION_LIBS) {
      expect(LAYOUT, `layout mengimpor ${lib}`).not.toContain(lib);
      expect(PAGE, `page mengimpor ${lib}`).not.toContain(lib);
    }
    for (const file of filesIn(path.join(ROOT, 'components', 'v6'))) {
      const text = readFileSync(file, 'utf8');
      for (const lib of MOTION_LIBS) {
        expect(text, `${path.basename(file)} mengimpor ${lib}`).not.toContain(lib);
      }
    }
  });

  it('tepat satu client component (orkestrator; anak-anaknya client via import)', () => {
    const clients = filesIn(path.join(ROOT, 'components', 'v6')).filter((file) =>
      readFileSync(file, 'utf8').includes("'use client'"),
    );
    expect(clients).toHaveLength(1);
    expect(clients[0].endsWith('HatStage.tsx'), 'orkestrator bukan HatStage').toBe(true);
  });

  it('satu breakpoint saja, dan ia layar sempit (640px)', () => {
    const queries = [...CSS.matchAll(/@media[^{]*max-width:\s*(\d+)px/g)].map((m) => m[1]);
    for (const q of queries) {
      expect(['640']).toContain(q);
    }
  });

  it('keyframes hanya berprefiks v6-', () => {
    const names = [...CSS.matchAll(/@keyframes\s+([a-zA-Z0-9_-]+)/g)].map((m) => m[1]);
    for (const name of names) {
      expect(name.startsWith('v6-'), `@keyframes ${name} tidak berprefiks v6-`).toBe(true);
    }
  });

  it('prefers-reduced-motion mematikan seluruh scene', () => {
    expect(CSS).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
    const reducedBlock = CSS.slice(CSS.indexOf('prefers-reduced-motion'));
    expect(reducedBlock).toContain('.v6-sprite-hit');
    expect(reducedBlock).toContain('.v6-flyer');
  });

  it('fallback noscript ada di orkestrator', () => {
    const stage = readFileSync(path.join(ROOT, 'components', 'v6', 'HatStage.tsx'), 'utf8');
    expect(stage).toMatch(/<noscript>/);
  });
});

describe('v6 — kontrak topi', () => {
  it('tepat tiga topi, id unik, aksen hex valid', () => {
    expect(V6_HATS.map((hat) => hat.id)).toEqual(['trainer', 'creative', 'ai']);
    expect(new Set(V6_HATS.map((hat) => hat.id)).size).toBe(3);
    for (const hat of V6_HATS) {
      expect(hat.accent).toMatch(/^#[0-9a-f]{6}$/);
      expect(hat.greeting.length, `${hat.id} tanpa greeting`).toBeGreaterThan(0);
      expect(hat.links.length, `${hat.id} tanpa tautan aksi`).toBeGreaterThan(0);
      for (const link of hat.links) {
        const ok = ['#', 'http', 'mailto:', '/'].some((head) => link.href.startsWith(head));
        expect(ok, `${hat.id} punya href baru keju: ${link.href}`).toBe(true);
      }
    }
  });

  it('content/v6-hats.ts menurunkan angka dari ledger, bukan salinan manual', () => {
    expect(HATS_CONTENT).toMatch(/from '\.\/ledger'/);
    expect(HATS_CONTENT).toMatch(/WORK_HISTORY\[0\]/);
    expect(HATS_CONTENT).toMatch(/CRM_PROJECT/);
    expect(HATS_CONTENT).toMatch(/WORK_GALLERY\.filter/);
    /* Literal 9.0/10 hanya boleh ada SEKALI: baris PROOF.find(...) SSOT. */
    const hits = HATS_CONTENT.match(/'9\.0\/10'/g) ?? [];
    expect(hits, 'literal 9.0/10 muncul lebih dari lookup SSOT').toHaveLength(1);
  });

  it('pesan unicorn ada dan memakai CTA dari ledger', () => {
    expect(V6_UNICORN.message).toContain('Full-Product Builder');
    expect(V6_UNICORN.cta.href.startsWith('mailto:')).toBe(true);
    expect(V6_NEUTRAL.chips).toHaveLength(3);
  });
});
