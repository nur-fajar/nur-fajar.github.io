# /v3 — Bento Home Screen

Status: Draft, awaiting review
Date: 2026-09-09
Supersedes: `2026-08-09-v3-story-scroll-design.md` (scroll-story `/v3`, dropped),
and the unmerged `feat/v3-myfolio-clone` branch (spec commits only, no code).

## Summary

Rebuild the portfolio as a bento home screen at `/v3`: one screen of widget
tiles, each a door into its own page. The visual direction comes from a
mockup supplied by Fajar (`D:\Claude\bento home.jpg`), which is itself in the
family of `devakshay.app/home`: warm cream paper, white cards with large
radii and no shadow, a floating pill nav, and a circular arrow button on
every tile that leads somewhere.

The current long single-page site stays live and untouched at `/`. Nothing in
`app/globals.css`, `app/sections.css`, or `components/site/` changes. When
Fajar is satisfied, promotion to `/` is a separate PR.

## Goals

- Reproduce the supplied mockup's home screen exactly: six tiles, three rows,
  twelve columns, no leftover cells.
- Reuse every word and number from `content/ledger.ts`, `content/addie.ts`,
  and `content/references.ts`. No new claims are written to fill space.
- Keep all four mechanical copy sweeps in `content/ledger.test.ts` applying to
  v3 copy, by exporting that copy from `ledger.ts` rather than inlining it in
  components.
- Keep both deploy targets green: `next build` (Vercel) and
  `NEXT_STATIC_EXPORT=true next build` (GitHub Pages).
- Zero external requests. The site's CSP is `img-src 'self' data:` and
  `font-src 'self'`, so every logo, map, and font is self-hosted.

## Non-goals

- Not replacing `app/page.tsx` in this pass.
- Not touching `/hire-me`, which keeps its own dark theme from `app/story.css`.
- No dark mode. Tokens are written so it can be added later as its own piece
  of work, but no toggle widget ships and no second palette is designed.
- No new dependencies. `framer-motion` and `@phosphor-icons/react` are already
  in the tree and cover everything here.

## Decisions on record

These were settled with Fajar before this document, and are written down
because each one closed off a plausible alternative.

| Decision | Chosen | Alternative rejected |
|---|---|---|
| Structure | Bento home screen, each tile opens its own page | Single long page restyled; hybrid widget header over a scroll |
| Release | Build at `/v3`, swap to `/` later in a separate PR | Replace `/` immediately; separate repo |
| Visual identity | Follow the supplied mockup fully | Keep Space Grotesk / Plus Jakarta and the blue-purple-pink gradient |
| Dark mode | Light only, tokens shaped to accept dark later | Ship dark mode and the toggle widget now |
| Evidence widgets | Dropped from home | Move them into inner pages; add a fourth row of number tiles |
| Credentials and Gallery | Credentials folds into `/v3/about`; Gallery folds into `/v3/project` | Six nav items; a seventh home tile |
| Website category | `nurfajar.com` itself, for now | jobluck, cg-talent, alterego (Fajar: "yang lainnya akan menyusul") |
| Tool logos | Nine as drawn, on a tile labeled Tools | Trim the list |

## Home screen

Twelve columns, three rows. Row height is one unit, roughly 165px at desktop,
`gap: 16px`, container `max-width: 1180px` (unchanged from the current site).

```
+---------------------------+--------+--------------+
|  Intro              6x1   | CV 2x1 |              |
+---------------------------+--------+  PROJECTS    |
|                           |LinkedIn|    4x2       |
|  Tools (yellow)     6x2   |  2x1   |  black+cyan  |
|                           +--------+--------------+
|                           |  Let's Connect   6x1  |
+---------------------------+-----------------------+

row 1:  6 + 2 + 4  = 12
row 2:  6 + 2 + 4  = 12
row 3:  6 + 6      = 12
```

The tiling is exact, which is what makes it testable. A tile whose span
changes without its neighbours changing folds the grid into a fourth row, and
that failure is purely visual: nothing in the code looks wrong. A new unit test
asserts the spans sum to 12 per row. There is no existing test of this shape in
the repo to model it on; it is written from scratch.

