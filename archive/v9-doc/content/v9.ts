/**
 * v9 content canon — "Signal".
 *
 * Aturan: tidak ada yang diketik tangan yang menyangkut fakta. Seluruh isi
 * halaman /v9 berasal dari `content/ledger.ts` (SSOT) lewat kanon v7, jadi v9
 * tidak bisa diam-diam membuat angka atau klaim baru.
 *
 * Yang ditulis tangan di file ini hanya dua jenis:
 *   1. Label antarmuka (label section, label nav, kata tombol) yang tidak
 *      menyangkut fakta.
 *   2. Pemotongan kalimat kanon jadi potongan yang lebih pendek, dengan
 *      sumbernya masih kelihatan di tempat yang sama.
 *
 * Copy: tanpa em-dash (dijaga guard di app/v9/v9.test.ts), tanpa klaim tanpa
 * sumber, dan setiap angka tetap milik ledger.
 *
 * Bentuk visual v9 (idiom 21st: bento, kolom offset, pill, mask, spotlight)
 * diambil dari komponen 21st.dev yang paling banyak diunduh, tapi seluruh
 * kodenya ditulis sendiri di components/v9. Lihat .impeccable/brief-v9.md.
 */

import { CONTACT } from './ledger';
import { V5_CASES } from './v5';
import {
  V5_FOUNDER_MAILTO,
  V7_BIO,
  V7_BIO_LINKS,
  V7_CHAPTERS,
  V7_META_DESCRIPTION,
  V7_PRAISE_VOICES,
  V7_STACK_LINE,
  V7_WORK_ROWS,
} from './v7';

/**
 * Hero: satu kalimat kanon, dua potongannya.
 *
 * `V7_META_DESCRIPTION` sudah persis dua kalimat yang jawab "apa yang dia
 * kerjakan" dalam satu baris. Dipisah di sini supaya halaman tidak pernah
 * menyalin ulang kalimat yang bisa bergeser dari kanon: kalau meta berubah,
 * hero ikut berubah.
 */
const META_PARTS = V7_META_DESCRIPTION.split('. ');
if (META_PARTS.length !== 2) {
  throw new Error('V7_META_DESCRIPTION harus dua kalimat; bentuknya berubah');
}

export const V9_HERO = {
  name: 'Nur Fajar',
  headline: `${META_PARTS[0]}.`,
  sub: META_PARTS[1],
  mailto: V5_FOUNDER_MAILTO,
  cv: CONTACT.cv,
  cvFilename: CONTACT.cvFilename,
} as const;

/** Meta halaman: judul mutlak (template root menambah ", Nur Fajar") dan
 *  deskripsi yang sama persis dengan kalimat kanon. */
export const V9_META = {
  title: 'Nur Fajar, AI specialist who builds apps and communities',
  description: V7_META_DESCRIPTION,
} as const;

/** Navigasi: label pendek, satu per section yang punya isi. */
export const V9_NAV = [
  { id: 'work', label: 'Work' },
  { id: 'praise', label: 'Praise' },
  { id: 'history', label: 'History' },
  { id: 'contact', label: 'Contact' },
] as const;

/**
 * Blok bio. Paragrafnya verbatim founder (V7_BIO) dan tidak boleh dirapikan:
 * ini satu-satunya tempat suara orang pertama dipakai, dan di situ resides
 * selembut v7. Tautan + logo di dalam teks diambil dari kanon yang sama.
 *
 * Tanpa pill label: di halaman ini label hanya dipakai sekali (section
 * Praise). Enam section dengan bentuk kepala yang sama itu yang membuat
 * halaman terasa seperti template, bukan seperti dokumen.
 *
 * Judulnya "About", bukan "In his own words.": kalimat itu sudah dipakai
 * section Praise ("In their words."), dan dua judul kembar di satu halaman
 * juga terasa seperti templat.
 */
export const V9_BIO = {
  heading: 'About',
  paragraphs: V7_BIO,
  links: V7_BIO_LINKS,
} as const;

/**
 * Tautan live untuk case CRM.
 *
 * Di kanon v5 link ini menempel di case "web-builds" (lemari untuk URL yang
 * dipakai lebih dari satu tempat), sedangkan v9 memamerkannya di kartu
 * CRM-nya sendiri. Alamatnya diambil dari kanon, bukan diketik ulang, supaya
 * ada satu sumber untuk setiap URL.
 */
const CRM_LINK = V5_CASES.find((entry) => entry.id === 'web-builds')?.links.find((link) =>
  link.href.includes('crm.nurfajar.com'),
);
if (!CRM_LINK) throw new Error('Link CRM tidak ditemukan di kanon v5 (web-builds)');

/**
 * Work: enam kartu bento.
 *
 * Isi kartu diambil dari `V7_WORK_ROWS` (kurat v7 atas kanon v5): judul,
 * satu fakta terkuat (headline), konteks seperlunya, dan tautan yang benar.
 * Kartu tanpa tautan tidak diberi tautan palsu: kredensial yang tidak bisa
 * diklik tetap tidak berpura-pura bisa diklik.
 *
 * Satu pengecualian kurasi: v7 memangkas bullet build karena galeri
 * screenshot yang jadi bintang di halaman itu. v9 tidak punya galeri, jadi
 * kartu besar pertama akan kosong kalau bullet-nya tetap dipangkas. Di sini
 * bullet diambil dari kanon v5 (bukan diketik ulang), maksimal dua per
 * kartu.
 */
const V5_BY_ID = new Map(V5_CASES.map((entry) => [entry.id, entry]));

export const V9_WORK = {
  heading: 'Selected work',
  sub: 'Four shipped, two in development.',
  tiles: V7_WORK_ROWS.map((row) => {
    const source = V5_BY_ID.get(row.id);
    if (!source) throw new Error(`Case v5 untuk "${row.id}" tidak ditemukan`);
    const build = row.build.length ? row.build : source.build.slice(0, 2);
    return {
      id: row.id,
      index: row.index,
      kind: row.kind,
      title: row.title,
      headline: row.headline,
      context: row.context,
      note: row.note,
      build: build.slice(0, 2),
      links:
        row.id === 'crm-pipeline'
          ? [{ label: 'Open the workspace', href: CRM_LINK.href }]
          : row.id === 'web-builds'
            ? row.links.filter((link) => !link.href.includes('crm.nurfajar.com'))
            : row.links,
    };
  }),
} as const;

/** Riwayat: empat babak, plus baris stack sebagai data mono. */
export const V9_HISTORY = {
  heading: '2018 to now.',
  chapters: V7_CHAPTERS,
  stack: V7_STACK_LINE,
} as const;

/**
 * Pujian: enam suara, kutipan dipangkas, tanpa foto yang tidak ada.
 *
 * Section ini satu-satunya yang memakai pill label di halaman v9. Bentuk
 * kepala yang sama di enam section itulah yang bikin halaman terasa
 * seperti template, jadi pilnya dipakai sekali saja.
 */
export const V9_PRAISE = {
  label: 'Praise',
  heading: 'In their words.',
  sub: 'Six voices, verbatim.',
  voices: V7_PRAISE_VOICES,
} as const;

/**
 * Penutup: footer yang jadi tujuan "Contact" (alamatnya ada sebagai
 * wordmark besar di sana), jadi band CTA terpisah tidak dipakai lagi.
 */
export const V9_FOOTER = {
  email: CONTACT.email,
  linkedin: CONTACT.linkedin,
} as const;
