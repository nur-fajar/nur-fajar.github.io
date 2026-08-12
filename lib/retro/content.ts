// Konten Bahasa Inggris untuk /retro, diselaraskan dengan angka & tautan yang sudah
// dipakai situs utama (lihat components/Hero.tsx, components/Contact.tsx) supaya kedua
// versi situs tidak saling kontradiksi.

import { buildAreas, type AreaBlueprint, type AreaDef, type AreaKey } from './gameState';

export interface StoryBeat {
  tag: string;
  title: string;
  sub: string;
  problem: string;
  resolution: string;
  stats: [string, string][];
}

export interface ProjectEntry extends StoryBeat {
  categoryIndex: number;
}

export interface SkillPiece {
  name: string;
  plainName: string;
  color: string;
  items: string[];
  blurb: string;
}

export interface ContactMethod {
  tag: string;
  value: string;
  href: string;
  color: string;
  blurb: string;
}

export const PROJECT_CATEGORIES: [string, string][] = [
  ['AI / AUTOMATION', '#e05a4e'],
  ['LEARNING', '#e0557f'],
  ['PRODUCT', '#54c8e0'],
  ['BUSINESS', '#f2a03d'],
];

export const ORG: StoryBeat[] = [
  {
    tag: 'KKN',
    title: 'KKN — VILLAGE COORDINATOR',
    sub: 'Purwaharja · 2021',
    problem:
      'Dropped into one village with **16 people** who had never worked together, 10 work programs, and a fixed departure date.',
    resolution:
      'Split into four divisions, one owner per program, progress tracked in Sheets. __All ten programs shipped.__',
    stats: [
      ['TEAM', '16'],
      ['PROGRAMS', '10'],
      ['RESIDENTS', '~200'],
      ['DURATION', '6 WEEKS'],
    ],
  },
  {
    tag: 'GDSC',
    title: 'GDSC UNSIL — CHAPTER LEAD',
    sub: 'Founding · 2021—22',
    problem: 'The chapter **did not exist yet**. No members, no events, no reason for anyone to show up.',
    resolution:
      'Recruited in batches, and ran most events jointly with other chapters so the material was stronger than I could bring alone. __100 members in year one.__',
    stats: [
      ['MEMBERS', '100'],
      ['SERIES', '4'],
      ['ATTENDANCE', '50+/EVENT'],
      ['STATUS', 'FOUNDING'],
    ],
  },
  {
    tag: 'LDK KISI',
    title: 'KULIAH DHUHA — CHAIR',
    sub: '2021 · online format',
    problem: 'A student-orientation event had to move online, and **no one had run** the online version before.',
    resolution:
      'A 50-person crew split by division, one rundown, one decision path — so 50 people did not become 50 versions of the event. __2,000+ attendees.__',
    stats: [
      ['ATTENDEES', '2,000+'],
      ['CREW', '~50'],
      ['FORMAT', 'ONLINE'],
      ['ROLE', 'CHAIR'],
    ],
  },
  {
    tag: 'SIDE QUESTS',
    title: 'SIDE QUESTS ×4',
    sub: '2019—2022',
    problem:
      'GenBI Tasikmalaya (3 videos), QRIS Competition with Bank Indonesia, Accreditation Team (C to B), IndonesiaNext (top 100 of 6,000).',
    resolution: '__The pattern was always the same: I was handed people and a deadline, and I built the system.__',
    stats: [
      ['MISSIONS', '4'],
      ['ORGS TOTAL', '7'],
      ['SPAN', '2019-22'],
      ['PATTERN', 'CONSISTENT'],
    ],
  },
];