| Tile | Span | Surface | Leads to |
|---|---|---|---|
| Intro | 6x1 | white | nowhere, no arrow |
| CV | 2x1 | white, black document glyph | `/Nur-Fajar-Resume.pdf` |
| Projects | 4x2 | black, cyan heading, white category list | `/v3/project` |
| Tools | 6x2 | yellow, nine white logo chips | `/v3/tools` |
| LinkedIn | 2x1 | LinkedIn blue, white glyph | linkedin.com, external |
| Let's Connect | 6x1 | white, blue script | `/v3/contact` |

### Responsive

- `>= 980px`: as drawn. 980px is already the tablet breakpoint in
  `app/sections.css`; reusing it avoids introducing a second one.
- `640px` to `980px`: six columns. Intro 6x1, Tools 6x2, Projects 6x2, then
  CV and LinkedIn side by side at 3x1 each, then Let's Connect 6x1.
- `< 640px`: one column, DOM order. Tiles keep their aspect ratios rather than
  their pixel heights, so the Tools tile stays roughly square instead of
  stretching into a yellow wall.

### Motion

Hover raises a tile 2px and fills its arrow button with the tile's contrast
color. Nothing else moves. `components/site/MotionProvider.tsx` already wires
`prefers-reduced-motion`; v3 mounts inside it and inherits that.

## Design tokens

Sampled from the supplied mockup, not estimated.

```
--v3-paper      #fff9f1    warm cream page background
--v3-card       #ffffff    every white tile
--v3-nav        #f5f2ed    nav pill track
--v3-ink        #000000    display type, headings          20.07:1 on paper
--v3-ink-soft   #5a5350    paragraphs                       7.20:1 on paper
--v3-ink-faint  #78706c    labels, captions                 4.63:1 on paper
--v3-yellow     #ffde59    Tools tile
--v3-cyan       #5ce1e6    "PROJECTS" heading on black     13.37:1 on black
--v3-blue       #0b66c3    LinkedIn tile, "Let's Connect!"  5.67:1 under white
```

The ratios above are measured, not estimated, following the convention
`app/globals.css` already uses. The two mid-tone inks are warm greys rather
than neutral ones, chosen to sit at exactly 7:1 and 4.6:1 against `#fff9f1`.

`--v3-blue` serves both the LinkedIn tile and the script, because sampling the
mockup showed they are the same blue. One token, not two. There is no separate
`--v3-black`: the Projects tile's surface is `--v3-ink`.

Two more checks that passed: black on the yellow tile is 15.84:1, and the blue
script on its white card is 5.67:1.

### Scoping

All tokens are defined on `.v3-root`, never on `:root`. `app/v3/layout.tsx`
wraps its children in that class. Defining them on `:root` would repaint the
live site at `/`, which shares the same document.

## Typography

Three families, replacing the Young Serif direction that an earlier draft of
this design proposed. The mockup is not serif at all.

```
Display   Archivo 800 italic     name, PROJECTS, category words
Body      Inter 400 / 500        paragraphs, labels, chips
Script    Kaushan Script 400     the words "Let's Connect!", nowhere else
```

Archivo is chosen over Montserrat because the mockup's letterforms are tighter
and more grotesque than Montserrat's geometric width. Both carry a real italic,
which matters: the display face is italic everywhere it appears, and a
browser-synthesised oblique smears at the sizes used on the Projects tile.

The script face is loaded only on the routes that use it (`/v3` and
`/v3/contact`), not from the root layout.

All three self-host through `next/font/google`, which keeps `font-src 'self'`
sufficient and adds no render-blocking request to fonts.googleapis.com. This is
the pattern the current layout already uses for its two families.

Scale:

```
Display XL   clamp(1.75rem, 3vw, 2.5rem)     Archivo 800 italic
Display L    clamp(1.5rem, 2.4vw, 2rem)      Archivo 800 italic
Body         1rem / 1.6                      Inter 400
Label, chip  0.8125rem                       Inter 500
Caption      0.75rem                         Inter 400, --v3-ink-faint
Script       clamp(2rem, 3.4vw, 2.75rem)     Kaushan Script 400
```

## Card anatomy

