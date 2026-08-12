# /retro — Island Portfolio Rebuild

**Date:** 2026-08-12
**Status:** Approved for planning
**Route:** `nurfajar.com/retro` (`app/retro/`)

## Background

`app/retro/page.tsx` currently just re-renders the main homepage as a placeholder alias
(see `2026-08-12` commit "Add /retro route serving the same homepage content"). This spec
replaces that placeholder with a real, standalone experience.

The source material is `D:\Claude\nurfajar-island-v7.html` — a 990-line, self-contained
vanilla JS/SVG "game" portfolio: an island map with five landmarks, each opening into a
different mini-game genre (platformer, Pac-Man-style maze, puzzle, Tetris), driven by a
single "step" state machine (`scroll/click = +1 step`, `scroll up = -1 step`). All content
in that file is in Indonesian and uses placeholder contact info.

Visual/UX reference named by the user: rleonardi.com/interactive-resume — considered and
explicitly **not** adopted; the user chose to keep the island + mini-game concept from
island-v7 and upgrade its polish and accessibility instead of replacing the concept.

## Goals

1. Port island-v7's full game (map + 5 areas: Organisasi/Org, Kerja/Work, Proyek/Projects,
   Skill, Hire-me) into React/TypeScript inside the existing Next.js app, at `/retro`.
2. Re-animate it with GSAP (game/scene choreography) and Framer Motion (UI chrome), instead
   of the original's manual CSS transitions / `setInterval` loops.
3. Translate and reconcile all content into English, sourced from the numbers and claims
   already live in `retro-portfolio`'s components (`Hero.tsx`, `Credibility.tsx`,
   `Signals.tsx`, `Skills.tsx`, `Contact.tsx`) rather than a literal translation of
   island-v7's (possibly stale) numbers.
4. Replace the generic procedural pixel sprite with a one-time AI-generated pixel-art
   sprite based on the user's real photo (`public/foto-profile-nf.jpg`), with a
   non-AI fallback.
5. Meaningfully improve accessibility beyond island-v7's baseline: a non-game fallback mode,
   live-region announcements, skip link, verified color contrast.
6. Do not touch `app/page.tsx` or the root domain — `/retro` is fully additive, consistent
   with the existing `add-retro-route` branch decision.

## Non-goals

- No CMS/admin UI for editing game content — content lives in a typed data file, edited by
  hand like the rest of the site.
- No multiplayer/leaderboard/analytics features.
- No changes to the main site's content or design system.
- No runtime (per-request) AI image generation — sprite generation is a one-time dev-time
  script, not a live API dependency.

## Architecture

```
app/retro/
  page.tsx                       → entry point, renders <IslandGame />

components/retro/
  IslandGame.tsx                 → root: owns {area, step, done} state, global input
                                    handling (wheel/touch/keyboard), scene switch, wipe
                                    transition orchestration
  IslandMap.tsx                  → island overview scene (5 landmarks + hero sprite)
  Hud.tsx                        → top bar: name/role, area name, map/sound/CV buttons
  Panel.tsx                      → bottom info panel (eyebrow/title/body/tags/hint),
                                    Framer Motion AnimatePresence on step change
  Track.tsx                      → bottom progress rail + checkpoints + kart position
  TitleOverlay.tsx                → opening title screen
  CvOverlay.tsx                   → full CV fallback view
  scenes/
    PlatformerScene.tsx          → used for Org and Work areas (genre: platformer)
    PacmanScene.tsx               → Projects area (genre: maze)
    PuzzleScene.tsx                → Skill area (genre: puzzle, 4-piece assembly)
    TetrisScene.tsx                 → Hire-me area (genre: tetris, falling contact blocks)

lib/retro/
  content.ts                     → typed data: AREAS, ORG, WORK, PROJECTS, SKILLS,
                                    CONTACT — English, reconciled with main-site copy
  sprite.ts                      → procedural SVG pixel-sprite generator (ported from
                                    island-v7's `sprite()`), used as fallback
  sfx.ts                         → WebAudio beep sound effects (ported as-is, same
                                    approach: oscillator beeps, muteable)
  gameState.ts                   → pure functions: globalStep(), step(d) transition
                                    logic, TOTAL step count, Pac-Man PATH/WAY mapping
                                    — kept pure/framework-free so they're unit-testable

public/retro/sprite/
  idle.png, walk-1.png, walk-2.png, jump.png   → AI-generated sprite frames (committed)

scripts/
  generate-retro-sprite.mjs      → one-time dev script, reads OPENAI_API_KEY from env,
                                    not invoked by build/deploy or any runtime code path
```

State stays local `useState`/`useReducer` in `IslandGame.tsx` — no new state library,
consistent with the project's MVP-first convention.

## Content & language

- All game text (area names, story lines, panel copy, tags) is written in English.
- Numbers and claims (learners trained, satisfaction score, AI agents deployed, GPA,
  program rankings) are pulled from the existing components (`Hero.tsx` STATS,
  `Credibility.tsx`, `Signals.tsx`) — not re-derived from island-v7's Indonesian copy —
  so the two versions of the site never contradict each other.
