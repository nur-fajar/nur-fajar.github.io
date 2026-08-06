import { PROGRAMS } from '@/content/programs';
import { WORK_EXPERIENCE, ORGANIZATION_EXPERIENCE } from '@/content/signals';
import { AGENT_STEPS } from '@/content/pipeline';
import { EDUCATION } from '@/content/education';

/* ── Skill → related project lookup, for the Skills popup ────────────────
   Every skill tag in the skill grid is clickable; this is what decides what
   the popup shows.

   Two tiers:
   1. OVERRIDES — a handful of tags that map 1:1 onto a specific section of
      this site (Curriculum development → Programs, Instructional design →
      the design case study, AI agents → the /lab pipeline teardown). Hand
      written so the popup copy reads like the section it points to, not a
      keyword-matched snippet.
   2. Everything else — matched by searching the *real* text already on this
      site (Programs, work/org signals, the lab pipeline's agent steps,
      education) for entries that mention every significant word in the tag.
      If nothing genuinely mentions it, the popup says so rather than
      inventing a connection. */

export interface RelatedProject {
  title: string;
  blurb: string;
  href: string;
  external?: boolean;
}

const OVERRIDES: Record<string, RelatedProject[]> = {
  'curriculum development': [
    {
      title: 'Programs / Curriculum Designed',
      blurb:
        'Four published LMS courses, 20 hours of contact time, on ai4impact — every course backward designed from a published artifact, so the learner leaves with something running, not notes.',
      href: '#programs',
    },
  ],
  'instructional design': [
    {
      title: 'Instructional Design / Case Study',
      blurb:
        '"Chatbots for Business" taken apart end to end: design context, learner profile, Bloom-tagged objectives, full session architecture, and assessment — the design reasoning made visible, not just asserted.',
      href: '#design',
    },
  ],
  'ai agents': [
    {
      title: 'Lab / Pipeline Teardown',
      blurb:
        'Nine agents behind a live B2B outreach pipeline, taken apart agent by agent — model routing across GPT-4o-mini/GPT-4o, and the one irreversible step (email dispatch) kept behind a human review gate.',
      href: '/lab',
      external: true,
    },
  ],
};

interface IndexEntry {
  title: string;
  blurb: string;
  href: string;
  external?: boolean;
  text: string;
}

function buildIndex(): IndexEntry[] {
  const fromPrograms: IndexEntry[] = PROGRAMS.map((p) => ({
    title: p.title,
    href: p.href,
    external: true,
    blurb: p.summary,
    text: [p.title, p.summary, p.audience, p.prerequisites, p.outcome, ...p.units.map((u) => `${u.title} ${u.detail}`)].join(
      ' '
    ),
  }));

  const fromWork: IndexEntry[] = WORK_EXPERIENCE.map((s) => ({
    title: s.name,
    href: '#signals',
    blurb: s.bullets[0],
    text: [s.name, s.sub, ...s.bullets].join(' '),
  }));

  const fromOrg: IndexEntry[] = ORGANIZATION_EXPERIENCE.map((s) => ({
    title: s.name,
    href: '#organization',
    blurb: s.bullets[0],
    text: [s.name, s.sub, s.category ?? '', ...s.bullets].join(' '),
  }));

  const fromLab: IndexEntry[] = AGENT_STEPS.map((a) => ({
    title: `Lab Pipeline — ${a.title}`,
    href: '/lab',
    external: true,
    blurb: a.body[0],
    text: [a.id, a.title, ...a.body, a.io.in, a.io.out, a.io.model, a.claim ?? '', a.note ?? ''].join(' '),
  }));

  // These two aren't pulled from a shared content file — the copy lives
  // directly in Programs.tsx / DesignCaseStudy.tsx's JSX — but it's the
  // exact text already rendered on the page, so it's fair game for the
  // search index too.
  const fromProgramsCopy: IndexEntry[] = [
    {
      title: 'Programs — design frameworks',
      href: '#programs',
      blurb:
        "Design frameworks applied across the set: backward design and Bloom's taxonomy in all four · design thinking in both chatbot courses · JTBD and MoSCoW in the PM track · problem-based learning in Foundations.",
      text: "backward design and Bloom's taxonomy design thinking Jobs-to-be-Done JTBD MoSCoW prioritization problem-based learning",
    },
  ];

  const fromDesignCopy: IndexEntry[] = [
    {
      title: 'Instructional Design / Case Study — Learning Objectives',
      href: '#design',
      blurb:
        'Objectives Bloom-tagged and backward designed from the published artifact — Understand, Apply, and Evaluate framed around what the learner actually ships.',
      text: 'Bloom-tagged backward designed learning objectives Understand Apply Evaluate Create',
    },
    {
      title: 'Instructional Design / Case Study — Assessment',
      href: '#design',
      blurb:
        'Two instruments, both testing whether the learner can do the thing rather than recall it: formative behaviour-verification quizzes during each lesson, and a summative published artifact plus design rationale at the end.',
      text: 'assessment design formative summative quizzes design rationale',
    },
  ];

  const fromEducation: IndexEntry[] = [
    {
      title: EDUCATION.school.name,
      href: '#education',
      blurb: EDUCATION.school.body,
      text: [EDUCATION.school.name, EDUCATION.school.sub, EDUCATION.school.body].join(' '),
    },
    {
      title: EDUCATION.certifications.name,
      href: '#education',
      blurb: EDUCATION.certifications.body.split('\n')[0],
      text: [EDUCATION.certifications.name, EDUCATION.certifications.body].join(' '),
    },
  ];

  return [...fromPrograms, ...fromWork, ...fromOrg, ...fromLab, ...fromProgramsCopy, ...fromDesignCopy, ...fromEducation];
}

const INDEX = buildIndex();

function normalize(s: string) {
  return s
    .toLowerCase()
    .replace(/\(.*?\)/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Loose singular/plural match — "pipelines" should still find "pipeline".
function stem(word: string) {
  return word.length > 3 && word.endsWith('s') ? word.slice(0, -1) : word;
}

// A handful of abbreviations the site's own copy uses in place of the full
// word — e.g. the thesis line says "ensemble ML", not "ensemble learning".
const SYNONYMS: Record<string, string[]> = {
  learning: ['ml'],
};

function hasWord(haystack: string, word: string) {
  if (haystack.includes(word) || haystack.includes(stem(word))) return true;
  return (SYNONYMS[word] ?? []).some((syn) => haystack.includes(syn));
}

export function getRelatedProjects(tag: string): RelatedProject[] {
  const key = normalize(tag);
  if (OVERRIDES[key]) return OVERRIDES[key];

  const words = key.split(' ').filter((w) => w.length > 2);
  if (!words.length) return [];

  const seen = new Set<string>();
  const out: RelatedProject[] = [];
  for (const entry of INDEX) {
    const hay = normalize(entry.text);
    if (!words.every((w) => hasWord(hay, w))) continue;
    if (seen.has(entry.title)) continue;
    seen.add(entry.title);
    out.push({ title: entry.title, blurb: entry.blurb, href: entry.href, external: entry.external });
    if (out.length >= 3) break;
  }
  return out;
}
