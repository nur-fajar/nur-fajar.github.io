/**
 * Single source of truth untuk seluruh angka & copy situs v2.
 *
 * Aturannya dari spec §3: angka di file ini adalah SATU-SATUNYA versi yang
 * boleh muncul di situs, dan setiap angka wajib membawa konteks/metodenya di
 * sebelahnya (prinsip P2). Kalau sebuah angka tidak punya baris `method`,
 * angka itu tidak boleh dipakai.
 *
 * Semua nilai di bawah ini sudah dicocokkan baris per baris dengan
 * Nur-Fajar-Resume-Learning-Development-Specialist.pdf (prinsip P3, situs dan
 * CV harus bisa dibaca berdampingan tanpa satu pertanyaan pun).
 *
 * Amandemen Agustus 2026 (lihat riwayat git untuk detail lengkap):
 * scoping "end to end" diperketat. Tiga peran berbayar Fajar TIDAK
 * setara: Machine Learning Mentor (Bangkit) murni mentoring, AI Training
 * Specialist murni delivery, dan hanya Learning & Development Specialist
 * yang memegang siklus penuh (ideation, design, development, marketing,
 * delivery, evaluation). Angka "5 programs" dan "4 curriculum modules"
 * cuma valid untuk tahun L&D itu, bukan digabung ke tiga tahun. Angka
 * "300+ learners" tetap benar sebagai TOTAL lintas 3 peran (sudah begitu
 * dari awal), tapi tidak boleh lagi duduk bersebelahan dengan "5 programs"
 * tanpa method line yang memisahkan keduanya secara eksplisit, karena
 * sebelahan begitu terbaca seolah 300+ itu hasil dari 5 program yang sama.
 */

export const CONTACT = {
  email: 'hi.nurfajar@gmail.com',
  linkedin: 'https://www.linkedin.com/in/nurfajar/',
  cal: 'https://cal.com/nurfajar/15min',
  location: 'Tangerang, Indonesia',
  timezone: 'GMT+7',
  /** Nama file sengaja deskriptif, file ini duduk di folder Downloads
   *  hiring manager selama berminggu-minggu (spec §7 SECTION 8). */
  cv: '/Nur-Fajar-LnD-Specialist-CV.pdf',
  cvFilename: 'Nur-Fajar-LnD-Specialist-CV.pdf',
} as const;

/** Mailto dengan subject & body sudah terisi, mengurangi gesekan menulis
 *  email pertama sampai nyaris nol. */
export const MAILTO =
  `mailto:${CONTACT.email}` +
  '?subject=Role%20at%20%5Bcompany%5D' +
  '&body=Hi%20Fajar%2C%0A%0A';

/**
 * Definisi "end to end" yang dipakai konsisten di seluruh situs. Enam kata
 * ini, urut, adalah satu-satunya definisi yang boleh dipakai kalau situs
 * mengklaim sesuatu "end to end" atau "the whole cycle". Klaim itu hanya
 * berlaku untuk tahun sebagai Learning & Development Specialist
 * (2025-2026) , dua peran sebelumnya (mentoring di Bangkit, training di
 * Terra AI) TIDAK memenuhi definisi ini, dan tidak pernah diberi label
 * "end to end" di mana pun di situs.
 */
export const END_TO_END_PHASES = 'ideation, design, development, marketing, delivery, and evaluation';

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1 , Hero
// ─────────────────────────────────────────────────────────────────────────────

export interface HeroStat {
  value: string;
  label: string;
  /** Denominator / konteks. Wajib ada , P2. */
  method: string;
}

/**
 * Keempat sel adalah metrik L&D/kurikulum murni. Tidak ada angka AI di hero
 * (spec §16 anti-checklist).
 *
 * "5 programs" dan "4 curriculum modules" method-nya secara eksplisit
 * mengunci ke satu tahun/satu peran. "300+ learners" method-nya secara
 * eksplisit bilang 3 peran. Dua kelompok ini TIDAK BOLEH dibaca sebagai
 * satu populasi yang sama , itulah sebabnya masing-masing wajib
 * menyebut cakupannya sendiri, bukan cuma "wajib ada method line".
 */