- Area names get an English framing that keeps the same tone (playful/narrative, not
  corporate), e.g. "BUKIT AWAL" → "BASE CAMP", "KOTA KERJA" → "WORK CITY" (exact wording
  finalized during implementation, reviewed against actual site copy at that time).
- `CONTACT` data pulled from the real `Contact.tsx` (Web3Forms endpoint, Cal.com link,
  actual social links) — no more placeholder `+62 ••• ••••` phone number.
- The CV overlay (`#cv` in the old version) is kept as a fast, non-game fallback for
  recruiters in a hurry.

## Animation split: GSAP vs Framer Motion

| Element | Tool | Reason |
|---|---|---|
| Platformer camera pan, hero walk/jump, block-open sequence | GSAP timeline | Needs precise sequencing (walk → jump → open), replaces old CSS-transition chaining |
| Pac-Man path movement, pellet-eating | GSAP (`MotionPathPlugin` or per-point `gsap.to`) | Motion-along-a-path is GSAP's core use case; replaces old manual `setInterval` walker |
| Puzzle piece assembly (off-screen → slot, overlap labels) | GSAP (`back`/`elastic` ease, stagger) | Overshoot/settle feel is easiest to tune precisely in GSAP |
| Tetris block drop, line-clear | GSAP | Gravity-like fall + stagger between blocks |
| Info panel content transitions | Framer Motion (`AnimatePresence` + `Variants`, same pattern as `Hero.tsx`) | Matches existing site's motion vocabulary |
| HUD, progress track, title overlay, scene wipe | Framer Motion | Chrome-level, not gameplay — one consistent design language |
| Any scroll-triggered reveal outside the game loop | Framer Motion `whileInView` (reuse existing `Reveal` pattern if present) | Reuse over reinvention |

GSAP is added as a new dependency (`gsap` + `@gsap/react`'s `useGSAP` hook for automatic
cleanup on unmount/navigation, avoiding leaked timelines across Next.js client-side nav).

## Accessibility

- **Reduced motion**: beyond speeding up animations (`prefers-reduced-motion: reduce`),
  provide a **non-game fallback view** — a plain, linearly-navigable list of all content
  (org/work/projects/skills/contact), auto-enabled when reduced-motion is detected, or
  toggleable manually from the HUD. The scroll-jacked step mechanic itself can be
  disorienting for some users even at faster speed, so a structurally different mode is
  provided, not just a faster version of the same mode.
- **Screen readers**: an `aria-live="polite"` region announces panel content on every step
  change, since SVG scene changes convey no information to a screen reader on their own.
- **Keyboard**: preserve Arrow/Space/Enter navigation from island-v7; add a skip link
  ("Skip game, jump to CV summary") at the top of the page; verify a logical tab order
  (map → HUD buttons → panel links).
- **Color contrast**: audit all text/background pairs in the island-v7 palette against
  WCAG AA (e.g. `--sand`/`--cream-d` combinations need verification).
- **Scroll-jacking safety**: the wheel/touch handlers must never fully trap page scroll if
  JS fails, and the page must always be exitable via `Esc` or an always-visible "back"
  control.

## AI sprite generation

`scripts/generate-retro-sprite.mjs`, run once during implementation, not part of the
build/deploy pipeline:

1. Reads `public/foto-profile-nf.jpg` as a reference.
2. Calls the OpenAI Images API with a prompt targeting a 16-bit pixel-art style consistent
   with island-v7's palette (`--ink`, `--gold`, `--sea`, etc.), transparent background.
3. Generates multiple consistent frames in one batch (idle, walk-1, walk-2, jump) rather
   than forcing one image to cover every game state — mirrors the `gear` parameter states
   the old procedural `sprite()` function supported.
4. Output committed to `public/retro/sprite/*.png` — no API dependency at runtime or
   deploy time after this one-time run.
5. Requires `OPENAI_API_KEY` in the environment when run locally; the key is never
   committed, pasted into chat, or embedded in client code.
6. Fallback: if generation fails or output quality is poor, the procedural SVG sprite in
   `lib/retro/sprite.ts` (ported from island-v7's `sprite()`) remains the default — the
   site never depends on the AI step succeeding.

## Testing & verification

- **Unit tests** (Vitest) for the pure logic most at risk of off-by-one errors during the
  port: `globalStep()`, `step(d)` transition boundaries (area entry/exit), `TOTAL` step
  count, and the Pac-Man `PATH`/`WAY` mapping.
- No unit tests for GSAP/Framer Motion timing values (duration/easing are visual
  preference, not correctness) — a render smoke-test per scene component is enough.
- **Manual verification**: `npm run build` + `npm run dev`, walked through in-browser for
  all 5 areas, reduced-motion mode, and keyboard-only navigation before claiming the work
  done.
- **Accessibility check**: axe DevTools or manual keyboard-only walkthrough per area,
  confirming focus is never lost/trapped across scene transitions.
- Build verified on a preview branch (Vercel preview deploy) before merging to `main`,
  consistent with the existing `add-retro-route` workflow.

## Open items for implementation time (not blocking spec approval)

- Exact English area names/story copy — drafted during implementation, checked against
  live `retro-portfolio` copy for consistency.
- Exact GSAP ease/duration values — tuned visually during implementation.
- Final choice of `gpt-image-1` vs other OpenAI image model, decided at script-writing time
  based on what's current/available.
