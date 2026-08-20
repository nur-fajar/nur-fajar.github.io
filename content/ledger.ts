/**
 * Single source of truth untuk seluruh angka & copy situs.
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
 * Amandemen Agustus 2026 (audit "74 ke 96"). Empat perubahan besar:
 *
 * 1. SATU ANGKA, SATU PERIODE, SATU OBJEK. 9.0/10 dulu mengklaim dua periode
 *    kerja sekaligus (tahun AI Training Specialist DAN tahun L&D). Sekarang
 *    ia dikunci ke periode asalnya di setiap tempat ia muncul, dan dihapus
 *    dari kartu kurikulum L&D, di mana ia tidak pernah menjadi miliknya.
 * 2. 300+ MEMBAWA DENOMINATOR-nya. Pembaca dulu harus menjumlahkan sendiri
 *    dari tiga tempat berbeda; sekarang pecahannya ditulis di baris method.
 * 3. PIPELINE CRM NAIK DARI FOOTNOTE JADI KARTU. Dua paragraf disclaimer yang
 *    saling menempel (SKILLS_FOOTNOTE + TECHNICAL_FOOTNOTE) dihapus, diganti
 *    satu kartu setara di grid Work dengan label struktural "Outside the L&D
 *    mandate". Label melakukan pekerjaan pemisahan secara visual, bukan lewat
 *    kalimat minta maaf, dan itu justru membuat klaimnya lebih dipercaya.
 * 4. TIDAK ADA JEMBATAN SEBAB-AKIBAT antara L&D dan AI. Tidak boleh ada kata
 *    "so", "which lets me", "underneath", "powering", "that's why" yang
 *    menghubungkan keduanya. Kalau keduanya harus disebut sebaris, penghubungnya
 *    paralel: "separately", "and also", "on a different track". Situs ini
 *    sekarang tidak menyebut keduanya sebaris sama sekali: keduanya berdiri
 *    sebagai fakta terpisah di tempatnya masing-masing, dan pembaca yang
 *    memperhatikan menarik irisannya sendiri.
 */

export const CONTACT = {
  email: 'hi.nurfajar@gmail.com',
  linkedin: 'https://www.linkedin.com/in/nurfajar/',
  cal: 'https://cal.com/nurfajar/15min',
  location: 'Tangerang, Indonesia',
  timezone: 'GMT+7',
  /** Nama file sengaja deskriptif, file ini duduk di folder Downloads
   *  hiring manager selama berminggu-minggu (spec §7 SECTION 8). */
  cv: '/Nur-Fajar-Resume-Learning-Development-Specialist.pdf',
  cvFilename: 'Nur-Fajar-Resume-Learning-Development-Specialist.pdf',
  /** Dipajang persis di bawah tombol kontak. Menurunkan biaya psikologis
   *  mengirim email dingin lebih dari yang terlihat: yang menahan orang
   *  bukan ragu soal alamatnya, tapi ragu apakah akan dibalas. */
  responseTime: 'I reply within 24 hours, GMT+7.',
} as const;

/**
 * Mailto dengan subject DAN kerangka body sudah terisi.
 *
 * Body-nya dulu cuma "Hi Fajar," yang menyerahkan seluruh pekerjaan menyusun
 * email ke pengirim. Empat baris kosong berlabel di bawah ini mengubahnya jadi
 * formulir isian: hiring manager tinggal mengetik di belakang titik dua, dan
 * balasannya datang sudah lengkap dengan konteks yang memang dibutuhkan.
 */
export const MAILTO =
  `mailto:${CONTACT.email}` +
  '?subject=Role%20at%20%5Bcompany%5D' +
  '&body=' +
  encodeURIComponent(
    'Hi Fajar,\n\n' +
      'Role:\n' +
      'Team size:\n' +
      'Setup (remote/hybrid):\n' +
      'What we need someone to fix:\n',
  );

/**
 * Definisi "end to end" yang dipakai konsisten di seluruh situs. Enam kata
 * ini, urut, adalah satu-satunya definisi yang boleh dipakai kalau situs
 * mengklaim sesuatu "end to end" atau "the whole cycle". Klaim itu hanya
 * berlaku untuk tahun sebagai Learning & Development Specialist
 * (2025-2026): dua peran sebelumnya (mentoring di Bangkit, training di
 * Terra AI) TIDAK memenuhi definisi ini, dan tidak pernah diberi label
 * "end to end" di mana pun di situs.
 */
export const END_TO_END_PHASES = 'ideation, design, development, marketing, delivery, and evaluation';

/*
 * Tidak ada kalimat yang menyebut L&D dan AI dalam satu napas.
 *
 * Sempat ada satu ("I don't just use AI. I have taught 100+ professionals...")
 * yang berdiri sendiri di Experience dan diulang di Contact. Ia dihapus atas
 * permintaan Fajar, dan penghapusannya tidak menghilangkan satu fakta pun:
 * "100+ students and professionals on generative AI, prompt engineering, and
 * chatbot development" sudah ada di bullet AI Training Specialist, enam
 * lecturer sudah ada di kartu Train the Trainers, dan ketiga kursusnya sudah
 * berdiri sebagai kartu yang bisa diklik di Work.
 *
 * Yang hilang cuma kalimat yang menunjuk ke ketiganya sekaligus, dan kalimat
 * seperti itu memang selalu terdengar setengah membela diri. Pembaca yang
 * memperhatikan akan menarik kesimpulan yang sama dari artefaknya sendiri,
 * dan kesimpulan yang ditarik sendiri selalu lebih kuat daripada kesimpulan
 * yang disodorkan.
 */

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1 , Hero
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hero, disusun ulang untuk menjawab tiga pertanyaan screening di layar
 * pertama: di mana orangnya, kapan bisa mulai, dan apa buktinya yang bisa
 * dibuka sekarang juga.
 *
 * Urutan prioritas visualnya sengaja dibalik dari versi sebelumnya. Kalimat
 * terkuat situs ("tell me what people should be able to do...") dulu terkubur
 * di section Contact, di dasar halaman, tempat sebagian besar pembaca tidak
 * pernah sampai. Ia naik jadi sub-headline. Paragraf "As L&D Specialist I own
 * programs the whole way..." turun jadi baris pendukung: isinya tetap utuh,
 * ukurannya yang mengecil.
 */
