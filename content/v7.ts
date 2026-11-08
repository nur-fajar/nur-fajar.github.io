/**
 * v7 content canon — the one-sheet.
 *
 * Numbers are DERIVED from content/ledger.ts (the SSOT), never retyped.
 * Copy rules inherited from the ledger guards: no em-dash, no unsupported
 * adjectives (versatile/adaptable/transferable/dynamic/passionate/
 * results-driven/self-motivated), no L&D-to-AI causal bridge, no British
 * spelling, no "Learning and Development" without the ampersand.
 *
 * Arah (Sesi 31, direvisi 2026-10-15): halaman menjadi one-sheet yang DIBUKA
 * dengan bio orang pertama. Keputusan revisi, berikut alasannya:
 *
 * - Bio pembuka (`V7_BIO`) verbatim dari founder. Ia satu-satunya blok di
 *   halaman yang sengaja memakai register personal ("intersection of",
 *   "work smarter", "the whole process"). Guard register di v7.test.ts
 *   berlaku untuk SELURUH teks v7 KECUALI blok ini, supaya suara itu tidak
 *   bocor ke section yang harus kering.
 * - Enam kalimat meta tentang integritas halaman dihapus. Halaman ini
 *   membuktikan, bukan menjelaskan bahwa dirinya bisa dipercaya.
 * - Blok capability dihapus. Ketiga artefaknya (Nadi, CRM workspace,
 *   ai4impact) sudah hidup sebagai link di dalam case Work, jadi tidak ada
 *   tautan yang hilang.
 * - Rail navigasi dan baris lokasi di masthead juga dihapus: satu dokumen
 *   pendek tidak butuh indeks section, dan tanpa rail tidak ada permukaan yang
 *   "terangkat" (sistemnya rata sepenuhnya). Id section tetap dirender supaya
 *   tautan langsung ke #work dan seterusnya masih bekerja.
 * - Method line di kotak Key figures dihapus; lalu SELURUH kotak Key figures
 *   dihapus juga (2026-10-15, lanjutan). Halaman tidak lagi memajang satu angka
 *   pun di layar pertama. Nasib angkanya: 9.0/10 hidup di babak History
 *   2024-2026, 96% less hidup di metrik case 01, dan 300+ tidak lagi muncul di
 *   halaman ini.
 * - Work jadi enam baris accordion (komponen `WorkRow`): baris tertutup
 *   membawa satu fakta terkuat, isi panel membawa konteks, bullet, metrik,
 *   dan link.
 * - REVISI 2026-10-16: enam baris accordion diganti ENAM SHOWCASE ala
 *   austinvalleskey.com (permintaan founder): satu proyek = satu blok besar
 *   berurutan (ikon/angka, judul display, headline, galeri berkas dari
 *   public/v7/work/<id>/, lalu fakta culminasi), plus pil nav sticky
 *   scrollspy. Satu client component kecil diizinkan (WorkNav) — keputusan
 *   founder; sisanya halaman tetap tak ber-JS. REVISI 2026-10-16
 *   (lanjutan): kontrak itu DIBUKA PENUH oleh founder — library motion dan
 *   client component tambahan kini sah; yang dijaga hanya LINGKUPNYA
 *   (app/v7 / components/v7, dijaga guard tes). CSS-first tetap idiom
 *   default: skrip dipakai bila CSS tak mampu.
 * - REVISI 2026-10-16 (lanjutan, case 01 CRM): kurasi AGRESIF atas permintaan
 *   founder ("less tulisan") — galeri screenshot yang jadi bintangnya, teks
 *   tinggal judul + headline + satu baris konteks. Bullet build dikosongkan
 *   (guard di v7.test.ts dilonggarkan: 0–3 bullet) dan satu metrik terkuat
 *   pindah jadi headline, bukan diulang di baris metrik. Judul case juga
 *   dipangkas prefix "9-agent"-nya: satu fakta oleh agen tidak dibawa ke v7,
 *   ledger tetap SSOT-nya.
 *
 * Struktur: satu halaman, tanpa pin scroll, tanpa marquee duplikat.
 */