```
+--------------------------------+
|  padding 32px                  |
|                                |
|  Heading        Archivo italic |
|  One supporting line    Inter  |
|                                |
|         content or art         |
|                                |
|  (^)                           |   48px circle, bottom left
+--------------------------------+   whole tile is one link
```

No `box-shadow` anywhere. Tiles separate from the page by the difference
between `#ffffff` and `#fff9f1` alone. This is what makes the reference feel
quiet, and the current site's two-layer `--shadow-card` is dropped rather than
softened.

Radii: tile 32px, sub-card 20px, chip and arrow button fully round.

The arrow button inverts against its tile: black on the yellow Tools tile,
white on the black Projects tile, black on white tiles.

## Routes

Nav pill, four items, matching the mockup: `Home · About · Tools · Project`.
`/v3/contact` exists but is not in the nav; it is reached from the Let's
Connect tile and from the foot of `/v3/about`.

### `/v3` — home

The six tiles above.

### `/v3/project`

Four categories, in the order the mockup prints them on the black tile.

- **Design** — `WORK_GALLERY` entries in `event-poster` and `greeting-poster`.
- **Video** — `WORK_GALLERY` entries in `video-marketing` and `testimonial`.
  Every card links out to its original Instagram post, so each is verifiable
  on its own.
- **Course** — `WORK` (three live ai4impact courses), `BUILT` (curriculum and
  Train the Trainers), and the ADDIE tab panel driven by `content/addie.ts`.
- **Website** — one entry for now, `nurfajar.com` itself. The category is built
  as a list so entries can be appended without touching layout.

`CRM_PROJECT` does not belong to any of the four. It keeps its own card below
them, carrying its existing structural label, "Outside the Learning &
Development mandate". That label is the whole mechanism by which the ledger
separates it from L&D work, and burying it inside a category would undo that.

The ADDIE section keeps its current form: one full-width, fixed-height panel
with five browser-style tabs, restyled to v3 tokens. It is not rebuilt as a
bento, and that is deliberate. `components/site/InsideOneProgram.tsx` records
that a five-card bento was tried and dropped, because it put each phase's
content behind a dialog and five phases then meant five open-and-close cycles
to read one process that only makes sense read in order. An accordion was tried
and dropped too, because Analysis has five blocks and Evaluation has twelve, so
opening the last phase shoved half the page down.

The panel also renders its first tab from the server, so the section reads
complete before JavaScript runs. That property matters more on a bento home
screen than it did on the old page, because `/v3/project` is now a
click away rather than on the scroll path.

Restyling is limited to surface, radius, type, and color. The tab mechanics,
keyboard handling, and the fixed panel height are left as they are.

### `/v3/about`

- Bio card with role chips: Learning & Development, Instructional Design,
  Curriculum Development, ADDIE.
- Two columns: **Experience** (`WORK_HISTORY`, three roles, the current one
  badged) and **Education and background** (`BACKGROUND`, three cards with the
  logos already in `public/logos/`).
- **Leadership** (`LEADERSHIP`), visually lighter than Experience, as the
  ledger's own comment requires.
- **Skills** (`SKILLS`), three groups of chips.
- **Credentials** (`CREDENTIALS`), each row a link to its verification page.
- **Testimonials and references** (`TESTIMONIALS`, `content/references.ts`).

Credentials and references move here because the mockup's nav has no room for
them, not because their weight changed. They keep their own headings so they
still read as third-party evidence rather than as part of the bio.

### `/v3/tools`

The nine tools from the mockup, each with a line saying what it is used for:
GitHub, Canva, Notion, Miro, n8n, Claude, CapCut, OpenAI, Gemini.

The tile and the page are labelled **Tools**, never Skills. `ledger.test.ts`
forbids LLM vendor names inside `SKILLS`, and although that test is scoped to
`SKILLS` and would not fail here, the reasoning behind it holds: having used a
vendor's product is not a competence. `SKILLS` stays as it is.

Logos are added to `public/logos/` as local SVGs. The CSP admits no other
option, and it also means no third-party analytics arrive with the images.

### `/v3/contact`

`LOOKING_FOR` (roles, setup, location, availability), the Cal.com booking
embed, the Web3Forms message box, and the response-time line. All already
built and already permitted by the CSP's `frame-src` and `connect-src`.

## Ledger additions

