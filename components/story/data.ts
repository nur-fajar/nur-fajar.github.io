// Konten scroll-story homepage. Semua copy di sini mengikuti BUILD-SPEC v2 —
// termasuk dua caption yang direvisi di ronde ini (§4.3 step 1 & step 3).

export type PathStep = {
  /** Logo yang muncul di ring untuk step ini. Step 0 = nucleus saja. */
  nodes: { src: string; alt: string }[];
  /** Radius ring sebagai persen lebar diagram (setengah dari diameter orbit). */
  radius: number;
  /** Sudut awal tiap node, derajat. */
  angles: number[];
  direction: 'cw' | 'ccw';
  /** Durasi satu putaran penuh (detik) — §4.3 minta 40-60s. */
  duration: number;
};

// Node marks-nya tinggal di /logos/story/ dan sengaja dipisah dari /logos/:
// yang di /logos/ sebagian lockup lebar berteks (mis. bri.svg, bank-indonesia.png
// versi marketing), dan di dalam lingkaran 44px itu menyusut jadi coretan tak
// terbaca. Yang di sini semuanya mark bujur sangkar yang masih jelas di ukuran
// sekecil itu.
export const NUCLEUS = { src: '/logos/story/unsil.png', alt: 'Universitas Siliwangi' };

export const PATH_STEPS: PathStep[] = [
  // Step 0 — nucleus + orbit terdalam, belum ada node.
  { nodes: [], radius: 18, angles: [], direction: 'cw', duration: 60 },
  // Step 1 — BRI + Bank Indonesia.
  {
    nodes: [
      { src: '/logos/story/bri.png', alt: 'Bank BRI' },
      { src: '/logos/story/bank-indonesia.png', alt: 'Bank Indonesia' },
    ],
    radius: 28,
    angles: [70, 250],
    direction: 'ccw',
    duration: 46,
  },
  // Step 2 — Bangkit Academy + Terra AI.
  {
    nodes: [
      { src: '/logos/story/bangkit.png', alt: 'Bangkit Academy' },
      { src: '/logos/story/terra-ai.png', alt: 'Terra AI' },
    ],
    radius: 38,
    angles: [20, 200],
    direction: 'cw',
    duration: 52,
  },
  // Step 3 — GenBI + GDSC.
  {
    nodes: [
      { src: '/logos/story/genbi.png', alt: 'GenBI — Generasi Baru Indonesia' },
      { src: '/logos/story/gdsc.png', alt: 'Google Developer Student Clubs' },
    ],
    radius: 48,
    angles: [130, 310],
    direction: 'ccw',
    duration: 58,
  },
];

export type SkillGroup = { name: string; tags: string[] };

export const SKILL_GROUPS: SkillGroup[] = [
  {
    name: 'Learning & Development',
    tags: [
      'Instructional Design',
      'Curriculum Dev',
      'ADDIE',
      'Facilitation',
      'Learner Analytics',
      'LMS',
    ],
  },
  {
    name: 'AI Automation',
    tags: [
      'Prompt Engineering',
      'Claude',
      'Gemini',
      'GPT',
      'Perplexity',
      'CRM Automation',
      'Sentiment Analysis',
    ],
  },
  {
    name: 'Program',
    tags: ['Design Thinking', 'Jobs-to-be-Done', 'Community Building', 'Notion', 'Miro'],
  },
  {
    name: 'Content',
    tags: ['Video Production', 'CapCut', 'Adobe Premiere', 'CorelDraw', 'Canva', 'Discord'],
  },
];

export type ShowcaseCard = { tag: string; title: string; sub: string };
export type ShowcaseQuote = { quote: string; name: string; role: string };

/**
 * Isi bento diambil dari konten yang sudah ada di repo (content/signals.ts,
 * content/education.ts, content/references.ts) — bukan placeholder, dan tiap
 * kartu unik. Jumlahnya sengaja banyak: separuh track marquee harus lebih
 * lebar dari viewport, dan kalau isinya sedikit, baris akan terasa mengulang.
 */
