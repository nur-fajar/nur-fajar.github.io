# /v3 — GSAP Story-Scroll Landing Page

Status: Approved
Date: 2026-08-09

## Summary

Add a new, standalone route `/v3` that presents the portfolio's existing
content (intro, work experience, skills, references, contact) as five
full-screen, pinned sections that transition via a GSAP scroll-driven
rotate effect — adapted from a supplied `FlowArt`/`FlowSection` reference
component. This does not replace or link from the current homepage; it is
a self-contained page for review at `/v3`.

## Goals

- Reuse existing portfolio content (no new copywriting) via lightweight
  section-specific summaries pulled from `content/*.ts`.
- Reuse the existing Spacecraft HUD theme tokens (`app/globals.css`) so
  `/v3` automatically follows the site's dark/light (Nightside/Dayside)
  toggle — no separate color system.
- Match the pin + rotate-reveal scroll mechanic from the reference
  component as closely as practical with GSAP + ScrollTrigger.
- Keep it isolated: new dependencies, new component, new route — zero
  changes to the current homepage, Nav, or other pages.

## Non-goals

- Not replacing `app/page.tsx` or linking `/v3` from the site `Nav`.
- Not building a `/components/ui` shadcn-style primitives folder — this
  project's convention is flat `/components`, and `/v3` follows it.
- Not building a separate mobile-simplified (non-pinned) experience —
  the only motion gate is the existing `prefers-reduced-motion` check.
- Not migrating any other page to this scroll pattern.

## Architecture

```
app/
  v3/
    page.tsx            → assembles <StoryScroll> with 5 <StorySection>s,
                           pulling summarized copy from content/*.ts
components/
  StoryScroll.tsx        → adapted FlowArt (renamed to match this repo's
                           PascalCase component convention); exports
                           StoryScroll (default) and StorySection
```

- `StoryScroll` owns the GSAP/ScrollTrigger wiring: registers the plugin,
  measures `[data-story-section]` children, pins each section on scroll
  except the last, and animates a 30°→0° rotation on the *next* section
  as it scrolls into place — same mechanic as the reference `FlowArt`.
- `StorySection` is the presentational wrapper (`min-h-screen`, flex
  column, padding) — equivalent to the reference `FlowSection`, renamed
  and restyled to use this repo's design tokens instead of inline hex
  background colors.
- `app/v3/page.tsx` is a thin content-assembly layer: imports from
  `content/signals.ts`, `content/skills.ts`, `content/references.ts`,
  picks a small curated subset for each section (not the full lists —
  these sections are meant to be skimmed at a glance, not read in full),
  and passes them as children to `StorySection`.

## Content mapping (5 sections)

1. **Intro** — headline + stat row, adapted from `Hero.tsx`'s copy
   (350+ learners, 9.0/10 satisfaction, 9 AI agents, 3.94 GPA).
2. **Signals / Work** — 2–3 highlighted roles from
   `content/signals.ts` (`WORK_EXPERIENCE`), title + sub + top 1–2
   bullets each — not the full bullet list per role.
3. **Skills** — skill group labels + a few representative items per
   group from `content/skills.ts` (`SKILL_GROUPS`), not the exhaustive
   item lists.
4. **References** — 2–3 curated quotes from `content/references.ts`
   (`REFERENCES`), trimmed to a short excerpt each, with name/role.
5. **Contact** — closing CTA, reusing the copy/links already in
   `components/Contact.tsx` (email, message form link or mailto,
   Cal.com link if present) rather than re-deriving new copy.

## Styling

- Background/text per section uses existing CSS custom properties
  (`var(--bg)`, `var(--panel)`, `var(--panel-2)`, `var(--line)`, plus
  whatever accent tokens `globals.css` defines) instead of the
  reference component's hardcoded hex values — this is what makes it
  follow the Dayside/Nightside toggle automatically.
- Each section keeps the chamfered-panel look (`--chamfer` / `polygon(...)`
  clip-path already defined in `globals.css`) applied to the inner
  content block, instead of the reference's flat, unclipped section.
- Headings use `var(--font-display)` (Space Grotesk) at the same large
  `clamp()` scale as the reference (`clamp(3.5rem, 12vw, 14rem)`);
  labels/eyebrows (`01 — INTRO`, etc.) use `var(--font-jbmono)` to match
  the site's existing mono-for-data-labels convention.
- Body font stays `var(--font-inter)` (already the site body font) —
  no new `--font-sans` token is introduced, since the site already has
  its own font stack wired through `next/font` in `app/layout.tsx`.

## Motion behavior

- GSAP `ScrollTrigger` pins each section (except the last) with
  `pinSpacing: false`, and rotates the *next* section's inner wrapper
  from 30° to 0° as it scrolls into the pinned position — ported
  directly from the reference `FlowArt` `useGSAP` effect.
- The only motion gate is the existing `prefers-reduced-motion` media
  query check (already in the reference component): when reduced motion
  is preferred, the GSAP effect is skipped entirely and sections render
  as plain stacked full-height blocks.
- No separate breakpoint-based simplification — animation runs
  identically across all viewport sizes per the approved design.

## Dependencies

Add to `package.json` `dependencies`:
- `gsap`
- `@gsap/react`

No Tailwind config changes needed beyond what's already in
`app/globals.css` (project is already on Tailwind 4 with `@import
"tailwindcss"`); no new `--font-sans` override is added (see Styling).

## Testing

- Vitest unit test (matching the project's existing test style — see
  `lib/stagger.test.ts`, `lib/chess-engine.test.ts`) for any pure logic
  extracted from `StoryScroll` (e.g. the section-index → rotation/pin
  wiring helper, if factored out as a testable function).
- Manual verification: `npm run dev`, load `/v3`, confirm all 5 sections
  render with real content, scroll through to confirm pin/rotate
  transitions fire, toggle dark/light to confirm section colors follow
  the theme, and check the browser console for GSAP/ScrollTrigger
  errors.
- No new browser/e2e test infrastructure introduced — out of scope per
  Non-goals.

## Risks / open questions

- The reference component's `useGSAP` cleanup pattern (returning a
  function that kills all `ScrollTrigger` instances) must be preserved
  to avoid trigger leaks on route navigation away from `/v3` in a
  client-side Next.js navigation — this is carried over as-is from the
  reference implementation.
- Curated content subsets (which 2–3 roles, which skill items, which
  references) are an implementation-time editorial choice within the
  boundaries above; not enumerated exhaustively here since the source
  data already exists and the selection is low-risk/reversible.