export const HERO_STATS: HeroStat[] = [
  { value: '300+', label: 'learners trained', method: 'across 3 roles, 2023 to 2026' },
  { value: '5', label: 'programs run end to end', method: 'as L&D Specialist, 2025 to 2026' },
  { value: '4', label: 'curriculum modules owned', method: 'same year, as L&D Specialist' },
  { value: '9.0/10', label: 'average satisfaction', method: 'all cohorts, post-program feedback' },
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2 , What I built
// ─────────────────────────────────────────────────────────────────────────────

export interface BuiltCard {
  id: string;
  title: string;
  body: string;
  /** Baris metrik mono di kaki kartu. */
  metrics: string[];
  /** Kartu pertama mendapat ruang lebih besar, urutan mencerminkan bobot. */
  lead?: boolean;
  /** Kartu dipadatkan: tanpa jeda paragraf, metrik langsung menempel. */
  compact?: boolean;
}

/**
 * Dua kartu, bukan empat. Dua kartu lama dihapus, bukan disembunyikan:
 *
 * - "Learner progress dashboard" dihapus dari What I Built DAN Selected
 *   Work. Belum ada artefak (screenshot) yang bisa ditunjukkan, dan spec
 *   §12 sendiri bilang: kalau artefak belum siap, jangan pajang kartu
 *   kosongnya.
 * - "Program marketing & content" dihapus sebagai kartu berdiri sendiri.
 *   Pekerjaan marketing-nya tetap disebut, tapi sebagai satu klausa di
 *   dalam kartu kurikulum (di mana ia memang terjadi), bukan sebagai
 *   pencapaian terpisah.
 */
export const BUILT: BuiltCard[] = [
  {
    id: 'curriculum',
    title: 'Chatbot development curriculum, owned end to end',
    body:
      "Four training modules across business, education, and product tracks, teaching people how to build a chatbot on Smojo, Terra AI's internal chatbot-development language. I owned it the whole way: needs breakdown, outlining, asset development, marketing, live delivery, and evaluation, with weekly progress reviews with the CEO.",
    metrics: ['4 modules', '5 programs', '25+ live sessions', '150+ participants', '9.0/10 satisfaction'],
    lead: true,
  },
  {
    id: 'train-the-trainers',
    title: 'Train the Trainers',
    body:
      'Six university lecturers, two weeks: four workshops, four consultations, weekly live check-ins, and daily WhatsApp support between sessions. The program wrapped in June 2026, equipping them to deliver the chatbot development curriculum to their own students going forward.',
    metrics: ['6 lecturers', '8 sessions', '2 weeks', 'completed June 2026'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3 , Selected work
// ─────────────────────────────────────────────────────────────────────────────

export interface WorkCard {
  id: string;
  title: string;
  body: string;
  href?: string;
  /** Label mono yang menggantikan thumbnail sampai screenshot asli tersedia. */
  kind: string;
  /** Ditandai kalau artefaknya belum punya tautan publik. */
  note?: string;
}

/**
 * Aturan spec §7 SECTION 3: kartu tanpa tautan asli lebih baik dihapus
 * daripada dipajang. Ketiga course di bawah ini live dan publik, hiring
 * manager bisa membukanya sendiri, bukan cuma percaya ringkasan.
 *
 * Kartu keempat (learner progress dashboard) dihapus untuk saat ini,
 * konsisten dengan penghapusannya di What I Built: belum ada screenshot
 * yang bisa ditunjukkan.
 */
export const WORK: WorkCard[] = [
  {
    id: 'chatbot-business',
    title: 'Chatbot for Business',
    body: 'One of the four chatbot-development modules I owned end to end: outline, assets, and delivery.',
    href: 'https://ai4impact.org/learn/detail?v=chatbots-for-business-id',
    kind: 'Live course · ai4impact',
  },
  {
    id: 'chatbot-education',
    title: 'Chatbot for Education',
    body: 'The same course engine, adapted for an education-sector audience.',
    href: 'https://ai4impact.org/learn/detail?v=chatbots-for-education-id',
    kind: 'Live course · ai4impact',
  },
  {
    id: 'gen-ai-pm',
    title: 'Gen AI Product Manager',
    body:
      'The Train the Trainers course. The material I used to hand the curriculum to six lecturers, so they can teach it themselves.',
    href: 'https://ai4impact.org/learn/detail?v=gen-ai-product-manager-id',
    kind: 'Live course · ai4impact',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4 , Experience
// ─────────────────────────────────────────────────────────────────────────────

export interface Role {
  start: string;
  end: string;
  title: string;
  org: string;
  place: string;
  detail: string;
  /**
   * Uraian peran, disalin apa adanya dari bullet CV supaya situs dan CV bisa
   * dibaca berdampingan tanpa satu pertanyaan pun (P3). Disembunyikan di balik
   * disclosure: Experience harus tetap bisa dipindai dalam beberapa detik,
   * dan detail sepanjang ini akan mengubur baris tanggal dan jabatan yang
   * justru jadi alasan section ini ada.
   */
  bullets: string[];
}

/** Blok 4a, pekerjaan berbayar dengan jabatan resmi. Tanggal & jabatan
 *  match persis dengan CV. */
export const WORK_HISTORY: Role[] = [
  {
    start: '2025 JUL',
    end: '2026 JUL',
    title: 'Learning & Development Specialist',
    org: 'Terra AI',
    place: 'Singapore (Remote)',
    detail: '5 programs end-to-end · 150+ participants · 25+ live sessions',
    bullets: [
      'Delivered 5 end-to-end programs and 25+ live sessions to 150+ participants, from small-group Zoom workshops to a publicly livestreamed YouTube event (Chatbot for Business, Chatbot for Education, Smojothon, Career Talk, Train the Trainers).',
      'Designed and led a 2-week Train the Trainers program for 6 university lecturers: 4 workshop sessions plus 4 consultation sessions, backed by weekly live consultations and daily WhatsApp support to keep participants unblocked between sessions.',
      'Owned the full curriculum lifecycle for 4 GenAI training modules across business, education, and product management tracks, from needs breakdown and outlining to asset development and live delivery, with weekly progress reviews with the CEO.',
      'Produced 4 alumni testimonial videos and ran program social media to drive enrollment across all 5 programs.',
    ],
  },
  {
    start: '2024 FEB',
    end: '2025 JUN',
    title: 'AI Training Specialist',
    org: 'Terra AI',
    place: 'Singapore (Remote)',
    detail: '100+ students & professionals · 9.0/10 across all cohorts',
    bullets: [
      'Trained 100+ students and professionals on generative AI, prompt engineering, and chatbot development, delivering customized curriculum for partners ranging from startups to multinational companies.',
      "Designed a learner progress dashboard (Google Sheets/Notion) mapping each participant's chatbot-development milestones: what they had completed, how far along they were, and what remained, giving learners self-service visibility into their own progress and mentors a shared view of cohort status.",
      'Maintained 9.0/10 average satisfaction across all cohorts through structured feedback loops, real-time curriculum iteration, and responsive learner support.',
      'Applied a 20% instruction / 80% practice model with project-based assessments across all cohorts.',
    ],
  },
  {
    start: '2023 FEB',
    end: '2024 JAN',
    title: 'Machine Learning Mentor',
    org: 'Bangkit Academy',
    place: 'Indonesia (Remote)',
    detail: '50+ mentees from 25+ universities · 90%+ graduation rate',
    bullets: [
      'Mentored 50+ students from 25+ universities across Indonesia in a Ministry of Education-backed national program, with 90%+ of the cohort graduating.',
      'Ran 40+ weekly sessions on technical and soft skills, and coordinated with 20+ industry and academic experts to deliver guest content and improve the online learning experience.',
    ],
  },
];

/** Blok 4b, kepemimpinan organisasi, bukan riwayat kerja berbayar. Dipisah
 *  persis seperti di CV, dan divisualkan lebih ringan supaya tidak terbaca
 *  setara dengan Blok 4a. */
export const LEADERSHIP: Role[] = [
  {
    start: '2021 AUG',
    end: '2022 JUL',
    title: 'Chapter Lead (founding)',
    org: 'Google Developer Student Clubs',
    place: 'Siliwangi University',
    detail: 'Founded from zero · 100+ members in year one · 4 national events',
    bullets: [
      'Founded the first GDSC chapter at Siliwangi University, growing to 100+ active members within its inaugural year.',
      'Co-organized 4 national events spanning webinars and hackathons, drawing 500+ participants across the developer community.',
    ],
  },
  {
    start: '2021 MAY',
    end: '2022 APR',
    title: 'Competition Coordinator & Media Staff',
    org: 'Generasi Baru Indonesia (GenBI)',
    place: 'Bank Indonesia',
    detail: 'Coordinated 50+ Bank Indonesia scholars across QRIS literacy campaigns',
    bullets: [
      'Coordinated 50+ Bank Indonesia scholarship recipients across QRIS digital-payment literacy campaigns; produced event and promo video content.',
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5 , Proof
// ─────────────────────────────────────────────────────────────────────────────

export interface ProofCell {
  value: string;
  label: string;
  method: string;
}

/**
 * Enam sel, semuanya metrik L&D/kurikulum. Setiap angka membawa metodenya:
 * angka tanpa denominator adalah klaim, bukan bukti (P2). Cakupan tahun/
 * peran ditulis eksplisit di setiap method line yang butuh itu (lihat
 * catatan amandemen di kepala file).
 */
export const PROOF: ProofCell[] = [
  { value: '300+', label: 'learners trained', method: 'across 3 roles, 2023 to 2026' },
  {
    value: '5',
    label: 'programs run end to end',
    method:
      'as L&D Specialist, 2025 to 2026: Chatbot for Business · Chatbot for Education · Smojothon · Career Talk · Train the Trainers',
  },
  {
    value: '4',
    label: 'curriculum modules owned',
    method: 'business, education, product tracks, same year as L&D Specialist',
  },
  { value: '9.0/10', label: 'average satisfaction', method: 'all cohorts, structured post-program feedback' },
  {
    value: '25+',
    label: 'live sessions delivered',
    method: 'small-group Zoom to one public YouTube livestream, as L&D Specialist',
  },
  { value: '6', label: 'lecturers trained to teach it', method: '2-week Train the Trainers cohort, completed June 2026' },
];

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  /** Caption opsional untuk menyelesaikan konflik instrumen pengukuran. */
  caption?: string;
}

/**
 * Tiga saja. Dua testimoni generik dari situs lama dibuang: pujian yang bisa
 * ditempel ke siapa pun menurunkan bobot rata-rata tiga yang spesifik ini.
 *
 * Kutipan Christian Jonathan sengaja BUKAN baris "9.8 out of 10"-nya, meski
 * itu bagian paling mudah dikutip dari rekomendasi LinkedIn-nya. Angka itu
 * berasal dari International AI Bootcamp by ai4impact, program terpisah dari
 * 5 program end-to-end di grid Proof, dan menaruhnya di sini berarti butuh
 * caption penjelas supaya tidak terbaca sebagai konflik dengan 9.0 di
 * sebelahnya. Caption defensif seperti itu justru menanam keraguan yang
 * tidak perlu ada, jadi pilihan yang lebih baik adalah tidak memakai baris
 * itu sama sekali. Kutipan yang dipakai adalah bagian lain rekomendasinya:
 * anekdot konkret soal dashboard yang ia bangun sendiri berinisiatif, bukan
 * angka yang butuh pembelaan.
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'His organizational skills and proactive approach stood out, especially in creating a chatbot to help students track progress.',
    name: 'Christian Jonathan',
    role: 'Manager, Terra AI',
  },
  {
    quote:
      "He never let a mentee's progress go unnoticed; he recognized every milestone along the way.",
    name: 'Kevin Naufal Eryogia',
    role: 'People Team Coordinator, Mondelēz International',
  },
  {
    quote: 'He had a way of making complex ideas accessible no matter where you were starting from.',
    name: 'Andrew Benedictus Jamesie',
    role: 'Senior Software Engineer, Accenture',
  },
];

export const CREDENTIALS: string[] = [
  'TensorFlow Developer (Google, 2024)',
  'Google Data Analytics Professional Certificate (2023)',
  'HRCI Human Resource Associate (Coursera, 2024)',
  'BNSP Digital Marketing',
  'Published in JOIV: ensemble ML + SMOTE for SDG sentiment analysis',
];

/**
 * Kredensial teknis pendukung. Satu paragraf, visual paling ringan di seluruh
 * situs, tanpa warna aksen dan tanpa angka besar, sengaja dibuat terlihat
 * sekunder. 1,250 ditampilkan dengan aritmetikanya supaya pembaca bisa
 * menghitung ulang sendiri (3.000 × 25 menit = 75.000 menit = 1.250 jam).
 */
export const TECHNICAL_FOOTNOTE =
  'Also outside the L&D mandate: I led the AI side of a 9-agent Python pipeline for the ' +
  "CRM at Terra Weather (Terra AI's parent company): sales ops, ~3,000 prospects, ~1,250 " +
  'hours of manual prep absorbed (3,000 × 25 min saved each). Not training, not ' +
  'curriculum; my title stayed L&D Specialist throughout.';

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 6 , Skills
// ─────────────────────────────────────────────────────────────────────────────

export interface SkillGroup {
  label: string;
  items: string[];
}

/** Semua grup netral, Skills bukan tempat menegaskan identitas track, jadi
 *  setiap chip mendapat treatment visual yang sama. */
export const SKILLS: SkillGroup[] = [
  {
    label: 'L&D & instructional design',
    items: [
      'Curriculum development',
      'Instructional design (ADDIE)',
      'Training needs analysis',
      'Learning experience design',
      'Facilitation & blended learning',
      'Assessment design',
      'Training evaluation',
      'Train the Trainers',
      'Program management',
      'Stakeholder management',
    ],
  },
  {
    label: 'Learning ops & tools',
    items: [
      'Google Workspace',
      'Notion',
      'Miro',
      'Discord',
      'Moodle',
      'Custom learner-progress tracking (Sheets/Notion)',
    ],
  },
  {
    label: 'Content & program',
    items: [
      'Video production',
      'CapCut',
      'Adobe Premiere',
      'Canva',
      'Community building',
      'Design thinking',
    ],
  },
];

/**
 * Bukan grup skill keempat, satu baris kecil di bawah rule tipis.
 *
 * Pointer "See Proof for details" dihapus: di struktur baru tidak ada section
 * bernama Proof lagi, dan TECHNICAL_FOOTNOTE duduk beberapa baris di bawahnya
 * di section yang sama, jadi pointer itu menunjuk ke tempat yang tidak ada.
 */
export const SKILLS_FOOTNOTE =
  'Also: Python, LLM pipelines, and prompt engineering, from a production AI project ' +
  'outside my L&D role.';

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 7 , Background
// ─────────────────────────────────────────────────────────────────────────────

export interface BackgroundLogo {
  src: string;
  alt: string;
  /** Sebagian logo membawa margin kosong besar di file-nya sendiri. */
  scale?: number;
}

export interface BackgroundCard {
  id: string;
  /** Label kecil di atas nama: apa peran institusi ini dalam ceritanya. */
  kicker: string;
  name: string;
  /** Bisa lebih dari satu: kartu beasiswa membawa dua lembaga sekaligus. */
  logos: BackgroundLogo[];
  body: string;
}

/**
 * Latar belakang, disusun sebagai bento alih-alih dua paragraf.
 *
 * Enam kartu berukuran sama, bukan tujuh dengan span berbeda-beda. Versi
 * sebelumnya memberi Bank BRI dan Bank Indonesia satu kartu sempit
 * masing-masing, dan isinya cuma satu kalimat ("One semester."), jadi kartunya
 * teregang setinggi kartu terpanjang di barisnya dan sisanya kosong. Kedua
 * beasiswa sekarang berbagi satu kartu dengan dua logo, yang membuat bobot
 * isinya sepadan dengan tetangganya. Ruang kosong di bento hampir selalu soal
 * isi yang tidak seimbang, bukan soal ukuran sel.
 *
 * Kartu Bangkit sengaja menyebut DUA momen sekaligus, peserta 2022 lalu mentor
 * 2023. Tanpa itu, pembaca yang teliti akan melihat "Bangkit" muncul di sini
 * sebagai pendidikan dan di Experience sebagai pekerjaan, lalu menyimpulkan
 * salah satunya keliru.
 */
export const BACKGROUND: BackgroundCard[] = [
  {
    id: "unsil",
    kicker: "Where it started",
    name: "Universitas Siliwangi",
    logos: [{ src: "/logos/unsil.png", alt: "Universitas Siliwangi" }],
    body:
      "Informatics, 2018 to 2022. Graduated best of the Faculty of Engineering with a 3.94 GPA.",
  },
  {
    id: "scholarships",
    kicker: "Scholarships",
    name: "Bank BRI and Bank Indonesia",
    logos: [
      { src: "/logos/bri.png", alt: "Bank BRI" },
      { src: "/logos/bank-indonesia.png", alt: "Bank Indonesia" },
    ],
    body: "One semester on the BRI scholarship, then a full year on the Bank Indonesia one.",
  },
  {
    id: "bangkit",
    kicker: "Ministry of Education program",
    name: "Bangkit Academy",
    logos: [{ src: "/logos/bangkit.png", alt: "Bangkit Academy" }],
    body:
      "Joined in early 2022 and graduated with distinction on the Machine Learning path. A year later I came back to the same program from the other side, as a mentor.",
  },
  {
    id: "terra",
    kicker: "Ministry of Education program",
    name: "Terra AI",
    logos: [{ src: "/logos/terra-ai.png", alt: "Terra AI", scale: 1.55 }],
    body:
      "Joined later in 2022; my team’s mental-health project was picked as a top project. That same program became my employer in 2024.",
  },
  {
    id: "genbi",
    kicker: "Student organisation",
    name: "Generasi Baru Indonesia",
    logos: [{ src: "/logos/genbi.png", alt: "Generasi Baru Indonesia" }],
    body:
      "QRIS competition coordinator and media staff, coordinating 50+ Bank Indonesia scholars across digital-payment literacy campaigns.",
  },
  {
    id: "gdsc",
    kicker: "Student organisation",
    name: "Google Developer Student Clubs",
    logos: [{ src: "/logos/gdsc.png", alt: "Google Developer Student Clubs" }],
    body:
      "Siliwangi’s first ever chapter lead, built from zero to 100+ members and four national events in its first year.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 8 , What I'm looking for
// ─────────────────────────────────────────────────────────────────────────────

export const LOOKING_FOR: Array<[string, string]> = [
  [
    'Roles',
    'L&D Specialist · Instructional Designer · Curriculum Developer · Learning Program Manager · Training Manager · hybrid L&D + AI enablement',
  ],
  ['Setup', 'Full-time · remote or hybrid'],
  ['Based', `${CONTACT.location} (${CONTACT.timezone})`],
  ['Available', 'Immediately'],
];

/** Dibaca oleh footer dan JSON-LD. Diperbarui bersamaan dengan konten. */
export const LAST_UPDATED = 'August 2026';

// ─────────────────────────────────────────────────────────────────────────────
// Turunan untuk layout v3
//
// Semua yang di bawah ini DITURUNKAN dari data di atas, bukan diketik ulang.
// Itu disengaja: begitu sebuah angka atau kalimat hidup di dua tempat, salah
// satunya akan basi diam-diam, dan justru itu kelas bug yang seluruh dokumen
// spec ini dibangun untuk mencegah.
// ─────────────────────────────────────────────────────────────────────────────

/** Konteks per organisasi untuk kartu Experience. Bullet, jabatan, dan
 *  tanggalnya TIDAK ada di sini, semuanya diturunkan dari WORK_HISTORY. */
const ORG_META: Record<string, { summary: string; chips: string[] }> = {
  'Terra AI': {
    summary:
      'Two roles, two different jobs. As AI Training Specialist I delivered training other people had scoped. As L&D Specialist I owned programs outright, from the needs breakdown to the evaluation, with weekly progress reviews with the CEO.',
    chips: [
      'Curriculum development',
      'Instructional design (ADDIE)',
      'Training needs analysis',
      'Facilitation',
      'Assessment design',
      'Training evaluation',
      'Train the Trainers',
      'Notion',
      'Google Workspace',
    ],
  },
  'Bangkit Academy': {
    summary:
      'A Ministry of Education-backed national program. My remit was mentoring rather than owning the curriculum: weekly sessions, cohort support, and coordination with the industry and academic experts who delivered guest content.',
    chips: ['Mentoring', 'Machine learning', 'Cohort support', 'Stakeholder coordination'],
  },
};

export interface OrgGroup {
  id: string;
  org: string;
  place: string;
  /** Rentang gabungan: dari start peran tertua sampai end peran terbaru. */
  period: string;
  summary: string;
  chips: string[];
  roles: Role[];
}

/**
 * Experience dikelompokkan per organisasi, bukan per jabatan.
 *
 * Terra AI muncul sebagai SATU kartu dengan dua sub-jabatan di dalamnya, dan
 * itu justru menguntungkan kejujuran: pembaca melihat langsung bahwa "AI
 * Training Specialist" dan "L&D Specialist" adalah dua periode berbeda dengan
 * tanggalnya masing-masing, bukan satu blok tiga tahun yang seolah semuanya
 * end to end.
 */
export const ORGS: OrgGroup[] = (() => {
  const order: string[] = [];
  const grouped = new Map<string, Role[]>();

  for (const role of WORK_HISTORY) {
    if (!grouped.has(role.org)) {
      grouped.set(role.org, []);
      order.push(role.org);
    }
    grouped.get(role.org)!.push(role);
  }

  return order.map((org) => {
    // WORK_HISTORY urut dari yang terbaru, jadi entri terakhir adalah yang tertua.
    const roles = grouped.get(org)!;
    const meta = ORG_META[org];
    return {
      id: org.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      org,
      place: roles[0].place,
      period: `${roles[roles.length - 1].start} - ${roles[0].end}`,
      summary: meta.summary,
      chips: meta.chips,
      roles,
    };
  });
})();

export interface ProjectCard {
  id: string;
  title: string;
  /** Label kategori di pojok kanan atas kartu. */
  kind: string;
  body: string;
  chips: string[];
  href?: string;
}

/**
 * Grid karya, gabungan dari BUILT (yang dibangun sendiri) dan WORK (course
 * yang bisa dibuka publik). Keduanya diturunkan, bukan disalin, supaya koreksi
 * fakta di BUILT/WORK otomatis ikut ke sini.
 */
export const PROJECTS: ProjectCard[] = [
  ...BUILT.map((card) => ({
    id: card.id,
    title: card.title,
    kind: card.id === 'curriculum' ? 'Curriculum' : 'Program',
    body: card.body,
    chips: card.metrics,
  })),
  ...WORK.map((card) => ({
    id: card.id,
    title: card.title,
    kind: 'Live course',
    body: card.body,
    chips: ['ai4impact', 'Public'],
    href: card.href,
  })),
];
