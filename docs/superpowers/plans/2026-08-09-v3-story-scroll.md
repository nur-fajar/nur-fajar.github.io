# /v3 Story-Scroll Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a standalone `/v3` route that presents the existing portfolio content as five full-screen, GSAP-pinned sections with a scroll-driven rotate transition between them.

**Architecture:** A pure helper (`lib/storyScroll.ts`) decides which sections pin/rotate given a count; a client component (`components/StoryScroll.tsx`) wires that decision to GSAP `ScrollTrigger` over `[data-story-section]` DOM nodes; `app/v3/page.tsx` assembles five `StorySection`s with content curated from the existing `content/*.ts` data files, `Hero.tsx`, and `Contact.tsx`.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind 4 (project convention: custom CSS classes in `app/globals.css`, not inline Tailwind utility classes — see Global Constraints), GSAP + `@gsap/react` + `ScrollTrigger` (new deps), Vitest.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-09-v3-story-scroll-design.md` — read it before starting if anything below is ambiguous.
- Zero changes to `app/page.tsx`, `components/Nav.tsx`, `components/Hero.tsx`, `components/Contact.tsx`, or any other existing page/component. All new code lives in new files.
- No `/components/ui` folder — new components go directly in `/components`, matching this repo's existing flat convention (see `components/Hero.tsx`, `components/Contact.tsx`, etc.).
- Follow this repo's styling convention: **custom CSS classes defined in `app/globals.css`**, referencing the existing theme tokens (`--bg`, `--panel`, `--panel-2`, `--line`, `--text-primary`, `--text-secondary`, `--text-dim`, `--accent`, `--accent-2`, `--teal`, `--yellow`, `--red`, `--font-display`, `--font-jbmono`). Do **not** write Tailwind utility classes directly in JSX — no component in this repo does that, even though Tailwind is installed.
- Motion gate is `prefers-reduced-motion` only — no separate mobile/breakpoint branch (per spec Non-goals).
- Animation runs identically at all viewport sizes.
- New npm dependencies: `gsap`, `@gsap/react` (added via `npm install`, not hand-edited into `package.json`).
- Git commit messages in this repo are plain, imperative, no footer boilerplate — follow the style of `git log --oneline` in this repo (e.g. "Add design spec for /v3 GSAP story-scroll landing page").

---

### Task 1: Pure section-role helper

**Files:**
- Create: `lib/storyScroll.ts`
- Test: `lib/storyScroll.test.ts`

**Interfaces:**
- Produces: `StorySectionRole { index: number; pin: boolean; rotate: boolean }` and `storySectionRoles(count: number): StorySectionRole[]` — consumed by Task 2's `components/StoryScroll.tsx`.

- [ ] **Step 1: Write the failing test**

Create `lib/storyScroll.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { storySectionRoles } from './storyScroll';