export const WORK: StoryBeat[] = [
  {
    tag: 'BANGKIT',
    title: 'BANGKIT ACADEMY — ML TRAINEE',
    sub: '2022 · capstone lead',
    problem:
      'I joined to learn machine learning. **Not to lead anyone.** But the capstone needed a lead, and six people from three disciplines did not automatically agree.',
    resolution:
      'I spent more time getting everyone aligned than writing models. __Valo.ai shipped, and I graduated with Distinction — top 10% of 1,000+ participants.__',
    stats: [
      ['RANK', 'DISTINCTION'],
      ['PLACED', 'TOP 10%'],
      ['OF', '1,000+'],
      ['TEAM', '6 PEOPLE'],
    ],
  },
  {
    tag: 'MSIB',
    title: 'TERRA AI — CHATBOT DEVELOPER',
    sub: 'MSIB · 5 months',
    problem:
      'Interned as a developer on a team that **had no mental-health product yet**. Easy to stay a demo that nobody ever hears about again.',
    resolution:
      'Led a 4-person team building Zy, a web-based chatbot on Smojo — and pushed for it to actually ship. __Zy reached real users.__',
    stats: [
      ['TEAM', '4'],
      ['PRODUCT', 'ZY'],
      ['STATUS', 'SHIPPED'],
      ['PLATFORM', 'SMOJO'],
    ],
  },
  {
    tag: 'TERRA AI',
    title: 'TERRA AI — AI ENGINEER + L&D',
    sub: 'two roles at once',
    problem: 'Then the company **pivoted**. Everyone had to become something else, fast.',
    resolution:
      'I became two things at once: 9 AI agents for CRM in Python, while designing and facilitating 4 GenAI programs end to end. __Two jobs that turned out to be one.__',
    stats: [
      ['AGENTS', '9'],
      ['PROGRAMS', '4'],
      ['LEARNERS', '350+'],
      ['MODE', 'DUAL'],
    ],
  },
];

export const PROJECTS: ProjectEntry[] = [
  {
    tag: 'CRM',
    categoryIndex: 0,
    title: '9-AGENT CRM',
    sub: 'Python · GPT-4o-mini',
    problem: 'The sales team spent its day **sorting leads**, not talking to people.',
    resolution:
      'Built nine sequential agents: lead classification, email drafting, sync back to the CRM. __Manual sorting now runs itself, every day.__',
    stats: [
      ['STACK', 'PYTHON'],
      ['AGENTS', '9'],
      ['MODEL', '4o-mini'],
      ['STATUS', 'ACTIVE'],
    ],
  },
  {
    tag: 'CURRICULUM',
    categoryIndex: 1,
    title: 'GENAI CURRICULUM',
    sub: '4 programs · ADDIE',
    problem: 'People wanted to use GenAI, but the material **jumped straight to technical**.',
    resolution:
      'Designed four tiered programs using ADDIE, each with its own assessment. __350+ learners, and a learning path that repeats without me.__',
    stats: [
      ['PROGRAMS', '4'],
      ['CONTENT', '~20 HRS'],
      ['LEARNERS', '350+'],
      ['METHOD', 'ADDIE'],
    ],
  },
  {
    tag: 'ZY',
    categoryIndex: 2,
    title: 'ZY — CHATBOT',
    sub: 'Smojo · shipped 2022',
    problem: 'A campus with many students who needed someone to talk to, and **few counselors**.',
    resolution: 'Designed the conversation flow myself, 4-person team. __Shipped, not demoed.__',
    stats: [
      ['TEAM', '4'],
      ['PLATFORM', 'SMOJO'],
      ['STATUS', 'SHIPPED'],
      ['YEAR', '2022'],
    ],
  },
  {
    tag: 'VALO.AI',
    categoryIndex: 2,
    title: 'VALO.AI',
    sub: '6 people · 3 disciplines',
    problem: 'Vaccination season: location info scattered and **people did not know where to go**.',
    resolution:
      'Six people, three disciplines, one month. __It worked. Did not win the competition — but the team finished it whole.__',
    stats: [
      ['TEAM', '6'],
      ['DISCIPLINES', '3'],
      ['TIME', '1 MONTH'],
      ['RESULT', 'FUNCTIONAL'],
    ],
  },
  {
    tag: 'INVITATIONS',
    categoryIndex: 3,
    title: 'DIGITAL INVITATIONS',
    sub: 'side business',
    problem: 'I had never sold anything to someone **paying with their own money** before.',
    resolution:
      'Build, price, deliver, support — all of it, solo. __"Good feature" and "someone will pay for it" are two different things.__',
    stats: [
      ['ROLE', 'ALL OF IT'],
      ['TYPE', 'SIDE'],
      ['CLIENTS', 'REAL'],
      ['STATUS', 'RUNNING'],
    ],
  },
];

