// Konten `/hire-me` — berkas kesiapan satu unit, bertema mecha.
//
// TIDAK ADA CERITA BARU DI FILE INI. Seluruh isi halaman ini adalah cerita
// homepage (`/`) yang dibingkai ulang sebagai briefing pra-peluncuran; yang
// mecha cuma bingkainya, faktanya persis sama. Tiap blok menyebut sumbernya:
//
//   UNIT      ← StoryHero (sapaan + judul layar-pembaca)
//   SPECS     ← components/story/data.ts (WORK milestones) + content/signals.ts
//   SORTIES   ← StoryPath CAPTIONS + PATH_STEPS/NUCLEUS
//   SUBSYSTEM ← data.ts SKILL_GROUPS (kode unit saja yang ditambahkan di sini)
//   LAUNCH    ← StoryClosing
//
// Grup skill, penghargaan, log kerja, dan kutipan TIDAK disalin ke sini sama
// sekali — halaman mengimpor `SKILL_GROUPS`, `AWARDS`, `WORK`, dan
// `REFERENCE_CARDS` langsung dari `components/story/data.ts`, jadi satu
// perubahan di sana ikut ke dua halaman dan keduanya tidak bisa berselisih.
//
// Aturan lama file ini tetap berlaku: tidak ada angka yang tidak bisa
// ditelusuri ke `content/signals.ts`, `content/references.ts`, atau `data.ts`.

export type Stat = { value: string; label: string };
export type Sortie = { code: string; phase: string; caption: string };
export type Section = { code: string; name: string; note: string };

/** Pelat identitas unit. Nama & tagline dari StoryHero. */
export const UNIT = {
  designation: 'NF-01',
  class: 'Learning & Development Specialist',
  callsign: 'Nur Fajar',
  // Judul layar-pembaca StoryHero, kata per kata.
  tagline: 'I build people, not just curricula.',
  status: 'Open to work · Remote, UTC+7',
  statusCode: 'All systems nominal',
  primaryCta: 'Book a 15-minute intro call',
  secondaryCta: 'Email me directly',
  reassure: 'Usually replies within one business day.',
};

/** Callout spesifikasi di blueprint hero. Empat angka, semua sudah ada di repo. */
export const SPECS: Stat[] = [
  { value: '350+', label: 'learners trained' },
  { value: '9.0/10', label: 'mean satisfaction, Kirkpatrick L1' },
  { value: '1,250 hrs', label: 'manual work automated away' },
  { value: '90%+', label: 'cohort graduation rate' },
];

/**
 * Rekam jejak penempatan — orbit StoryPath yang diluruskan jadi garis waktu.
 *
 * Urutan dan isinya sejajar 1:1 dengan `CAPTIONS` di StoryPath dan dengan
 * `PATH_STEPS`, jadi logo tiap tahap diambil dari sana alih-alih didaftar
 * ulang: indeks 0 memakai `NUCLEUS`, indeks 1-3 memakai `PATH_STEPS[i].nodes`.
 * Caption di sana berupa JSX (ada penebalan di tengah kalimat); di sini
 * versinya teks polos, dengan fakta yang sama.
 */
export const SORTIES: Sortie[] = [
  {
    code: 'S-00',
    phase: 'Origin',
    caption:
      'It started at Universitas Siliwangi, where I graduated as the best graduate of the Faculty of Engineering with a 3.94 GPA.',
  },
  {
    code: 'S-01',
    phase: 'Support',
    caption:
      'Along the way, I received the Bank BRI scholarship for a semester, and the Bank Indonesia scholarship for a year.',
  },
  {
    code: 'S-02',
    phase: 'National programmes',
    caption:
      'I joined two national programs by Indonesia’s Ministry of Education — Bangkit Academy in early 2022, graduating with distinction in the Machine Learning path, then Terra AI later that year, where my project team was selected as a top project in mental health.',
  },
  {
    code: 'S-03',
    phase: 'Command',
    caption:
      'On campus, I took on leadership early — serving as QRIS competition coordinator and media staff at GenBI at the same time, and becoming GDSC’s first-ever lead, building it from zero.',
  },
];

/**
 * Kode unit untuk tiap grup skill, sejajar indeks dengan `SKILL_GROUPS` di
 * `components/story/data.ts` — nama dan tag-nya diimpor dari sana, bukan
 * disalin, jadi yang perlu hidup di sini hanya lapisan kode mecha-nya.
 */
export const SUBSYSTEM_CODES = ['SYS-A', 'SYS-B', 'SYS-C', 'SYS-D'];

/** Header kokpit tiap section. */
export const SECTIONS: Record<string, Section> = {
  core: { code: 'SEC-01', name: 'Core system', note: 'Primary function' },
  sorties: { code: 'SEC-02', name: 'Deployment history', note: '4 phases logged' },
  subsystems: { code: 'SEC-03', name: 'Subsystems', note: '4 arrays online' },
  record: { code: 'SEC-04', name: 'Service record', note: 'Commendations & mission log' },
  transmissions: { code: 'SEC-05', name: 'Incoming transmissions', note: '5 of 11 received' },
  launch: { code: 'SEC-06', name: 'Launch', note: 'Awaiting clearance' },
};

/** Penutup — kalimat dan ajakan kontaknya dari StoryClosing. */
export const LAUNCH = {
  line: 'See me as your last puzzle piece,',
  // Kalimat kedua StoryClosing dipecah supaya kata yang berputar
  // (`CLOSING_WORDS` di data.ts) bisa disisipkan di tengahnya.
  lineBefore: 'or the diamond that grows your',
  sub: 'Fifteen minutes, no deck, no pitch. Describe the gap in your team and I will tell you straight whether I can close it — and if I cannot, who or what would.',
  thanks: 'Thank you for visiting my site.',
};