import { CONTACT, LAST_UPDATED, TESTIMONIALS, V3_TOOLS } from './ledger';
import { V5_ABOUT, V5_CASES, V5_FOUNDER_MAILTO } from './v5';

export const V7_SEO_SUMMARY =
  'Nur Fajar builds software, AI agents, programs, and content for small teams. 300+ learners trained, a 9-agent CRM pipeline, three sites live, and a Sundanese learning app in development.';

/**
 * Meta description, teksnya dari kalimat positioning founder yang baru
 * (2026-10-16, pergeseran dari "I fill the gaps a small team keeps
 * postponing" ke kalimat verbatim di tagline masthead) — cuplikan pencarian
 * masih menjawab "apa yang dia kerjakan" dalam satu baris.
 */
export const V7_META_DESCRIPTION =
  'AI specialist who builds apps and communities. Software, AI agents, programs, and content.';

/**
 * Bio pembuka, verbatim dari founder.
 *
 * Sengaja TIDAK dirapikan: ini satu-satunya tempat suara orang pertama yang
 * hangat dipakai, dan mengubah kalimatnya berarti mengubah suara pemiliknya.
 * Yang menjaganya adalah dua guard di v7.test.ts: panjang kata dikunci supaya
 * ia tidak diam-diam membengkak, dan nama perusahaan (Terra AI) wajib ada
 * supaya bio tidak turun jadi keterangan samar.
 *
 * Revisi 2026-10-15 (disetujui founder): tiga kalimat meta dipotong
 * ("Each has taught me...", "Moments like these...", "My inbox is always
 * open...") dan paragraf penutup ditulis ulang oleh founder sendiri
 * ("I'm always happy to connect..."). Word diset bawah kini 145.
 */
export const V7_BIO = [
  "Hi there! I'm Fajar, and I enjoy turning ideas into things that help people learn, work, and solve problems better.",
  "I've worked in AI and learning development at Terra AI, where I designed curricula, developed learning programs, and explored ways to make work more efficient with AI. Today I continue through personal projects like Remember and Nyunda, turning everyday problems into things I can build and learn from.",
  "I'm grateful for the people and communities that shaped my journey, from Bank Indonesia and Bank BRI scholarships to Google Developer Student Clubs and Generasi Baru Indonesia.",
  "When I'm not building something, I enjoy playing chess like I did with my grandma at six, exploring the pages of a book, or tracing constellations in the clear night sky.",
  "I'm always happy to connect with new people on LinkedIn, and my mail inbox is always wide open to new opportunities.",
] as const;

/**
 * Tautan + logo di dalam bio (revisi 2026-10-15). Teksnya TIDAK berubah
 * sama sekali: yang melekat di bio ini cuma href per frasa, dirender oleh
 * app/v7/page.tsx sebagai <a> di atas teks polos.
 *
 * URL-nya semua dari kanon yang sudah ada: CONTACT (LinkedIn, mailto
 * founder) dan link case v5 (Remember dan Nyunda tidak punya link publik
 * — keduanya masih in development, jadi tidak ada href yang bisa dilekat).
 * Bank Indonesia, BRI, GDSC, dan GENBI ter-link ke situs resminya.
 * Logo hidup di /logos; kalau perusahaan ganti identitas (mis. GDSC kini
 * GDG on Campus), ganti berkasnya, jangan bikin inline asset baru.
 */
/** Satu tautan bio: frasa verbatim, href-nya, dan logo opsional dengan
 *  tinggi dalam em (default 1em). */
interface V7BioLink {
  phrase: string;
  href: string;
  logo?: string;
  size?: number;
}