export const SKILLS: SkillPiece[] = [
  {
    name: 'L&D',
    plainName: 'L&D',
    color: '#e0557f',
    items: ['Curriculum Development', 'Instructional Design', 'ADDIE', 'Facilitation', "Bloom's Taxonomy", 'LMS'],
    blurb: 'Because building something **means nothing if nobody can actually use it**.',
  },
  {
    name: 'AI / AUTO',
    plainName: 'AI/Automation',
    color: '#54c8e0',
    items: ['CRM Automation', 'Prompt Engineering', 'n8n Workflow', 'Sentiment Analysis', 'Data Analysis'],
    blurb: 'Because I **became technical first**, and never left it behind.',
  },
  {
    name: 'PROGRAM',
    plainName: 'Program Management',
    color: '#f2a03d',
    items: ['Program Planning', 'Team Leadership', 'Stakeholder Mgmt', 'Execution', 'Notion / Sheets'],
    blurb: 'Because since KKN, the ask has always been one thing: **make sure this ships**.',
  },
  {
    name: 'COMMUNITY',
    plainName: 'Community & Content',
    color: '#8b5fe0',
    items: ['Community Management', 'Audience Communication', 'Content Production', 'Canva / CapCut'],
    blurb: 'Because a participant **does not stop being one** once the class ends.',
  },
];

// CONTACT: value/href diambil langsung dari components/Contact.tsx (CONTACT_EMAIL,
// CONTACT_LINKS, iframe Cal.com src) dan components/Nav.tsx (link CV) — bukan tebakan.
// Lihat catatan rekonsiliasi di task-3-report.md.
export const CONTACT: ContactMethod[] = [
  {
    tag: 'EMAIL',
    value: 'hi.nurfajar@gmail.com',
    href: 'mailto:hi.nurfajar@gmail.com',
    color: '#54c8e0',
    blurb: "The fastest way. I'll get back within a day or two.",
  },
  {
    tag: 'LINKEDIN',
    value: 'linkedin/nurfajar',
    href: 'https://www.linkedin.com/in/nurfajar/',
    color: '#f2a03d',
    blurb: 'Full history, recommendations, and writing.',
  },
  {
    tag: 'BOOK A CALL',
    value: 'cal.com/nurfajar/15min',
    href: 'https://cal.com/nurfajar/15min',
    color: '#6cc24a',
    blurb: 'Grab 15 minutes on my calendar for a quick chat.',
  },
  {
    tag: 'DOWNLOAD CV',
    value: 'PDF, 1 page',
    href: '/nf.pdf',
    color: '#e0557f',
    blurb: 'One-page version, ready to send to a hiring team.',
  },
];

const AREA_BLUEPRINTS: AreaBlueprint[] = [
  {
    id: 0,
    key: 'org',
    name: 'BASE CAMP',
    sectionLabel: 'ORGANIZATIONS',
    genre: 'platformer',
    color: '#6cc24a',
    iconColor: '#e05a4e',
    mapPos: [250, 470],
    icon: 'camp',
    intro: 'Before anyone paid me, people were already handing me a team and a deadline.',
    itemCount: ORG.length,
  },
  {
    id: 1,
    key: 'work',
    name: 'WORK CITY',
    sectionLabel: 'WORK EXPERIENCE',
    genre: 'platformer',
    color: '#f2a03d',
    mapPos: [300, 200],
    icon: 'tower',
    intro: 'Three places, three times I had to become someone different than I expected.',
    itemCount: WORK.length,
  },
  {
    id: 2,
    key: 'proj',
    name: 'MAZE FOREST',
    sectionLabel: 'PROJECTS',
    genre: 'maze',
    color: '#ffcb2e',
    mapPos: [610, 155],
    icon: 'forest',
    intro: 'Five things real people actually use — not just sitting in a folder.',
    itemCount: PROJECTS.length,
  },
  {
    id: 3,
    key: 'skill',
    name: 'FOUR-PIECE TEMPLE',
    sectionLabel: 'SKILLS',
    genre: 'puzzle',
    color: '#8b5fe0',
    mapPos: [790, 395],
    icon: 'temple',
    intro: 'Four pieces that only make sense assembled together.',
    itemCount: SKILLS.length,
  },
  {
    id: 4,
    key: 'hire',
    name: 'LIGHTHOUSE',
    sectionLabel: 'HIRE ME',
    genre: 'tetris',
    color: '#e0557f',
    mapPos: [520, 560],
    icon: 'light',
    intro: 'One more row to clear. That part is yours.',
    itemCount: CONTACT.length,
  },
];

export const AREAS: AreaDef[] = buildAreas(AREA_BLUEPRINTS);

export function dataForArea(key: AreaKey): StoryBeat[] | ProjectEntry[] | SkillPiece[] | ContactMethod[] {
  switch (key) {
    case 'org':
      return ORG;
    case 'work':
      return WORK;
    case 'proj':
      return PROJECTS;
    case 'skill':
      return SKILLS;
    case 'hire':
      return CONTACT;
  }
}