A new `V3` block in `content/ledger.ts` holds page titles, tile labels,
category names, the tool list, and the Website entry.

It goes in `ledger.ts` specifically because four tests there iterate
`Object.entries(ledger)` and therefore sweep every export automatically:

- no em dash anywhere in exported content
- US spelling, no British variants
- the discipline written `Learning & Development`, never `Learning and
  Development` (with `CREDENTIALS` excepted, since certificate names are
  proper nouns)
- none of the seven unprovable adjectives

Copy written directly into components escapes all four. That is the reason for
the rule, not a stylistic preference.

One gap worth naming, inherited rather than introduced: `ledger.ts` re-exports
`./addie` but not `./references`, so `REFERENCES` is outside all four sweeps
today. Moving references onto `/v3/about` does not change that either way.
Closing the gap is a one-line change but it is not part of this work, because
it would put five quotes written by other people under a copy rule written for
Fajar's own prose.

## Tests

Added to `content/ledger.test.ts`:

1. Home tile spans sum to exactly 12 per row, across exactly three rows.
2. Every door tile's `href` resolves to a route that exists in `app/v3/`.
3. The Projects page's four category ids match the four words printed on the
   home tile, so the tile and the page cannot drift apart.
4. Every `WORK_GALLERY` entry lands in exactly one Projects category, so no
   gallery item is silently dropped by the fold into `/v3/project`.
5. `SKILLS` still contains no LLM vendor name, now that a `TOOLS` list
   containing three of them exists in the same file.

## Build gates

All four must pass before anything is pushed.

```
npm test
npx next build
NEXT_STATIC_EXPORT=true npx next build
visual check at 1440px, 980px, 390px
```

Both builds, every time. The repo deploys to Vercel and to GitHub Pages from
the same source, and the static target is the one that breaks quietly.

## File structure

```
app/v3/
  layout.tsx                 fonts, .v3-root wrapper, nav, metadata
  v3.css                     tokens, grid, tile
  page.tsx                   home
  project/page.tsx
  about/page.tsx
  tools/page.tsx
  contact/page.tsx

components/v3/
  Nav.tsx                    floating pill, four items
  Grid.tsx                   twelve-column bento
  Tile.tsx                   base tile plus door variant with arrow button
  tiles/
    IntroTile.tsx  CvTile.tsx  ProjectsTile.tsx
    ToolsTile.tsx  LinkedInTile.tsx  ConnectTile.tsx
  sections/                  inner-page blocks

content/ledger.ts            + V3 block
public/logos/                + nine tool SVGs
```

Nothing outside `app/v3/`, `components/v3/`, the `V3` block, and the new logo
files is modified.

## Order of work

1. Shell: tokens, fonts, `Grid`, `Tile`, nav. Home renders with empty tiles.
2. Real tiles: intro, CV, LinkedIn, Projects, Tools, Let's Connect.
3. `/v3/project`, including the restyled ADDIE tab panel.
4. `/v3/about`.
5. `/v3/tools` and `/v3/contact`.
6. Tests, both builds, responsive pass.

Step 1 is deliberately first and deliberately empty: it puts the grid on a
phone before five pages are built on top of a grid that turns out to be wrong.

## Promotion to `/`

A separate PR, after Fajar is satisfied:

1. Move `app/v3/*` to `app/`, `components/v3/*` to `components/site/`.
2. Delete the superseded page and its components.
3. Redirect `/v3/*` to `/*` so links already shared keep working. Note this
   only holds on Vercel: `output: 'export'` refuses `redirects()`, so the
   GitHub Pages build will not carry them.
4. Update `metadata`, the OG image, and the JSON-LD `Person` schema.

## Risk noted, not resolved

The mockup's intro tile reads "hi! I'm Nur Fajar" and nothing else. The current
site opens with "I run the whole cycle. Not just the training day.", which is
the strongest claim on the site and the one line that makes a reader stop.
Trading it for a greeting is a real loss, and the home screen no longer carries
any evidence at all now that the number tiles are dropped.

The cheapest repair, if Fajar wants it: keep the name as the display line and
set `HERO.sub` beneath it in Inter at body size. The tile is 6x1 and has the
room. This is recorded as a recommendation, not as part of the accepted design.