export const V7_BIO_LINKS: readonly V7BioLink[] = [
  // Emblem Terra AI saja: mark dan tulisan baked-in dipisah lewat label
  // komponen tersambung (crop-terra.js) — huruf "Terra AI" itu tumpang tindih
  // sama ekor emblemnya, jadi pemisahan kolom polos tidak bisa.
  { phrase: 'Terra AI', href: 'https://terra-ai.sg/', logo: '/logos/terra-ai-mark.png', size: 1.05 },
  // Bulatan BI saja: lockup lebar di bank-indonesia.png dipangkas ambang gap jadi mark berdiri sendiri.
  { phrase: 'Bank Indonesia', href: 'https://www.bi.go.id/', logo: '/logos/bank-indonesia-mark.png', size: 1.05 },
  // Kotak BRI saja: bri.png memang berisi mark kotaknya saja, tanpa wordmark.
  { phrase: 'Bank BRI', href: 'https://www.bri.co.id/', logo: '/logos/bri.png', size: 1.05 },
  {
    phrase: 'Google Developer Student Clubs',
    href: 'https://gdsc.community.dev/',
    logo: '/logos/gdsc-inline.png',
    size: 1.15,
  },
  {
    phrase: 'Generasi Baru Indonesia',
    href: 'https://genbi.id/',
    // Emblem burung toa saja; band wordmark di bawah genbi.png ikut terpangkas di genbi-inline.png.
    logo: '/logos/genbi-inline.png',
    size: 1.15,
  },
  { phrase: 'LinkedIn', href: CONTACT.linkedin, logo: '/logos/linkedin-brand.svg', size: 1.05 },
  // 'mail' + 'inbox', bukan 'email': kalimat penutup bio kini penulisan
  // founder sendiri ("I'm always happy to connect... wide open to new
  // opportunities") dan kata email tidak ada di teksnya. Dua entri, satu
  // mailto (2026-10-15, permintaan founder): logo Gmail + kata "mail"
  // di dalam chip abu, kata "inbox" keluar dari chip (link polos
  // bergaris bawah) — dua-duanya klik ke mailto yang sama.
  // Logonya M resmi Gmail (Wikimedia), bukan favicon "G" Google.
  // REVISI 2026-10-16: sempat dilepas saat email pindah ke hi@nurfajar.com,
  // DIPULIHKAN atas permintaan founder (logonya memang yang dimau) —
  // mismatch logo/alamat jadi keputusan sadar, bukan kelalaian.
  { phrase: 'mail', href: V5_FOUNDER_MAILTO, logo: '/logos/gmail-m.svg', size: 1.05 },
  { phrase: 'inbox', href: V5_FOUNDER_MAILTO },
];

/**
 * Kata pemicu mode malam (2026-10-15, permintaan founder): kata-kata di
 * paragraf chess/constellations ini dibungkus <label> yang menambahkan
 * "toggle" checkbox CSS-murni (lihat .v7-stars-toggle di v7.css) — klik
 * membalik seluruh palet halaman ke navy dan memunculkan konstelasi
 * bintang; klik lagi, kembali ke kertas putih. Nol JavaScript.
 */
export const V7_STARS_WORDS = ['constellations', 'night', 'sky'] as const;


/** Label section Work sekaligus heading-nya: label-only, tanpa lede. */
export const V7_WORK = {
  label: 'Selected work',
} as const;

/** Struktur heading sengaja TIDAK seragam antar section (Sesi 30). */
export const V7_PRAISE = {
  label: 'Praise',
  heading: 'In their words.',
} as const;

export const V7_HISTORY = {
  label: 'History',
  heading: '2018 to now.',
} as const;

export interface V7WorkRow {
  id: string;
  index: string;
  kind: string;
  title: string;
  /** Label pendek untuk pil nav scrollspy (WorkNav). Satu-dua kata. */
  nav: string;
  /** Satu fakta terkuat di blok showcase. Wajib berasal dari canon case ini. */
  headline: string;
  context: string;
  build: string[];
  metrics: string[];
  links: { label: string; href: string }[];
  note?: string;
}

