/**
 * v5 content canon — founder-focused, full-time generalist.
 *
 * Numbers are DERIVED from content/ledger.ts (the SSOT), never retyped.
 * v5 reframes them for founders (outcomes first) without inventing new facts.
 * Canon reconciliation (Aug 2026):
 * - learners: 300+ (50+ Bangkit 2023 + 100+ training 2024-2025 + 150+ L&D 2025-2026)
 * - CRM headline: ~3,000 contacts / ~600 companies -> ~500 qualified,
 *   ~11h runtime vs 300+h manual (96% less). The 30min-><5min per-prospect
 *   figure from signals.ts is kept as supporting detail inside the case card.
 */

import { CONTACT, CRM_PROJECT, PROOF, TESTIMONIALS, WORK } from './ledger';

export const V5_SEO_SUMMARY =
  'Nur Fajar — versatile generalist for ambitious teams. Base in AI and learning: web and software support, AI agents and automations, programs and training, social and content. 9-agent CRM workflow, 3 public courses, 300+ learners.';

export interface V5NavLink {
  label: string;
  href: string;
}

export const V5_NAV: V5NavLink[] = [
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Work', href: '#work' },
  { label: 'Referrals', href: '#voices' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export const V5_HERO = {
  eyebrow: 'Folio 2026 · Nur Fajar',
  location: 'Tangerang, ID',
  timezone: 'Asia/Jakarta',
  availability: 'Open to full-time',
  titleLead: 'The missing piece?',
  indexPrompt: "That's me.",
  sub: [] as const,
  ticker: [
    'Websites and web apps',
    'AI agents and automations',
    'Programs and training',
    'Social and content',
  ] as const,
  secondaryCta: 'See what I shipped',
} as const;

export interface V5Pillar {
  id: string;
  index: string;
  tag: string;
  title: string;
  body: string;
  points: string[];
}

export const V5_PILLARS: V5Pillar[] = [
  {
    id: 'build',
    index: '01',
    tag: 'Build',
    title: 'Websites, web apps, internal tools',
    body: 'When the site needs improving, an app needs building, or ops needs a tool, I contribute on the software side.',
    points: ['This site: Next.js + TypeScript, dual deploy', 'Supabase-backed apps and dashboards', 'Internal tools that remove ops busywork'],
  },
  {
    id: 'automate',
    index: '02',
    tag: 'Automate with AI',
    title: 'Agents, automations, AI workflows',
    body: 'When AI can remove busywork, I implement it: agents, automations, and AI-powered workflows, with a human checking before anything sends.',
    points: ['9-agent CRM pipeline, live Jun to Jul 2026', 'Python + LLM APIs, human-in-the-loop', '~11h runtime vs 300+h manual'],
  },
  {
    id: 'amplify',
    index: '03',
    tag: 'Amplify',
    title: 'Content, social media & training',
    body: 'Posts, carousels, video, and the social accounts that publish them, plus the training programs that make change stick. One pipeline from outline to published to delivered.',
    points: ['Posts, carousels, video, program social accounts', '4 testimonial videos, 24 published assets', '5 programs end to end, 25+ live sessions'],
  },
];

/** Tool strip logos, verified against public/logos/tools. Founder-relevant five. */
export const V5_TOOLS: { name: string; logo: string }[] = [
  { name: 'GitHub', logo: '/logos/tools/github.png' },
  { name: 'OpenAI', logo: '/logos/tools/openai.png' },
  { name: 'Supabase', logo: '/logos/tools/supabase.png' },
  { name: 'Vercel', logo: '/logos/tools/vercel.png' },
  { name: 'n8n', logo: '/logos/tools/n8n.png' },
];

/** The rest of the working stack, shown once in About instead of the hero. */
export const V5_TOOLS_MORE: { name: string; logo: string }[] = [
  { name: 'Notion', logo: '/logos/tools/notion.png' },
  { name: 'Miro', logo: '/logos/tools/miro.png' },
  { name: 'Canva', logo: '/logos/tools/canva.png' },
  { name: 'CapCut', logo: '/logos/tools/capcut.png' },
  { name: 'Claude', logo: '/logos/tools/claude.png' },
  { name: 'Gemini', logo: '/logos/tools/gemini.png' },
];

export interface V5Case {
  id: string;
  index: string;
  kind: string;
  title: string;
  context: string;
  build: string[];
  metrics: string[];
  links: { label: string; href: string }[];
  note?: string;
}

export const V5_CASES: V5Case[] = [
  {
    id: 'crm-pipeline',
    index: '01',
    kind: 'AI build · Revenue ops',
    title: '9-agent CRM pipeline',
    context:
      'Terra Weather B2B pivot: thousands of raw contacts, no qualification engine, and a sales team with no time for manual research.',
    build: [
      'Led the AI side in a 3-person build with the CEO and a software engineer',
      '9 specialized Python + LLM agents with human-in-the-loop approval before sending',
    ],
    metrics: [...CRM_PROJECT.metrics],
    links: [],
  },
  {
    id: 'curriculum-engine',
    index: '02',
    kind: 'Enablement build · Curriculum',
    title: 'Chatbot curriculum engine',
    context:
      'One chatbot-development engine on Smojo, adapted for three audiences: business, education, and product managers.',
    build: [
      'Owned end to end: needs breakdown, outline, assets, marketing, live delivery',
      'Train the Trainers handoff: 4 workshops plus 4 consultations in 2 weeks',
      'Daily WhatsApp support between sessions so lecturers never stayed blocked',
    ],
    metrics: ['3 modules', '5 programs', '25+ live sessions', '150+ participants'],
    links: WORK.map((course) => ({ label: course.title, href: course.href ?? '#' })),
  },
  {
    id: 'web-builds',
    index: '03',
    kind: 'Web build · Sites shipped',
    title: 'Web builds that prove shipping',
    context: 'Three sites, all live: this portfolio and two brand concept sites.',
    build: [
      'This site: Next.js + TypeScript, one copy source, tested so numbers cannot drift',
      'Nadi wellbeing concept site: fictional brand, landing plus solutions plus contact flow, live on Vercel',
      'Xcel Autodrive concept site: fictional brand, narrative landing plus careers plus contact flow, live on Vercel',
    ],
    metrics: ['Next.js + TS + Vercel', '3 sites live'],
    links: [
      { label: 'nurfajar.com (this site)', href: 'https://nurfajar.com' },
      { label: 'Nadi wellbeing concept site', href: 'https://nadi-wellbeing.vercel.app/' },
      { label: 'Xcel Autodrive concept site', href: 'https://xcel-autodrive.vercel.app/' },
    ],
  },
  {
    id: 'content-engine',
    index: '04',
    kind: 'Social media content · Video & design',
    title: 'Social media content',
    context: 'Course marketing, alumni stories, and holiday greetings, produced and published as social content.',
    build: [
      'Marketing posters and launch videos for each course and event on the calendar',
      'Alumni stories: tracked down graduates of earlier programs, interviewed and edited 4 videos for IG',
    ],
    metrics: ['4 alumni videos', '24 posts published'],
    links: [{ label: 'ai4impact.id on Instagram', href: 'https://www.instagram.com/ai4impact.id/' }],
    note: 'ai4impact is a community under Terra AI.',
  },
];

/** Simplified pipeline illustration. Labeled as simplified, not agent names. */
export const V5_PIPELINE_STAGES = [
  'Source',
  'Enrich',
  'Qualify',
  'Draft',
  'Human review',
  'Send',
  'Sync',
] as const;

export interface V5ProofCell {
  value: string;
  label: string;
  method: string;
}

/**
 * Dua sel yang dikurasi dari canon PROOF, bukan cermin 1:1. Tiap baris wajib
 * satu cerita yang berbeda: jangkauan (300+), kualitas (9.0/10), outcome
 * (96% less, highlight di bawah). Tiga sel L&D 2025 to 2026 yang gugur di sini
 * (5 programs, 3 modules, 25+ sessions) menceritakan tahun yang sama dan
 * ketiganya tetap hidup di Work case + Experience, jadi yang hilang cuma
 * pengulangan. Diambil by value supaya sisipan di PROOF tidak diam-diam
 * menggeser isi section ini; tes kurasi mengunci valuenya.
 */
const V5_PROOF_VALUES = ['300+', '9.0/10'] as const;

export const V5_PROOF: V5ProofCell[] = V5_PROOF_VALUES.map((value) => {
  const cell = PROOF.find((candidate) => candidate.value === value);
  if (!cell) throw new Error(`Proof "${value}" tidak ada di ledger PROOF`);
  return { ...cell };
});

export const V5_PROOF_HIGHLIGHT = {
  value: '96% less',
  label: 'manual outreach time',
  method: '~11h runtime vs 300+h manual on the CRM pipeline, recomputable from the card above',
} as const;

export const V5_VOICES = TESTIMONIALS.map((t) => ({ ...t }));

export interface V5TimelineEntry {
  span: string;
  title: string;
  body: string;
}

export const V5_ABOUT = {
  eyebrow: 'About',
  title: ['2018 to now,', 'in four chapters.'] as const,
  lede: 'Study, student leadership, mentoring, then three paid roles. Every chapter below is verifiable further up this page.',
  timeline: [
    {
      span: '2018 to 2022',
      title: 'Informatics degree, best of the faculty',
      body: 'Siliwangi University, 3.94 GPA. Bank BRI scholarship for one semester in 2020, Bank Indonesia scholarship for a full year in 2021. Graduated Bangkit Academy on the Machine Learning path, with distinction.',
    },
    {
      span: '2021 to 2022',
      title: 'Built a student organization from zero',
      body: 'Founding lead of Siliwangi’s first GDSC chapter: 0 to 100+ members, four national events.',
    },
    {
      span: '2023 to 2024',
      title: 'Returned as a mentor',
      body: 'Machine Learning mentor at Bangkit Academy: 50+ mentees from 25+ universities, 90%+ of the cohort graduating, 40+ weekly sessions.',
    },
    {
      span: '2024 to 2026',
      title: 'Terra AI, trainer to program owner',
      body: 'AI Training Specialist for 100+ learners at 9.0/10 satisfaction, then Learning & Development Specialist owning 5 programs for 150+ participants, plus the AI side of a 9-agent CRM pipeline.',
    },
  ] as const,
};

export const V5_FOUNDER_MAILTO =
  `mailto:${CONTACT.email}` +
  '?subject=Intro%20at%20%5Bcompany%5D' +
  '&body=' +
  encodeURIComponent(
    'Hi Fajar,\n\nWhat eats most time right now:\nTeam size + tools:\nLink to product or site:\nTimeline:\n',
  );

export const V5_CONTACT_ROWS = [
  { label: 'Looking for', value: 'Full-time · utility player (software, AI, programs, content)' },
  { label: 'Setup', value: 'Remote or hybrid · onsite in Indonesia · willing to relocate' },
  { label: 'Based', value: `${CONTACT.location} (${CONTACT.timezone})` },
  { label: 'Available', value: 'Immediately' },
] as const;

/** Risk-reversal close: the last line of the page restates the bet, not admin. */
export const V5_CONTACT_CLOSE =
  'Bring one painful workflow. 15 min, honest no if I cannot fix it. Reply within 24 hours.';

/** Caption that keeps the before/after mailer attributed to the CRM case. */
export const V5_MAIL_CAPTION = 'Example draft, anonymized, from the pipeline above.';

export interface V5Section {
  id: string;
  eyebrow: string;
  heading: readonly [string, string];
  lede: string;
}

export const V5_SECTIONS: V5Section[] = [
  {
    id: 'capabilities',
    eyebrow: 'What I bring to the table',
    heading: ['Versatile skillset', 'for your growth.'],
    lede: 'Websites, AI, programs, and content: one hire that grows with your company.',
  },
  {
    id: 'work',
    eyebrow: 'Selected work',
    heading: ['Proof,', "what I've built."],
    lede: 'What I do as a curriculum developer, as an AI engineer, as a software engineer, and as a social media and content manager.',
  },
  {
    id: 'voices',
    eyebrow: 'Referrals',
    heading: ['What working', 'with me is like.'],
    lede: 'A manager, a mentee, and a teammate on the same pattern: organized, proactive, and clear under pressure.',
  },
  {
    id: 'about',
    eyebrow: V5_ABOUT.eyebrow,
    heading: V5_ABOUT.title,
    lede: V5_ABOUT.lede,
  },
  {
    id: 'contact',
    eyebrow: 'Contact',
    heading: ["Let's build", 'something better.'],
    lede: "Let's find the missing piece for your team.",
  },
];
