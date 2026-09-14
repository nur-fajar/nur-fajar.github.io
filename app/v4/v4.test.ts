import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { V4_HOME_TILES } from '@/content/ledger';

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

/** Semua berkas .tsx di bawah sebuah folder, termasuk subfolder. */
function files(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return files(full);
    return entry.name.endsWith('.tsx') ? [full] : [];
  });
}

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

describe('v4 , petak bento', () => {
  it('setiap baris tertutup penuh 12 kolom dan berhenti di baris tiga', () => {
    /* Kegagalannya murni visual: satu span yang bergeser melipat grid jadi
       baris keempat, hero tidak lagi setinggi dua baris, dan tidak ada satu
       pun baris kode yang terlihat salah.

       Aturan yang sama sudah menjaga V3_HOME_TILES di content/ledger.test.ts.
       v4 punya petaknya sendiri justru supaya /v3 dan homepage tidak ikut
       tertata ulang saat ubin pembuka v4 naik dari 6x1 jadi 8x2. */
    for (const row of [1, 2, 3]) {
      const occupying = V4_HOME_TILES.filter(
        (tile) => tile.row <= row && row < tile.row + tile.rows,
      );
      const total = occupying.reduce((sum, tile) => sum + tile.span, 0);
      expect(total, `baris ${row} berisi ${total} kolom`).toBe(12);
    }
    const last = Math.max(...V4_HOME_TILES.map((tile) => tile.row + tile.rows - 1));
    expect(last, 'bento v4 tidak berhenti di tiga baris').toBe(3);
  });

  it('setiap ubin punya komponen isinya, dan sebaliknya', () => {
    /* Bento mencari komponen lewat content[tile.id]. Id yang tidak ada di
       peta menghasilkan `undefined`, dan React melempar saat render , tapi
       cuma di route itu, jadi build tetap lolos dan yang ketahuan cuma
       halaman kosong. Tes ini menangkapnya di CI. */
    const wrapper = readFileSync(path.join(ROOT, 'components', 'v4', 'Hero.tsx'), 'utf8');
    const mapped = [...wrapper.matchAll(/^\s{2}(\w+):\s*\w+,$/gm)].map((m) => m[1]);
    const ids = V4_HOME_TILES.map((tile) => tile.id);

    expect([...ids].sort(), 'id ubin dan kunci peta isi tidak cocok').toEqual([...mapped].sort());
  });

  it('ubin pembuka tidak pernah mengaku bisa diklik', () => {
    /* Panah cuma dipasang di ubin ber-href. Ubin hero tidak ke mana-mana,
       jadi ia juga tidak boleh terlihat seperti pintu. */
    const hero = V4_HOME_TILES.find((tile) => tile.id === 'hero');
    expect(hero, 'ubin hero tidak ada di petak v4').toBeTruthy();
    expect(hero?.href).toBeUndefined();
  });
});

describe('v4 , akar dokumen', () => {
  it('headline hero dirender sebagai satu-satunya <h1>', () => {
    /* /v3 sama sekali tidak punya <h1>: ubin bento cuma <section aria-label>
       dengan <p aria-label> di dalamnya, dan ketujuh judul section semuanya
       <h2>, jadi dokumennya menggantung tanpa akar. Tidak ada yang error,
       dan yang rugi cuma pembaca layar dan mesin telusur.

       Dua sisi dijaga sekaligus: hero HARUS punya h1, dan tidak boleh ada
       komponen v4 kedua yang menambah h1 lain. */
    const hero = readFileSync(
      path.join(ROOT, 'components', 'v4', 'tiles', 'HeroTile.tsx'),
      'utf8',
    );
    expect(hero, 'HeroTile tidak merender <h1>').toMatch(/<h1[\s>]/);

    /* Komentar dibuang sebelum menghitung. Berkas-berkas ini menjelaskan
       DI DALAM komentarnya kenapa <h1> perlu ada, dan penjelasan itu ikut
       terhitung sebagai tag kalau teksnya dipindai mentah. */
    const dir = path.join(ROOT, 'components', 'v4');
    const count = files(dir).reduce((sum, file) => {
      const code = readFileSync(file, 'utf8')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/.*$/gm, '');
      return sum + (code.match(/<h1[\s>]/g)?.length ?? 0);
    }, 0);
    expect(count, `ada ${count} <h1> di components/v4, harusnya tepat satu`).toBe(1);
  });

  it('headline datang dari ledger, bukan diketik ulang di JSX', () => {
    /* Scan em dash, ejaan British, kata sifat tak terbukti, dan jembatan
       kausal L&D ke AI semuanya membaca hasil ekspor content/ledger.ts.
       Copy yang diketik langsung di JSX lolos dari keempatnya tanpa jejak,
       dan disiplin copy situs ini justru berasal dari sana. */
    const hero = readFileSync(
      path.join(ROOT, 'components', 'v4', 'tiles', 'HeroTile.tsx'),
      'utf8',
    );
    expect(hero, 'HeroTile tidak membaca HERO dari ledger').toMatch(
      /import\s*\{[^}]*\bHERO\b[^}]*\}\s*from\s*'@\/content\/ledger'/,
    );
    for (const field of ['titleLead', 'titleAccent', 'titleRestLead', 'titleRestTail', 'sub', 'meta']) {
      expect(hero, `HERO.${field} tidak dirender`).toContain(`HERO.${field}`);
    }
  });
});
