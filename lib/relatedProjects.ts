import { PROGRAMS } from '@/content/programs';
import { WORK_EXPERIENCE, ORGANIZATION_EXPERIENCE } from '@/content/signals';
import { AGENT_STEPS } from '@/content/pipeline';
import { EDUCATION } from '@/content/education';

/* ── Skill → related project lookup, for the Skills popup ────────────────
   Every skill tag in the skill grid is clickable; this decides what the
   popup shows.

   Three tags map 1:1 onto a full "detail" view instead of a link out —
   Curriculum development, Instructional design, and AI agents used to be
   their own page sections/route (Programs, the design case study, and
   /lab). Those sections no longer exist on the site at all; their content
   now lives only inside these popups (see components/skill-details/ and
   SkillPopup.tsx, which renders the matching detail component directly).

   Everything else is matched by searching the *real* text already on this
   site (programs, work/org signals, the lab pipeline's agent steps,
   education) for entries that mention every significant word in the tag.
   A match against a program/case-study/pipeline entry also opens one of
   the three detail views (there's nowhere else for it to point); a match
   against work/org signals or education links to the section itself,
   since those are still on the page. If nothing genuinely mentions a tag,
   the popup says so rather than inventing a connection. */

export type DetailKind = 'curriculum' | 'design' | 'lab';

export interface RelatedProject {
  title: string;
  blurb: string;
  href?: string;
  detail?: DetailKind;
}

const DETAIL_OVERRIDES: Record<string, DetailKind> = {
  'curriculum development': 'curriculum',
  'instructional design': 'design',
  'ai agents': 'lab',
};

interface IndexEntry {
  title: string;
  blurb: string;
  href?: string;
  detail?: DetailKind;
  text: string;
}

function buildIndex(): IndexEntry[] {
  const fromPrograms: IndexEntry[] = PROGRAMS.map((p) => ({
    title: p.title,
    detail: 'curriculum',
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
    detail: 'lab',
    blurb: a.body[0],
    text: [a.id, a.title, ...a.body, a.io.in, a.io.out, a.io.model, a.claim ?? '', a.note ?? ''].join(' '),
  }));

  // These two aren't pulled from a shared content file — the copy lives
  // directly in the curriculum/design detail data — but it's the exact
  // text already shown there, so it's fair game for the search index too.
  const fromProgramsCopy: IndexEntry[] = [
    {
      title: 'Programs — design frameworks',
      detail: 'curriculum',
      blurb:
        "Design frameworks applied across the set: backward design and Bloom's taxonomy in all four · design thinking in both chatbot courses · JTBD and MoSCoW in the PM track · problem-based learning in Foundations.",
      text: "backward design and Bloom's taxonomy design thinking Jobs-to-be-Done JTBD MoSCoW prioritization problem-based learning",
    },
  ];

  const fromDesignCopy: IndexEntry[] = [
    {
      title: 'Instructional Design / Case Study — Learning Objectives',
      detail: 'design',
      blurb:
        'Objectives Bloom-tagged and backward designed from the published artifact — Understand, Apply, and Evaluate framed around what the learner actually ships.',
      text: 'Bloom-tagged backward designed learning objectives Understand Apply Evaluate Create',
    },
    {
      title: 'Instructional Design / Case Study — Assessment',
      detail: 'design',
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

/** A tag that maps 1:1 onto one of the three full detail views, rather than
    a searched list of related projects. SkillPopup renders the detail
    component directly for these, skipping the related-list UI entirely. */
export function getDetailKindForTag(tag: string): DetailKind | null {
  return DETAIL_OVERRIDES[normalize(tag)] ?? null;
}

export function getRelatedProjects(tag: string): RelatedProject[] {
  const words = normalize(tag)
    .split(' ')
    .filter((w) => w.length > 2);
  if (!words.length) return [];

  const seen = new Set<string>();
  const out: RelatedProject[] = [];
  for (const entry of INDEX) {
    const hay = normalize(entry.text);
    if (!words.every((w) => hasWord(hay, w))) continue;
    if (seen.has(entry.title)) continue;
    seen.add(entry.title);
    out.push({ title: entry.title, blurb: entry.blurb, href: entry.href, detail: entry.detail });
    if (out.length >= 3) break;
  }
  return out;
}