export const AWARDS: ShowcaseCard[] = [
  { tag: 'Award', title: 'Best Graduate', sub: 'Faculty of Engineering, Unsil — GPA 3.94' },
  { tag: 'Award', title: 'Top 100 Next Digital Talent', sub: 'IndonesiaNext by Telkomsel — from 6,000 applicants' },
  { tag: 'Award', title: 'Top Project — Mental Health', sub: 'Terra AI, 2022' },
  { tag: 'Award', title: 'Graduated with Distinction', sub: 'Bangkit Academy — Machine Learning path' },
  { tag: 'Scholarship', title: 'Bank Indonesia Scholar', sub: 'One-year award' },
  { tag: 'Scholarship', title: 'Bank BRI Scholar', sub: 'One-semester award' },
  { tag: 'Certification', title: 'TensorFlow Developer', sub: 'Google — 2024' },
  { tag: 'Certification', title: 'Google Data Analytics', sub: 'Professional Certificate — 2023' },
  { tag: 'Certification', title: 'BNSP Digital Marketing', sub: 'National competency certification' },
  { tag: 'Certification', title: 'MOS PowerPoint', sub: 'Microsoft Office Specialist' },
  { tag: 'Publication', title: 'Published in JOIV', sub: 'Ensemble ML + SMOTE for SDG sentiment analysis' },
];

export const WORK: ShowcaseCard[] = [
  { tag: 'Project', title: '9 AI agents in the CRM', sub: 'Full pipeline, human-in-the-loop before sending' },
  { tag: 'Project', title: 'B2B outreach automation', sub: 'Python + LLM APIs — ~3,000 leads processed' },
  { tag: 'Project', title: 'Learning-progress chatbot', sub: 'Built unprompted for Terra AI students' },
  { tag: 'Project', title: '3 GenAI training modules', sub: 'Business, education & product tracks' },
  { tag: 'Project', title: 'This website', sub: 'Designed & built with AI' },
  { tag: 'Milestone', title: '1,000+ human-hours', sub: 'Manual work the CRM agents absorbed' },
  { tag: 'Milestone', title: '350+ learners trained', sub: 'Startups through multinationals' },
  { tag: 'Milestone', title: '9.0 / 10 satisfaction', sub: 'Kirkpatrick L1 mean, all cohorts' },
  { tag: 'Milestone', title: '600 qualified prospects', sub: 'Surfaced by the outreach pipeline' },
  { tag: 'Milestone', title: '30 min → under 5', sub: 'Per-prospect email prep, −83%' },
  { tag: 'Milestone', title: 'GDSC Unsil, from zero', sub: 'Founded it — 100 members in year one' },
  { tag: 'Milestone', title: 'Kuliah Dhuha 2021', sub: 'Lead organizer — 2,000-person programme' },
  { tag: 'Milestone', title: '6 lecturers upskilled', sub: 'Train the Trainers cohort' },
];

// Kutipan asli dari content/references.ts — dipangkas ke satu kalimat kunci
// supaya muat di kartu marquee. 5 dari 11 rekomendasi.
export const REFERENCE_CARDS: ShowcaseQuote[] = [
  {
    quote: 'He mentored more than 100 students and consistently earned 9.8 out of 10 from them.',
    name: 'Christian Jonathan',
    role: 'Manager · Terra AI',
  },
  {
    quote: 'He never let a mentee’s progress go unnoticed — he recognized every milestone along the way.',
    name: 'Kevin Naufal Eryogia',
    role: 'People Team Coordinator · Mondelēz International',
  },
  {
    quote: 'He had a way of making complex ideas accessible no matter where you were starting from.',
    name: 'Andrew Benedictus Jamesie',
    role: 'Senior Software Engineer · Accenture',
  },
  {
    quote: 'Communication stayed clear, tasks were managed effectively, right through to a successful finish.',
    name: 'Diki Hamdani',
    role: 'Capstone teammate · Bangkit Academy',
  },
  {
    quote: 'Organized, proactive, and positive — with everything delivered on time.',
    name: 'Dicky Arya Pratama',
    role: 'Colleague',
  },
];

export const SOCIAL = {
  linkedin: 'https://www.linkedin.com/in/nurfajar/',
  email: 'hi.nurfajar@gmail.com',
  resume: '/Nur-Fajar-Resume-Learning-Development-Specialist.pdf',
  // CTA utama `/hire-me`. Slot booking yang sama yang dulu ditanam sebagai
  // embed Cal.com di section Contact versi lama situs ini — di sini cuma
  // ditaut biasa, jadi tidak ada iframe pihak ketiga yang perlu dipercaya
  // (frame-src di next.config.mjs sudah mengizinkannya kalau suatu saat
  // embed-nya mau dipakai lagi).
  cal: 'https://cal.com/nurfajar/15min',
};

// Kata yang berputar di kalimat penutup (§ permintaan Fajar).
export const CLOSING_WORDS = ['company', 'startup', 'business', 'work', 'project', 'ideas'];