export const HERO = {
  /** Tiga keraguan logistik, dihapus dalam satu baris kecil. */
  meta: ['Open to work', 'Onsite in Indonesia, GMT+7', 'Remote or hybrid', 'Available now'],
  /**
   * Dipertahankan apa adanya. Empat kata, muat dua baris di ukuran display
   * penuh, dan satu-satunya klaim di halaman yang tidak butuh kualifikasi.
   *
   * Dipecah jadi empat potongan, bukan dua, supaya titik pemecahan barisnya
   * bisa ditentukan di markup alih-alih diserahkan ke browser. Di layar
   * sempit browser memecahnya di tengah frasa ("I run the / whole cycle."),
   * yang membelah span gradient jadi dua dan menggantung kata sandang di
   * ujung baris. Potongan di bawah memecahnya di batas frasa.
   */
  titleLead: 'I run',
  titleAccent: 'the whole cycle.',
  titleRestLead: 'Not just',
  titleRestTail: 'the training day.',
  /** Sub-headline. Ini kalimat yang membuat pembaca berhenti: ia menawarkan
   *  penilaian, bukan jasa, dan menyiratkan kesediaan mengatakan "training
   *  bukan jawabannya" kepada orang yang sedang mau membeli training. */
  sub: [
    'Tell me what people should be able to do after the program.',
    "I'll tell you whether training is even the right answer.",
  ],
  /** Baris pendukung. Isinya sama dengan lede lama, prioritas visualnya turun. */
  support:
    'Learning & Development Specialist. 5 programs and 3 curriculum modules built from scratch this past year: ' +
    `${END_TO_END_PHASES}.`,
  /** Baris bukti. Ini yang mengubah hero dari klaim jadi undangan verifikasi:
   *  ia menunjuk ke #work, tempat ketiga kursusnya benar-benar bisa dibuka. */
  proof: "3 of my courses are live and public. Take a look and see what's inside",
} as const;

/*
 * Angka hero tidak lagi punya array sendiri.
 *
 * Dulu ada HERO_STATS berisi empat sel yang isinya nyaris duplikat empat sel
 * pertama PROOF, dan itu persis kelas bug yang seluruh file ini dibangun
 * untuk mencegah: begitu satu angka hidup di dua tempat, salah satunya akan
 * basi diam-diam. Band angka di bawah hero sekarang mengambil empat sel
 * pertama PROOF langsung (lihat components/site/Stats.tsx).
 */

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
 *
 * Metrik "9.0/10 satisfaction" DIHAPUS dari kartu kurikulum. Angka itu milik
 * periode AI Training Specialist (2024-2025), bukan tahun L&D tempat empat
 * modul ini dibangun, dan menaruhnya di sini membuat satu angka mengklaim dua
 * periode kerja sekaligus. Kalau nanti ada angka kepuasan yang memang milik
 * tahun L&D, ia yang masuk ke sini, bukan angka ini dipinjam lagi.
 */
