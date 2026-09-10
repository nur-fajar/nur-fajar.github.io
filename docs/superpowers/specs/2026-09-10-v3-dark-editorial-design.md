# /v3 — Dark Editorial Scroll

Status: Draft, awaiting review
Date: 2026-09-10
Supersedes: `2026-09-09-v3-bento-home-design.md` (bento home screen, built through
Task 3 and superseded by Fajar's choice of a new reference).

## Summary

Rebuild `/v3` as a single dark, editorial, long-scrolling page in the style of
`vansh-mehta-portfolio.vercel.app`: near-black ground, a light-weight display
serif at display size with its final line in italic, an electric blue accent,
uppercase letterspaced eyebrows, and section content revealed on scroll.

This reverses the structural decision of the previous spec. `/v3` is one page
again, not a bento home screen with five inner routes. The live site at `/`
stays untouched.

## What carries over, and what is dropped

The previous pass reached Task 3 of 7. Everything is committed on
`feat/v3-bento-home`, so nothing is lost from history.

**Kept:**

- The `V3` block in `content/ledger.ts`, minus `V3_HOME_TILES`. `V3_TOOLS`,
  `V3_WEBSITES`, `V3_PROJECT_CATEGORIES`, `V3_GALLERY_CATEGORY`, and
  `V3_ROLE_CHIPS` all still describe real content and are reused as they are.
- The nine tool SVGs in `public/logos/tools/`. They move from a scattered
  yellow tile to the Technologies section.
- The discipline that all v3 copy is exported from `ledger.ts` so the four
  mechanical sweeps reach it.
- The build gates and the CSP constraints.

**Dropped:**

- `components/v3/Grid.tsx`, `Tile.tsx`, and every file under
  `components/v3/tiles/`.
- `V3_HOME_TILES` and the two tests that read it (row tiling, three rows).
- The four inner routes. `app/v3/project/`, `about/`, `tools/`, and `contact/`
  are deleted; their content returns to sections on one page.
- The warm cream palette, Archivo, and Kaushan Script.

## Non-goals

- Not replacing `app/page.tsx`. The live site keeps its aurora skin.
- Not touching `/hire-me`.
- No new dependencies. `framer-motion` is already in the tree and covers the
  scroll progress bar and the reveal.
- Not adopting the reference's section order. See below.

## Section order

The reference runs hero, about, experience, projects, achievements,
technologies, contact.

This spec does not copy that order. `app/page.tsx` carries a written argument
for the order the live site uses, and its central move is that About drops from
second place to sixth, because a reader spending their first attention on
university history has not yet seen a single artifact they can open. That
decision is about Fajar's content, not about any skin, so it survives the
reskin intact.

`/v3` therefore runs:

```
Hero            who this is, the largest claim, where, when he can start
Proof           four numbers, each carrying its method line
Work            what can be opened and judged right now
Experience      how long, where, and which role was which
Technologies    what he works with
Achievements    third-party evidence: credentials, testimonials, references
About           where it came from: study, scholarships, programs, organizations
Contact         what he is looking for, and how to reach him
```

Eight sections against the reference's seven, because Proof is a band of four
numbers the reference has no equivalent for.

## Design tokens

Sampled from the reference, with one deliberate departure.

```
--v3-page       #0f0f0f    page ground
--v3-card       #161616    cards, panels
--v3-line       #252525    hairline borders, 0.8px
--v3-ink        #f0f0f0    body and headings          16.82:1 on page
--v3-ink-soft              paragraphs                 target >= 7:1
--v3-ink-faint             captions, method lines     target >= 4.6:1
--v3-blue       #2563eb    progress bar, button fills, hero asterisk
--v3-blue-text  #60a5fa    eyebrows and small links    7.54:1 on page
                                                       7.12:1 on card
```

**Why two blues.** The reference paints its eyebrows in `#2563eb` at 10.4px.
Measured against `#0f0f0f` that is **3.71:1**, below the 4.5:1 that AA asks for
normal text, and it is the smallest text on the page. `#2563eb` stays for
things where the ratio is not the governing question: the 4px progress bar, a
filled button with white text on it (5.17:1, which passes), and the hero
asterisk. Every small blue text token uses `#60a5fa` instead.

The two mid inks get computed against `#0f0f0f` during implementation and
pinned next to their measured ratios, the way `app/globals.css` already does.

All tokens live on `.v3-root`, never on `:root`. The live site shares the
document.

## Typography

```
Display   Fraunces 300              section headings, hero name
Body      Inter 400 / 500           everything else
Mono      ui-monospace stack        tech chips, method lines
```

Fraunces at weight **300**, not bold. This is the single most distinctive
choice in the reference and the easiest to get wrong: at display size a light
high-contrast serif reads as editorial, and the same letterforms at 700 read as
a newspaper masthead.

**Heading construction.** Every section heading is two lines, and the second
line is italic:

```
Where I've          Fraunces 300 upright
worked.             Fraunces 300 italic
```

The split point is decided in the data, not left to the browser. This is the
same reasoning `HERO` already records for the live hero, where the headline is
stored as four pieces so the break lands on a phrase boundary instead of
wherever the line happens to run out.

Scale:

```
Hero name       clamp(4rem, 12vw, 11rem)     Fraunces 300, second line italic
Section heading clamp(2.25rem, 5vw, 3.75rem) Fraunces 300, second line italic
Eyebrow         0.65rem, 0.2em tracking      Inter 500, uppercase, --v3-blue-text
Lede            clamp(1rem, 1.4vw, 1.125rem) Inter 400
Body            1rem / 1.65                  Inter 400
Chip            0.75rem                      mono
Caption         0.75rem                      Inter 400, --v3-ink-faint
```

Fraunces and Inter both self-host through `next/font/google`, so `font-src
'self'` stays sufficient.

## Section furniture

Every section is built from the same three parts, so eight sections need one
component rather than eight:

```
EYEBROW                    uppercase, letterspaced, blue
Two-line heading.          Fraunces 300, second line italic
One line of lede.          Inter, --v3-ink-soft, max 62ch

[ section content ]
```

Cards: `background: #161616`, `border: 0.8px solid #252525`, `border-radius:
12px`. Note this is the opposite of the previous pass, which forbade borders
and shadows. On a near-black ground a card cannot separate itself by lightness
alone without turning grey, so the hairline does the work.

## Motion, and the floor under it

Two effects, both from `framer-motion`, which is already a dependency:

1. A 4px `#2563eb` bar fixed to the top of the viewport, scaling on the X axis
   from the left as the page scrolls.
2. Sections fading and rising into place as they enter the viewport.

**The floor:** every section must be fully legible with JavaScript disabled.
While reading the reference, scrolling produced repeated frames of entirely
blank black screen, because its content does not exist until its animation
runs. For a site whose whole argument is that a reader can verify the claims
themselves, content that is absent until a script finishes is a real cost, not
a stylistic one.

`app/layout.tsx` already ships the mechanism: a `<noscript>` block that forces
`.motion-safe` elements to full opacity. v3's reveal wrapper uses that same
class, and the no-JS check is a build gate, not an afterthought.

`MotionProvider` already wires `prefers-reduced-motion`; v3 mounts inside it.

## Content mapping

| Section | Ledger source |
|---|---|
| Hero | `HERO`, `CONTACT` |
| Proof | `PROOF`, first four cells, each with its `method` line |
| Work | `WORK`, `BUILT`, `CRM_PROJECT`, `WORK_GALLERY` grouped by `V3_GALLERY_CATEGORY`, `V3_WEBSITES`, and the ADDIE panel from `content/addie.ts` |
| Experience | `WORK_HISTORY`, then `LEADERSHIP` at lighter visual weight |
| Technologies | `V3_TOOLS` with their logos, then `SKILLS` as three chip groups |
| Achievements | `CREDENTIALS`, `TESTIMONIALS`, `REFERENCES` |
| About | `BACKGROUND`, `ORGS`, `V3_ROLE_CHIPS` |
| Contact | `LOOKING_FOR`, `MAILTO`, `CONTACT.cal`, `CONTACT.responseTime`, the Web3Forms box |

Two rules carried forward from the previous spec because they are about the
content, not the skin:

- `CRM_PROJECT` keeps its `kind` string, `Outside the Learning & Development
  mandate`, as a visible label. That label is the whole mechanism separating it
  from L&D work.
- The ADDIE section keeps its fixed-height five-tab panel. A bento and an
  accordion were both tried and dropped for reasons written in
  `components/site/InsideOneProgram.tsx`. Restyling is limited to surface,
  radius, type, and color.

## Ledger changes

- Delete `V3_HOME_TILES`, `V3Tile`, and `V3Surface`.
- Replace `V3_NAV` with in-page anchors matching the section ids.
- Replace `V3_PAGE` with `V3_SECTIONS`: for each section, an `id`, an
  `eyebrow`, a two-part `heading` (upright line and italic line), and a `lede`.
- Everything else in the `V3` block stays.

## Tests

Replacing the two bento tests, keeping the rest:

1. Every entry in `V3_SECTIONS` has a non-empty eyebrow, both heading lines,
   and an id.
2. `V3_NAV` anchors all resolve to an id present in `V3_SECTIONS`.
3. Section ids and their order match the order argued above, so a reordering is
   a deliberate edit rather than an accident.
4. Kept: gallery items each land in exactly one category; `SKILLS` carries no
   LLM vendor name; every `V3_WEBSITES` entry has an https link; role chips
   write `Learning & Development` with an ampersand.

## Build gates

```
npm test
npx next build
NEXT_STATIC_EXPORT=true npx next build
visual check at 1440px, 980px, 390px
JavaScript disabled: every section still legible
```

## Order of work

1. Tear down the bento, rebuild tokens and fonts, ship the hero alone.
2. Section furniture component, plus Proof and Experience.
3. Work, including the ADDIE panel.
4. Technologies and Achievements.
5. About and Contact.
6. Motion: progress bar and reveal, with the no-JS check.
7. Responsive and accessibility pass.

Step 1 ships the hero by itself because the hero carries the whole visual
argument: if Fraunces at 300 on `#0f0f0f` is not the feeling Fajar wants, that
is worth knowing before seven sections are built on top of it.

## Risk noted

This is the third direction in two days: devakshay's bento, Fajar's own bento
mockup, and now this. The ledger block and its tests have survived all three
because they describe content rather than appearance, which is the argument for
keeping copy out of components. The visual layer has been rebuilt each time.

---

## Amandemen, 10 September 2026: dua tema, aksen Gundam

Fajar meminta tema terang dengan warna aksen Gundam, dan memilih agar tema
gelap tetap ada di balik sebuah tombol.

**Terang jadi default, gelap jadi override.** Token terang hidup di
`.v3-root`; token gelap di `[data-v3-theme='dark'] .v3-root`. Urutan itu
disengaja: kalau skrip anti-kedip gagal jalan, yang muncul adalah tema terang
yang utuh, bukan halaman setengah gelap.

**Skrip anti-kedip menumpang yang sudah ada** di `<head>` `app/layout.tsx`,
yang selama ini hanya melayani `/hire-me`. Ia sekarang menormalkan slash
penutup lebih dulu, lalu bercabang per path. Bedanya dengan `/hire-me`: kalau
belum ada pilihan tersimpan, `/v3` mengikuti `prefers-color-scheme` sistem,
bukan langsung memilih satu tema. Logikanya diuji di enam kasus, termasuk
`/v3/` dan `/v3.html` yang muncul di build statis.

**Pembagian tugas trikolor RX-78-2**, dan ini yang menahan halaman dari
terlihat seperti situs mainan:

| Warna | Tugas | Jumlah tempat |
|---|---|---|
| Biru | semua yang struktural: eyebrow, tautan, tombol, bar progres, cincin fokus | banyak |
| Merah | asterisk hero, garis bawah nav saat disentuh | dua |
| Kuning | lingkaran panah di dalam tombol biru | satu |

**Kuning tidak pernah jadi huruf.** `#ffc400` hanya 1.49:1 di atas kertas
terang, dan itu tidak bisa diakali dengan menebalkan. Ia hanya bidang isi,
dengan tinta gelap di atasnya (11.89:1).

**Aksen diganti, bukan dipakai ulang, di tema gelap.** Biru RX-78 `#0f3a93`
cuma 1.87:1 di atas `#0f0f0f`. Tema gelap memakai `#3a68d8` untuk isian
tombol (putih di atasnya 5.06, terhadap halaman 3.79) dan `#5b8ae8` untuk
teks (5.70). Merahnya jadi `#f0666d` (6.23).

Palet lengkap dengan rasio terukurnya dipatok di komentar `app/v3/v3.css`.
Audit dijalankan di browser terhadap dua belas pasangan teks/latar di kedua
tema, termasuk panel ADDIE yang mewarisi warnanya lewat alias token: nol
pasangan di bawah 4.5:1.