interface V7WorkTrim {
  /** Label pendek nav pill; wajib, satu-dua kata. */
  nav: string;
  /**
   * Judul opsional yang mengambil alih judul case v5. Wajib substring dari
   * canon case itu (bukan fakta baru). Dipakai case 01 untuk memangkas
   * prefix "9-agent" tanpa mengedit kanon yang dipakai v5.
   */
  title?: string;
  /** Konteks yang dipendekkan; isinya tetap dari canon v5, bukan fakta baru. */
  context: string;
  /** Fakta showcase; bagian dipisah " · " wajib ada di metrik/bullet. */
  headline: string;
  /** Indeks bullet v5 yang dipertahankan, urut. Kosong = galeri yang bicara. */
  build: number[];
  /** Indeks metrik v5 yang dipertahankan. Kosong = kind sudah cukup. */
  metrics: number[];
}

/**
 * Kurasi per case. `V5_CASES` dipakai bersama halaman v5, jadi pemangkasan
 * v7 hidup di sini sebagai kurasi, bukan dengan mengedit kanon v5.
 *
 * Metrik case 05/06 dibuang karena bunyinya "In development, <bulan> <tahun>"
 * dan kind barisnya sudah berkata "In development": satu fakta, satu tempat.
 */
const V7_WORK_TRIM: Record<string, V7WorkTrim> = {
  // Kurasi agresif (2026-10-16, permintaan founder "less tulisan"): satu
  // fakta terkuat jadi headline, sisanya galeri screenshot (dashboard,
  // script, box, mail box di public/v7/work/crm-pipeline/). Judul sotong
  // dari v5 dipangkas "9-agent"-nya di sini, bukan di kanon v5.
  // Revisi 2026-10-16 (lanjutan): konteks juga diambil — setelah galeri
  // TIDAK ADA tulisan lagi; halaman menutup blok ini di gambar terakhir.
  'crm-pipeline': {
    nav: 'CRM pipeline',
    title: 'CRM pipeline',
    context: '',
    headline: '~11h runtime vs 300+h manual (96% less)',
    build: [],
    metrics: [],
  },
  'curriculum-engine': {
    nav: 'Curriculum',
    context:
      'One chatbot engine on Smojo, adapted for three audiences: business, education, and product managers.',
    headline: '5 programs · 150+ participants',
    build: [0, 1],
    metrics: [0, 1, 2, 3],
  },
  'web-builds': {
    nav: 'Web builds',
    context: 'Two brand concept sites and this portfolio, plus the CRM workspace behind the AI build.',
    headline: 'Next.js + TS + Vercel',
    build: [1, 2],
    metrics: [1],
  },
  'content-engine': {
    nav: 'Content',
    context: 'Course marketing, alumni stories, and holiday greetings.',
    headline: '4 alumni videos · 24 posts published',
    build: [0, 1],
    metrics: [0, 1],
  },
  remember: {
    nav: 'Remember',
    context:
      'A desktop assistant for working with many browser tabs: what each is about, why it was opened, and whether it still matters.',
    // "In development" pindah ke headline (re-authoring kind, 2026-10-16):
    // frasa itu tetap milik canon kind, jadi guard fakta tetap sah.
    headline: 'In development · 100% local storage',
    build: [0, 1, 2],
    metrics: [],
  },
  nyunda: {
    nav: 'Nyunda',
    context:
      'A native Android app for English speakers learning Sundanese through small, easy-to-follow lessons.',
    headline: 'In development · free, no account, offline-first',
    build: [0, 1, 2],
    metrics: [],
  },
};

function pick<T>(list: readonly T[], index: number, where: string): T {
  const item = list[index];
  if (item === undefined) throw new Error(`Indeks ${index} tidak ada di ${where}`);
  return item;
}