describe('storySectionRoles', () => {
  it('returns an empty array for zero sections', () => {
    expect(storySectionRoles(0)).toEqual([]);
  });

  it('marks the only section as neither pinned nor rotated when there is just one', () => {
    expect(storySectionRoles(1)).toEqual([{ index: 0, pin: false, rotate: false }]);
  });

  it('pins every section except the last, and rotates every section except the first', () => {
    expect(storySectionRoles(3)).toEqual([
      { index: 0, pin: true, rotate: false },
      { index: 1, pin: true, rotate: true },
      { index: 2, pin: false, rotate: true },
    ]);
  });

  it('scales to five sections the same way', () => {
    const roles = storySectionRoles(5);
    expect(roles.map((r) => r.pin)).toEqual([true, true, true, true, false]);
    expect(roles.map((r) => r.rotate)).toEqual([false, true, true, true, true]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/storyScroll.test.ts`
Expected: FAIL — `lib/storyScroll.ts` does not exist (module not found).

- [ ] **Step 3: Write minimal implementation**

Create `lib/storyScroll.ts`:

```ts
// Pure decision logic behind the /v3 story-scroll pin+rotate mechanic (see
// components/StoryScroll.tsx). Kept framework-free so which sections pin
// and which rotate can be unit-tested without touching GSAP or the DOM.
//
// Every section except the last stays pinned while the next section
// scrolls over it; every section except the first rotates in from 30deg
// as it arrives — ported from the FlowArt reference component's inline
// `i > 0` / `i < sections.length - 1` checks.
export interface StorySectionRole {
  index: number;
  pin: boolean;
  rotate: boolean;
}

export function storySectionRoles(count: number): StorySectionRole[] {
  return Array.from({ length: count }, (_, index) => ({
    index,
    pin: index < count - 1,
    rotate: index > 0,
  }));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/storyScroll.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add lib/storyScroll.ts lib/storyScroll.test.ts
git commit -m "Add storySectionRoles helper for /v3 pin+rotate wiring"
```

---

### Task 2: StoryScroll / StorySection component + CSS + stub page

**Files:**
- Modify: `package.json`, `package-lock.json` (via `npm install`, not hand-edited)
- Create: `components/StoryScroll.tsx`
- Modify: `app/globals.css` (append new block at end of file)
- Create: `app/v3/page.tsx` (stub — replaced with real content in Task 3)

**Interfaces:**
- Consumes: `storySectionRoles` from `lib/storyScroll.ts` (Task 1).
- Produces: `StoryScroll` (default export, client component) and `StorySection` (named export) from `components/StoryScroll.tsx` — consumed by Task 3's `app/v3/page.tsx`. `StorySection` props: `{ className?: string; style?: React.CSSProperties; children: React.ReactNode; 'aria-label'?: string }`. `StoryScroll` props: `{ children: React.ReactNode; className?: string; 'aria-label'?: string }`.
- Produces CSS classes consumed by Task 3: `.story-panel-a` through `.story-panel-e` (background+accent per section), `.story-eyebrow`, `.story-rule`, `.story-heading`, `.story-body`, `.story-grid`, `.story-grid-item`, `.story-stats`, `.story-links`.

- [ ] **Step 1: Install dependencies**

```bash
npm install gsap @gsap/react
```

Expected: `package.json` `dependencies` gains `"gsap": "^3.15.0"` and `"@gsap/react": "^2.1.2"` (or whatever current versions `npm install` resolves), `package-lock.json` updates accordingly.

- [ ] **Step 2: Create the component**

Create `components/StoryScroll.tsx`:

```tsx
'use client';

// Adapted from a FlowArt/FlowSection reference component (GSAP
// pin+rotate scroll story). Renamed to match this repo's PascalCase
// component convention and restyled to use the site's own CSS custom
// properties (see the "/v3 story-scroll" block in app/globals.css)
// instead of the reference's inline hex background colors — that's what
// makes /v3 follow the Dayside/Nightside toggle automatically.
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { storySectionRoles } from '@/lib/storyScroll';

gsap.registerPlugin(ScrollTrigger);

export interface StorySectionProps {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  'aria-label'?: string;
}

export function StorySection({ className, style, children, 'aria-label': ariaLabel }: StorySectionProps) {
  return (
    <section data-story-section aria-label={ariaLabel} className={['story-section', className].filter(Boolean).join(' ')}>
      <div data-story-inner className="story-inner" style={style}>
        {children}
      </div>
    </section>
  );
}

export interface StoryScrollProps {
  children: React.ReactNode;
  className?: string;
  'aria-label'?: string;
}

export default function StoryScroll({ children, className, 'aria-label': ariaLabel = 'Story scroll' }: StoryScrollProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const sectionCount = React.Children.count(children);

  useGSAP(
    () => {
      if (!containerRef.current || reducedMotion) return;

      const sections = Array.from(containerRef.current.querySelectorAll<HTMLElement>('[data-story-section]'));
      if (sections.length === 0) return;

      const roles = storySectionRoles(sections.length);
      const triggers: ScrollTrigger[] = [];

      roles.forEach((role) => {
        const section = sections[role.index];
        gsap.set(section, { zIndex: role.index + 1 });

        const inner = section.querySelector<HTMLElement>('.story-inner');
        if (!inner) return;

        if (role.rotate) {
          gsap.set(inner, { rotation: 30, transformOrigin: 'bottom left' });
          const tween = gsap.to(inner, {
            rotation: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'top 25%',
              scrub: true,
            },
          });
          if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
        }

        if (role.pin) {
          triggers.push(
            ScrollTrigger.create({
              trigger: section,
              start: 'bottom bottom',
              end: 'bottom top',
              pin: true,
              pinSpacing: false,
            }),
          );
        }
      });

      ScrollTrigger.refresh();

      return () => {
        triggers.forEach((t) => t.kill());
      };
    },
    { scope: containerRef, dependencies: [sectionCount, reducedMotion] },
  );

  return (
    <main ref={containerRef} aria-label={ariaLabel} className={['story-scroll', className].filter(Boolean).join(' ')}>
      {children}
    </main>
  );
}
```

- [ ] **Step 3: Append CSS for the story-scroll sections**

Append to the end of `app/globals.css`:

```css

/* ── /v3 story-scroll (experimental, not linked from Nav) ──────────────
   Five full-height panels, alternating --bg/--panel-2 with a cycling
   accent (accent → teal → yellow → accent-2 → red — the same named
   tokens the rest of the site already uses), so the sequence follows
   the Dayside/Nightside toggle instead of carrying its own palette. */
.story-scroll {
  position: relative;
  width: 100%;
}
.story-section {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
}
.story-inner {
  position: relative;
  display: flex;
  min-height: 100vh;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
  gap: 24px;
  padding: clamp(32px, 6vw, 64px) clamp(20px, 6vw, 64px);
  will-change: transform;
}
.story-panel-a .story-inner {
  background: var(--bg);
  color: var(--text-primary);
}
.story-panel-a .story-eyebrow,
.story-panel-a .story-heading {
  color: var(--accent);
}
.story-panel-b .story-inner {
  background: var(--panel-2);
  color: var(--text-primary);
}
.story-panel-b .story-eyebrow,
.story-panel-b .story-heading {
  color: var(--teal);
}
.story-panel-c .story-inner {
  background: var(--bg);
  color: var(--text-primary);
}
.story-panel-c .story-eyebrow,
.story-panel-c .story-heading {
  color: var(--yellow);
}
.story-panel-d .story-inner {
  background: var(--panel-2);
  color: var(--text-primary);
}
.story-panel-d .story-eyebrow,
.story-panel-d .story-heading {
  color: var(--accent-2);
}
.story-panel-e .story-inner {
  background: var(--bg);
  color: var(--text-primary);
}
.story-panel-e .story-eyebrow,
.story-panel-e .story-heading {
  color: var(--red);
}
.story-eyebrow {
  font-family: var(--font-jbmono), monospace;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.story-rule {
  border: none;
  border-top: 1px solid var(--line);
  margin: clamp(16px, 3vw, 32px) 0;
}
.story-heading {
  font-family: var(--font-display), sans-serif;
  font-weight: 700;
  line-height: 0.9;
  text-transform: uppercase;
  font-size: clamp(2.75rem, 10vw, 9rem);
  letter-spacing: -0.01em;
}
.story-body {
  max-width: 60ch;
  font-size: clamp(1rem, 2vw, 1.4rem);
  line-height: 1.5;
  color: var(--text-secondary);
}
.story-grid {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(16px, 3vw, 32px);
}
.story-grid-item {
  flex: 1 1 200px;
  min-width: 180px;
}
.story-grid-item h3 {
  font-family: var(--font-jbmono), monospace;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 8px;
  color: var(--text-dim);
}
.story-grid-item p {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
}
.story-stats {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(16px, 3vw, 28px);
}
.story-stats div {
  min-width: 120px;
}
.story-stats strong {
  display: block;
  font-family: var(--font-display), sans-serif;
  font-size: clamp(1.5rem, 3vw, 2.25rem);
}
.story-stats span {
  font-family: var(--font-jbmono), monospace;
  font-size: 11px;
  color: var(--text-dim);
}
.story-links {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  font-family: var(--font-jbmono), monospace;
}
```

- [ ] **Step 4: Create a stub `/v3` page to sanity-check the mechanic**

Create `app/v3/page.tsx`:

```tsx
import StoryScroll, { StorySection } from '@/components/StoryScroll';

// Stub content — replaced with the real 5-section content mapping in the
// next task. This exists so the pin+rotate mechanic can be checked in a
// browser before real copy is wired in.
export default function V3StubPage() {
  return (
    <StoryScroll aria-label="Story scroll stub">
      <StorySection aria-label="One" className="story-panel-a">
        <p className="story-eyebrow">01 — One</p>
        <h1 className="story-heading">Section One</h1>
      </StorySection>
      <StorySection aria-label="Two" className="story-panel-b">
        <p className="story-eyebrow">02 — Two</p>
        <h1 className="story-heading">Section Two</h1>
      </StorySection>
    </StoryScroll>
  );
}
```

- [ ] **Step 5: Verify it compiles and lints**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 6: Manual browser check**

Run: `npm run dev`, open `http://localhost:3000/v3`.
Expected: two full-height sections; scrolling down pins "Section One" while "Section Two" rotates in from an angle to flat as it arrives. No console errors.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json components/StoryScroll.tsx app/globals.css app/v3/page.tsx
git commit -m "Add StoryScroll/StorySection component and /v3 stub page"
```

---

### Task 3: Real /v3 content (5 sections from existing portfolio data)

**Files:**
- Modify: `app/v3/page.tsx` (replace stub content from Task 2)

**Interfaces:**
- Consumes: `StoryScroll`, `StorySection` from `components/StoryScroll.tsx` (Task 2); `WORK_EXPERIENCE` from `content/signals.ts`; `SKILL_GROUPS` from `content/skills.ts`; `REFERENCES` from `content/references.ts`.

- [ ] **Step 1: Replace the stub page with the full 5-section content**

Replace the entire contents of `app/v3/page.tsx`:

```tsx
import StoryScroll, { StorySection } from '@/components/StoryScroll';
import { WORK_EXPERIENCE } from '@/content/signals';
import { SKILL_GROUPS } from '@/content/skills';
import { REFERENCES } from '@/content/references';

// Same four stat values as components/Hero.tsx's STATS — duplicated
// (rather than imported) because Hero.tsx isn't exporting it and this
// page isn't allowed to modify Hero.tsx (see plan Global Constraints).
// Keep these in sync with Hero.tsx by hand if the numbers ever change.
const INTRO_STATS = [
  ['350+', 'Learners trained'],
  ['9.0/10', 'Satisfaction'],
  ['9', 'AI agents deployed'],
  ['3.94', 'GPA · best graduate'],
] as const;

// Top two roles from WORK_EXPERIENCE (content/signals.ts), trimmed to
// their two highest-signal bullets each — this section is meant to be
// skimmed at a glance, not read in full (see spec's content mapping).
const SIGNAL_HIGHLIGHTS = WORK_EXPERIENCE.slice(0, 2).map((role) => ({
  ...role,
  bullets: role.bullets.slice(0, 2),
}));

// All four skill groups (content/skills.ts), each trimmed to its four
// most representative items.
const SKILL_HIGHLIGHTS = SKILL_GROUPS.map((group) => ({
  ...group,
  items: group.items.slice(0, 4),
}));

// Three references (content/references.ts) chosen for differing vantage
// points (manager / mentee / colleague), same selection rationale as the
// full REFERENCES list, with each quote trimmed to its strongest single
// sentence for a full-screen panel.
const REFERENCE_HIGHLIGHTS = [
  { ref: REFERENCES[0], excerpt: 'He mentored more than 100 students and consistently earned outstanding satisfaction scores — 9.8 out of 10.' },
  { ref: REFERENCES[2], excerpt: 'His technical depth came paired with real leadership and mentoring ability — he had a way of making complex ideas accessible no matter where you were starting from.' },
  { ref: REFERENCES[4], excerpt: 'His communication was excellent — always clear and efficient. His management stood out too: organized, proactive, and positive.' },
] as const;

// Same contact constants as components/Contact.tsx — duplicated for the
// same reason as INTRO_STATS above (Contact.tsx can't be modified here).
const CONTACT_EMAIL = 'hi.nurfajar@gmail.com';
const CONTACT_LINKS = [
  ['mailto:' + CONTACT_EMAIL, CONTACT_EMAIL],
  ['https://www.linkedin.com/in/nurfajar/', 'linkedin/nurfajar'],
  ['https://github.com/nur-fajar', 'github/nur-fajar'],
] as const;

export default function V3Page() {
  return (
    <StoryScroll aria-label="Nur Fajar — story scroll">
      <StorySection aria-label="Intro" className="story-panel-a">
        <p className="story-eyebrow">01 — Intro</p>
        <hr className="story-rule" />
        <h1 className="story-heading">
          Full-Stack
          <br />
          Learning &amp;
          <br />
          Development.
        </h1>
        <hr className="story-rule" />
        <p className="story-body">End-to-end — curriculum, marketing, delivery, evaluation. All in one person.</p>
        <div className="story-stats">
          {INTRO_STATS.map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </StorySection>

      <StorySection aria-label="Signals / Work experience" className="story-panel-b">
        <p className="story-eyebrow">02 — Signals / Work</p>
        <hr className="story-rule" />
        <h2 className="story-heading">
          Built.
          <br />
          Shipped.
          <br />
          Measured.
        </h2>
        <hr className="story-rule" />
        <div className="story-grid">
          {SIGNAL_HIGHLIGHTS.map((role) => (
            <div className="story-grid-item" key={role.id}>
              <h3>
                {role.name} — {role.sub}
              </h3>
              <p>{role.bullets.join(' ')}</p>
            </div>
          ))}
        </div>
      </StorySection>

      <StorySection aria-label="Skills" className="story-panel-c">
        <p className="story-eyebrow">03 — Skills</p>
        <hr className="story-rule" />
        <h2 className="story-heading">
          Range,
          <br />
          Not
          <br />
          Guesswork.
        </h2>
        <hr className="story-rule" />
        <div className="story-grid">
          {SKILL_HIGHLIGHTS.map((group) => (
            <div className="story-grid-item" key={group.id}>
              <h3>{group.label}</h3>
              <p>{group.items.join(' · ')}</p>
            </div>
          ))}
        </div>
      </StorySection>

      <StorySection aria-label="References" className="story-panel-d">
        <p className="story-eyebrow">04 — References</p>
        <hr className="story-rule" />
        <h2 className="story-heading">
          Ask
          <br />
          Who
          <br />
          Worked
          <br />
          With Me.
        </h2>
        <hr className="story-rule" />
        <div className="story-grid">
          {REFERENCE_HIGHLIGHTS.map(({ ref, excerpt }) => (
            <div className="story-grid-item" key={ref.tag}>
              <h3>
                {ref.name} — {ref.role}
              </h3>
              <p>&ldquo;{excerpt}&rdquo;</p>
            </div>
          ))}
        </div>
      </StorySection>

      <StorySection aria-label="Contact" className="story-panel-e">
        <p className="story-eyebrow">05 — Contact</p>
        <hr className="story-rule" />
        <h2 className="story-heading">
          Open
          <br />
          Channel.
        </h2>
        <hr className="story-rule" />
        <p className="story-body">Available for AI L&amp;D programs, GenAI curriculum work, and automation projects.</p>
        <div className="story-links">
          {CONTACT_LINKS.map(([href, label]) => (
            <a key={href} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener">
              {label}
            </a>
          ))}
        </div>
      </StorySection>
    </StoryScroll>
  );
}
```

- [ ] **Step 2: Verify types and lint**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Run the full test suite**

Run: `npx vitest run`
Expected: all existing tests plus `lib/storyScroll.test.ts` pass; no regressions.

- [ ] **Step 4: Full production build**

Run: `npm run build`
Expected: build succeeds, `/v3` listed among the generated routes.

- [ ] **Step 5: Manual browser verification**

Run: `npm run dev`, open `http://localhost:3000/v3`.

Check:
- All 5 sections render with real content (Intro stats, two work roles, four skill groups, three references, contact links).
- Scrolling through pins each section (except Contact) while the next rotates in from an angle.
- No console errors.
- Open `http://localhost:3000` first, toggle dark/light via the existing `ThemeToggle`, then navigate to `/v3` (or reload it) — confirm the five panels' backgrounds/accents follow the toggle (light vs. dark token values from `app/globals.css`).

- [ ] **Step 6: Commit**

```bash
git add app/v3/page.tsx
git commit -m "Wire real portfolio content into /v3 (intro, signals, skills, references, contact)"
```
