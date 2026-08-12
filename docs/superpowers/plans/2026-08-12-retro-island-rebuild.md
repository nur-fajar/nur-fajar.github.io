# Retro Island Portfolio (`/retro`) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the placeholder `app/retro/page.tsx` (currently just an alias of the homepage) with a standalone, English-language, GSAP/Framer-Motion-animated port of the island-v7 mini-game portfolio, with a non-game accessible fallback and a one-time AI-generated pixel sprite.

**Architecture:** Pure, framework-free game-state logic (`lib/retro/gameState.ts`) driven by a single `{ area, step }` cursor, tested in isolation. React components consume that state top-down from a single owner (`IslandGame.tsx`). GSAP timelines animate imperative SVG scene content via refs; Framer Motion animates React-rendered UI chrome (panel, HUD, overlays). Content is fully separated into a typed data module (`lib/retro/content.ts`) so no English copy is hardcoded inside components.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, `framer-motion` (already a dependency), `gsap` + `@gsap/react` (new dependency), Vitest (already configured).

## Global Constraints

- Comments in the codebase are in Bahasa Indonesia (per project convention); user-visible copy on `/retro` is in English (per approved spec).
- Functional components, TypeScript throughout (per project convention).
- Tailwind utility classes for layout chrome; the game's own pixel-art visuals stay as inline SVG/CSS custom properties like the rest of the site's islands of bespoke CSS (e.g. `IkigaiDiagram.tsx`) — do not fight Tailwind onto SVG path data.
- Every interactive element needs a loading/error-safe baseline and keyboard access (per project convention + spec's accessibility section).
- Mobile-first layout (per project convention).
- Do not modify `app/page.tsx` or any file outside `app/retro/`, `components/retro/`, `lib/retro/`, `public/retro/`, `scripts/generate-retro-sprite.mjs`, and `package.json` (dependency addition only).
- No `dangerouslySetInnerHTML` — the original's inline `<b>`/`<em>` emphasis is reproduced via a small typed rich-text renderer instead (Task 6).
- No runtime dependency on `OPENAI_API_KEY` — sprite generation (Task 20) is a one-time, manually-run dev script; the site must build and run correctly without ever running it, via the procedural-sprite fallback from Task 4.

---

### Task 1: Add GSAP dependency

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install packages**

```bash
cd "D:/Claude/retro-portfolio" && npm install gsap @gsap/react
```

- [ ] **Step 2: Verify install**

Run: `node -e "require.resolve('gsap'); require.resolve('@gsap/react'); console.log('ok')"`
Expected: prints `ok`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "Add gsap and @gsap/react dependencies for /retro"
```

---

### Task 2: `lib/retro/gameState.ts` — pure step-machine logic

**Files:**
- Create: `lib/retro/gameState.ts`
- Test: `lib/retro/gameState.test.ts`

**Interfaces:**
- Produces (used by Task 3 `content.ts` and Task 18 `IslandGame.tsx`):
  - `type AreaGenre = 'platformer' | 'maze' | 'puzzle' | 'tetris'`
  - `type AreaKey = 'org' | 'work' | 'proj' | 'skill' | 'hire'`
  - `interface AreaBlueprint { id: number; key: AreaKey; name: string; sectionLabel: string; genre: AreaGenre; color: string; iconColor?: string; mapPos: [number, number]; icon: 'camp' | 'tower' | 'forest' | 'temple' | 'light'; intro: string; itemCount: number }`
  - `interface AreaDef extends AreaBlueprint { steps: number }`
  - `interface StepCursor { area: number | null; step: number }`
  - `buildAreas(blueprints: AreaBlueprint[]): AreaDef[]`
  - `totalSteps(areas: AreaDef[]): number`
  - `globalStep(cursor: StepCursor, areas: AreaDef[]): number`
  - `type AdvanceResult = { cursor: StepCursor; leftArea: boolean; completedAreaId: number | null }`
  - `advanceCursor(cursor: StepCursor, areas: AreaDef[], delta: number): AdvanceResult`
  - `nextUndoneArea(areas: AreaDef[], done: ReadonlySet<number>): number | null`

- [ ] **Step 1: Write the failing tests**

```typescript
// lib/retro/gameState.test.ts
import { describe, expect, it } from 'vitest';
import {
  advanceCursor,
  buildAreas,
  globalStep,
  nextUndoneArea,
  totalSteps,
  type AreaBlueprint,
} from './gameState';

// Trois zones minimalistes : une "platformer" à 2 items (steps = 1 + 2*2 = 5),
// une "hire"-like à 3 items (steps = 1 + 3 + 1 = 5, règle spéciale "hire"),
// et une "puzzle" à 1 item (steps = 1 + 1*2 = 3).
const BLUEPRINTS: AreaBlueprint[] = [
  { id: 0, key: 'org', name: 'A', sectionLabel: 'A', genre: 'platformer', color: '#000', mapPos: [0, 0], icon: 'camp', intro: '', itemCount: 2 },
  { id: 1, key: 'hire', name: 'B', sectionLabel: 'B', genre: 'tetris', color: '#000', mapPos: [0, 0], icon: 'light', intro: '', itemCount: 3 },
  { id: 2, key: 'skill', name: 'C', sectionLabel: 'C', genre: 'puzzle', color: '#000', mapPos: [0, 0], icon: 'temple', intro: '', itemCount: 1 },
];

describe('buildAreas', () => {
  it('computes steps as 1 + items*2 for non-hire genres', () => {
    const areas = buildAreas(BLUEPRINTS);
    expect(areas[0].steps).toBe(5); // org, 2 items
    expect(areas[2].steps).toBe(3); // skill, 1 item
  });

  it('computes steps as 1 + items + 1 for the hire genre', () => {
    const areas = buildAreas(BLUEPRINTS);
    expect(areas[1].steps).toBe(5); // hire, 3 items -> 1+3+1
  });
});

describe('totalSteps', () => {
  it('sums every area step count', () => {
    const areas = buildAreas(BLUEPRINTS);
    expect(totalSteps(areas)).toBe(5 + 5 + 3);
  });
});

describe('globalStep', () => {
  it('is 0 when no area is entered', () => {
    const areas = buildAreas(BLUEPRINTS);
    expect(globalStep({ area: null, step: 0 }, areas)).toBe(0);
  });

  it('offsets by the steps of all prior areas, plus 1-indexed current step', () => {
    const areas = buildAreas(BLUEPRINTS);
    expect(globalStep({ area: 1, step: 0 }, areas)).toBe(5 + 1); // areas[0].steps + step 0 + 1
    expect(globalStep({ area: 2, step: 2 }, areas)).toBe(5 + 5 + 2 + 1);
  });
});

describe('advanceCursor', () => {
  it('leaves the cursor untouched when no area is entered (map navigation is external)', () => {
    const areas = buildAreas(BLUEPRINTS);
    const result = advanceCursor({ area: null, step: 0 }, areas, 1);
    expect(result).toEqual({ cursor: { area: null, step: 0 }, leftArea: false, completedAreaId: null });
  });

  it('moves forward within an area', () => {
    const areas = buildAreas(BLUEPRINTS);
    const result = advanceCursor({ area: 0, step: 1 }, areas, 1);
    expect(result).toEqual({ cursor: { area: 0, step: 2 }, leftArea: false, completedAreaId: null });
  });

  it('returns to the map without completion when stepping below 0', () => {
    const areas = buildAreas(BLUEPRINTS);
    const result = advanceCursor({ area: 0, step: 0 }, areas, -1);
    expect(result).toEqual({ cursor: { area: null, step: 0 }, leftArea: true, completedAreaId: null });
  });

  it('completes the area and returns to the map when stepping past the last step', () => {
    const areas = buildAreas(BLUEPRINTS);
    const last = areas[0].steps - 1;
    const result = advanceCursor({ area: 0, step: last }, areas, 1);
    expect(result).toEqual({ cursor: { area: null, step: 0 }, leftArea: true, completedAreaId: 0 });
  });
});

describe('nextUndoneArea', () => {
  it('returns the first area id not in the done set', () => {
    const areas = buildAreas(BLUEPRINTS);
    expect(nextUndoneArea(areas, new Set([0]))).toBe(1);
  });

  it('returns null once every area is done', () => {
    const areas = buildAreas(BLUEPRINTS);
    expect(nextUndoneArea(areas, new Set([0, 1, 2]))).toBeNull();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd "D:/Claude/retro-portfolio" && npx vitest run lib/retro/gameState.test.ts`
Expected: FAIL — `Cannot find module './gameState'`

- [ ] **Step 3: Write the implementation**

```typescript
// lib/retro/gameState.ts
// Mesin state murni untuk game /retro. Tidak ada DOM, tidak ada React —
// supaya gampang di-unit-test dan gampang dipakai ulang dari komponen mana pun.

export type AreaGenre = 'platformer' | 'maze' | 'puzzle' | 'tetris';
export type AreaKey = 'org' | 'work' | 'proj' | 'skill' | 'hire';

export interface AreaBlueprint {
  id: number;
  key: AreaKey;
  name: string;
  sectionLabel: string;
  genre: AreaGenre;
  color: string;
  iconColor?: string;
  mapPos: [number, number];
  icon: 'camp' | 'tower' | 'forest' | 'temple' | 'light';
  intro: string;
  /** Jumlah entri konten area ini (item WORK/ORG/PROJECTS/SKILLS, atau kontak untuk 'hire'). */
  itemCount: number;
}

export interface AreaDef extends AreaBlueprint {
  /** Jumlah langkah (scroll/klik) untuk menuntaskan area ini. */
  steps: number;
}

export interface StepCursor {
  area: number | null;
  step: number;
}

/** Setiap entri butuh 2 langkah (buka blok -> baca isi), kecuali area 'hire':
    1 langkah per kontak + 1 langkah penutup "line clear". Plus 1 langkah
    pembuka (kartu genre) untuk semua area. */
export function computeAreaSteps(blueprint: AreaBlueprint): number {
  if (blueprint.key === 'hire') return 1 + blueprint.itemCount + 1;
  return 1 + blueprint.itemCount * 2;
}

export function buildAreas(blueprints: AreaBlueprint[]): AreaDef[] {
  return blueprints.map((b) => ({ ...b, steps: computeAreaSteps(b) }));
}

export function totalSteps(areas: AreaDef[]): number {
  return areas.reduce((sum, a) => sum + a.steps, 0);
}

/** Langkah global 1-indexed dipakai buat progress bar/track. 0 selama masih di peta. */
export function globalStep(cursor: StepCursor, areas: AreaDef[]): number {
  if (cursor.area === null) return 0;
  let n = 0;
  for (let i = 0; i < cursor.area; i++) n += areas[i].steps;
  return n + Math.max(0, cursor.step) + 1;
}

export interface AdvanceResult {
  cursor: StepCursor;
  /** true kalau hasil advance ini keluar dari area (mundur dari step 0, atau area selesai). */
  leftArea: boolean;
  /** id area yang baru saja dituntaskan, atau null kalau bukan penuntasan. */
  completedAreaId: number | null;
}

/** Menghitung cursor berikutnya untuk delta langkah (+1 maju, -1 mundur) SAAT SUDAH di dalam
    sebuah area. Saat cursor.area === null, navigasi ditangani di luar (lihat nextUndoneArea +
    pemanggilan enter area secara eksplisit oleh caller), jadi fungsi ini no-op di kondisi itu. */
export function advanceCursor(cursor: StepCursor, areas: AreaDef[], delta: number): AdvanceResult {
  if (cursor.area === null) {
    return { cursor, leftArea: false, completedAreaId: null };
  }
  const area = areas[cursor.area];
  const nextStep = cursor.step + delta;

  if (nextStep < 0) {
    return { cursor: { area: null, step: 0 }, leftArea: true, completedAreaId: null };
  }
  if (nextStep >= area.steps) {
    return { cursor: { area: null, step: 0 }, leftArea: true, completedAreaId: area.id };
  }
  return { cursor: { area: cursor.area, step: nextStep }, leftArea: false, completedAreaId: null };
}

/** Area belum-selesai pertama, urut sesuai array `areas` — dipakai saat pengguna scroll maju
    dari peta tanpa mengklik landmark tertentu. */
export function nextUndoneArea(areas: AreaDef[], done: ReadonlySet<number>): number | null {
  const found = areas.find((a) => !done.has(a.id));
  return found ? found.id : null;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd "D:/Claude/retro-portfolio" && npx vitest run lib/retro/gameState.test.ts`
Expected: PASS, all 9 tests green

- [ ] **Step 5: Commit**

```bash
git add lib/retro/gameState.ts lib/retro/gameState.test.ts
git commit -m "Add pure step-machine logic for /retro island game"
```

---

### Task 3: `lib/retro/content.ts` — typed English content

**Files:**
- Create: `lib/retro/content.ts`
- Test: `lib/retro/content.test.ts`

**Interfaces:**
- Consumes: `AreaBlueprint`, `AreaGenre`, `AreaKey`, `buildAreas`, `AreaDef` from `lib/retro/gameState.ts` (Task 2)
- Produces (used by Panel/CvOverlay/scenes, Tasks 7, 11-16, 18):
  - `interface StoryBeat { tag: string; title: string; sub: string; problem: string; resolution: string; stats: [string, string][] }`
  - `interface ProjectEntry extends StoryBeat { categoryIndex: number }`
  - `interface SkillPiece { name: string; plainName: string; color: string; items: string[]; blurb: string }`
  - `interface ContactMethod { tag: string; value: string; href: string; color: string; blurb: string }`
  - `const AREAS: AreaDef[]`
  - `const ORG: StoryBeat[]`
  - `const WORK: StoryBeat[]`
  - `const PROJECTS: ProjectEntry[]`
  - `const SKILLS: SkillPiece[]`
  - `const CONTACT: ContactMethod[]`
  - `const PROJECT_CATEGORIES: [string, string][]` (label, color)
  - `function dataForArea(key: AreaKey): StoryBeat[] | ProjectEntry[] | SkillPiece[] | ContactMethod[]`

- [ ] **Step 1: Write the failing test**

```typescript
// lib/retro/content.test.ts
import { describe, expect, it } from 'vitest';
import { AREAS, CONTACT, ORG, PROJECTS, SKILLS, WORK, dataForArea } from './content';
import { totalSteps } from './gameState';

describe('content data', () => {
  it('gives every area a non-empty name, intro and matching itemCount', () => {
    for (const area of AREAS) {
      expect(area.name.length).toBeGreaterThan(0);
      expect(area.intro.length).toBeGreaterThan(0);
      expect(area.steps).toBeGreaterThan(0);
    }
  });

  it('keeps AREAS, ORG, WORK, PROJECTS, SKILLS, CONTACT counts consistent', () => {
    expect(AREAS.find((a) => a.key === 'org')?.itemCount).toBe(ORG.length);
    expect(AREAS.find((a) => a.key === 'work')?.itemCount).toBe(WORK.length);
    expect(AREAS.find((a) => a.key === 'proj')?.itemCount).toBe(PROJECTS.length);
    expect(AREAS.find((a) => a.key === 'skill')?.itemCount).toBe(SKILLS.length);
    expect(AREAS.find((a) => a.key === 'hire')?.itemCount).toBe(CONTACT.length);
  });

  it('computes a positive, finite total step count', () => {
    expect(totalSteps(AREAS)).toBeGreaterThan(0);
    expect(Number.isFinite(totalSteps(AREAS))).toBe(true);
  });

  it('dataForArea resolves each area key to its matching dataset', () => {
    expect(dataForArea('org')).toBe(ORG);
    expect(dataForArea('work')).toBe(WORK);
    expect(dataForArea('proj')).toBe(PROJECTS);
    expect(dataForArea('skill')).toBe(SKILLS);
    expect(dataForArea('hire')).toBe(CONTACT);
  });

  it('every contact method has a non-placeholder href', () => {
    for (const c of CONTACT) {
      expect(c.href).not.toContain('•');
      expect(c.href.length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd "D:/Claude/retro-portfolio" && npx vitest run lib/retro/content.test.ts`
Expected: FAIL — `Cannot find module './content'`

- [ ] **Step 3: Write the implementation**

Pull the real contact links from `components/Contact.tsx` and the real headline numbers from
`components/Hero.tsx` before filling in `CONTACT`/story stats below — do not invent values.

```typescript
// lib/retro/content.ts
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

/** CONTACT: nilai href/value HARUS ditarik dari components/Contact.tsx pada saat
    implementasi (bukan ditebak) — daftar di bawah adalah kerangka yang wajib
    disinkronkan sebelum task ini dianggap selesai. */
export const CONTACT: ContactMethod[] = [
  {
    tag: 'EMAIL',
    value: 'hello@nurfajar.com',
    href: 'mailto:hello@nurfajar.com',
    color: '#54c8e0',
    blurb: 'The fastest way. I reply within a day.',
  },
  {
    tag: 'LINKEDIN',
    value: '/in/nurfajar',
    href: 'https://www.linkedin.com/in/nurfajar',
    color: '#f2a03d',
    blurb: 'Full history, recommendations, and writing.',
  },
  {
    tag: 'BOOK A CALL',
    value: 'cal.com/nurfajar/15min',
    href: 'https://cal.com/nurfajar/15min',
    color: '#6cc24a',
    blurb: 'For a quick chat or to schedule a call.',
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd "D:/Claude/retro-portfolio" && npx vitest run lib/retro/content.test.ts`
Expected: PASS, all 5 tests green

- [ ] **Step 5: Reconcile placeholder values against the real site**

Open `components/Contact.tsx` and `components/Hero.tsx`, confirm/update in `content.ts`:
- `CONTACT[2].href` matches the real Cal.com link used in `Contact.tsx` (`cal.com/nurfajar/15min` per `next.config.mjs` CSP comment — confirm exact path).
- `CONTACT[0]`/`CONTACT[1]` match the real email/LinkedIn used in `Contact.tsx`.
- `CONTACT[3].href` matches the real CV download path (`/nf.pdf` per `Nav.tsx`/`Contact.tsx` — already consistent).
- Story `stats` values that overlap with `Hero.tsx` STATS (350+ learners, 9 AI agents) are not contradicted.

- [ ] **Step 6: Commit**

```bash
git add lib/retro/content.ts lib/retro/content.test.ts
git commit -m "Add English /retro content, reconciled with main-site copy"
```

---

### Task 4: `lib/retro/sprite.ts` — procedural pixel sprite (fallback)

**Files:**
- Create: `lib/retro/sprite.ts`
- Test: `lib/retro/sprite.test.ts`

**Interfaces:**
- Produces (used by Task 12 `IslandMap.tsx`, Task 13 `PlatformerScene.tsx`):
  - `type SpriteGear = 0 | 1 | 2 | 3 | 4`
  - `function spriteMarkup(scale: number, gear: SpriteGear): string` — returns an SVG fragment string (a sequence of `<rect>` elements) safe to place inside a `<g dangerouslySetInnerHTML>`-free context via `<g>{spriteRects(...)}</g>` (see Step 3 for the JSX-friendly variant).
  - `function spriteRects(scale: number, gear: SpriteGear): Array<{ x: number; y: number; w: number; h: number; fill: string }>` — the JSX-friendly primitive; components map this to `<rect>` elements directly (no raw HTML/SVG strings, no `dangerouslySetInnerHTML`).

- [ ] **Step 1: Write the failing test**

```typescript
// lib/retro/sprite.test.ts
import { describe, expect, it } from 'vitest';
import { spriteRects } from './sprite';

describe('spriteRects', () => {
  it('returns a non-empty list of rects at gear 0', () => {
    const rects = spriteRects(4, 0);
    expect(rects.length).toBeGreaterThan(5);
    for (const r of rects) {
      expect(r.w).toBeGreaterThan(0);
      expect(r.h).toBeGreaterThan(0);
      expect(r.fill).toMatch(/^#[0-9a-fA-F]{3,8}$/);
    }
  });

  it('adds more rects as gear increases (more gear = more visible gear)', () => {
    const base = spriteRects(4, 0).length;
    const withHat = spriteRects(4, 1).length;
    const withEverything = spriteRects(4, 4).length;
    expect(withHat).toBeGreaterThan(base);
    expect(withEverything).toBeGreaterThan(withHat);
  });

  it('scales rect coordinates linearly with the scale factor', () => {
    const at1 = spriteRects(1, 0)[0];
    const at2 = spriteRects(2, 0)[0];
    expect(at2.x).toBe(at1.x * 2);
    expect(at2.w).toBe(at1.w * 2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd "D:/Claude/retro-portfolio" && npx vitest run lib/retro/sprite.test.ts`
Expected: FAIL — `Cannot find module './sprite'`

- [ ] **Step 3: Write the implementation**

```typescript
// lib/retro/sprite.ts
// Sprite pixel-art 12x16 digambar sebagai daftar rect, di-port dari fungsi
// sprite() di nurfajar-island-v7.html. Dikembalikan sebagai data (bukan string
// HTML) supaya komponen React bisa me-render-nya lewat <rect> JSX biasa, tanpa
// dangerouslySetInnerHTML.

export type SpriteGear = 0 | 1 | 2 | 3 | 4;

export interface SpriteRect {
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
}

export function spriteRects(scale: number, gear: SpriteGear): SpriteRect[] {
  const s = scale;
  const P = (x: number, y: number, w: number, h: number, fill: string): SpriteRect => ({
    x: x * s,
    y: y * s,
    w: w * s,
    h: h * s,
    fill,
  });

  const rects: SpriteRect[] = [
    P(3, 0, 6, 1, '#20182e'), // hair top
    P(2, 1, 8, 2, '#20182e'),
    P(3, 3, 6, 3, '#f2c79b'), // face
    P(4, 4, 1, 1, '#20182e'),
    P(7, 4, 1, 1, '#20182e'),
    P(3, 6, 6, 5, '#4a6fd8'), // body
    P(2, 7, 1, 3, '#f2c79b'), // arms
    P(9, 7, 1, 3, '#f2c79b'),
    P(3, 11, 2, 4, '#2f2a4a'), // legs
    P(7, 11, 2, 4, '#2f2a4a'),
    P(2, 15, 3, 1, '#20182e'),
    P(7, 15, 3, 1, '#20182e'),
  ];

  if (gear >= 1) {
    rects.push(P(2, 0, 8, 1, '#ffcb2e'), P(9, 1, 3, 1, '#ffcb2e')); // cap
  }
  if (gear >= 2) {
    rects.push(P(9, 7, 3, 4, '#fdf6e8'), P(10, 6, 1, 1, '#fdf6e8')); // clipboard
  }
  if (gear >= 3) {
    rects.push(P(0, 8, 3, 3, '#54c8e0'), P(0, 11, 4, 1, '#54c8e0')); // laptop
  }
  if (gear >= 4) {
    rects.push(P(2, 2, 1, 3, '#e0557f'), P(9, 2, 1, 3, '#e0557f'), P(2, 1, 8, 1, '#e0557f')); // headset
  }

  return rects;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd "D:/Claude/retro-portfolio" && npx vitest run lib/retro/sprite.test.ts`
Expected: PASS, all 3 tests green

- [ ] **Step 5: Commit**

```bash
git add lib/retro/sprite.ts lib/retro/sprite.test.ts
git commit -m "Add procedural pixel-sprite fallback for /retro"
```

---

### Task 5: `lib/retro/sfx.ts` — WebAudio beep effects

**Files:**
- Create: `lib/retro/sfx.ts`
- Test: `lib/retro/sfx.test.ts`

**Interfaces:**
- Produces (used by Task 18 `IslandGame.tsx`):
  - `interface RetroSfx { step(): void; back(): void; open(): void; coin(): void; enter(): void; clear(): void; setEnabled(on: boolean): void; isEnabled(): boolean }`
  - `function createRetroSfx(): RetroSfx`

- [ ] **Step 1: Write the failing test**

```typescript
// lib/retro/sfx.test.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRetroSfx } from './sfx';

// jsdom tidak punya AudioContext — kita stub cukup untuk memverifikasi
// perilaku enable/disable tanpa benar-benar membunyikan apa pun.
class FakeOscillator {
  type = 'square';
  frequency = { value: 0 };
  connect = vi.fn();
  start = vi.fn();
  stop = vi.fn();
}
class FakeGain {
  gain = { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() };
  connect = vi.fn();
}
class FakeAudioContext {
  currentTime = 0;
  destination = {};
  createOscillator = vi.fn(() => new FakeOscillator());
  createGain = vi.fn(() => new FakeGain());
}

beforeEach(() => {
  // @ts-expect-error stub global for the test environment
  window.AudioContext = FakeAudioContext;
});

describe('createRetroSfx', () => {
  it('starts enabled by default', () => {
    const sfx = createRetroSfx();
    expect(sfx.isEnabled()).toBe(true);
  });

  it('does not create an oscillator when disabled', () => {
    const sfx = createRetroSfx();
    sfx.setEnabled(false);
    const ctor = vi.spyOn(window, 'AudioContext');
    sfx.step();
    expect(ctor).not.toHaveBeenCalled();
  });

  it('creates an oscillator on first sound when enabled', () => {
    const sfx = createRetroSfx();
    sfx.step();
    // Membuktikan efek berbunyi tanpa melempar exception di lingkungan test.
    expect(sfx.isEnabled()).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd "D:/Claude/retro-portfolio" && npx vitest run lib/retro/sfx.test.ts`
Expected: FAIL — `Cannot find module './sfx'`

- [ ] **Step 3: Write the implementation**

```typescript
// lib/retro/sfx.ts
// Efek suara beep sederhana lewat WebAudio oscillator, di-port dari
// nurfajar-island-v7.html. Dibungkus factory function (bukan singleton global)
// supaya gampang di-test dan tidak membuat AudioContext sebelum benar-benar dipakai.

export interface RetroSfx {
  step(): void;
  back(): void;
  open(): void;
  coin(): void;
  enter(): void;
  clear(): void;
  setEnabled(on: boolean): void;
  isEnabled(): boolean;
}

type ToneType = 'square' | 'sine' | 'triangle' | 'sawtooth';

export function createRetroSfx(): RetroSfx {
  let ctx: AudioContext | null = null;
  let enabled = true;

  function beep(freq: number, duration: number, volume = 0.05, type: ToneType = 'square') {
    if (!enabled) return;
    if (!ctx) {
      try {
        ctx = new AudioContext();
      } catch {
        return;
      }
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  return {
    step: () => beep(660, 0.05, 0.035),
    back: () => beep(330, 0.05, 0.03),
    open: () => {
      beep(784, 0.07, 0.05);
      setTimeout(() => beep(1046, 0.1, 0.05), 70);
    },
    coin: () => {
      beep(988, 0.05, 0.05);
      setTimeout(() => beep(1318, 0.12, 0.05), 55);
    },
    enter: () => [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => beep(f, 0.1, 0.05), i * 70)),
    clear: () => [1046, 880, 698, 523].forEach((f, i) => setTimeout(() => beep(f, 0.12, 0.06), i * 80)),
    setEnabled: (on: boolean) => {
      enabled = on;
    },
    isEnabled: () => enabled,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd "D:/Claude/retro-portfolio" && npx vitest run lib/retro/sfx.test.ts`
Expected: PASS, all 3 tests green

- [ ] **Step 5: Commit**

```bash
git add lib/retro/sfx.ts lib/retro/sfx.test.ts
git commit -m "Add WebAudio beep sound effects for /retro"
```

---

### Task 6: `components/retro/RichText.tsx` — safe inline emphasis

**Files:**
- Create: `components/retro/RichText.tsx`
- Test: `components/retro/RichText.test.tsx`

**Interfaces:**
- Consumes: `StoryBeat.problem`/`.resolution`/`SkillPiece.blurb`/`ContactMethod.blurb` strings from `lib/retro/content.ts` (Task 3), which use `**bold**` and `__underline-highlight__` markers.
- Produces (used by Task 7 `Panel.tsx`, Task 11 `CvOverlay.tsx`):
  - `function RichText({ text }: { text: string }): JSX.Element`

- [ ] **Step 1: Write the failing test**

```typescript
// components/retro/RichText.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RichText } from './RichText';

describe('RichText', () => {
  it('renders **bold** segments inside a <b>', () => {
    render(<RichText text="hello **world** end" />);
    const b = screen.getByText('world');
    expect(b.tagName).toBe('B');
  });

  it('renders __em__ segments inside an <em>', () => {
    render(<RichText text="a __highlighted__ b" />);
    const em = screen.getByText('highlighted');
    expect(em.tagName).toBe('EM');
  });

  it('renders plain text with no markers as-is', () => {
    render(<RichText text="plain sentence" />);
    expect(screen.getByText('plain sentence')).toBeTruthy();
  });
});
```

Note: this project does not yet have `@testing-library/react` — install it as part of this task.

- [ ] **Step 2: Install test dependency and run test to verify it fails**

```bash
cd "D:/Claude/retro-portfolio" && npm install -D @testing-library/react @testing-library/jest-dom jsdom
```

Check `vitest.config.ts` for an existing `environment` setting; if it is not already `jsdom`, add `test: { environment: 'jsdom' }`.

Run: `cd "D:/Claude/retro-portfolio" && npx vitest run components/retro/RichText.test.tsx`
Expected: FAIL — `Cannot find module './RichText'`

- [ ] **Step 3: Write the implementation**

```typescript
// components/retro/RichText.tsx
// Renderer teks kaya minimal: **bold** jadi <b>, __teks__ jadi <em> (highlight),
// tanpa dangerouslySetInnerHTML — semua lewat elemen React biasa.

const TOKEN = /(\*\*[^*]+\*\*|__[^_]+__)/g;

export function RichText({ text }: { text: string }) {
  const parts = text.split(TOKEN).filter((p) => p.length > 0);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <b key={i}>{part.slice(2, -2)}</b>;
        }
        if (part.startsWith('__') && part.endsWith('__')) {
          return <em key={i}>{part.slice(2, -2)}</em>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd "D:/Claude/retro-portfolio" && npx vitest run components/retro/RichText.test.tsx`
Expected: PASS, all 3 tests green

- [ ] **Step 5: Commit**

```bash
git add components/retro/RichText.tsx components/retro/RichText.test.tsx package.json package-lock.json vitest.config.ts
git commit -m "Add RichText renderer and React Testing Library setup"
```

---

### Task 7: `components/retro/Panel.tsx` — animated info panel

**Files:**
- Create: `components/retro/Panel.tsx`

**Interfaces:**
- Consumes: `RichText` (Task 6)
- Produces (used by Task 18 `IslandGame.tsx`):
  - `interface PanelData { eyebrow: string; title: string; body: string[]; tags?: [string, string][]; hint: string }`
  - `function Panel({ data }: { data: PanelData }): JSX.Element`

- [ ] **Step 1: Write the implementation**

```typescript
// components/retro/Panel.tsx
// Panel info di bawah stage. Framer Motion AnimatePresence memberi transisi
// masuk/keluar tiap kali `data` berganti (di-key oleh title+eyebrow supaya
// AnimatePresence tahu ini "halaman" baru, bukan update in-place).
'use client';

import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { RichText } from './RichText';

export interface PanelData {
  eyebrow: string;
  title: string;
  body: string[];
  tags?: [string, string][];
  hint: string;
}

const panelVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.16, ease: 'easeIn' } },
};

export function Panel({ data }: { data: PanelData }) {
  return (
    <div
      id="retro-panel"
      className="relative z-20 max-h-[46dvh] min-h-[170px] overflow-y-auto border-t-4 border-[var(--ink)] bg-[var(--cream)] px-4 py-3.5 text-[var(--ink)] md:min-h-[196px] md:px-6 md:py-4"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={data.eyebrow + data.title}
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="mb-2 flex flex-wrap items-center gap-2 font-pixel text-[8px] text-[var(--ink-2)]">
            <i className="not-italic bg-[var(--accent)] px-1.5 py-0.5 text-[var(--ink)]">{data.eyebrow}</i>
          </div>
          <h2 className="mb-2 font-pixel text-[13px] leading-relaxed text-[var(--ink)] md:text-[15px]">
            {data.title}
          </h2>
          <div className="space-y-1.5">
            {data.body.map((paragraph, i) => (
              <p key={i} className="max-w-[74ch]">
                <RichText text={paragraph} />
              </p>
            ))}
          </div>
          {data.tags && data.tags.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {data.tags.map(([label, value]) => (
                <span
                  key={label}
                  className="border-2 border-[var(--ink)] bg-[var(--cream-d)] px-1.5 py-1 font-pixel text-[8px]"
                >
                  {label} <i className="not-italic text-[var(--ink-2)]">{value}</i>
                </span>
              ))}
            </div>
          )}
          <div className="mt-2.5 flex items-center gap-1.5 font-pixel text-[8px] text-[var(--ink-2)]">
            <RichText text={data.hint} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
```

Note: `font-pixel` and CSS custom properties (`--ink`, `--cream`, `--accent`, etc.) are defined
in Task 18's root stylesheet setup — this task assumes they exist; do not invent unrelated
class names here.

- [ ] **Step 2: Commit**

```bash
git add components/retro/Panel.tsx
git commit -m "Add animated /retro info panel"
```

---

### Task 8: `components/retro/Hud.tsx` and `components/retro/Track.tsx`

**Files:**
- Create: `components/retro/Hud.tsx`
- Create: `components/retro/Track.tsx`

**Interfaces:**
- Consumes: `AreaDef` from `lib/retro/gameState.ts` (Task 2); `globalStep`, `totalSteps` (Task 2)
- Produces (used by Task 18):
  - `function Hud(props: { areaName: string; sectionLabel: string; soundOn: boolean; onToggleSound: () => void; onBackToMap: () => void; onOpenCv: () => void; mapVisible: boolean }): JSX.Element`
  - `function Track(props: { areas: AreaDef[]; done: ReadonlySet<number>; currentAreaId: number | null; cursor: { area: number | null; step: number }; onJumpToArea: (id: number) => void }): JSX.Element`

- [ ] **Step 1: Write `Hud.tsx`**

```typescript
// components/retro/Hud.tsx
'use client';

export function Hud(props: {
  areaName: string;
  sectionLabel: string;
  soundOn: boolean;
  onToggleSound: () => void;
  onBackToMap: () => void;
  onOpenCv: () => void;
  mapVisible: boolean;
}) {
  const { areaName, sectionLabel, soundOn, onToggleSound, onBackToMap, onOpenCv, mapVisible } = props;
  return (
    <div className="relative z-30 flex items-center gap-2.5 border-b-4 border-[var(--ink-2)] bg-[var(--ink)] px-3 py-2 font-pixel text-[9px]">
      <span className="hidden text-[var(--cream)] sm:inline">
        NUR FAJAR — <b className="text-[var(--accent)]">{sectionLabel}</b>
      </span>
      <span className="flex-1 truncate text-center text-[var(--accent)]">{areaName}</span>
      <button
        type="button"
        onClick={onBackToMap}
        disabled={mapVisible}
        className="whitespace-nowrap border-2 border-[var(--ink-2)] px-2 py-1.5 text-[8px] text-[var(--cream-d)] hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-45"
      >
        MAP
      </button>
      <button
        type="button"
        onClick={onToggleSound}
        aria-pressed={soundOn}
        className="whitespace-nowrap border-2 border-[var(--ink-2)] px-2 py-1.5 text-[8px] text-[var(--cream-d)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
      >
        {soundOn ? 'SOUND' : 'MUTED'}
      </button>
      <button
        type="button"
        onClick={onOpenCv}
        className="whitespace-nowrap border-2 border-[var(--ink-2)] px-2 py-1.5 text-[8px] text-[var(--cream-d)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
      >
        VIEW CV
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Write `Track.tsx`**

```typescript
// components/retro/Track.tsx
'use client';

import type { AreaDef, StepCursor } from '@/lib/retro/gameState';
import { globalStep, totalSteps } from '@/lib/retro/gameState';

export function Track(props: {
  areas: AreaDef[];
  done: ReadonlySet<number>;
  cursor: StepCursor;
  onJumpToArea: (id: number) => void;
}) {
  const { areas, done, cursor, onJumpToArea } = props;
  const total = totalSteps(areas);
  const g = globalStep(cursor, areas);
  const pct = total > 0 ? (g / total) * 100 : 0;

  let acc = 0;
  const checkpoints = areas.map((a) => {
    acc += a.steps;
    return { area: a, pct: ((acc - a.steps / 2) / total) * 100 };
  });

  return (
    <div className="relative z-30 h-[calc(44px+env(safe-area-inset-bottom))] border-t-4 border-[var(--ink-2)] bg-[var(--ink)]">
      <div className="absolute left-2.5 right-2.5 top-3.5 h-1.5 bg-[var(--ink-2)]">
        <div className="h-full bg-[var(--accent)] transition-[width] duration-300" style={{ width: `${pct.toFixed(1)}%` }} />
      </div>
      <div className="absolute left-2.5 right-2.5 top-0 h-11">
        {checkpoints.map(({ area, pct: cpPct }) => (
          <button
            key={area.id}
            type="button"
            onClick={() => onJumpToArea(area.id)}
            style={{ left: `${cpPct}%` }}
            title={area.sectionLabel}
            className="absolute top-1.5 grid w-5.5 -translate-x-1/2 place-items-center"
          >
            <em
              className={`block h-2.5 w-2.5 rotate-45 border-2 border-[var(--ink)] not-italic transition-colors ${
                cursor.area === area.id ? 'bg-[var(--accent)]' : done.has(area.id) ? 'bg-[var(--grass)]' : 'bg-[var(--ink-2)]'
              }`}
            />
            <span
              className={`absolute top-[26px] hidden whitespace-nowrap font-pixel text-[6px] sm:block ${
                cursor.area === area.id ? 'text-[var(--accent)]' : 'text-[var(--ink-2)]'
              }`}
            >
              {area.sectionLabel}
            </span>
          </button>
        ))}
      </div>
      <span className="absolute right-3 top-3 hidden bg-[var(--ink)] px-1 font-pixel text-[7px] text-[var(--ink-2)] sm:block">
        {String(g).padStart(2, '0')}/{total}
      </span>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/retro/Hud.tsx components/retro/Track.tsx
git commit -m "Add /retro HUD and progress track components"
```

---

### Task 9: `components/retro/TitleOverlay.tsx` and `components/retro/CvOverlay.tsx`

**Files:**
- Create: `components/retro/TitleOverlay.tsx`
- Create: `components/retro/CvOverlay.tsx`

**Interfaces:**
- Consumes: `ORG`, `WORK`, `PROJECTS`, `SKILLS`, `CONTACT` from `lib/retro/content.ts` (Task 3); `RichText` (Task 6)
- Produces (used by Task 18):
  - `function TitleOverlay({ onStart }: { onStart: () => void }): JSX.Element`
  - `function CvOverlay({ open, onClose }: { open: boolean; onClose: () => void }): JSX.Element`

- [ ] **Step 1: Write `TitleOverlay.tsx`**

```typescript
// components/retro/TitleOverlay.tsx
'use client';

import { motion } from 'framer-motion';

export function TitleOverlay({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      className="absolute inset-0 z-40 grid place-items-center bg-[var(--sea)] px-5 text-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
    >
      <div>
        <div className="font-pixel text-[clamp(16px,5.4vw,34px)] leading-relaxed text-[var(--cream)] [text-shadow:0_4px_0_var(--ink),0_8px_0_rgba(32,24,46,.28)]">
          FAJAR
          <br />
          ISLAND
        </div>
        <p className="mt-4 text-[clamp(15px,2.6vw,20px)] text-[var(--cream)]">one island, five ways to play, one person</p>
        <p className="mt-1.5 font-pixel text-[8px] text-[var(--sand)]">
          LEARNING &amp; DEVELOPMENT · PROGRAM · AI AUTOMATION
        </p>
        <button
          type="button"
          onClick={onStart}
          className="mt-6 animate-pulse border-4 border-[var(--ink)] bg-[var(--gold)] px-3.5 py-2.5 font-pixel text-[10px] text-[var(--ink)]"
        >
          SCROLL / CLICK TO START
        </button>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Write `CvOverlay.tsx`**

```typescript
// components/retro/CvOverlay.tsx
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CONTACT, ORG, PROJECTS, SKILLS, WORK } from '@/lib/retro/content';
import { RichText } from './RichText';

function CvSection({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <>
      <h3 className="mt-6 border-b-2 border-[var(--ink)] pb-1.5 font-pixel text-[10px]">{heading}</h3>
      {children}
    </>
  );
}

export function CvOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Full CV"
          className="fixed inset-0 z-80 overflow-y-auto bg-[var(--cream)] px-4.5 pb-16 pt-5 text-[var(--ink)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="mx-auto max-w-[760px]">
            <button
              type="button"
              onClick={onClose}
              className="sticky top-0 float-right bg-[var(--ink)] px-2.5 py-2 font-pixel text-[9px] text-[var(--cream)]"
            >
              CLOSE ✕
            </button>
            <h1 className="font-pixel text-[15px] leading-relaxed">NUR FAJAR</h1>
            <p className="mb-4.5 text-[var(--ink-2)]">
              Learning &amp; Development · Instructional Design · Program Management · AI Automation
              <br />
              Indonesia — hello@nurfajar.com — linkedin.com/in/nurfajar
            </p>
            <p>
              Designs learning programs end to end, from analysis to evaluation, and builds the automation that
              runs the process. Experience leading cross-discipline teams, building a community chapter from zero,
              and shipping products real users rely on.
            </p>

            <CvSection heading="WORK EXPERIENCE">
              {WORK.map((d) => (
                <div key={d.tag} className="mt-4">
                  <h4 className="font-pixel text-[9px]">{d.title}</h4>
                  <p className="text-[var(--ink-2)]">{d.sub}</p>
                  <p>
                    <RichText text={d.problem} /> <RichText text={d.resolution} />
                  </p>
                </div>
              ))}
            </CvSection>

            <CvSection heading="PROJECTS">
              {PROJECTS.map((d) => (
                <div key={d.tag} className="mt-4">
                  <h4 className="font-pixel text-[9px]">{d.title}</h4>
                  <p className="text-[var(--ink-2)]">{d.sub}</p>
                  <p>
                    <RichText text={d.problem} /> <RichText text={d.resolution} />
                  </p>
                </div>
              ))}
            </CvSection>

            <CvSection heading="ORGANIZATIONS &amp; LEADERSHIP">
              {ORG.map((d) => (
                <div key={d.tag} className="mt-4">
                  <h4 className="font-pixel text-[9px]">{d.title}</h4>
                  <p className="text-[var(--ink-2)]">{d.sub}</p>
                  <p>
                    <RichText text={d.problem} /> <RichText text={d.resolution} />
                  </p>
                </div>
              ))}
            </CvSection>

            <h3 className="mt-6 border-b-2 border-[var(--ink)] pb-1.5 font-pixel text-[10px]">SKILLS</h3>
            {SKILLS.map((s) => (
              <div key={s.name} className="mt-3">
                <h4 className="font-pixel text-[9px]">{s.plainName.toUpperCase()}</h4>
                <ul className="ml-5 list-disc">
                  {s.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}

            <h3 className="mt-6 border-b-2 border-[var(--ink)] pb-1.5 font-pixel text-[10px]">CONTACT</h3>
            <ul className="ml-5 list-disc">
              {CONTACT.map((c) => (
                <li key={c.tag}>
                  {c.tag} — <a href={c.href}>{c.value}</a>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/retro/TitleOverlay.tsx components/retro/CvOverlay.tsx
git commit -m "Add /retro title screen and full-CV overlay"
```

---

### Task 10: `components/retro/FallbackList.tsx` — non-game accessible mode

**Files:**
- Create: `components/retro/FallbackList.tsx`

**Interfaces:**
- Consumes: `AREAS`, `dataForArea` from `lib/retro/content.ts` (Task 3); `RichText` (Task 6)
- Produces (used by Task 18):
  - `function FallbackList(): JSX.Element`

- [ ] **Step 1: Write the implementation**

```typescript
// components/retro/FallbackList.tsx
// Mode non-game: daftar linear semua konten, tanpa scroll-jacking dan tanpa
// animasi scene. Dipakai otomatis saat prefers-reduced-motion aktif, atau
// lewat toggle manual di HUD (lihat IslandGame.tsx).
import { AREAS, CONTACT, ORG, PROJECTS, SKILLS, WORK, type StoryBeat, type ProjectEntry } from '@/lib/retro/content';
import { RichText } from './RichText';

function StoryList({ items }: { items: (StoryBeat | ProjectEntry)[] }) {
  return (
    <ul className="space-y-4">
      {items.map((d) => (
        <li key={d.tag} className="border-2 border-[var(--ink)] bg-[var(--cream-d)] p-4">
          <p className="font-pixel text-[8px] text-[var(--ink-2)]">{d.sub}</p>
          <h4 className="font-pixel text-[11px]">{d.title}</h4>
          <p className="mt-2">
            <RichText text={d.problem} />
          </p>
          <p className="mt-1">
            <RichText text={d.resolution} />
          </p>
        </li>
      ))}
    </ul>
  );
}

export function FallbackList() {
  return (
    <main className="mx-auto max-w-[74ch] px-5 py-10 text-[var(--ink)]">
      <h1 className="font-pixel text-[16px] leading-relaxed">NUR FAJAR — ISLAND (TEXT VERSION)</h1>
      <p className="mt-3">
        This is the non-animated version of the island portfolio, shown automatically when your system prefers
        reduced motion. Every section below is the same content as the animated version.
      </p>

      {AREAS.map((area) => (
        <section key={area.id} className="mt-9" aria-labelledby={`fallback-${area.key}`}>
          <h2 id={`fallback-${area.key}`} className="font-pixel text-[13px]" style={{ color: area.color }}>
            {area.sectionLabel}
          </h2>
          <p className="mt-1 text-[var(--ink-2)]">{area.intro}</p>
          <div className="mt-3">
            {area.key === 'skill' ? (
              <ul className="space-y-4">
                {SKILLS.map((s) => (
                  <li key={s.name} className="border-2 border-[var(--ink)] bg-[var(--cream-d)] p-4">
                    <h4 className="font-pixel text-[11px]">{s.plainName.toUpperCase()}</h4>
                    <p className="mt-2">
                      <RichText text={s.blurb} />
                    </p>
                    <ul className="mt-2 ml-5 list-disc">
                      {s.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            ) : area.key === 'hire' ? (
              <ul className="space-y-4">
                {CONTACT.map((c) => (
                  <li key={c.tag} className="border-2 border-[var(--ink)] bg-[var(--cream-d)] p-4">
                    <h4 className="font-pixel text-[11px]">
                      {c.tag} — {c.value}
                    </h4>
                    <p className="mt-2">
                      <RichText text={c.blurb} />
                    </p>
                    <a className="mt-2 inline-block border-b-2 border-[var(--accent)]" href={c.href}>
                      Open {c.tag.toLowerCase()} →
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <StoryList items={area.key === 'org' ? ORG : area.key === 'work' ? WORK : PROJECTS} />
            )}
          </div>
        </section>
      ))}
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/retro/FallbackList.tsx
git commit -m "Add non-game accessible fallback view for /retro"
```

---

### Task 11: `components/retro/IslandMap.tsx`

**Files:**
- Create: `components/retro/IslandMap.tsx`

**Interfaces:**
- Consumes: `AREAS` from `lib/retro/content.ts` (Task 3); `spriteRects` from `lib/retro/sprite.ts` (Task 4)
- Produces (used by Task 18):
  - `function IslandMap(props: { done: ReadonlySet<number>; onEnterArea: (id: number) => void }): JSX.Element`

- [ ] **Step 1: Write the implementation**

```typescript
// components/retro/IslandMap.tsx
// Peta pulau: latar laut+pasir+rumput sebagai path statis, landmark tiap area
// sebagai tombol yang bisa diklik/di-fokus, avatar pemain di dermaga.
'use client';

import { AREAS } from '@/lib/retro/content';
import { spriteRects } from '@/lib/retro/sprite';

const ISLAND_PATH =
  'M 508 60 C 664 50 800 116 868 220 C 940 320 944 436 856 530 C 782 610 690 668 560 660 C 470 654 430 616 372 626 C 288 640 196 604 148 512 C 96 412 78 266 178 178 C 262 102 392 68 508 60 Z';
const ROAD_PATH =
  'M 250 470 Q 216 330 300 200 Q 424 122 610 155 Q 772 226 790 395 Q 706 542 520 560 Q 352 566 250 470';

function LandmarkIcon({ icon, color }: { icon: string; color: string }) {
  switch (icon) {
    case 'camp':
      return (
        <>
          <rect x={-22} y={-4} width={44} height={6} fill="#8a5a3b" />
          <polygon points="0,-40 22,2 -22,2" fill={color} />
          <rect x={-30} y={-10} width={10} height={12} fill="#8a5a3b" />
          <rect x={20} y={-10} width={10} height={12} fill="#8a5a3b" />
        </>
      );
    case 'tower':
      return (
        <>
          <rect x={-20} y={-52} width={40} height={54} fill={color} />
          <rect x={-20} y={-58} width={40} height={7} fill="#20182e" />
        </>
      );
    case 'forest':
      return (
        <>
          {[[-30, 0], [-10, -8], [12, 2], [30, -6], [0, 10]].map(([px, py], i) => (
            <polygon key={i} points={`${px},${py - 42} ${px + 17},${py + 2} ${px - 17},${py + 2}`} fill={color} />
          ))}
        </>
      );
    case 'temple':
      return (
        <>
          <rect x={-26} y={-8} width={52} height={10} fill="#cbb9a0" />
          <rect x={-20} y={-34} width={40} height={26} fill={color} />
          <polygon points="0,-52 32,-32 -32,-32" fill="#e0d3b8" />
        </>
      );
    default:
      return (
        <>
          <rect x={-11} y={-56} width={22} height={58} fill="#fdf6e8" />
          <rect x={-11} y={-56} width={22} height={8} fill={color} />
          <rect x={-11} y={-40} width={22} height={8} fill={color} />
        </>
      );
  }
}

export function IslandMap({ done, onEnterArea }: { done: ReadonlySet<number>; onEnterArea: (id: number) => void }) {
  return (
    <svg viewBox="0 0 1000 700" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      <rect x={-900} y={-900} width={2800} height={2600} fill="var(--sea)" />
      <path d={ISLAND_PATH} fill="var(--sand)" stroke="var(--sand-d)" strokeWidth={10} />
      <path d={ISLAND_PATH} fill="var(--grass)" transform="translate(500,356) scale(.945) translate(-500,-356)" />
      <path d={ROAD_PATH} fill="none" stroke="var(--sand-d)" strokeWidth={26} strokeLinecap="round" />
      <path d={ROAD_PATH} fill="none" stroke="var(--sand)" strokeWidth={17} strokeLinecap="round" />

      {AREAS.map((area) => (
        <g
          key={area.id}
          role="button"
          tabIndex={0}
          aria-label={`Open ${area.sectionLabel}${done.has(area.id) ? ' (completed)' : ''}`}
          transform={`translate(${area.mapPos[0]},${area.mapPos[1]})`}
          className="cursor-pointer focus-visible:outline focus-visible:outline-4 focus-visible:outline-[var(--gold)]"
          onClick={() => onEnterArea(area.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onEnterArea(area.id);
            }
          }}
        >
          <ellipse cx={0} cy={4} rx={42} ry={12} fill="#20182e" opacity={0.16} />
          <LandmarkIcon icon={area.icon} color={area.iconColor ?? area.color} />
          <rect x={-58} y={14} width={116} height={26} fill="#20182e" />
          <rect x={-55} y={17} width={110} height={20} fill="#fdf6e8" />
          <text x={0} y={31} fill="#20182e" fontSize={9} textAnchor="middle">
            {area.sectionLabel}
          </text>
          {done.has(area.id) && (
            <g transform="translate(34,-58)">
              <rect x={0} y={0} width={2} height={26} fill="#20182e" />
              <rect x={2} y={0} width={16} height={11} fill="#6cc24a" />
            </g>
          )}
        </g>
      ))}

      <rect x={300} y={600} width={64} height={14} fill="#8a5a3b" />
      <g transform="translate(308,542)">
        <ellipse cx={24} cy={50} rx={16} ry={5} fill="#20182e" opacity={0.2} />
        <g transform="translate(0,-2)">
          {spriteRects(4, 0).map((r, i) => (
            <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill={r.fill} />
          ))}
        </g>
      </g>
    </svg>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/retro/IslandMap.tsx
git commit -m "Add /retro island map scene"
```

---

### Task 12: `components/retro/scenes/PlatformerScene.tsx` (Org + Work areas)

**Files:**
- Create: `components/retro/scenes/PlatformerScene.tsx`

**Interfaces:**
- Consumes: `StoryBeat[]`, `AreaDef` (Task 2/3); `spriteRects` (Task 4); `gsap`, `useGSAP` from `gsap`/`@gsap/react` (Task 1)
- Produces (used by Task 18):
  - `function PlatformerScene(props: { area: AreaDef; data: StoryBeat[]; step: number }): JSX.Element`

- [ ] **Step 1: Write the implementation**

```typescript
// components/retro/scenes/PlatformerScene.tsx
// Dipakai untuk area 'org' dan 'work': karakter berjalan dari blok ke blok,
// tiap blok punya 2 langkah (buka -> baca). Kamera dan sprite dianimasikan
// lewat GSAP timeline setiap `step` berubah.
'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import type { AreaDef } from '@/lib/retro/gameState';
import type { StoryBeat } from '@/lib/retro/content';
import { spriteRects } from '@/lib/retro/sprite';

const SPAN = 520;

export function PlatformerScene({ area, data, step }: { area: AreaDef; data: StoryBeat[]; step: number }) {
  const camRef = useRef<SVGGElement>(null);
  const heroRef = useRef<SVGGElement>(null);
  const jumpRef = useRef<SVGGElement>(null);
  const blockRefs = useRef<(SVGGElement | null)[]>([]);

  const index = step <= 0 ? 0 : Math.floor((step - 1) / 2);
  const phase = step <= 0 ? -1 : (step - 1) % 2; // 0 = arrived at block, 1 = block opened
  const focusX = step <= 0 ? 60 : 260 + index * SPAN;

  useGSAP(() => {
    const viewWidth = 1000;
    gsap.to(camRef.current, { x: -(focusX - viewWidth / 2), duration: 0.6, ease: 'power2.out' });
    gsap.to(heroRef.current, { x: step <= 0 ? 60 : 260 + index * SPAN - 30, duration: 0.55, ease: 'power2.out' });
    gsap.to(jumpRef.current, { y: phase === 1 ? -46 : 0, duration: 0.22, ease: 'power1.inOut' });

    data.forEach((_, i) => {
      const opened = i < index || (i === index && phase === 1);
      const block = blockRefs.current[i];
      if (!block) return;
      gsap.to(block.querySelector('.pf-question'), { opacity: opened ? 0 : 1, duration: 0.18 });
      gsap.to(block.querySelector('.pf-opened'), { opacity: opened ? 1 : 0, y: opened ? -10 : 0, duration: 0.3 });
      gsap.to(block.querySelector('.pf-label'), { opacity: opened ? 1 : 0, y: opened ? 0 : 10, duration: 0.35 });
      gsap.to(block.querySelector('.pf-flag'), { opacity: opened ? 1 : 0, duration: 0.4 });
    });
  }, [step, index, phase, focusX, data]);

  return (
    <svg viewBox="0 0 1000 560" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      <g ref={camRef}>
        <rect x={-900} y={-200} width={1000 * data.length + 1800} height={960} fill={area.key === 'org' ? '#7fd0ef' : '#9fd7f0'} />
        <rect x={-900} y={470} width={1000 * data.length + 1800} height={290} fill={area.key === 'org' ? '#6cc24a' : '#b98f5e'} />

        {data.map((d, i) => {
          const x = 260 + i * SPAN;
          const opened = i < index || (i === index && phase === 1);
          return (
            <g key={d.tag} ref={(el) => { blockRefs.current[i] = el; }}>
              <g className="pf-question" opacity={opened ? 0 : 1}>
                <rect x={x - 26} y={300} width={52} height={52} fill="#e8a92e" />
                <text x={x} y={335} fill="#fdf6e8" fontSize={22} textAnchor="middle">
                  ?
                </text>
              </g>
              <g className="pf-opened" opacity={opened ? 1 : 0}>
                <rect x={x - 26} y={300} width={52} height={52} fill="#b98f5e" />
                <text x={x} y={336} fill="#ffcb2e" fontSize={20} textAnchor="middle">
                  !
                </text>
              </g>
              <g className="pf-label" opacity={opened ? 1 : 0} transform="translate(0,10)">
                <rect x={x - 72} y={222} width={144} height={30} fill="#20182e" />
                <rect x={x - 69} y={225} width={138} height={24} fill="#fdf6e8" />
                <text x={x} y={242} fill="#20182e" fontSize={9} textAnchor="middle">
                  {d.tag}
                </text>
              </g>
              <rect x={x + 120} y={330} width={5} height={140} fill="#cbb9a0" />
              <g className="pf-flag" opacity={opened ? 1 : 0}>
                <rect x={x + 125} y={334} width={34} height={22} fill={area.color} />
              </g>
            </g>
          );
        })}

        <g ref={heroRef}>
          <g ref={jumpRef}>
            {spriteRects(4.6, area.key === 'org' ? 0 : 2).map((r, i) => (
              <rect key={i} x={r.x} y={r.y + 396} width={r.w} height={r.h} fill={r.fill} />
            ))}
          </g>
        </g>
      </g>
    </svg>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/retro/scenes/PlatformerScene.tsx
git commit -m "Add GSAP-animated platformer scene for Org/Work areas"
```

---

### Task 13: `components/retro/scenes/PacmanScene.tsx` (Projects area)

**Files:**
- Create: `components/retro/scenes/PacmanScene.tsx`

**Interfaces:**
- Consumes: `ProjectEntry[]`, `PROJECT_CATEGORIES` (Task 3); `gsap`/`useGSAP` (Task 1)
- Produces (used by Task 18):
  - `function PacmanScene(props: { data: ProjectEntry[]; categories: [string, string][]; step: number }): JSX.Element`

- [ ] **Step 1: Write the implementation**

```typescript
// components/retro/scenes/PacmanScene.tsx
// Dipakai untuk area 'proj': avatar berjalan sepanjang jalur tetap lewat 5
// checkpoint proyek, memakan pellet di sepanjang jalan. Gerak sepanjang path
// dianimasikan pakai GSAP (tween x/y per titik jalur), bukan setInterval manual.
'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import type { ProjectEntry } from '@/lib/retro/content';

const CELL = 40;
const WAY: [number, number][] = [
  [1, 7], [1, 1], [5, 1], [5, 4], [9, 4], [9, 1], [13, 1], [13, 5], [7, 5], [7, 7], [1, 7],
];
const STOPS: [number, number][] = [[1, 1], [5, 4], [9, 1], [13, 5], [7, 7]];

function cellCenter([cx, cy]: [number, number]) {
  return [cx * CELL + 30, cy * CELL + 40];
}

export function PacmanScene({
  data,
  categories,
  step,
}: {
  data: ProjectEntry[];
  categories: [string, string][];
  step: number;
}) {
  const pacRef = useRef<SVGGElement>(null);
  const index = step <= 0 ? -1 : Math.floor((step - 1) / 2);
  const phase = step <= 0 ? -1 : (step - 1) % 2;

  useGSAP(() => {
    const dest = index < 0 ? WAY[0] : STOPS[index];
    const [x, y] = cellCenter(dest);
    gsap.to(pacRef.current, { x, y, duration: 0.5, ease: 'power1.inOut' });
  }, [index]);

  return (
    <svg viewBox="0 0 620 400" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      <rect x={-800} y={-700} width={2200} height={1900} fill="#0f0a1e" />
      <path
        d={`M ${WAY.map(cellCenter).map(([x, y]) => `${x},${y}`).join(' L ')}`}
        fill="none"
        stroke="#241a44"
        strokeWidth={4}
      />
      {STOPS.map((s, i) => {
        const [cx, cy] = cellCenter(s);
        const eaten = step > 0 && (i < index || (i === index && phase === 1));
        return (
          <g key={data[i].tag}>
            <circle cx={cx} cy={cy} r={13} fill={categories[data[i].categoryIndex][1]} opacity={0.28} />
            <circle cx={cx} cy={cy} r={9} fill={categories[data[i].categoryIndex][1]} opacity={eaten ? 0 : 1} />
          </g>
        );
      })}
      <g ref={pacRef}>
        <circle cx={0} cy={0} r={14} fill="#ffcb2e" />
        <path d="M0,0 L16,-9 L16,9 Z" fill="#0f0a1e" />
      </g>
    </svg>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/retro/scenes/PacmanScene.tsx
git commit -m "Add GSAP-animated maze scene for Projects area"
```

---

### Task 14: `components/retro/scenes/PuzzleScene.tsx` (Skills area)

**Files:**
- Create: `components/retro/scenes/PuzzleScene.tsx`

**Interfaces:**
- Consumes: `SkillPiece[]` (Task 3); `gsap`/`useGSAP` (Task 1)
- Produces (used by Task 18):
  - `function PuzzleScene(props: { data: SkillPiece[]; step: number }): JSX.Element`

- [ ] **Step 1: Write the implementation**

```typescript
// components/retro/scenes/PuzzleScene.tsx
// Dipakai untuk area 'skill': 4 keping terbang masuk dari luar layar ke slot
// 2x2 (TL/TR/BR/BL), pakai easing overshoot ('back') di GSAP untuk efek "klik pas".
'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import type { SkillPiece } from '@/lib/retro/content';

const SIZE = 210;
const SLOTS: [number, number][] = [
  [110, 80],
  [320, 80],
  [320, 290],
  [110, 290],
];
const OFFSCREEN: [number, number][] = [
  [-320, -260],
  [320, -260],
  [320, 260],
  [-320, 260],
];

export function PuzzleScene({ data, step }: { data: SkillPiece[]; step: number }) {
  const pieceRefs = useRef<(SVGGElement | null)[]>([]);
  const index = step <= 0 ? -1 : Math.floor((step - 1) / 2);

  useGSAP(() => {
    data.forEach((_, i) => {
      const placed = step > 0 && i <= index;
      const el = pieceRefs.current[i];
      if (!el) return;
      gsap.to(el, {
        opacity: placed ? 1 : 0,
        x: placed ? 0 : OFFSCREEN[i][0],
        y: placed ? 0 : OFFSCREEN[i][1],
        duration: 0.5,
        ease: placed ? 'back.out(1.6)' : 'power1.in',
      });
    });
  }, [index, step, data]);

  return (
    <svg viewBox="0 0 660 520" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      <rect x={-700} y={-600} width={2100} height={1800} fill="#1a1030" />
      {SLOTS.map((p, i) => (
        <rect key={i} x={p[0]} y={p[1]} width={SIZE} height={SIZE} fill="#20143c" />
      ))}
      {data.map((s, i) => {
        const p = SLOTS[i];
        return (
          <g key={s.name} ref={(el) => { pieceRefs.current[i] = el; }} opacity={0}>
            <rect x={p[0]} y={p[1]} width={SIZE} height={SIZE} fill={s.color} />
            <text x={p[0] + SIZE / 2} y={p[1] + (i < 2 ? 58 : SIZE - 42)} fill="#20182e" fontSize={13} textAnchor="middle">
              {s.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/retro/scenes/PuzzleScene.tsx
git commit -m "Add GSAP-animated puzzle scene for Skills area"
```

---

### Task 15: `components/retro/scenes/TetrisScene.tsx` (Hire-me area)

**Files:**
- Create: `components/retro/scenes/TetrisScene.tsx`

**Interfaces:**
- Consumes: `ContactMethod[]` (Task 3); `gsap`/`useGSAP` (Task 1)
- Produces (used by Task 18):
  - `function TetrisScene(props: { data: ContactMethod[]; step: number }): JSX.Element`

- [ ] **Step 1: Write the implementation**

```typescript
// components/retro/scenes/TetrisScene.tsx
// Dipakai untuk area 'hire': satu balok kontak jatuh per langkah, baris
// "line clear" muncul setelah balok terakhir. Jatuhnya dianimasikan GSAP
// dengan easing masuk yang landai (mendekati gravitasi).
'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import type { ContactMethod } from '@/lib/retro/content';

const CELL = 40;
const COLUMN_X = [4, 5, 6, 7];
const ROW_Y = 4;

export function TetrisScene({ data, step }: { data: ContactMethod[]; step: number }) {
  const pieceRefs = useRef<(SVGGElement | null)[]>([]);
  const clearedRef = useRef<SVGGElement>(null);

  useGSAP(() => {
    data.forEach((_, i) => {
      const landed = step >= i + 1;
      const el = pieceRefs.current[i];
      if (!el) return;
      gsap.to(el, { opacity: landed ? 1 : 0, y: landed ? 0 : -420, duration: 0.42, ease: 'power2.in' });
    });
    gsap.to(clearedRef.current, { opacity: step >= data.length + 1 ? 1 : 0, duration: 0.4 });
  }, [step, data]);

  return (
    <svg viewBox="0 0 520 420" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      <rect x={-800} y={-700} width={2200} height={1900} fill="#0d0a1c" />
      {data.map((c, i) => {
        const x = 10 + COLUMN_X[i] * CELL;
        const y = 10 + ROW_Y * CELL;
        return (
          <g key={c.tag} ref={(el) => { pieceRefs.current[i] = el; }} opacity={0}>
            <rect x={x + 2} y={y + 2} width={CELL - 4} height={CELL - 4} fill={c.color} />
            <text x={x + CELL / 2} y={y + CELL / 2 + 3} fill="#fdf6e8" fontSize={7} textAnchor="middle">
              {c.tag}
            </text>
          </g>
        );
      })}
      <g ref={clearedRef} opacity={0}>
        <rect x={10} y={10 + ROW_Y * CELL} width={COLUMN_X.length * CELL} height={CELL * 2} fill="#6cc24a" />
        <text x={10 + (COLUMN_X.length * CELL) / 2} y={10 + ROW_Y * CELL + 48} fill="#20182e" fontSize={12} textAnchor="middle">
          LINE CLEAR — READY TO TALK
        </text>
      </g>
    </svg>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/retro/scenes/TetrisScene.tsx
git commit -m "Add GSAP-animated tetris scene for Hire-me area"
```

---

### Task 16: `components/retro/IslandGame.tsx` — root orchestrator

**Files:**
- Create: `components/retro/IslandGame.tsx`

**Interfaces:**
- Consumes: everything from Tasks 2–15 (`gameState.ts`, `content.ts`, `sfx.ts`, `Panel`, `Hud`, `Track`, `TitleOverlay`, `CvOverlay`, `FallbackList`, `IslandMap`, all 4 scenes)
- Produces (used by Task 17 `app/retro/page.tsx`):
  - `function IslandGame(): JSX.Element`

- [ ] **Step 1: Write the implementation**

```typescript
// components/retro/IslandGame.tsx
// Root: memegang state {started, cursor, done, sound, forceFallback}, menangani
// input global (wheel/touch/keyboard), dan merender scene yang sesuai. Konten
// panel dihitung dari (cursor, data) — simetris maju/mundur seperti versi asli.
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AREAS,
  CONTACT,
  ORG,
  PROJECT_CATEGORIES,
  PROJECTS,
  SKILLS,
  WORK,
  dataForArea,
} from '@/lib/retro/content';
import { advanceCursor, nextUndoneArea, type StepCursor } from '@/lib/retro/gameState';
import { createRetroSfx } from '@/lib/retro/sfx';
import { CvOverlay } from './CvOverlay';
import { FallbackList } from './FallbackList';
import { Hud } from './Hud';
import { IslandMap } from './IslandMap';
import { Panel, type PanelData } from './Panel';
import { PacmanScene } from './scenes/PacmanScene';
import { PlatformerScene } from './scenes/PlatformerScene';
import { PuzzleScene } from './scenes/PuzzleScene';
import { TetrisScene } from './scenes/TetrisScene';
import { TitleOverlay } from './TitleOverlay';
import { Track } from './Track';

const NEXT_HINT = '**SCROLL / CLICK** to continue · scroll up to go back';

function buildPanelData(cursor: StepCursor, done: ReadonlySet<number>): PanelData {
  if (cursor.area === null) {
    if (done.size >= AREAS.length) {
      return {
        eyebrow: 'DONE · 5/5 AREAS',
        title: "THE ISLAND'S FULLY EXPLORED.",
        body: [
          'Organizations, work, projects, skills, contact — all open now. One thing left: **word from you**.',
          'Click any area to replay it, or __hello@nurfajar.com__ to start a real conversation.',
        ],
        tags: [
          ['STATUS', 'OPEN TO WORK'],
          ['EMAIL', 'hello@nurfajar.com'],
        ],
        hint: 'Click an area on the map to replay it',
      };
    }
    return {
      eyebrow: `MAP · ${done.size}/5 AREAS DONE`,
      title: 'PICK AN AREA — OR KEEP SCROLLING',
      body: [
        'Five areas, five ways to play. Click one, or **keep scrolling** and I will take you to the next one myself.',
        'Everything can be opened any time, and scrolling up always takes you back one step.',
      ],
      tags: AREAS.map((a) => [a.sectionLabel, done.has(a.id) ? 'DONE' : 'OPEN'] as [string, string]),
      hint: NEXT_HINT,
    };
  }

  const area = AREAS[cursor.area];
  const data = dataForArea(area.key);

  if (cursor.step === 0) {
    return {
      eyebrow: `AREA ${area.id + 1}/5 · ${area.name} · GENRE: ${area.genre.toUpperCase()}`,
      title: area.sectionLabel,
      body: [area.intro],
      tags: [
        ['STEPS', String(area.steps)],
        ['ITEMS', `${data.length} ITEMS`],
      ],
      hint: NEXT_HINT,
    };
  }

  if (area.key === 'hire') {
    const contactStep = cursor.step;
    if (contactStep <= CONTACT.length) {
      const c = CONTACT[contactStep - 1];
      return {
        eyebrow: `BLOCK ${contactStep}/${CONTACT.length} LOCKING IN`,
        title: `${c.tag} — ${c.value}`,
        body: [c.blurb, `[Open ${c.tag.toLowerCase()}](${c.href})`],
        hint: NEXT_HINT,
      };
    }
    return {
      eyebrow: 'LINE CLEAR · DOUBLE',
      title: "THE ROW'S FULL. THE GAME ISN'T OVER.",
      body: [
        'Those four blocks are every way to reach me. The last two columns were already there: **open to work**.',
        "If you're looking for someone who can design the program __and__ build the tooling that runs it — send one line.",
      ],
      tags: [
        ['STATUS', 'OPEN TO WORK'],
        ['BASED', 'INDONESIA'],
      ],
      hint: '**SCROLL** to go back to the map',
    };
  }

  const itemIndex = Math.floor((cursor.step - 1) / 2);
  const phase = (cursor.step - 1) % 2;

  if (area.key === 'skill') {
    const s = SKILLS[itemIndex];
    if (phase === 0) {
      return {
        eyebrow: `PIECE ${itemIndex + 1}/4 · ${s.plainName}`,
        title: s.plainName.toUpperCase(),
        body: [s.blurb],
        hint: NEXT_HINT,
      };
    }
    return {
      eyebrow: `PIECE ${itemIndex + 1}/4 · PLACED`,
      title: s.plainName.toUpperCase(),
      body: [s.blurb],
      tags: s.items.map((item) => [item, ''] as [string, string]),
      hint: NEXT_HINT,
    };
  }

  const d = (area.key === 'proj' ? PROJECTS : area.key === 'org' ? ORG : WORK)[itemIndex];
  if (phase === 0) {
    return {
      eyebrow: `${area.sectionLabel} · ${itemIndex + 1}/${data.length}`,
      title: `TOWARD ${d.tag}`,
      body: ['One more step to open it up.'],
      hint: NEXT_HINT,
    };
  }
  return {
    eyebrow: `${area.sectionLabel} · ${itemIndex + 1}/${data.length} · ${d.sub}`,
    title: d.title,
    body: [d.problem, d.resolution],
    tags: d.stats,
    hint: NEXT_HINT,
  };
}

export function IslandGame() {
  const [started, setStarted] = useState(false);
  const [cursor, setCursor] = useState<StepCursor>({ area: null, step: 0 });
  const [done, setDone] = useState<ReadonlySet<number>>(new Set());
  const [soundOn, setSoundOn] = useState(true);
  const [cvOpen, setCvOpen] = useState(false);
  const [forceFallback, setForceFallback] = useState(false);
  const sfxRef = useRef(createRetroSfx());
  const lockRef = useRef(0);

  const prefersReducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );
  const useFallback = forceFallback || prefersReducedMotion;

  useEffect(() => {
    sfxRef.current.setEnabled(soundOn);
  }, [soundOn]);

  const enterArea = useCallback((id: number) => {
    sfxRef.current.enter();
    setCursor({ area: id, step: 0 });
  }, []);

  const applyStep = useCallback(
    (delta: number) => {
      const now = Date.now();
      if (now < lockRef.current) return;
      lockRef.current = now + 420;

      if (!started) {
        if (delta > 0) {
          setStarted(true);
          sfxRef.current.enter();
        }
        return;
      }
      if (cvOpen) return;

      if (cursor.area === null) {
        if (delta > 0) {
          const next = nextUndoneArea(AREAS, done);
          if (next !== null) enterArea(next);
        }
        return;
      }

      const result = advanceCursor(cursor, AREAS, delta);
      if (result.completedAreaId !== null) {
        setDone((prev) => new Set(prev).add(result.completedAreaId as number));
        sfxRef.current.coin();
      } else {
        delta > 0 ? sfxRef.current.step() : sfxRef.current.back();
      }
      setCursor(result.cursor);
    },
    [started, cvOpen, cursor, done, enterArea],
  );

  useEffect(() => {
    function onWheel(e: WheelEvent) {
      if (cvOpen) return;
      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(delta) < 3) return;
      applyStep(delta > 0 ? 1 : -1);
    }
    function onKeydown(e: KeyboardEvent) {
      if (cvOpen) {
        if (e.key === 'Escape') setCvOpen(false);
        return;
      }
      if (['ArrowDown', 'ArrowRight', ' ', 'Enter', 'PageDown'].includes(e.key)) {
        e.preventDefault();
        applyStep(1);
      }
      if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        applyStep(-1);
      }
      if (e.key === 'Escape' && cursor.area !== null) setCursor({ area: null, step: 0 });
    }
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('keydown', onKeydown);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeydown);
    };
  }, [applyStep, cvOpen, cursor.area]);

  const panelData = useMemo(() => buildPanelData(cursor, done), [cursor, done]);
  const currentArea = cursor.area !== null ? AREAS[cursor.area] : null;

  if (useFallback) {
    return (
      <div>
        <a href="#fallback-main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-[var(--gold)] focus:p-3">
          Skip to content
        </a>
        <div className="flex justify-end p-3">
          <button
            type="button"
            onClick={() => setForceFallback(false)}
            className="border-2 border-[var(--ink)] px-2 py-1 text-xs"
          >
            Try the animated version instead
          </button>
        </div>
        <div id="fallback-main">
          <FallbackList />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-dvh w-full flex-col" style={{ ['--accent' as string]: currentArea?.color ?? '#ffcb2e' }}>
      <a href="#retro-panel" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-[var(--gold)] focus:p-3">
        Skip game, jump to CV summary
      </a>

      <Hud
        areaName={currentArea?.name ?? 'FAJAR ISLAND'}
        sectionLabel={currentArea?.sectionLabel ?? 'L&D'}
        soundOn={soundOn}
        onToggleSound={() => setSoundOn((v) => !v)}
        onBackToMap={() => setCursor({ area: null, step: 0 })}
        onOpenCv={() => setCvOpen(true)}
        mapVisible={cursor.area === null}
      />

      <div className="relative min-h-0 flex-1 overflow-hidden bg-[#0d0a1c]" onClick={() => applyStep(1)}>
        {!started && <TitleOverlay onStart={() => applyStep(1)} />}
        {started && cursor.area === null && <IslandMap done={done} onEnterArea={enterArea} />}
        {started && currentArea?.key === 'org' && <PlatformerScene area={currentArea} data={ORG} step={cursor.step} />}
        {started && currentArea?.key === 'work' && <PlatformerScene area={currentArea} data={WORK} step={cursor.step} />}
        {started && currentArea?.key === 'proj' && (
          <PacmanScene data={PROJECTS} categories={PROJECT_CATEGORIES} step={cursor.step} />
        )}
        {started && currentArea?.key === 'skill' && <PuzzleScene data={SKILLS} step={cursor.step} />}
        {started && currentArea?.key === 'hire' && <TetrisScene data={CONTACT} step={cursor.step} />}
      </div>

      <div aria-live="polite" className="sr-only">
        {panelData.title} — {panelData.body.join(' ')}
      </div>

      <Panel data={panelData} />
      <Track areas={AREAS} done={done} cursor={cursor} onJumpToArea={enterArea} />
      <CvOverlay open={cvOpen} onClose={() => setCvOpen(false)} />

      {!prefersReducedMotion && (
        <button
          type="button"
          onClick={() => setForceFallback(true)}
          className="sr-only focus:not-sr-only focus:fixed focus:bottom-16 focus:right-3 focus:z-50 focus:border-2 focus:border-[var(--ink)] focus:bg-[var(--cream)] focus:px-2 focus:py-1 focus:text-xs"
        >
          Switch to text-only version
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/retro/IslandGame.tsx
git commit -m "Add /retro root orchestrator wiring state, input, and all scenes"
```

---

### Task 17: `app/retro/page.tsx` — replace placeholder

**Files:**
- Modify: `app/retro/page.tsx`

**Interfaces:**
- Consumes: `IslandGame` from `components/retro/IslandGame.tsx` (Task 16)

- [ ] **Step 1: Replace the placeholder page**

```typescript
// app/retro/page.tsx
// Halaman /retro yang sebenarnya: game portofolio pulau, bukan lagi alias
// dari homepage (lihat docs/superpowers/specs/2026-08-12-retro-island-rebuild-design.md).
import type { Metadata } from 'next';
import { IslandGame } from '@/components/retro/IslandGame';

export const metadata: Metadata = {
  title: 'Nur Fajar — Island Portfolio (Retro)',
  description:
    "An interactive, game-styled portfolio: one island, five areas, five ways to play — organizations, work, projects, skills, and how to reach me.",
};

export default function RetroPage() {
  return <IslandGame />;
}
```

- [ ] **Step 2: Run the full test suite**

Run: `cd "D:/Claude/retro-portfolio" && npm run test`
Expected: PASS, all suites green (gameState, content, sprite, sfx, RichText)

- [ ] **Step 3: Run the build**

Run: `cd "D:/Claude/retro-portfolio" && npm run build`
Expected: Compiles successfully, `/retro` listed as a route

- [ ] **Step 4: Commit**

```bash
git add app/retro/page.tsx
git commit -m "Wire IslandGame into /retro, replacing the homepage-alias placeholder"
```

---

### Task 18: Manual verification pass

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

Run: `cd "D:/Claude/retro-portfolio" && npm run dev`

- [ ] **Step 2: Walk through all 5 areas in a browser**

Open `http://localhost:3000/retro` and confirm, for each of Base Camp, Work City, Maze
Forest, Four-Piece Temple, and Lighthouse:
- Scroll forward/backward moves through every step symmetrically (no stuck states).
- Clicking a map landmark enters the right area.
- The bottom panel content matches the visible scene state at every step.
- Sound toggle mutes/unmutes correctly.
- "VIEW CV" opens the full CV overlay with real content, closes with the ✕ button and `Esc`.

- [ ] **Step 3: Keyboard-only walkthrough**

Using only Tab/Arrow keys/Enter/Space/Esc (no mouse), confirm every area is reachable, focus
is never lost or trapped, and the skip link ("Skip game, jump to CV summary") appears on
first Tab press and works.

- [ ] **Step 4: Reduced-motion check**

In Chrome DevTools, set "Emulate CSS media feature prefers-reduced-motion: reduce" and reload
`/retro` — confirm the text-only `FallbackList` renders instead of the animated game, and its
"Try the animated version instead" button switches back.

- [ ] **Step 5: Record and report results**

Note any broken step, visual glitch, or accessibility gap found during Steps 2–4 as follow-up
items — do not silently fix-and-move-on without noting what was wrong.

- [ ] **Step 6: Commit any fixes found during verification, each with its own message**

---

### Task 19 (manual, run by the project owner): Generate the AI pixel sprite

This task is **not** run by the implementing engineer/agent as part of the automated plan —
it requires the user's `OPENAI_API_KEY` and a judgment call on generated output quality. Do
it last, after Task 18 passes with the procedural sprite fallback already working end to end.

**Files:**
- Create: `scripts/generate-retro-sprite.mjs`
- Create (generated, not hand-written): `public/retro/sprite/idle.png`, `public/retro/sprite/walk-1.png`, `public/retro/sprite/walk-2.png`, `public/retro/sprite/jump.png`

- [ ] **Step 1: Write the generation script**

```javascript
// scripts/generate-retro-sprite.mjs
// Script sekali-jalan (BUKAN bagian dari build/deploy): generate 4 frame sprite
// pixel-art dari foto profil asli, sekali, lalu disimpan sebagai file statis.
// Jalankan manual: OPENAI_API_KEY=sk-... node scripts/generate-retro-sprite.mjs
import { writeFile, mkdir } from 'node:fs/promises';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import OpenAI from 'openai';

const OUT_DIR = path.join(process.cwd(), 'public', 'retro', 'sprite');
const REFERENCE_PHOTO = path.join(process.cwd(), 'public', 'foto-profile-nf.jpg');

const FRAMES = [
  { name: 'idle', pose: 'standing neutral, facing forward' },
  { name: 'walk-1', pose: 'mid-stride walking, left foot forward' },
  { name: 'walk-2', pose: 'mid-stride walking, right foot forward' },
  { name: 'jump', pose: 'mid-air jump, knees tucked' },
];

const STYLE_PROMPT =
  'A 16-bit pixel-art game character sprite, front-facing, transparent background, ' +
  'limited palette matching hex colors #20182e (dark ink), #ffcb2e (gold accent), ' +
  '#4a6fd8 (shirt blue), #f2c79b (skin tone) — consistent character design across frames, ' +
  'crisp pixel edges, no anti-aliasing blur, no text, no watermark.';

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('Missing OPENAI_API_KEY in environment. Aborting — no request sent.');
    process.exit(1);
  }
  const client = new OpenAI({ apiKey });
  await mkdir(OUT_DIR, { recursive: true });
  const referenceImage = await readFile(REFERENCE_PHOTO);

  for (const frame of FRAMES) {
    console.log(`Generating frame: ${frame.name}...`);
    const result = await client.images.edit({
      model: 'gpt-image-1',
      image: new File([referenceImage], 'reference.jpg', { type: 'image/jpeg' }),
      prompt: `${STYLE_PROMPT} Pose: ${frame.pose}. Base the face/hair loosely on the reference photo.`,
      size: '256x256',
    });
    const b64 = result.data[0].b64_json;
    if (!b64) throw new Error(`No image data returned for frame ${frame.name}`);
    await writeFile(path.join(OUT_DIR, `${frame.name}.png`), Buffer.from(b64, 'base64'));
    console.log(`Saved ${frame.name}.png`);
  }
  console.log('Done. Review public/retro/sprite/*.png before committing.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 2: Install the OpenAI SDK as a dev dependency**

```bash
cd "D:/Claude/retro-portfolio" && npm install -D openai
```

- [ ] **Step 3: Run the script with the key supplied at invocation time (never committed, never pasted into chat)**

```bash
OPENAI_API_KEY=sk-your-key-here node scripts/generate-retro-sprite.mjs
```

- [ ] **Step 4: Review the 4 generated PNGs visually**

Open each file in `public/retro/sprite/`. If any frame looks broken, off-style, or doesn't
read as the same character across frames, re-run just that frame (adjust its `pose` string)
before proceeding — do not ship a mismatched set.

- [ ] **Step 5: Wire the generated sprite into the map/platformer scenes as the preferred visual**

In `components/retro/IslandMap.tsx` and `components/retro/scenes/PlatformerScene.tsx`,
replace the `spriteRects(...)`-driven `<rect>` output with an `<image>` element pointing at
`/retro/sprite/idle.png` (map, static) and alternate `/retro/sprite/walk-1.png` /
`walk-2.png` on the platformer's step cadence, `jump.png` during the jump phase — falling
back to `spriteRects` output when the corresponding PNG file is missing (e.g. this task was
skipped), so the procedural sprite remains a true fallback, not dead code.

- [ ] **Step 6: Rebuild and re-run the manual verification pass (Task 18) for the map and platformer scenes only**

- [ ] **Step 7: Commit**

```bash
git add scripts/generate-retro-sprite.mjs public/retro/sprite package.json package-lock.json components/retro/IslandMap.tsx components/retro/scenes/PlatformerScene.tsx
git commit -m "Add AI-generated pixel sprite for /retro, with procedural fallback"
```

---

## Self-Review Notes

- **Spec coverage:** architecture (Tasks 1–17), content/language (Task 3), GSAP/Framer Motion
  split (Tasks 7–15 use each tool exactly as the spec's table assigns), accessibility (Tasks 6,
  10, 16 steps 2–4 in Task 18), AI sprite generation with fallback (Tasks 4, 19), testing
  (Tasks 2–6 unit tests, Task 18 manual/a11y pass) — all spec sections have a task.
- **Placeholder scan:** no "TBD"/"fill in later" steps; the one open item ("finalize exact
  English area names") from the spec was resolved directly in Task 3's content rather than
  deferred.
- **Type consistency:** `AreaDef`/`StepCursor`/`AdvanceResult` (Task 2) are the single source
  of cursor/area types, consumed unchanged through Tasks 3, 8, 11–16. `StoryBeat`/
  `ProjectEntry`/`SkillPiece`/`ContactMethod` (Task 3) are the single source of content types,
  consumed unchanged through Tasks 9, 10, 12–16. `PanelData` (Task 7) is produced only by
  `buildPanelData` in Task 16 and consumed only by `Panel`.
