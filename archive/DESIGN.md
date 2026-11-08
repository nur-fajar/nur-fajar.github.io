---
name: Nur Fajar, AI specialist who builds apps and communities
description: The v7 Apple product world — a white ground with alternating #f5f5f7 full-bleed modules, Inter semibold display with tight tracking, one blue action accent, work exhibited in rounded soft-shadow gallery tiles, and CSS-only scroll-driven fade-up reveals.
colors:
  paper: "#ffffff"
  tint: "#f5f5f7"
  chip: "#f5f5f7"
  ink: "#1d1d1f"
  ink-2: "#6e6e73"
  rule: "#d2d2d7"
  rule-strong: "#b9b9c0"
  blue: "#0071e3"
typography:
  display:
    fontFamily: "Inter, sans-serif"
    fontSize: "clamp(2rem, 4.6vw, 3.1rem)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.022em"
  email-display:
    fontFamily: "Inter, sans-serif"
    fontSize: "clamp(1.7rem, 4.6vw, 3rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  section-heading:
    fontFamily: "Inter, sans-serif"
    fontSize: "clamp(1.9rem, 3.6vw, 2.7rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  work-title:
    fontFamily: "Inter, sans-serif"
    fontSize: "clamp(1.9rem, 3.4vw, 2.7rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.022em"
  section-work-label:
    fontFamily: "Inter, sans-serif"
    fontSize: "clamp(1.55rem, 2.8vw, 2.1rem)"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.018em"
  chapter-title:
    fontFamily: "Inter, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 600
    letterSpacing: "-0.012em"
  quote:
    fontFamily: "Inter, sans-serif"
    fontSize: "1.12rem"
    fontWeight: 500
    lineHeight: 1.45
  bio:
    fontFamily: "Inter, sans-serif"
    fontSize: "1.06rem"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Inter, sans-serif"
    fontSize: "0.76rem"
    fontWeight: 600
    letterSpacing: "-0.005em"
  data-mono:
    fontFamily: "DM Mono, monospace"
    fontSize: "0.72rem"
    lineHeight: 1.6
  ramp:
    - "0.72rem"  # DM Mono data: history spans, metrics, stack line
    - "0.76rem"  # testimonial relation (Inter 600)
    - "0.78rem"  # nav bar links (Inter 500)
    - "0.8rem"   # colophon, contact keys (Inter 600)
    - "0.84rem"  # roles, italic notes, skip link (Inter 400)
    - "0.85rem"  # work action links (Inter 400, blue)
    - "0.94rem"  # small body: contact values, chapter text, voice names, facts
    - "0.95rem"  # masthead tagline, contact "more" row
    - "0.98rem"  # work headline (the gray Apple tagline under a title)
    - "1.06rem"  # bio prose (17px)
    - "1.12rem"  # testimonial quotes (Inter 500)
    - "1.2rem"   # chapter titles (Inter 600)
    - "clamp(1.55rem, 2.8vw, 2.1rem)"  # Work section label-as-heading
    - "clamp(1.7rem, 4.6vw, 3rem)"     # contact email display
    - "clamp(1.9rem, 3.6vw, 2.7rem)"   # section h2 / work titles
    - "clamp(2rem, 4.6vw, 3.1rem)"     # masthead name
spacing:
  tight: "0.3rem"
  sm: "0.7rem"
  md: "1.4rem"
  lg: "2.4rem"
  xl: "3.6rem"
  band: "4.5rem"
components:
  hero-column:
    textColor: "{colors.ink}"
    rounded: "0px"
  gallery-tile:
    backgroundColor: "{colors.chip}"
    rounded: "0.75rem"
  bio-chip:
    backgroundColor: "{colors.chip}"
    rounded: "0.45em"
  work-mark:
    backgroundColor: "{colors.chip}"
    rounded: "1.1rem"
    width: "4.8rem"
  work-link:
    textColor: "{colors.blue}"
  nav-bar:
    textColor: "{colors.ink-2}"
    height: "44px"
  contact-row:
    textColor: "{colors.ink}"
---

# Design System: Nur Fajar v7 — The Product Showroom

## Overview

**Creative North Star: "The Product Showroom"**

