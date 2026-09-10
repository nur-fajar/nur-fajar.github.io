import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Tes struktural untuk lapisan CSS /v3.
 *
 * Ia lahir dari satu bug yang mahal dan tidak kelihatan di kode mana pun.
 * Wadah chip di ubin bento dan daftar tool di section Technologies sama-sama
 * bernama `.v3-tools`. Aturan bento memberi `position: absolute; inset: 0`,
 * dan aturan Technologies tidak pernah menimpanya karena ia memang tidak
 * menyebut `position` sama sekali. Akibatnya daftar tool lepas dari alirannya
 * lalu membentang ke leluhur berposisi terdekat, yaitu seluruh halaman, dan
 * menutupi hero dengan chip 88px.
 *
 * Yang membuatnya sulit: kedua berkas komponen benar. Yang salah adalah dua
 * berkas berbeda kebetulan memilih nama kelas yang sama, dan tidak ada satu
 * tempat pun yang menunjukkannya.
 */

const CSS = readFileSync(path.join(process.cwd(), 'app', 'v3', 'v3.css'), 'utf8');
const COMPONENTS = path.join(process.cwd(), 'components', 'v3');

/** Semua berkas .tsx di components/v3, termasuk subfolder. */
function componentFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return componentFiles(full);
    return entry.name.endsWith('.tsx') ? [full] : [];
  });
}

/** Kelas yang diberi position absolute atau fixed oleh sebuah aturan top-level. */
function positionedClasses(): string[] {
  // Isi @media dibuang: varian responsif bukan deklarasi yang berdiri sendiri.
  const top = CSS.replace(/@media[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, '');
  const found = new Set<string>();

  for (const match of top.matchAll(/^([^{}\n][^{}]*)\{([^{}]*)\}/gm)) {
    const [, selector, body] = match;
    if (!/position:\s*(absolute|fixed)/.test(body)) continue;
    // Ambil kelas TERAKHIR di tiap selektor: itu elemen yang diberi position,
    // bukan induk yang cuma dipakai untuk mempersempit.
    for (const part of selector.split(',')) {
      const classes = [...part.matchAll(/\.([a-zA-Z0-9_-]+)/g)].map((m) => m[1]);
      if (classes.length) found.add(classes[classes.length - 1]);
    }
  }
  return [...found];
}

describe('v3 , tata nama kelas', () => {
  it('kelas yang diberi position dipakai paling banyak satu komponen', () => {
    const files = componentFiles(COMPONENTS);
    const sources = files.map((file) => ({ file, text: readFileSync(file, 'utf8') }));

    for (const className of positionedClasses()) {
      // Cocokkan sebagai token utuh supaya v3-tool tidak ikut cocok ke
      // v3-toolfield.
      const token = new RegExp(`className=(?:"|\`|')[^"\`']*\\b${className}\\b`);
      const users = sources.filter((source) => token.test(source.text));

      expect(
        users.length,
        `.${className} diberi position oleh CSS tapi dipakai ${users.length} komponen: ` +
          users.map((u) => path.basename(u.file)).join(', ') +
          '. Salah satunya akan lepas dari alirannya tanpa ada kode yang terlihat salah.',
      ).toBeLessThanOrEqual(1);
    }
  });

  it('token tema hidup di .v3-root, tidak pernah di :root', () => {
    // Situs lama masih live di / dan berbagi dokumen yang sama. Satu token v3
    // yang bocor ke :root akan mengecat ulang halaman itu.
    const rootBlocks = [...CSS.matchAll(/^:root[^{]*\{([^}]*)\}/gm)].map((m) => m[1]);
    for (const block of rootBlocks) {
      expect(block, 'ada token --v3-* yang ditulis di :root').not.toMatch(/--v3-/);
    }
  });
});

/**
 * Tes ini lahir dari bug kedua yang sama tidak kelihatannya: judul ketujuh
 * section tidak pernah muncul sama sekali.
 *
 * MaskedLines menaruh `whileInView` di elemen yang ia sembunyikan sendiri.
 * Baris judul digeser `y: 112%` ke bawah, dan induknya `.v3-mask` punya
 * `overflow: hidden`. IntersectionObserver memotong kotak target dengan klip
 * milik leluhur, jadi yang terhitung "terlihat" cuma sisa 0.12em padding
 * descender: rasionya 0.0104, diukur langsung di browser dengan judul persis
 * di tengah viewport. `viewport.amount` 0.4 meminta 0.4. Ambang itu tidak bisa
 * dicapai di posisi scroll mana pun, jadi animasinya tidak pernah jalan dan
 * judulnya tetap terjepit di balik mask selamanya.
 *
 * Yang membuatnya sulit: tidak ada yang error, dan rasio 0.0104 itu tidak
 * bergantung pada ukuran font, jadi ia tidak akan pernah "kebetulan sembuh".
 *
 * Aturannya: yang diamati harus mask-nya, yang tidak terpotong. Baris di
 * dalamnya ikut lewat variants.
 */
describe('v3 , mask reveal', () => {
  it('whileInView tidak dipasang di elemen yang diklip induknya', () => {
    // Kelas yang diklip: induknya diberi overflow:hidden oleh CSS.
    const clipped = ['v3-mask__line'];

    for (const file of componentFiles(COMPONENTS)) {
      const text = readFileSync(file, 'utf8');
      // Pisah per tag pembuka <m.* ...> lalu periksa atribut tiap tag.
      for (const tag of text.matchAll(/<m\.[a-zA-Z]+([^>]*)>/g)) {
        const attrs = tag[1];
        if (!/whileInView/.test(attrs)) continue;
        for (const className of clipped) {
          expect(
            attrs.includes(className),
            `${path.basename(file)}: whileInView dipasang di .${className}, yang ` +
              'diklip induknya. IntersectionObserver ikut memotong, rasionya ' +
              'mentok ~0.01, dan ambang amount tidak akan pernah tercapai.',
          ).toBe(false);
        }
      }
    }
  });
});
