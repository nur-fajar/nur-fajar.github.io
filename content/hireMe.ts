// Copy untuk halaman konversi `/hire-me`.
//
// Homepage (`/`) itu naratif — ia membangun rasa, bukan menutup kesepakatan.
// Halaman ini kebalikannya: tiap section ditaruh untuk memindahkan pengunjung
// satu langkah lebih dekat ke "kirim email / booking call", dengan urutan
// masalah → solusi → bukti → proses → bantahan keberatan → ajakan.
//
// Aturan isi: TIDAK ADA angka baru di file ini. Semua klaim ditarik dari
// content/signals.ts, content/references.ts, content/designCaseStudy.ts, dan
// components/story/data.ts yang sudah lebih dulu ada di repo — kalau sebuah
// angka tidak bisa ditelusuri ke sana, ia tidak boleh muncul di halaman yang
// tujuannya justru membangun kepercayaan.

export type Stat = { value: string; label: string };
export type Failure = { problem: string; because: string; fix: string };
export type Service = { n: string; name: string; promise: string; deliverables: string[]; proof: string };
export type CaseStudy = { metric: string; metricLabel: string; title: string; context: string; did: string[]; result: string };
export type Step = { n: string; name: string; detail: string; when: string };
export type Faq = { q: string; a: string };

export const HERO = {
  status: 'Open to work · Remote, UTC+7',
  h1: ['Hire me to build training', 'your team actually applies.'],
  sub: 'I am Nur Fajar — a Learning & Development specialist who designs the curriculum, delivers it, measures whether it changed behaviour, and automates the operational work underneath it. Four jobs most teams hire four people for.',
  primaryCta: 'Book a 15-minute intro call',
  secondaryCta: 'Email me directly',
};

// Diambil dari signals.ts (Terra Weather, Bangkit) + data.ts WORK milestones.
export const HERO_STATS: Stat[] = [
  { value: '350+', label: 'learners trained' },
  { value: '9.0/10', label: 'mean satisfaction, Kirkpatrick L1' },
  { value: '1,250 hrs', label: 'manual work automated away' },
  { value: '90%+', label: 'cohort graduation rate' },
];

export const LOGOS = [
  { src: '/logos/story/terra-ai.png', alt: 'Terra Weather' },
  { src: '/logos/story/bangkit.png', alt: 'Bangkit Academy' },
  { src: '/logos/story/bank-indonesia.png', alt: 'Bank Indonesia' },
  { src: '/logos/story/bri.png', alt: 'Bank BRI' },
  { src: '/logos/story/gdsc.png', alt: 'Google Developer Student Clubs' },
  { src: '/logos/story/genbi.png', alt: 'GenBI' },
  { src: '/logos/story/unsil.png', alt: 'Universitas Siliwangi' },
];

// Bagian "kenapa kebanyakan gagal" — cermin dari framing template rujukan,
// tapi dipindah ke domain yang benar-benar saya kerjakan: program L&D.
export const FAILURES: Failure[] = [
  {
    problem: 'The training gets great reviews and changes nothing.',
    because: 'Attendance and a happy-sheet are the only things measured, so nobody finds out that the skill never reached the job.',
    fix: 'Objectives are backward-designed from the artifact the learner must produce, then measured at Kirkpatrick L1–L3 — reaction, learning, and behaviour on the job.',
  },
  {
    problem: 'The content is built for the trainer, not the learner.',
    because: 'A generic deck gets reused across audiences whose prior knowledge, motivation, and fears are completely different.',
    fix: 'Every programme starts from a written learner profile — prior knowledge, motivation, fears — and the design follows from it. Sessions run 20% instruction, 80% practice.',
  },
  {
    problem: 'The programme dies when the trainer leaves.',
    because: 'The knowledge lives in one person and the operations are manual, so nothing survives their last day.',
    fix: 'Facilitator guides, assessment instruments, and a Train-the-Trainers handover ship with the programme — plus automation for the repetitive operational work around it.',
  },
];

export const SERVICES: Service[] = [
  {
    n: '01',
    name: 'GenAI training programmes',
    promise: 'A full programme for your team — from empty page to a cohort that can do the work.',
    deliverables: [
      'Curriculum, module outlines, and facilitator guides',
      'Live delivery — webinar, workshop, or multi-week cohort',
      'Project-based assessment with a real artifact per learner',
      'Progress dashboard and post-programme evaluation report',
    ],
    proof: '4 GenAI modules built across business, education, and product tracks; 5 programmes led end to end for 200+ participants.',
  },
  {
    n: '02',
    name: 'Instructional design & programme audit',
    promise: 'You already have training. It underperforms. I take it apart and rebuild the parts that fail.',
    deliverables: [
      'Learner profile and design brief',
      'Bloom-tagged objectives, backward-designed from the artifact',
      'Session architecture — hook, concept, activity, checkpoint',
      'Formative and summative assessment instruments',
    ],
    proof: 'A worked example is on this site: a 2-hour, 3-lesson course taken apart down to its assessment rationale.',
  },
  {
    n: '03',
    name: 'AI workflow automation',
    promise: 'The repetitive work around your programme — or your pipeline — handled by agents, with a human still approving.',
    deliverables: [
      'Workflow mapping and automation scope',
      'Python + LLM API pipeline built to your stack',
      'Agents wired into your CRM or ops tooling',
      'Human-in-the-loop approval before anything is sent',
    ],
    proof: '9 agents deployed across a CRM pipeline: ~3,000 leads processed, 600 qualified prospects surfaced, per-prospect prep cut 83%.',
  },
  {
    n: '04',
    name: 'Train the Trainers',
    promise: 'Your own people run the programme after I leave. That is the point.',
    deliverables: [
      'Facilitation coaching for your internal trainers',
      'Annotated facilitator guides and session runbooks',
      'Observation, feedback, and certification cycle',
      'Full handover of materials and evaluation instruments',
    ],
    proof: '6 university lecturers upskilled through a Train-the-Trainers cohort at Terra Weather.',
  },
];