The page reads like an apple.com product page, not a document. A clean white ground (#ffffff) carries the screen; full-bleed slate-gray modules (#f5f5f7) alternate with white to mark chapters — Praise and Contact sit on gray, History stays white; there are no top hairlines separating sections, the background does the dividing. Type is Inter at semibold (600) with tight tracking for every display voice, and the palette holds exactly one chromatic color: Apple's action blue (#0071e3), used only where the reader acts. Work is exhibited, not listed: six centered project showcases, each with a mark, a display title, a gray Apple-style tagline, a rounded soft-shadow gallery grid, and small-print facts beneath a hairline.

Personality is quiet and long-lived. The only warm block is the founder's first-person bio at the top; everything under it runs dry — facts, verbatim quotes, history rows, a contact strip crowned by a monumental email link. Motion is module-level fade-up driven by scroll (CSS `animation-timeline: view()`); one 44px translucent blur bar (WorkNav) drops from the top once the hero has scrolled away. The one sanctioned eccentricity is the night-mode Easter egg: click a night/sky/constellations word in the bio and the whole page inverts to a navy palette with a drifting constellation sky, all pure CSS. JavaScript is now UNRESTRICTED by policy (founder decision 2026-10-16, "buka penuh"): client components and motion libraries are allowed — but they must live under app/v7 or components/v7, and CSS-first remains the default idiom (reach for script only where CSS cannot express the motion). The hero is a sticky cover: pinned while the Work module slides over it.

**Key Characteristics:**
- White ground (#ffffff) with full-bleed slate modules (#f5f5f7) alternating chapter by chapter; ink #1d1d1f, annotation gray #6e6e73.
- One chromatic accent, Apple blue (#0071e3), reserved for action: async links, hover underlines, focus ring, text selection. It never fills a block or paints a heading.
- One family (Inter, self-hosted, weights 400/500/600) for all text voices; DM Mono survives only for data (metrics, history spans, stack line).
- Work as exhibited product: centered showcases with rounded (0.75rem) soft-shadow gallery tiles that lift on hover, and no fold — everything rests visible.
- Motion is scroll-driven CSS by default: modules rise 26px into view on `animation-timeline: view()`, gated by `prefers-reduced-motion` and `@supports`, with content visible without animation support. Script-driven motion is allowed since 2026-10-16 where CSS falls short — the hero's sticky cover and the WorkNav bar are the current native devices; heavier libraries (framer-motion) are sanctioned but must justify their bundle weight.
- One fixed chrome element: a 44px white-78% `saturate(180%) blur(20px)` top bar with scrollspy (WorkNav — a client component; others are now permitted under app/v7 / components/v7).
- A pure-CSS night mode (hidden checkbox + `:has()` flips the palette to navy and fades in a fixed constellation sky at 50% opacity) is the page's only decoration.

## Colors

The palette is Apple's hour before dusk: white and slate surfaces, near-black ink for reading, a quiet gray for annotation, hairlines that whisper, and a single decisive blue for action.

### Primary
- **Apple Action Blue** (#0071e3): the page's only chromatic color, and it is canonical only as action — work link text, contact "more" links, the `:focus-visible` ring (2px, 3px offset), `::selection` (blue ground, white text), the email's hover underline. It never fills a surface, never colors a heading, never becomes body text.

### Neutral
- **Showroom Ink** (#1d1d1f): all primary text — masthead, section h2s, work titles, chapter titles, contact values, the monumental email. The email link reads ink at rest and earns blue only as an underline on hover.
- **Annotation Gray** (#6e6e73): the secondary voice — tagline, work headlines, contexts, metrics, notes, relations, roles, colophon, nav links at rest. Everything that supports but does not lead.
- **Showroom White** (#ffffff): the page ground (`--paper`), also the nav bar's glass base (translucent to 78%).
- **Slate Module** (#f5f5f7): the full-bleed alternating band (`--tint`), twice-role'd — one token wears two names (`--tint` for bands, `--chip` for tile/pill interiors), same hex. Identity chips, gallery tile backfills, and the mark sit on it.
- **Hairline** (#d2d2d7): 1px grouping rules — fact-panel tops, chapter and contact row tops, voice block tops, colophon. Also the parent of two translucent variants: 55% for gallery tile borders, 40% for the nav bar's bottom border.
- **Emphasis Hairline** (#b9b9c0): the darker 1px — decoration for bio link underlines (ink on hover), the dotted night-word underline, the dashed placeholder tile border.

**Night mode (preserved, founder-approved).** When the hidden `#v7-stars` checkbox is checked, the same variables flip via `:has()` — paper #091128, tint #0e1940, ink #e7ecfb, ink-2 #97a1c4, rule #1a2142, rule-strong #2b3563, chip #121a38 — with a 0.45s background/color ease. Sky inks: stars #cfd9ff, constellation lines #8fa0d8 (40% opacity), figure points #e7ecfb; the whole layer is dulled to 50% (`--v7-sky: 0.5`) so it never rivals the text.

### Named Rules
**The Action-Blue Rule.** Blue appears only where the reader can act: async links, the email's hover underline, focus, selection. Decorative blue is a design error, not a palette shortfall — and this usage is canonical, not provisional.

**The Full-Bleed Band Rule.** Chapter color is background, never border: a gray module spreads edge-to-edge via a `0 0 0 100vmax` box-shadow of `--tint` clipped by `clip-path: inset(0 -100vmax)`. Section separators are white/gray alternation, not hairlines.

**The Inversion-of-Variables Rule.** Night mode is not a new theme file; it re-points the same custom properties through `:has(#v7-stars:checked)` so every color in the document flips at once, content rules untouched.

## Typography

**Display & Body Font:** Inter (weights 400/500/600 used, 700 loaded as headroom, self-hosted via `next/font` as `--font-v7-sans`; `--font-v7-display` and `--font-v7-body` alias it so the family loads once; fallback sans-serif)
**Data Font:** DM Mono (weights 300/400/500 self-hosted as `--font-v7-mono`, fallback monospace) — data only: history spans, metrics lines, the stack line, placeholder captions.

**Character:** One grotesk, two loads' worth of purpose. apple.com never slips a second family into running text, and neither does this page: Inter 600 with tracking between −0.022em and −0.015em carries every display voice (name, section h2s, work titles, the contact email), Inter 500 marks mid-voices (quotes, nav links), and Inter 400 reads everything else. DM Mono is quarantined to facts that behave like data. Nothing is uppercase; tracking is negative on display, near-neutral on UI text, and only the history spans carry positive mono tracking (0.05em).

### Hierarchy
- **Display** (600, clamp(2rem, 4.6vw, 3.1rem), lh 1.08, ls −0.022em): the masthead name, alone in the first screen.
- **Email Display** (600, clamp(1.7rem, 4.6vw, 3rem), lh 1.1, ls −0.015em): the contact email as its section's heading, the page's monumental gesture.
- **Section Heading** (600, clamp(1.9rem, 3.6vw, 2.7rem), lh 1.1, ls −0.02em): section h2s (Praise, History); work titles run the same weight at clamp(1.9rem, 3.4vw, 2.7rem) with ls −0.022em.
- **Work Section Label** (600, clamp(1.55rem, 2.8vw, 2.1rem), lh 1.12, ls −0.018em): Work's own h2 — deliberately the smallest display in the set so the six showcased titles outrank their parent list.
- **Chapter Title** (600, 1.2rem, ls −0.012em): history chapter heads, seated against a DM Mono 0.72rem span column.
- **Quote** (500, 1.12rem, lh 1.45): verbatim testimonial text, `text-wrap: pretty`.
- **Bio** (400, 1.06rem, lh 1.6): the opening first-person paragraphs, capped at a 45em measure (masthead + bio share the 45em column), 12px between paragraphs, `text-wrap: pretty`, hyphens off.
- **Body** (400, 16px, lh 1.55): base voice; small body at 0.94rem (contact values, chapter text, contexts, facts).
- **Label** (600, 0.76–0.82rem, ls −0.005em, sentence case): testimonial relation, contact keys, nav brand — the Apple specs-table voice, never mono, never uppercase.
- **Data Mono** (DM Mono, 0.72rem, lh 1.6–1.7): metrics line, history spans, stack line. Prose never enters this voice.

### Named Rules
**The One Family Rule.** Inter is the only family in running text. Display, body, label, chip — all Inter. A second text family inside prose or UI breaks the world; only data escapes into DM Mono.

**The Data-Only Mono Rule.** DM Mono handles numbers, spans, and stack traces — never a sentence a reader must settle into, never a stylistic label. If it reads like prose, it is Inter.

## Layout

A single 1140px shell (`--shell`) with 1.5rem side gutters organizes the page. The first screen is showroom-clean: the hero fills the viewport on screens ≥901px and centres vertically (`justify-content: safe center`, 3.5rem bottom rescue padding for the chevron), holding the masthead row (name left, gray tagline set mid-flex and optically lowered 2px) and the bio in one shared 45em column, with a 0.7rem hairline chevron pinned 1.5rem above the bottom edge. There is no stat card, no contact row, no nav bar over the hero — the first screen is name, tagline, bio, and nothing else; contact waits at the page's end.

After the hero the page becomes product modules: `.v7-sec` blocks capped at the shell with `padding: 4.5rem 1.5rem 5rem`, gray ones bleeding full width via the tint-shadow/clip-path device. Work showcases are center-aligned articles (`padding: 3.6rem 0`, gap 0.6rem, `scroll-margin-top: 4.5rem` for anchor landings) whose fact rails sit beneath the gallery as a two-column grid (context left, build/metrics/note right, `gap: 0.9rem 2.6rem`, hairline top) that stacks under 780px. Voice blocks run two per row with a 3.2rem column gap and hairline tops; history chapters use an 11rem mono-span column; contact rows a 9rem key column, both with 2.5rem gutters; the colophon closes under a hairline at 0.8rem gray.

### Responsive
- **≥901px:** hero goes full-viewport and centres (with safe-centre overflow protection); the chevron and the 44px WorkNav bar exist only here — the bar is `display: none` below this width.
- **≤900px:** voices collapse to one column with zero gap; chapter and contact key columns stack above their content.
- **≤780px:** showcase fact rails stack to a single column.
- **≤640px:** hero pads down (2.4rem/3rem); the tagline drops to its own centered line beneath the name and surrenders its 2px optical offset.

## Elevation & Depth

Depth is restrained and earned. The only shadowed element is the gallery tile: at rest it carries `0 6px 18px rgba(0, 0, 0, 0.06)` — a soft ambient floor so white screenshots don't fuse with the ground — plus a hairline border mixed at 55% transparency. On hover (pointer devices only) the tile lifts `translateY(-4px)` and the shadow hardens to `0 12px 28px rgba(0, 0, 0, 0.09)`. One non-elevation shadow exists: the gray module's `0 0 0 100vmax` spread is a layout device for full-bleed tinting, not depth. The nav bar's blurred translucency is the page's one layer of glass, sitting above content at z-index 40; the night sky is a layer below content (z-index −1 inside an isolated stack). Headings, rows, and type get their flatness intact: nothing else ever lifts.

### Shadow Vocabulary
- **Tile at rest** (`box-shadow: 0 6px 18px rgba(0,0,0,0.06)`): under every gallery screenshot, with a 1px `color-mix(var(--rule) 55%, transparent)` border; keeps light shots legible against white and gray.
- **Tile lifted** (`box-shadow: 0 12px 28px rgba(0,0,0,0.09)` + `translateY(-4px)`, 0.35s `cubic-bezier(0.28, 0.11, 0.32, 1)`): hover-only, `@media (hover: hover)` gated.
- **Tint spread** (`box-shadow: 0 0 0 100vmax var(--tint)`): full-bleed paint, clipped by `clip-path: inset(0 -100vmax)`; never reads as elevation.

### Named Rules
**The Earned-Depth Rule.** A shadow belongs to a surface that portrays a physical product (gallery tile) or answers the pointer (the lift). Section bands, rows, quotes, and panels stay flat — nothing else casts.

## Shapes

The radius ladder climbs with display weight. The smallest sanctioned radius is the bio's inline logo chip at 0.45em; gallery tiles sit at 0.75rem; the work mark (project icon) tops the ladder at 1.1rem. Corners are otherwise square: hero, sections, rows, quotes, panels, and the colophon all run at 0. The focus ring rounds itself to 2px so it doesn't clamp past pill corners. Dashed placeholder tiles (1px dashed `--rule-strong`, 0.55rem, DM Mono caption) carry no design authority — they are temporary scaffolding while gallery files await the founder's screenshots and must not be styled as a look.

The line vocabulary stays two-toned and hairline only: solid 1px `#d2d2d7` to group (voice tops, chapter tops, contact tops, fact rail, colophon) and emphasis 1px `#b9b9c0` for the darkest strokes a hairline may darken to (bio underline arrival). Where a hairline lies over glass or depth, it goes translucent through `color-mix`: 55% rule on tile borders, 40% rule under the nav bar.

### Named Rules
**The Radius Ladder Rule.** Radius scales with the object's prominence — 0.45em for in-line chips, 0.75rem for product tiles, 1.1rem for the mark — and structural surfaces stay at 0. Inventing a mid-step radius injects a fifth rung the world doesn't carry.

**The Translucent-Overlap Rule.** Where a line meets depth or glass, it is the same hairline color at reduced opacity (`color-mix` 55%/40%); never a new hex, never a thicker stroke.

## Components

### WorkNav Bar (navigation, the page's single client component)
- **Character:** the apple.com glass bar, one 44px strip above everything.
- **Shape:** fixed, full-width, height 2.75rem (44px); interior row capped at the shell, name left and project anchor mail links right (`gap: 2.2rem`); bottom border 1px rule at 40%.
- **Surface:** `color-mix(in srgb, var(--paper) 78%, transparent)` + `backdrop-filter: saturate(180%) blur(20px)`; flips with the night palette via `--paper` alone.
- **Type & states:** brand Inter 600 0.82rem ink; links Inter 500 0.78rem gray, hover ink (0.2s ease), scrollspy marks the section under the screen's mid-line as full ink (`aria-current`). It hides until the hero exits (IntersectionObserver in WorkNav), slides down via `translate 0.4s cubic-bezier(0.28,0.11,0.32,1)` / `opacity 0.25s`, and is desktop-only (≥901px).
- **No-JS/fallback stance:** with JS off the bar never mounts its observers, but every target section keeps its `w-<id>` anchor; nothing on the page requires the bar to be reachable.

### Hero (first screen)
- **Character:** one clean white screen of person, not product — name, tagline, bio, chevron, no chrome.
- **Shape:** 45em column inside the shell; full-viewport vertical centre with `safe center`; chevron is a 0.7rem rotated square with 1px right/bottom borders in annotation gray, `aria-hidden`, desktop-only, static.
- **Interactions:** bio links are ink with `--rule-strong` underlines (offset 0.2em) that darken to ink on hover; the logo chip is a tint pill (1px rule border, 0.45em radius) whose hover whitens and darkens the border; the night trigger words are dotted-underlined and take the blue focus ring.

### Work Showcase (signature component)
- **Character:** six center-aligned project exhibits — mark, title, gray tagline, action links, gallery, facts.
- **Mark:** the project's `icon.png` in a 4.8rem 1.1rem-radius chip (1px rule border, chip ground); if no icon exists the whole mark unmounts (`:not(:has(img))` display none) — a mark appears only when a real product icon exists.
- **Type:** title in Work Title scale; headline is one gray 0.98rem Apple tagline sentence under it; the kind line stays in the DOM for machines and tests but renders invisible via `display: none` (never a screen kicker).
- **Links:** blue 0.85rem, no underline at rest, underlined on hover (thickness 0.08em, offset 0.2em); external, `rel="noreferrer"`.
- **Gallery:** centered grid, `repeat(auto-fit, minmax(300px, 1fr))`, 14px gap, images keep native aspect; tiles per the shadow/radius vocabulary, hover lift on pointer devices. Lazy-loaded.
- **Facts:** hairline-topped two-column small print at 0.92rem — context in gray, 0.75rem ▸-marker build list, DM Mono metrics line, italic 0.84rem note. Rendered only when content exists; otherwise the gallery closes the showcase.

### Voice Blocks (testimonials)
- **Style:** verbatim quote (Inter 500, 1.12rem, lh 1.45) over name (600, 0.94rem), relation (600, 0.76rem gray), role (0.84rem gray); hairline tops; two per row on gray module. Roles may only be trimmed from canon, never extended.

### Chapter & Contact Rows
- **Style:** hairline tops; history chapters 11rem DM Mono span column + 1.2rem 600 title + 0.94rem gray text; contact rows 9rem Inter 600 0.8rem gray key + 0.94rem value. The email itself is the section heading at Email Display scale, ink at rest, underlined in blue (0.12em thickness) on hover; "more" links (LinkedIn, CV) are blue with hover underlines.

### Focus & Selection (accessibility floor)
- `:focus-visible` everywhere inside v7: 2px solid blue outline, 3px offset, 2px self-radius. `::selection`: blue ground, white text. Skip link (ink bar, top 0.75rem on focus) and keyboard-operable night toggle (blue ring on the dotted trigger word) come standard; smooth scrolling exists only under `prefers-reduced-motion: no-preference`.

### Night Sky (signature: pure-CSS Easter egg)
- **Trigger:** hidden checkbox `#v7-stars`, labeled by three dotted words in the bio ("night" family); `:has()` flips the palette and fades the sky layer to 50%.
- **Sky:** fixed full-viewport layer under content in an isolated stacking context; four 100svh declination bands (curated IAU constellations, server-projected at build) parallax backwards via `animation-timeline: scroll(root block)` dragging the strip −300svh per full scroll; plus alternating ±26px drift (30–48s) and a small twinkle subset — both reduced-motion gated. Without `animation-timeline` support the layer falls back to absolute positioning and the stars stay visible.

## Do's and Don'ts

### Do:
- **Do** alternate chapter grounds — gray for Praise and Contact, white for History — with the full-bleed tint-spread device, never with hairline separators (The Full-Bleed Band Rule).
- **Do** reserve blue #0071e3 for action: async links, the email's hover underline, focus ring, selection (The Action-Blue Rule).
- **Do** gate module reveals behind `@media (prefers-reduced-motion: no-preference)` **and** `@supports (animation-timeline: view())`, so every browser reads full content even where the animation can't run.
- **Do** keep reveal at module level (`.v7-show`, `.v7-voices`, `.v7-chapters`, `.v7-rows`, `animation-range: entry 0% entry 60%`) — one rise per module, never per line.
- **Do** keep Inter on every text voice and DM Mono strictly on data (The One Family Rule, The Data-Only Mono Rule).
- **Do** keep client code scoped to app/v7 or components/v7; CSS-first stays the default idiom, and the night mode remains a checkbox + `:has()` even though script is now permitted (2026-10-16).
- **Do** separate with a two-tone hairline vocabulary only: 1px grouping rules for section furniture, the darker hairline only where underlines need emphasis; translucent variants (`color-mix`) where lines meet glass or depth, never new hexes or thicker strokes (The Translucent-Overlap Rule).
- **Do** read gallery files from `public/v7/work/<id>/` at build time; a folder refresh plus rebuild fills the exhibits without JS or CMS.

### Don't:
- **Don't** let blue fill a block, color a heading, or replace ink for body text; it lives at links, focus, and hover underlines.
- **Don't** set a second family inside running text, or set any prose in mono; mono is for metrics, spans, and the stack line only.
- **Don't** shadow anything outside the gallery-tile vocabulary (at-rest shadow on tiles, the hover lift, the nav glass); sections, panels, rows, and quotes stay flat.
- **Don't** pin surfaces to scroll (no scroll-jacking) or marquee-duplicate content; the scroll-driven reveal moves content into place, it never intercepts input.
- **Don't** retype figures into the page; every number descends from the ledger SSOT, and showcase headlines may only restate facts their own project already carries.
- **Don't** let client code escape the v7 folders (app/v7, components/v7) — the guard is scope, not count, since 2026-10-16.
- **Don't** hide content behind animation or JS: reduced-motion and unsupported browsers get the same content instantly visible.
- **Don't** let gallery tiles mount behind a fold: everything rests visible, lazy-loaded images merely defer bytes, not structure.

---

# Design System: Nur Fajar v9 — "Signal" (eksperimen, /v9)

> Route eksperimen, noindex, tidak pernah dipromosikan ke homepage tanpa
> keputusan founder terpisah. Sistem visualnya sendiri: dunia terang dengan
> idiom komponen 21st.dev yang paling banyak diunduh. Copy dan angka tetap
> milik ledger. Seluruh token ada di `app/v9/v9.css` (kelas berprefiks `v9-`).

## Karakter
- **Ground kertas** (#ffffff) dengan satu modul tint (#f5f5f7) di section
  History. Semua section terang, dari atas sampai bawah.
- **Ink** #1d1d1f, **ink-2** #6e6e73, **ink-3** #86868b, hairline #d2d2d7 dan
  #e8e8ed. Satu aksen aksi: biru #0071e3 (tombol solid, tautan, fokus).
- **Pita cahaya** hanya di dalam shader hero: satu warna, biru terang ke biru
  pekat (`#3b82f6` -> `#1d4ed8`), intensitas rendah di atas ground kertas.
  Tidak dipakai di tempat lain. Ungu dibuang (audit 2026-10-20: biru ke
  ungu adalah gradient paling generic yang ada, dan warna kedua berarti dua
  keluarga kromatik di halaman yang satu-satunya aksennya adalah biru aksi).
- Inter 400/500/600/700 untuk semua suara; DM Mono hanya untuk data (indeks
  case, span waktu, baris stack).
- Radius 1.25rem untuk kartu, 0.75rem untuk panel kecil. Bayangan hanya di
  kartu: `0 6px 18px rgba(0,0,0,.06)`, naik ke `0 18px 44px` saat hover.

## Idiom (dari 21st.dev, ditulis ulang)
| Bagian | Pola 21st (unduhan) | Padanan v9 |
|---|---|---|
| Hero | Shader Background (1 459) | `components/v9/Shader.tsx`, WebGL mentah, satu draw call |
| Headline | Text Reveal (87) | GSAP `SplitText` dengan `mask: 'lines'` |
| Nav | Navbar with Dropdowns (1 996) | Bilah kaca; menu mobile `<details>` native |
| Work | Bento Grid (2 702) + Spotlight Card (2 129) | Kartu 12 kolom, cahaya mengikuti pointer |
| Latar bento | Gradient Dots (658) | Dot-grid #d2d2d7, jarak 22px |
| Praise | Testimonial (uilayout.contact, 299) | Grid 3x2, satu kartu menyala, dua sel kosong berpola grid |
| History | Timeline (230) | Garis yang terisi seiring gulir, penanda lingkaran |
| Footer | Retro Grid (dillionverma, 695) | Lantai perspektif CSS murni, alamat email sebagai wordmark |

## Gerak
- Tiga gerak saja: shader (ambient, satu draw call), mask reveal (hanya hero
  dan dua judul utama: Work dan Praise), dan reveal polos untuk blok lain.
  `prefers-reduced-motion: reduce` mematikan GSAP seluruhnya (satu guard di
  `components/v9/Motion.tsx`) dan menggambar **satu frame statis** untuk
  shader, bukan anima thereof. framer-motion tidak dipakai di halaman ini.
- Lantai perspektif di footer bergerak sendiri, tapi itu **permukaan, bukan
  UI**: gerak CSS murni, `aria-hidden`, dan tidak bisa diklik. Di bawah
  reduced motion ia berhenti menjadi satu frame.
- **Tidak ada UI yang bergerak tanpa diminta manusia.** Kartu testimoni
  menyala hanya saat kursor masuk atau fokus naik ke kartu itu; tidak ada
  timer, tidak ada carousel otomatis (audit 2026-10-20).
- Tanpa JavaScript: server mengirim teks utuh; semua efek masuk dari state
  JS (`gsap.from`), tidak pernah dari state awal CSS.
- Tanpa WebGL: shader digantikan radial gradient CSS (`.v9-hero__fallback`).
- Larangan yang sama dengan v7: tanpa scroll-jacking, tanpa marquee duplikat,
  tanpa logo soup, tanpa angka yang dietik ulang.

## Aturan
- Biru hanya di tempat pembaca bisa bertindak: tombol, tautan, cincin fokus.
- Pita cahaya tidak pernah menimpa headline tanpa scrim putih (`.v9-hero__scrim`).
- Angka hanya di section penghasilnya; tidak ada baris stats terpisah.
- **Bentuk kepala section tidak seragam.** Pill label dipakai satu kali
  saja di seluruh halaman (Praise). Enam section dengan bentuk kepala yang
  sama adalah tanda "dari template" (audit 2026-10-13 menemukan pola yang
  sama di halaman lama).
- Klien v9 hanya boleh hidup di `app/v9` dan `components/v9` (dijaga tes).