export const V7_WORK_ROWS: V7WorkRow[] = V5_CASES.map((entry) => {
  const trim = V7_WORK_TRIM[entry.id];
  if (!trim) throw new Error(`Kurasi v7 untuk case "${entry.id}" belum ditulis`);
  return {
    id: entry.id,
    index: entry.index,
    kind: entry.kind,
    title: trim.title ?? entry.title,
    nav: trim.nav,
    headline: trim.headline,
    context: trim.context,
    build: trim.build.map((i) => pick(entry.build, i, `build ${entry.id}`)),
    metrics: trim.metrics.map((i) => pick(entry.metrics, i, `metrics ${entry.id}`)),
    links: entry.links.map((link) => ({ ...link })),
    note: entry.note,
  };
});

export interface V7Chapter {
  span: string;
  title: string;
  body: string;
}

/**
 * Babak History, satu baris masing-masing (revisi 2026-10-15). Judul dan
 * periodenya tetap dari `V5_ABOUT.timeline`; hanya body-nya yang dipendekkan.
 *
 * Babak terakhir sengaja menyimpan "100+ learners at 9.0/10" dan "150+
 * participants": sejak method line di kotak Key figures dihapus, inilah
 * satu-satunya tempat angka 9.0/10 masih bisa dilacak pembaca di halaman ini.
 */
const V7_CHAPTER_BODIES: Record<string, string> = {
  '2018 to 2022': 'Siliwangi University, 3.94 GPA. Bangkit Academy, with distinction.',
  '2021 to 2022': 'Siliwangi’s first GDSC chapter, 0 to 100+ members, four national events.',
  '2023 to 2024': 'Machine Learning mentor at Bangkit: 50+ mentees, 90%+ graduating, 40+ sessions.',
  '2024 to 2026':
    'AI Training Specialist for 100+ learners at 9.0/10, then 5 programs for 150+ participants, plus the CRM pipeline.',
};

export const V7_CHAPTERS: V7Chapter[] = V5_ABOUT.timeline.map((chapter) => {
  const body = V7_CHAPTER_BODIES[chapter.span];
  if (!body) throw new Error(`Body v7 untuk babak "${chapter.span}" belum ditulis`);
  return { span: chapter.span, title: chapter.title, body };
});

/** Satu baris stack, satu-satunya daftar tool di halaman. Tanpa logo. */
export const V7_STACK_LINE = `Working stack: ${V3_TOOLS.map((t) => t.name).join(', ')}.`;

export interface V7PraiseVoice {
  quote: string;
  name: string;
  relation: string;
  role: string;
}

/**
 * Kutipan tetap verbatim dari ledger. Yang dipangkas hanya `role`: kalimat
 * "Managed him directly." mengulang `relation` ("Former manager, Terra AI")
 * tepat di baris berikutnya, dan pengulangan itu makan dua baris di setiap
 * blok. Trim di sini adalah SUFFIX dari role ledger, jadi tidak ada fakta baru
 * (dikunci guard: role v7 wajib ekor dari role ledger).
 */
const V7_PRAISE_ROLE_TRIM: Record<string, string> = {
  'Arnold Doray': 'Now CTO, Wingfin',
  'Christian Jonathan': '2024 to 2025. Now AI Program Manager, GovTech Singapore',
};

export const V7_PRAISE_VOICES: V7PraiseVoice[] = TESTIMONIALS.map((voice) => ({
  ...voice,
  role: V7_PRAISE_ROLE_TRIM[voice.name] ?? voice.role,
}));

export const V7_CONTACT = {
  rows: [
    { label: 'Looking for', value: 'Full-time' },
    { label: 'Setup', value: 'Remote or hybrid, onsite in Indonesia, open to relocate' },
    { label: 'Available', value: 'Immediately' },
  ],
} as const;

/** Colophon dua baris: dokumennya, lalu manusia yang menjawab. */
export const V7_COLOPHON = {
  build: `Built with Next.js and TypeScript. Last updated ${LAST_UPDATED}.`,
  credit: 'Replies to every email.',
} as const;

export { V5_FOUNDER_MAILTO } from './v5';
export { CONTACT } from './ledger';