export const CASES: CaseStudy[] = [
  {
    metric: '−83%',
    metricLabel: 'time per prospect',
    title: 'B2B outreach, rebuilt as an agent pipeline',
    context: 'A 3-person build with the CEO and a software engineer at Terra Weather. Outreach prep was eating the team alive at roughly 30 minutes per prospect.',
    did: [
      'Co-engineered a Python + LLM API pipeline, live June–July 2026',
      'Deployed 9 specialised agents across the CRM, each with a narrow job',
      'Kept a human approval gate before any email left the system',
    ],
    result: '~3,000 leads processed and 600 qualified prospects surfaced. Prep fell from ~30 minutes to under 5 — a manual-equivalent workload of ~1,250 hours that never had to be staffed.',
  },
  {
    metric: '9.0/10',
    metricLabel: 'mean learner satisfaction',
    title: 'GenAI curriculum for mixed audiences, startup to multinational',
    context: 'Learners arrived with no shared baseline — some non-technical business owners, some engineers — and the same generic deck would have failed both.',
    did: [
      'Built 4 modules spanning foundational to production-ready',
      'Ran a 20% instruction / 80% practice delivery framework',
      'Iterated curriculum live from structured feedback loops each cohort',
    ],
    result: 'A 9.0/10 mean Kirkpatrick L1 score sustained across every cohort, with 100+ students and professionals trained and progress tracked per learner.',
  },
  {
    metric: '90%+',
    metricLabel: 'cohort graduation rate',
    title: 'Mentoring 50+ students across 25 universities',
    context: 'A Ministry of Education programme at Bangkit Academy, with mentees spread across Indonesia and no shared campus to fall back on.',
    did: [
      'Ran 40+ weekly sessions covering technical skills, soft skills, and engagement',
      'Coordinated 20+ industry and academic experts as the liaison to the Bangkit team',
      'Tracked individual progress rather than cohort averages',
    ],
    result: 'Graduation rate above 90%. Two mentees from that cohort are quoted further down this page — one now at Accenture, one at Mondelēz International.',
  },
];

export const PROCESS: Step[] = [
  { n: '01', name: 'Intro call', detail: '15 minutes. You describe the gap, I tell you plainly whether I am the right person for it.', when: 'Day 0' },
  { n: '02', name: 'Scope & design brief', detail: 'Learner profile, objectives, success measures, and a fixed scope in writing before anything is built.', when: 'Week 1' },
  { n: '03', name: 'Build & pilot', detail: 'Materials, assessments, and automation built, then piloted with a small group and revised on what the pilot exposes.', when: 'Weeks 2–4' },
  { n: '04', name: 'Deliver & measure', detail: 'Live delivery, then evaluation at reaction, learning, and behaviour — not attendance.', when: 'Delivery' },
  { n: '05', name: 'Handover', detail: 'Facilitator guides, instruments, and a Train-the-Trainers pass so your team can run it without me.', when: 'Close' },
];

export const FAQS: Faq[] = [
  {
    q: 'Where are you based, and does remote work?',
    a: 'Indonesia, UTC+7. I spent two and a half years as a fully remote Learning & Development Specialist for a Singapore-based company, so remote delivery and async collaboration are the normal case for me, not an experiment.',
  },
  {
    q: 'What kind of engagement are you open to?',
    a: 'Full-time roles, contract engagements, and one-off workshops. If you are not sure which fits, the intro call is the fastest way to find out — I will say so if a smaller engagement would serve you better.',
  },
  {
    q: 'Which languages do you deliver in?',
    a: 'Bahasa Indonesia and English. Materials can ship bilingual if your cohort is mixed.',
  },
  {
    q: 'Do you actually build the automation, or just specify it?',
    a: 'I build it. The CRM pipeline described above was co-engineered in Python against LLM APIs, and I hold a TensorFlow Developer certificate and a Google Data Analytics certificate alongside the L&D work.',
  },
  {
    q: 'How do you prove the training worked?',
    a: 'Kirkpatrick levels 1 through 3 — reaction, learning, and on-the-job behaviour. Assessment is artifact-based: learners produce something real and explain the design decisions behind it, which is what separates understanding from rote completion.',
  },
  {
    q: 'What does it cost?',
    a: 'It depends entirely on scope, and I would rather quote something honest than post a number that fits nobody. Bring the gap to the intro call and you will get a scoped figure in writing.',
  },
];

export const FINAL_CTA = {
  heading: ['One call is enough to know', 'if this is a fit.'],
  sub: 'Fifteen minutes, no deck, no pitch. Describe the gap in your team and I will tell you straight whether I can close it — and if I cannot, who or what would.',
  reassure: 'Usually replies within one business day.',
};
