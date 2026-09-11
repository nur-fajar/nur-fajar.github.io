import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Tes struktural untuk lapisan /v4.
 *
 * Tiga aturan di bawah adalah aturan yang, kalau dilanggar, tidak membuat
 * apa pun error. Halaman tetap ter-build, tesnya tetap hijau, dan gejalanya
 * baru muncul sebagai "kok homepage ikut berubah" atau "kok pembaca layar
 * bingung" berminggu-minggu kemudian.
 */

const ROOT = process.cwd();
const CSS = readFileSync(path.join(ROOT, 'app', 'v4', 'v4.css'), 'utf8');
const LAYOUT = readFileSync(path.join(ROOT, 'app', 'v4', 'layout.tsx'), 'utf8');

describe('v4 , token tema', () => {
  it('token hidup di .v4-root, tidak pernah di :root', () => {
    /* Homepage lama masih live di / dan berbagi dokumen yang sama. Satu
       token v4 yang bocor ke :root akan mengecat ulang halaman itu, dan
       yang terlihat cuma "homepage berubah sendiri" tanpa ada satu baris
       pun di app/page.tsx yang disentuh.

       Aturan yang sama sudah ditegakkan untuk v3 di app/v3/v3.test.ts;
       ini meneruskannya ke lapisan ketiga. */
    const rootBlocks = [...CSS.matchAll(/^:root[^{]*\{([^}]*)\}/gm)].map((m) => m[1]);
    for (const block of rootBlocks) {
      expect(block, 'ada token --v4-* yang ditulis di :root').not.toMatch(/--v4-/);
    }
  });

  it('hanya memakai tiga breakpoint', () => {
    /* v3 menyebar sebelas nilai breakpoint (400, 420, 560, 640, 700, 720,
       760, 860, 900, 980, 1020) di lima berkas CSS. Akibatnya tiap pass
       responsif jadi tebak-tebakan soal nilai mana yang berlaku di berkas
       mana, dan dua berkas bisa mengurus layar yang sama dengan ambang
       berbeda tanpa ada yang kelihatan salah.

       v4 memakai tiga: 640 / 980 / 1240. CSS belum punya custom media
       query yang bisa dipakai produksi, jadi angkanya tidak bisa disimpan
       di variabel dan disiplinnya harus dijaga dari luar. */
    const allowed = new Set(['640', '980', '1240']);
    const widths = [...CSS.matchAll(/\((?:max|min)-width:\s*(\d+)px\)/g)].map((m) => m[1]);

    for (const width of widths) {
      expect(
        allowed.has(width),
        `${width}px bukan salah satu dari tiga breakpoint v4 (640 / 980 / 1240). ` +
          'Breakpoint keempat mengembalikan persoalan yang justru dibereskan v4.',
      ).toBe(true);
    }
  });

  it('kuning tidak pernah jadi warna huruf di atas kertas terang', () => {
    /* #ffc400 cuma 1.49:1 di atas kertas terang. Ia gagal untuk teks apa
       pun dan itu tidak bisa diakali dengan menebalkannya. Satu-satunya
       tempat kuning boleh membawa huruf adalah di atas permukaan gelap,
       di mana perannya terbalik (11.89:1) , dan itu diurus oleh aturan
       .v4-section--ink .v4-eyebrow. */
    const top = CSS.replace(/\.v4-section--ink[^{]*\{[^}]*\}/g, '');
    const colorRules = [...top.matchAll(/(^|\n)\s*color:\s*var\(--v4-yellow\)/g)];

    expect(
      colorRules.length,
      'ada aturan di luar permukaan gelap yang memakai --v4-yellow sebagai ' +
        'warna huruf. Di atas kertas terang rasionya 1.49:1.',
    ).toBe(0);
  });
});

describe('v4 , kerangka halaman', () => {
  it('skip link menunjuk ke id <main> yang benar', () => {
    /* Salah satu cara paling mudah merusak aksesibilitas tanpa ada yang
       error: menyalin layout dari v3, lupa mengganti #v3-main, dan skip
       link-nya jadi tautan mati yang tidak memindahkan fokus ke mana pun.
       Yang kehilangan cuma pengguna keyboard, dan tidak ada yang
       melaporkannya. */
    const target = LAYOUT.match(/className="skip-link" href="#([\w-]+)"/)?.[1];
    const mainId = LAYOUT.match(/<main id="([\w-]+)"/)?.[1];

    expect(target, 'skip link tidak ditemukan di layout v4').toBeTruthy();
    expect(mainId, '<main> tidak punya id di layout v4').toBeTruthy();
    expect(target, `skip link menunjuk #${target} tapi <main> ber-id ${mainId}`).toBe(mainId);
  });

  it('halaman menolak diindeks selama masih berdampingan dengan homepage', () => {
    /* /v4 dan / melayani isi yang sama selama v4 masih draf. Dua URL dengan
       konten identik adalah duplikat di mata mesin telusur, dan repo ini
       sudah kena persoalan itu sekali: / dan /v3 sampai sekarang melayani
       halaman yang byte-nya sama dengan judul yang sama.

       Baris ini dihapus saat v4 menggantikan homepage, bukan sebelumnya. */
    const page = readFileSync(path.join(ROOT, 'app', 'v4', 'page.tsx'), 'utf8');
    expect(page, 'metadata /v4 tidak menolak indeks').toMatch(/robots:\s*\{\s*index:\s*false/);
  });
});
