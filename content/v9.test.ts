/**
 * Guard kanon homepage (edisi panggung 21st.dev, 2026-11-08).
 * Skin lama (edisi dokumen, band, nav/footer, strip sorotan logo)
 * diarsipkan di archive/v9-doc/ bersama guard lamanya. Yang dijaga di
 * sini hanya isi: teks founder tidak boleh berubah diam-diam, kontak
 * tetap satu sumber dari ledger, dan foto kartun menempel ke berkas
 * yang benar-benar ada.
 */
import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { CONTACT } from '@/content/ledger';
import { V7_META_DESCRIPTION } from '@/content/v7';
import { V9_BIO, V9_BIO_LINES, V9_HERO, V9_META } from '@/content/v9';

const root = process.cwd();

describe('kanon homepage', () => {
  it('bio founder verbatim: dua paragraf, tidak ada tautan inline', () => {
    // Bentuk barisnya ditentukan founder (4 baris tetap, 2+2). Teks
    // paragrafnya turunan join baris-baris itu, bukan diketik ulang.
    expect(V9_BIO_LINES).toHaveLength(2);
    for (const lines of V9_BIO_LINES) expect(lines).toHaveLength(2);
    expect(V9_BIO).toHaveLength(2);
    expect(V9_BIO[0]).toContain("I'm Fajar, working across three seats:");
    const bio = V9_BIO.join(' ');
    expect(bio).toContain('Perfect10');
    expect(bio).toContain('Pawang IO');
    expect(bio).toContain('three seats');
    expect(bio).toContain('actually help');
    // Kontak hidup di baris aksi, bukan di dalam kalimat bio.
    expect(bio).not.toContain('LinkedIn');
    expect(bio).not.toContain('hi@nurfajar.com');
    // Kanon hero membaca bio dengan benar.
    expect(V9_HERO.paragraphs).toEqual(V9_BIO);
  });

  it('lead dan lima frasa rotasi: urutan tetap, tidak ada dobel', () => {
    expect(V9_HERO.lead).toBe('AI specialist who also loves');
    expect(V9_HERO.rotating).toEqual([
      'building apps',
      'crafting curriculum',
      'growing communities',
      'program management',
      'creating content',
    ]);
    expect(new Set(V9_HERO.rotating).size).toBe(V9_HERO.rotating.length);
    // Halaman membaca bio langsung dari V9_BIO, bukan menyalinnya.
    expect(V9_HERO.paragraphs).toEqual(V9_BIO);
  });

  it('dua aksi dari kanon kontak, bukan diketik ulang', () => {
    expect(V9_HERO.ctas).toHaveLength(2);
    expect(V9_HERO.ctas[0].href).toBe(`mailto:${CONTACT.email}`);
    expect(V9_HERO.ctas[0].label).toBe(CONTACT.email);
    expect(V9_HERO.ctas[1].href).toBe(CONTACT.linkedin);
    expect(V9_HERO.ctas[1].label).toBe('connect on LinkedIn');
  });

  it('foto kartun menempel ke berkas yang ada di public', () => {
    expect(V9_HERO.avatar.src).toBe('/kartun-ungu.jpg');
    expect(existsSync(join(root, 'public/kartun-ungu.jpg'))).toBe(true);
  });

  it('deskripsi meta identik dengan kalimat kanon v7', () => {
    expect(V9_META.description).toBe(V7_META_DESCRIPTION);
  });
});
