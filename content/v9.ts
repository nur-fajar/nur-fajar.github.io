/**
 * Kanon konten homepage, edisi panggung 2026-11-08.
 *
 * Angka dan fakta tetap satu sumber: kontak datang dari `CONTACT` di
 * ledger, deskripsi meta dari kalimat kanon v7, dan bio founder verbatim
 * di bawah. Yang ditulis tangan di sini hanya label antarmuka (lead,
 * frasa rotasi, label tombol) yang tidak menyangkut fakta baru.
 *
 * Bentuk visual: komponen "call-to-action-01" @aliimam di 21st.dev
 * (grid hairline di kertas putih, headline font-medium, tombol shadcn),
 * dengan frasa berotasi warisan "animated-hero" yang dipertahankan
 * founder. Skin edisi dokumen sebelumnya (nav, footer, band, strip
 * sorotan logo) sudah diarsipkan di archive/v9-doc/.
 *
 * Copy: tanpa em-dash, tanpa klaim tanpa sumber.
 */

import { CONTACT } from './ledger';
import { V7_META_DESCRIPTION } from './v7';

/**
 * Bio founder, verbatim pilihan founder (edisi portofolio, 2026-11-08;
 * versi sebelumnya "three hats" ada di riwayat git).
 *
 * Pemenggalannya kini DITENTUKAN founder (2026-11-08): empat baris
 * tetap, dua paragraf dua baris. `V9_BIO_LINES` memegang bentuk barisnya,
 * `V9_BIO` (paragraf utuh) hanya turunan join baris-baris itu, supaya
 * kalimatnya tetap satu sumber dan komponen tidak mengetik ulang apa pun.
 *
 * Perfect10 dan Pawang IO sengaja TIDAK diberi tautan: URL resminya
 * tidak ada di kanon, dan menautkan address yang dikira-kira melanggar
 * aturan satu sumber di repo ini.
 *
 * Bio ini hidup DI SINI, bukan di v7, karena:
 *   1. v7.ts ditimpa `npm run sync:canon` dari repo utama; suara founder
 *      tidak boleh bisa ditimpa balik oleh sinkronisasi.
 *   2. Bio ini milik founder, jadi kalimatnya berhak berbeda dari repo
 *      utama.
 */
export const V9_BIO_LINES = [
  [
    "I'm Fajar, working across three seats: business development at Perfect10,",
    'curriculum building at Pawang IO, and the community that connects them both.',
  ],
  [
    'Every seat has the same favorite part: connecting the right people to the right thing,',
    'from partners and lessons to group chats that actually help.',
  ],
] as const;

/** Paragraf utuh, turunan langsung dari baris di atas (tidak diketik
 *  ulang), dipakai kanon hero dan guard test. */
export const V9_BIO = V9_BIO_LINES.map((lines) => lines.join(' ')) as string[];

/**
 * Hero panggung (2026-11-08), menyalin teks yang diminta founder.
 *
 * Frasa rotasinya lima, urutannya tetap, semua menyebut fakta yang
 * sudah ada di kanon (software, kurikulum, komunitas, program, konten);
 * tidak ada klaim baru yang lahir di sini.
 */
export const V9_HERO = {
  /** Lead statis baris pertama headline. */
  lead: 'AI specialist who also loves',
  /** Frasa yang berotasi di baris kedua, urutan render dimulai dari
   *  frasa pertama supaya tanpa JavaScript pun halaman terbaca utuh. */
  rotating: [
    'building apps',
    'crafting curriculum',
    'growing communities',
    'program management',
    'creating content',
  ] as readonly string[],
  paragraphs: V9_BIO,
  /** Foto kartun di atas judul: berkasnya di public/, satu asal (CSP). */
  avatar: {
    src: '/kartun-ungu.jpg',
    alt: 'Cartoon illustration of Nur Fajar in a purple outfit',
    width: 1024,
    height: 1024,
  },
  /** Dua aksi ala referensi: dialamat ke kontak kanon, labelnya dari
   *  sumber yang sama, tidak ada yang diketik tangan. */
  ctas: [
    { label: CONTACT.email, href: `mailto:${CONTACT.email}` },
    { label: 'connect on LinkedIn', href: CONTACT.linkedin },
  ] as readonly { label: string; href: string }[],
  /** Menu cepat tombol plus di foto (2026-11-08): jangkar section
   *  homepage (Exp/Project/Tools/Personal). Section-nya menyusul —
   *  jangkar ini belum menaut ke mana pun sampai section-nya ada di
   *  halaman yang sama. */
  menu: [
    { label: 'Exp', href: '#exp' },
    { label: 'Project', href: '#project' },
    { label: 'Tools', href: '#tools' },
    { label: 'Personal', href: '#personal' },
  ] as readonly { label: string; href: string }[],
} as const;

/** Meta halaman: judul mutlak (template root menambah ", Nur Fajar") dan
 *  deskripsi yang sama persis dengan kalimat kanon. */
export const V9_META = {
  title: 'Nur Fajar, AI specialist who grows businesses with apps and communities',
  description: V7_META_DESCRIPTION,
} as const;