export const BUILT: BuiltCard[] = [
  {
    id: 'curriculum',
    title: 'Chatbot development curriculum, owned end to end',
    body:
      "Three training modules across business, education, and product tracks, teaching people how to build a chatbot on Smojo, Terra AI's internal chatbot-development language. I owned it the whole way: needs breakdown, outlining, asset development, marketing, live delivery, and evaluation.",
    metrics: ['3 modules', '5 programs', '25+ live sessions', '150+ participants'],
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
 */
export const WORK: WorkCard[] = [
  {
    id: 'chatbot-business',
    title: 'Chatbot for Business',
    body: 'One of the three chatbot-development modules I owned end to end: outline, assets, and delivery.',
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

/**
 * Pipeline CRM 9 agent, dinaikkan dari catatan kaki jadi kartu setara.
 *
 * Versi sebelumnya menyimpannya sebagai DUA paragraf disclaimer berturut-turut
 * di kaki Experience: satu di SKILLS_FOOTNOTE ("Also: Python, LLM pipelines...")
 * dan satu lagi di TECHNICAL_FOOTNOTE yang mengulang isi yang sama dengan
 * nada meminta maaf. Dua kali menyangkal satu hal yang sama membaca seperti
 * seseorang yang tahu ia sedang menaruh sesuatu di tempat yang salah.
 *
 * Solusinya bukan menyembunyikannya lebih dalam, tapi memberinya label
 * struktural, pola yang sudah dipakai kartu lain di grid ini ("Curriculum",
 * "Program", "Live course"). Label melakukan pekerjaan pemisahan secara
 * visual; kalimat "No learners, no curriculum, no evaluation" menyebut tiga
 * komponen L&D yang absen secara spesifik, jadi pembaca L&D langsung paham
 * batasnya tanpa perlu satu kalimat pun untuk membelanya.
 *
 * Aritmetikanya dibiarkan terbuka: 300+ jam manual jadi ~11 jam runtime
 * adalah pengurangan 96%, dan pembaca bisa menghitung ulang sendiri. Angka
 * yang bisa diverifikasi berhenti terlihat seperti angka karangan.
 */
export const CRM_PROJECT = {
  id: 'crm-pipeline',
  kind: 'Outside the Learning & Development mandate',
  title: '9-agent CRM pipeline, Terra Weather',
  body:
    "Sales and revenue ops during the company's B2B pivot. I led the AI side of a 9-agent Python " +
    'pipeline; another engineer owned the CRM itself. No learners, no curriculum, no evaluation. ' +
    'My title stayed Learning & Development Specialist throughout.',
  metrics: [
    '9 agents',
    '~3,000 contacts / ~600 companies',
    '~500 qualified prospects',
    '~11h runtime vs 300+h manual (96% less)',
    'Python + LLM APIs',
  ],
} as const;

export interface Artifact {
  id: string;
  title: string;
  /** Satu kalimat: apa yang sebenarnya dilihat pembaca, dan kenapa itu bukti. */
  note: string;
  src: string;
  alt: string;
}

/**
 * Lebar kartu di grid bento dua baris, ditulis di data dan bukan diturunkan
 * dari indeks.
 *
 * Alasannya sama dengan yang berlaku di grid Work: kalau lebar kartu ditentukan
 * urutannya, menambah satu artefak nanti diam-diam menggeser seluruh baris.
 * Ditulis di sini, ia jadi keputusan editorial yang bisa dibaca dan diubah satu
 * kata, bukan efek samping dari posisi.
 *
 * Grid dasarnya dua belas kolom, dan ketiga nilai ini menjumlah pas jadi dua
 * baris penuh tanpa satu pun koordinat ditulis tangan:
 *
 *   third  4 dari 12   Analysis, Design, Development mengisi baris pertama
 *   major  7 dari 12   Implementation, kartu berfoto, butuh lebar
 *   minor  5 dari 12   Evaluation, sisa baris kedua
 *
 * Tidak ada varian tinggi. Semua kartu setinggi sama, dan itu yang membuat
 * kelimanya muat dalam satu layar: kartu setinggi dua baris memaksa seluruh
 * blok jadi setinggi tiga.
 */
export type AddieSpan = 'third' | 'major' | 'minor';

export interface AddiePhase {
  id: string;
  /** Huruf ADDIE ('A', 'D', 'D', 'I', 'E'), dipakai sebagai penanda kecil di kartu. */
  letter: string;
  phase: string;
  span: AddieSpan;
  /** Satu kalimat di muka kartu: apa yang sebenarnya dikerjakan di fase ini.
   *  Tidak butuh artefak untuk tetap jujur, jadi fase tanpa gambar pun terisi. */
  summary: string;
  /** Keputusan yang diambil di fase ini, satu baris satu keputusan, dibuka di
   *  dialog. Dipisah dari summary karena fase yang belum punya artefak tetap
   *  punya isi di sini: keputusan yang diambil adalah pekerjaannya, gambar cuma
   *  jejaknya. */
  decisions: string[];
  /** Kosong kalau belum ada artefak yang boleh dipajang untuk fase ini. */
  artifacts: Artifact[];
}

/**
 * Satu program (GenAI Product Manager, kohort Train the Trainers), dibaca
 * lewat lima fase ADDIE. ADDIE sendiri sudah diklaim sebagai kompetensi di
 * SKILLS; bagian ini yang membuktikannya per fase, bukan cuma menyebut namanya.
 *
 * Lima fase, dan berhenti di lima. Sertifikat peserta memang terbit Juli 2026,
 * tapi halaman verifikasinya bukti credentialing, bukan bukti evaluasi, dan
 * kotak keenam untuk itu akan membuat ADDIE terbaca sebagai model enam fase.
 * Gambarnya tetap ada di public/artifacts/, hanya tidak dirujuk dari sini.
 *
 * Kelima fase sekarang punya artefak. Lima di antaranya dirender dari deck
 * pre-training (`Pre-Session Meeting TTT GenAI PM.pdf`), yang ternyata memuat
 * sendiri jejak fase yang paling sulit dibuktikan: jadwal yang disepakati
 * sebelum modul ditulis, pilihan slot waktu, tabel goal per section, daftar
 * tool, dan rancangan asesmen Day 4. Deck itu satu-satunya artefak di sini
 * yang dibuat SEBELUM programnya jalan, jadi ia bukti paling kuat untuk klaim
 * "diputuskan di muka" yang dipakai di fase Analysis, Design dan Evaluation.
 *
 * Satu artefak Implementation sengaja dilabeli asal kohortnya. Screenshot kuis
 * itu dari Chatbot for Business, bukan GenAI Product Manager. Ia dipajang
 * karena pola pembukanya sama persis, dan disebutkan asalnya karena caption
 * yang membiarkan pembaca menyimpulkan sendiri lebih murah daripada satu
 * kalimat jujur.
 */
export const ADDIE_PHASES: AddiePhase[] = [
  {
    id: 'analysis',
    letter: 'A',
    phase: 'Analysis',
    span: 'third',
    /* Sengaja pendek. Ringkasan di muka kartu dipotong dua baris, dan kalimat
       yang terpotong di tengah frasa membaca sebagai teks yang kepanjangan,
       bukan sebagai ringkasan. Sisa ceritanya ada di `decisions`. */
    summary: 'Six university lecturers, mixed technical and non-technical.',
    decisions: [
      'A pre-training session set the dates and the milestones before a single module was outlined. Three slots went to the group, 09:00, 13:00 and 19:00 WIB, and the group took the morning.',
      'The schedule agreed in that session is the schedule that ran: 11, 13, 18 and 20 May 2026, two hours each.',
      'Baseline was general AI awareness. Nobody arrived with a product already in flight to improve.',
      'Each participant would build their own product from a case they chose themselves, instead of working a shared example.',
      'Finishing was defined up front and written into the evaluation form: full attendance, plus a final submission with a working chatbot in it.',
      'Format set as a workshop with consultation running alongside it, not a lecture series.',
    ],
    artifacts: [
      {
        id: 'pre-schedule',
        title: 'Program schedule, pre-training deck',
        note: 'Four sessions, dated and fixed before any module was written: 11, 13, 18 and 20 May 2026, two hours each.',
        src: '/artifacts/pre-schedule.webp',
        alt: 'Slide titled Jadwal Pelaksanaan Program with a four row table pairing Day 1 to Day 4 with their topics, the dates 11, 13, 18 and 20 May 2026, and a two hour duration each.',
      },
      {
        id: 'pre-timeslot',
        title: 'Time slot put to the group',
        note: 'Three options offered. Only the morning card carries the selected outline, which is the decision the session was called to make.',
        src: '/artifacts/pre-timeslot.webp',
        alt: 'Slide titled Diskusi: Pemilihan Waktu showing three time slot cards, 09:00, 13:00 and 19:00 WIB, with the 09:00 morning card outlined as the selected option.',
      },
    ],
  },
  {
    id: 'design',
    letter: 'D',
    phase: 'Design',
    span: 'third',
    summary:
      'Nine modules across three days, each section given its goal before a single asset existed.',
    decisions: [
      'The outline was written goal-first: every section header carries the outcome it owes the reader before any slide, note or lab is attached to it.',
      'Three teaching days, three modules each: mindset and identity, then AI integration and behavior, then data and tracking. Day 4 is the assessment, not a tenth module.',
      'Those same goals went back to participants in the pre-training deck, so Day 1 opened with its sequence already visible: PM mindset, then user context, then product identity, each with its goal printed underneath.',
      'Labs sit inside the sequence rather than after it. Lab 1 lands in Day 1, between two teaching blocks.',
      "The closing project is the participant's own chatbot, and it doubles as the assessment, so there was never a separate exam to design.",
    ],
    artifacts: [
      {
        id: 'outline',
        title: 'Course outline, GenAI Product Manager',
        note: 'Nine module tabs down the side, one goals table per section, and Lab 1 already sitting inside Day 1 rather than after it.',
        src: '/artifacts/outline.webp',
        alt: 'Course outline document for GenAI Product Manager, showing nine module tabs in the sidebar and a table pairing each section header with its stated goals.',
      },
      {
        id: 'pre-day1-goals',
        title: 'Day 1 goals, shown to participants',
        note: 'The same goals from the outline, handed to the group before the session rather than kept in the planning document.',
        src: '/artifacts/pre-day1-goals.webp',
        alt: 'Slide titled Day 1: Mindset & Identity with three columns, PM Mindset, User Context and Product Identity, each carrying a description and a stated goal.',
      },
    ],
  },
  {
    id: 'development',
    letter: 'D',
    phase: 'Development',
    span: 'third',
    summary:
      'Course notes written inside the Smojo editor with code that runs, not snippets that illustrate.',
    decisions: [
      'Notes were authored in the editor itself, so every code block in them is a block that executed before it was published.',
      'Images were collected for the notes specifically, and the step where an API key is easiest to leak carries a marked warning rather than a footnote.',
      'Labs and practice guides were built end to end as one flow, instead of assembled from parts written separately.',
      'The full Day 1 to Day 4 cycle was dry run solo before the cohort saw it, to confirm the sequence held. Every lab was walked start to finish the same way, and the notes were revised in place each time a run-through broke.',
    ],
    artifacts: [
      {
        id: 'slides',
        title: 'Day 1 deck, GenAI Product Manager',
        note: 'Twenty Day 1 slides in running order. Lab 1 and Lab 2 are numbered into the teaching blocks, not collected at the end.',
        src: '/artifacts/slides.webp',
        alt: 'Grid of twenty slide thumbnails from the Day 1 GenAI Product Management deck, with lab exercises interleaved between teaching sections.',
      },
      {
        id: 'course-page',
        title: 'Course page, ai4impact',
        note: 'The public page a learner meets before enrolling: three lessons, twelve hours, and a paragraph saying what the course is not.',
        src: '/artifacts/course-note-home.webp',
        alt: 'Public course page for Generative AI Product Manager on ai4impact, showing the course description, three lessons, twelve hours and a Start Learning button.',
      },
      {
        id: 'course-note',
        title: 'Course notes, step by step',
        note: 'Numbered steps with annotated screenshots, and a warning marked at the step where an API key is easiest to leak.',
        src: '/artifacts/course-note.webp',
        alt: 'Course notes page with numbered steps, annotated screenshots and colored callout arrows walking through creating an API key and enabling the Google Sheets API.',
      },
    ],
  },
  {
    id: 'implementation',
    letter: 'I',
    phase: 'Implementation',
    span: 'major',
    summary:
      'Four live sessions, two hours each, 11 to 20 May 2026, on the dates agreed back in analysis.',
    decisions: [
      'Four sessions, not eight. The schedule set in the pre-training session is the schedule that ran.',
      'Consultation ran between sessions over chat and Zoom, opened by whoever needed it, rather than booked into slots that would have gone half empty.',
      'Three tools with one job each, named to participants before the program started: Notion held materials, recordings and assignments; WhatsApp carried fast questions and daily announcements; Smojo was the build environment, with the facilitator setting up accounts alongside each lecturer.',
      'Sessions opened with a live quiz, used as a warm up and as a read on who was actually in the room.',
      'Participants kept building on their own after the last session. Final submissions came in June 2026, certificates in July 2026.',
    ],
    artifacts: [
      {
        id: 'live-session',
        title: 'Live session, Train the Trainers',
        note: 'One of the four two-hour sessions. Participant nametags are blurred; the facilitator is the only person named.',
        src: '/artifacts/live-session.webp',
        alt: 'Zoom gallery view of a live Train the Trainers session with six video tiles. Only the facilitator nametag is legible; the participant nametags are blurred.',
      },
      {
        id: 'pre-ecosystem',
        title: 'The tools, agreed up front',
        note: 'Notion, WhatsApp and Smojo given one job each and shown to participants before the first session, so nobody had to guess where anything lived.',
        src: '/artifacts/pre-ecosystem.webp',
        alt: 'Slide titled Digital Learning Ecosystem with three cards, Notion as the LMS for materials and recordings, a WhatsApp group for fast questions and daily announcements, and Smojo accounts set up with facilitator help.',
      },
      {
        id: 'warmup-quiz',
        title: 'Warm up quiz, session open',
        note: 'A three question poll to open the room. This capture is from the Chatbot for Business cohort, not GenAI Product Manager, and it shows the same opening pattern.',
        src: '/artifacts/warmup-quiz.webp',
        alt: 'Mentimeter quiz screen reading Question 1 of 3 with a join code and seven players ready, shared during a live session.',
      },
    ],
  },
  {
    id: 'evaluation',
    letter: 'E',
    phase: 'Evaluation',
    span: 'minor',
    summary: 'The assessment was written before the program ran, not added to it afterward.',
    decisions: [
      'Day 4 was booked as peer review and showcase from the pre-training deck onward, before a single module had been built.',
      "On the day, lecturers and facilitator reviewed each other's work against a chatbot each of them showed running live.",
      'A tracker at the midpoint, between the last live session and the June submission, checked the build rather than the mood: published, tested, connected to GPT, wired to Google Sheets.',
      'It also asked what each participant planned to do with the chatbot next, and how ready they felt to teach the material themselves. In a Train the Trainers program that second answer is the one the program exists for.',
    ],
    artifacts: [
      {
        id: 'pre-peer-review',
        title: 'Day 4, as designed beforehand',
        note: 'Peer review and showcase written into the pre-training deck. The assessment existed as a plan before it existed as a session.',
        src: '/artifacts/pre-peer-review.webp',
        alt: 'Slide titled Day 4: Peer Review Assessment describing competency validation, with two cards, Peer Review for collaborative evaluation between lecturers and facilitator, and Showcase for demonstrating the chatbot each of them built.',
      },
      {
        id: 'evaluation',
        title: 'Mid-program progress tracker',
        note: 'Four responses at the checkpoint between the last live session and the June submission. It asks whether the chatbot is published, tested and connected, not whether the session was enjoyable.',
        src: '/artifacts/evaluation.webp',
        alt: 'Google Forms response summary for the Train the Trainers progress tracker at four responses, showing charts for post-program plans, preferred follow-up, chatbot build completeness and confidence to teach the material.',
      },
    ],
  },
];

/*
 * Dua mini case study ("Two things I changed after watching them not work")
 * sempat berdiri di sini sebagai blok sendiri di section Work, lalu dihapus.
 *
 * Isinya bagus, masalahnya penempatan: ia muncul tepat setelah grid karya
 * tanpa apa pun yang menyiapkannya, jadi pembaca sampai di dua perbaikan
 * operasional berskala kecil tanpa tahu kenapa justru dua itu yang dipilih
 * dari setahun kerja. Blok yang harus menjelaskan keberadaannya sendiri lebih
 * baik tidak ada sampai ada tempat yang memang memanggilnya, misalnya sebagai
 * bagian dari satu studi kasus penuh per program, bukan sebagai daftar lepas.
 *
 * Teksnya ada di riwayat git kalau nanti dibutuhkan lagi.
 */

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
   * dibaca berdampingan tanpa satu pertanyaan pun (P3).
   */
  bullets: string[];
}

/**
 * Blok 4a, pekerjaan berbayar dengan jabatan resmi.
 *
 * Format tanggal di sini adalah format PENYIMPANAN, bukan format tampilan.
 * Ia cocok persis dengan CV supaya keduanya bisa dibaca berdampingan, dan
 * dinormalkan jadi "Feb 2024 - Jul 2026" di satu tempat saja (lib/dates.ts),
 * bukan diformat ulang per komponen. Versi sebelumnya memformatnya per
 * instance dan hasilnya dua format berbeda di dalam satu kartu yang sama,
 * salah satunya rusak ("2025 JUL to - 2026 JUL").
 */
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
      'Owned the full curriculum lifecycle for 3 GenAI training modules across business, education, and product management tracks, from needs breakdown and outlining to asset development and live delivery.',
      'Produced 4 alumni testimonial videos and ran program social media to drive enrollment across all 5 programs.',
    ],
  },
  {
    start: '2024 FEB',
    end: '2025 JUN',
    title: 'AI Training Specialist',
    org: 'Terra AI',
    place: 'Singapore (Remote)',
    detail: '100+ students & professionals · 9.0/10 across all cohorts, 2024 to 2025',
    bullets: [
      'Trained 100+ students and professionals on generative AI, prompt engineering, and chatbot development, delivering customized curriculum for partners ranging from startups to multinational companies.',
      "Designed a learner progress dashboard (Google Sheets/Notion) mapping each participant's chatbot-development milestones: what they had completed, how far along they were, and what remained, giving learners self-service visibility into their own progress and mentors a shared view of cohort status.",
      'Held 9.0/10 average satisfaction across all cohorts, 2024 to 2025, through structured feedback loops, real-time curriculum iteration, and responsive learner support.',
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
 * angka tanpa denominator adalah klaim, bukan bukti (P2).
 *
 * "300+" sekarang membawa pecahannya. Sebelumnya pembaca harus menjumlahkan
 * sendiri dari tiga tempat berbeda di halaman, dan angka bulat yang tidak bisa
 * dilacak asalnya justru yang paling gampang dicurigai. Angka yang menunjukkan
 * cara kerjanya sendiri berhenti terlihat seperti angka karangan.
 */
export const PROOF: ProofCell[] = [
  {
    value: '300+',
    label: 'learners trained',
    method: 'across 3 roles: 50+ Bangkit 2023 · 100+ training 2024 to 2025 · 150+ Learning & Development 2025 to 2026',
  },
  {
    value: '5',
    label: 'programs run end to end',
    method:
      'as Learning & Development Specialist, 2025 to 2026: Chatbot for Business · Chatbot for Education · Smojothon · Career Talk · Train the Trainers',
  },
  {
    /* Tiga, bukan empat, dan angkanya sekarang berdiri persis di atas
       buktinya: tiga modul, tiga track, dan tiga kursus yang bisa dibuka
       sendiri di section Work. Angka yang jumlahnya cocok dengan artefak yang
       terpajang di halaman yang sama berhenti perlu dipercaya. */
    value: '3',
    label: 'curriculum modules owned',
    method: 'business, education, product tracks, same year as Learning & Development Specialist',
  },
  {
    /* Periodenya ditulis, nama perannya tidak. Angka ini lahir di tahun AI
       Training Specialist, dan sebelum revisi ini ia juga menempel di kartu
       kurikulum L&D setahun sesudahnya, jadi satu angka mengklaim dua periode
       kerja sekaligus. Sekarang ia dikunci ke periodenya di setiap tempat ia
       muncul. Nama perannya sengaja tidak ikut: keempat sel ini adalah layar
       pertama, dan layar pertama berbicara L&D, bukan AI. Nama peran itu ada
       lengkap beberapa section di bawah, di Experience. */
    value: '9.0/10',
    label: 'average satisfaction',
    method: 'all cohorts, 2024 to 2025, structured post-program feedback',
  },
  {
    value: '25+',
    label: 'live sessions delivered',
    method: 'small-group Zoom to one public YouTube livestream, as Learning & Development Specialist',
  },
  { value: '6', label: 'lecturers trained to teach it', method: '2-week Train the Trainers cohort, completed June 2026' },
];

export interface Testimonial {
  quote: string;
  name: string;
  /** Hubungan ke Fajar. Ini yang membuat tiga suara terbaca sebagai tiga
   *  sudut pandang, bukan tiga orang yang mengaku sama. */
  relation: string;
  /** Di mana orang ini sekarang. Konteks, bukan klaim. */
  role: string;
}

/**
 * Tiga saja, dan sekarang tiga sudut pandang yang benar-benar berbeda.
 *
 * Versi sebelumnya berjudul "What the people who managed me said" padahal
 * hanya satu dari tiga yang manajernya, dan dua sisanya sama-sama mentee.
 * Judulnya yang tidak akurat DAN komposisinya yang mengulang. Keduanya
 * diperbaiki sekaligus: satu manajer, satu mentee, satu rekan setim. Tiga
 * sudut pandang berbeda lebih meyakinkan daripada tiga suara yang mengaku
 * sama, karena pembaca bisa memeriksa klaim yang sama dari tiga arah.
 *
 * Kutipan Christian Jonathan dipotong sebelum kata "chatbot". Rekomendasi
 * aslinya menyebut "a chatbot to help students track progress", sementara
 * situs ini di tempat lain menyebut artefak yang sama sebagai dashboard
 * Sheets/Notion. Keduanya rekaman yang jujur dari orang berbeda, tapi
 * berdampingan di satu halaman keduanya saling melemahkan. Bagian kutipan
 * yang tidak bertabrakan tetap dipakai; bagian yang bertabrakan dibuang.
 *
 * Tidak satu pun mengutip angka rating. Percobaan sebelumnya memakai kutipan
 * "9.8 out of 10" lalu perlu caption penjelas supaya tidak terbaca bentrok
 * dengan 9.0/10. Caption yang tugasnya menjelaskan kontradiksi justru menanam
 * keraguan yang ingin dicegahnya.
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    quote: 'His organizational skills and proactive approach stood out.',
    name: 'Christian Jonathan',
    relation: 'Former manager, Terra AI',
    role: 'Managed him directly, 2024 to 2025',
  },
  {
    quote:
      "He never let a mentee's progress go unnoticed; he recognized every milestone along the way.",
    name: 'Kevin Naufal Eryogia',
    relation: 'Former mentee, Bangkit Academy 2023',
    role: 'Now People Team Coordinator, Mondelez International',
  },
  {
    quote:
      'He ran the team with real skill. Communication stayed clear, tasks were managed effectively, and the group worked through to a successful finish.',
    name: 'Diki Hamdani',
    relation: 'Peer, Bangkit Academy',
    role: 'Capstone teammate, 2023',
  },
];

export interface Credential {
  name: string;
  issuer: string;
  year?: string;
  /** Tautan verifikasi. Kredensial tanpa tautan tetap boleh dipajang, tapi
   *  ia tidak boleh berpura-pura bisa diklik. */
  href?: string;
  /**
   * `ld` naik ke strip utama, `other` turun ke satu baris kecil di bawahnya.
   *
   * Ini flag, bukan urutan indeks, dan itu disengaja: menyisipkan satu
   * kredensial baru di tengah array tidak boleh diam-diam mendorong kredensial
   * lain keluar dari strip utama.
   */
  track: 'ld' | 'other';
}

/**
 * Kredensial, dipisah keluar dari About dan diurutkan berdasarkan relevansi
 * ke peran target.
 *
 * Urutan sebelumnya kebetulan persis terbalik: sertifikasi teknis (TensorFlow,
 * Data Analytics) duduk di atas, sertifikasi HR/L&D di bawah, di halaman yang
 * seluruhnya melamar peran L&D. Sekarang tiga kredensial paling relevan naik
 * ke atas, dan ketiganya bisa diverifikasi sendiri.
 *
 * Tautan verifikasi adalah pengembalian kredibilitas tertinggi per menit di
 * seluruh dokumen audit: kredensial tanpa tautan cuma klaim yang diketik rapi,
 * kredensial dengan tautan adalah klaim yang sudah dibuktikan sebelum pembaca
 * sempat meragukannya.
 */
export const CREDENTIALS: Credential[] = [
  {
    name: 'HRCI Human Resource Associate',
    issuer: 'Coursera',
    year: '2024',
    href: 'https://www.coursera.org/account/accomplishments/specialization/certificate/92M2ED4GGPUQ',
    track: 'ld',
  },
  {
    name: 'HRD Fundamentals',
    issuer: 'MySkill',
    href: 'https://storage.googleapis.com/myskill-v2-certificates/learning-path-gzR8UOKYWNrc25zKOg0b/P5TXGCQgYGVxKdae9oPJvNwOTVs2-V7zUKKVZuqM1ytwHjjNg.pdf',
    track: 'ld',
  },
  {
    name: 'Generative AI for Learning and Development',
    issuer: 'LinkedIn Learning',
    href: 'https://www.linkedin.com/learning/certificates/cc531416ad4efd0208c4939578a3d80d8ad3ea599c9d3f7b6b1f189ce3ec74f8',
    track: 'ld',
  },
  {
    name: 'SDGs 101',
    issuer: 'Bappenas',
    href: 'https://sdgs-mlp.bappenas.go.id/certificates/3d68718c0aca4921abc8914651e8b764',
    track: 'other',
  },
  { name: 'TensorFlow Developer Certificate', issuer: 'Google', year: '2024', track: 'other' },
  {
    name: 'Google Data Analytics Professional Certificate',
    issuer: 'Coursera',
    year: '2023',
    track: 'other',
  },
  { name: 'Digital Marketing', issuer: 'BNSP', track: 'other' },
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 6 , Skills
// ─────────────────────────────────────────────────────────────────────────────

export interface SkillGroup {
  label: string;
  items: string[];
}

/*
 * Section Skills & tools tidak punya lede, dan itu keputusan, bukan kelupaan.
 *
 * Dua versi sempat dicoba dan keduanya dibuang. Sebabnya sama: kalimat itu
 * berusaha mengatakan sesuatu yang halamannya sudah katakan. Keluwesan
 * berpindah peran sudah dibawa heading section sebelumnya ("Three roles. Same
 * craft, rising ownership."), dan isi daftarnya sudah dijanjikan heading
 * section ini sendiri ("What the craft is made of."). Kalimat ketiga yang
 * mengulang keduanya berhenti terdengar sebagai penjelasan dan mulai
 * terdengar seperti sedang meyakinkan diri sendiri.
 *
 * Pola yang sama sudah dipakai Credentials dan References: judul, lalu
 * langsung isinya.
 */

/**
 * Semua grup netral: Skills bukan tempat menegaskan identitas track, jadi
 * setiap chip mendapat treatment visual yang sama.
 *
 * Tiga blok ini sekarang SATU-SATUNYA sumber daftar kompetensi di halaman.
 * Kartu Terra AI dan Bangkit dulu membawa tag list sendiri yang isinya
 * sembilan dari sepuluh chip yang sama persis, jadi pembaca melewati daftar
 * yang nyaris identik tiga kali sebelum sampai ke Work. Menghapus duplikatnya
 * memendekkan halaman tanpa menghilangkan satu pun informasi.
 */
export const SKILLS: SkillGroup[] = [
  {
    label: 'Learning & Development and instructional design',
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
  /** Label kecil di atas nama: apa peran babak ini dalam ceritanya. */
  kicker: string;
  name: string;
  /** Bisa lebih dari satu: tiap kartu sekarang menggabungkan beberapa lembaga. */
  logos: BackgroundLogo[];
  body: string;
  /** Tautan verifikasi opsional, dipakai kartu pendidikan untuk publikasi JOIV. */
  link?: { label: string; href: string };
}

/**
 * Latar belakang, dipadatkan dari enam kartu jadi tiga.
 *
 * Enam kartu untuk seseorang dengan empat tahun pengalaman profesional adalah
 * terlalu banyak: ia membuat bagian paling tidak penting di halaman memakan
 * ruang paling banyak, dan menempatkannya sebelum Work (di urutan lama) berarti
 * pembaca menghabiskan perhatiannya di kuliah dan organisasi kampus sebelum
 * sempat melihat satu pun artefak.
 *
 * Tiga kartu sekarang mengelompokkan babak yang memang satu jenis: pendidikan
 * dan beasiswa, program nasional, kepemimpinan organisasi. Tidak ada satu fakta
 * pun yang hilang; yang hilang cuma pengulangannya.
 *
 * Kartu Bangkit sengaja menyebut DUA momen sekaligus, peserta 2022 lalu mentor
 * 2023. Tanpa itu, pembaca yang teliti akan melihat "Bangkit" muncul di sini
 * sebagai pendidikan dan di Experience sebagai pekerjaan, lalu menyimpulkan
 * salah satunya keliru.
 */
export const BACKGROUND: BackgroundCard[] = [
  {
    id: 'education',
    kicker: 'Education and scholarships',
    name: 'Universitas Siliwangi',
    logos: [
      { src: '/logos/unsil.png', alt: 'Universitas Siliwangi' },
      { src: '/logos/bri.png', alt: 'Bank BRI' },
      { src: '/logos/bank-indonesia.png', alt: 'Bank Indonesia' },
    ],
    body:
      'Informatics, 2018 to 2022. Graduated best of the Faculty of Engineering with a 3.94 GPA, on a Bank BRI scholarship for one semester in 2020 and a Bank Indonesia scholarship for a full year in 2021.',
    link: {
      label: 'Undergraduate research published in JOIV (Q2): ensemble ML and SMOTE for SDG sentiment analysis',
      href: 'https://doi.org/10.62527/joiv.8.2.1949',
    },
  },
  {
    id: 'national-programs',
    kicker: 'Ministry of Education programs',
    name: 'Bangkit Academy and Terra AI',
    logos: [
      { src: '/logos/bangkit.png', alt: 'Bangkit Academy' },
      { src: '/logos/terra-ai.png', alt: 'Terra AI', scale: 1.55 },
    ],
    body:
      'Two Kampus Merdeka cohorts in 2022. Graduated Bangkit with distinction on the Machine Learning path, then joined Terra AI, where my team’s mental-health project was picked as a top project. A year later I came back to Bangkit from the other side, as a mentor; Terra AI became my employer in 2024.',
  },
  {
    id: 'leadership',
    kicker: 'Student organizations',
    name: 'GDSC and Generasi Baru Indonesia',
    logos: [
      { src: '/logos/gdsc.png', alt: 'Google Developer Student Clubs' },
      { src: '/logos/genbi.png', alt: 'Generasi Baru Indonesia' },
    ],
    body:
      'Siliwangi’s first ever GDSC chapter lead, built from zero to 100+ members and four national events in its first year. At GenBI, QRIS competition coordinator and media staff, coordinating 50+ Bank Indonesia scholars across digital-payment literacy campaigns.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 8 , What I'm looking for
// ─────────────────────────────────────────────────────────────────────────────

export interface LookingForRow {
  label: string;
  value: string;
  /** Baris kecil di bawah nilai: menerangkan tanpa menaikkan bobot. */
  note?: string;
  /**
   * Frasa tambahan yang menyimpan daftar kota di baliknya. Kotanya muncul saat
   * di-hover ATAU saat difokus keyboard, dan tetap terbaca screen reader
   * sepanjang waktu, karena informasi yang hanya bisa didapat lewat hover
   * tidak akan pernah sampai ke pengguna ponsel maupun pengguna keyboard.
   */
  reveal?: { label: string; items: string[] };
}

/**
 * Tiga jabatan, bukan enam.
 *
 * Enam judul jabatan berjajar membaca sebagai kandidat yang belum memilih, dan
 * itu kebalikan dari sinyal yang dibawa seluruh halaman ini. Empat yang
 * tersisa (termasuk Curriculum Developer, ditambahkan Agustus 2026) adalah
 * jabatan yang benar-benar dilamar; sisanya masuk ke baris catatan di
 * bawahnya, tempat ia menerangkan tanpa mengencerkan.
 *
 * Baris Setup membawa jawaban atas pertanyaan screening yang paling sering
 * menggugurkan kandidat remote sebelum wawancara pertama: bisa onsite atau
 * tidak, dan bersedia pindah atau tidak. Daftar kotanya disembunyikan di balik
 * satu frasa alih-alih dipajang penuh, karena lima nama kota berjajar di baris
 * ini akan menarik perhatian lebih besar daripada bobotnya, sementara yang
 * benar-benar butuh tahu tinggal mengarahkan kursor ke sana.
 */
export const LOOKING_FOR: LookingForRow[] = [
  {
    label: 'Roles',
    value:
      'Learning & Development Specialist · Instructional Designer · Learning Program Manager · Curriculum Developer',
    note: 'Plus hybrid roles where Learning & Development sits next to AI enablement.',
  },
  {
    label: 'Setup',
    value: 'Full-time · remote or hybrid',
    reveal: {
      label: 'onsite in Indonesia',
      items: ['Tangerang', 'Jakarta', 'Bandung', 'Bali', 'Surabaya'],
    },
    note: 'Willing to relocate.',
  },
  { label: 'Based', value: `${CONTACT.location} (${CONTACT.timezone})` },
  { label: 'Available', value: 'Immediately' },
];

/** Dibaca oleh footer dan JSON-LD. Diperbarui bersamaan dengan konten. */
export const LAST_UPDATED = 'August 2026';

// ─────────────────────────────────────────────────────────────────────────────
// Turunan
//
// Semua yang di bawah ini DITURUNKAN dari data di atas, bukan diketik ulang.
// Itu disengaja: begitu sebuah angka atau kalimat hidup di dua tempat, salah
// satunya akan basi diam-diam, dan justru itu kelas bug yang seluruh dokumen
// spec ini dibangun untuk mencegah.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Konteks per organisasi untuk kartu Experience.
 *
 * `chips` sudah tidak ada di sini. Tiap kartu dulu membawa tag list sendiri
 * yang mengulang blok Skills beberapa ratus piksel di bawahnya, hampir chip
 * per chip. Satu sumber saja yang tinggal, dan itu blok Skills.
 */
const ORG_META: Record<string, { summary: string }> = {
  'Terra AI': {
    summary:
      'Two roles, same craft, very different scope. As AI Training Specialist I delivered training other people had scoped. As Learning & Development Specialist I owned programs outright, from needs breakdown to evaluation.',
  },
  'Bangkit Academy': {
    summary:
      'A Ministry of Education-backed national program. My remit was mentoring rather than owning the curriculum: weekly sessions, cohort support, and coordination with the industry and academic experts who delivered guest content.',
  },
};

export interface OrgGroup {
  id: string;
  org: string;
  place: string;
  /** Rentang gabungan mentah: dari start peran tertua sampai end peran terbaru.
   *  Formatnya sama dengan Role.start/Role.end, dinormalkan saat render. */
  start: string;
  end: string;
  summary: string;
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
    return {
      id: org.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      org,
      place: roles[0].place,
      start: roles[roles.length - 1].start,
      end: roles[0].end,
      summary: ORG_META[org].summary,
      roles,
    };
  });
})();

export interface ProjectCard {
  id: string;
  title: string;
  /** Label kategori di pojok kiri atas kartu. */
  kind: string;
  body: string;
  chips: string[];
  href?: string;
  /** Kartu yang berdiri di luar mandat L&D diberi treatment visual sendiri:
   *  label struktural, tanpa aksen gradient. */
  aside?: boolean;
}

/**
 * Grid karya, gabungan dari BUILT (yang dibangun sendiri), WORK (course yang
 * bisa dibuka publik), dan CRM_PROJECT (yang berdiri di luar mandat L&D).
 * Ketiganya diturunkan, bukan disalin, supaya koreksi fakta di sumbernya
 * otomatis ikut ke sini.
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
  {
    id: CRM_PROJECT.id,
    title: CRM_PROJECT.title,
    kind: CRM_PROJECT.kind,
    body: CRM_PROJECT.body,
    chips: [...CRM_PROJECT.metrics],
    aside: true,
  },
];
