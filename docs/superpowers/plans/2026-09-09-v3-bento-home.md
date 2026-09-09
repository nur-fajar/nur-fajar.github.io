# /v3 Bento Home Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bento home screen at `/v3` whose six tiles each open their own page, styled from Fajar's supplied mockup, without touching the live site at `/`.

**Architecture:** A self-contained route group under `app/v3/` with its own layout, its own CSS token file scoped to a `.v3-root` wrapper, and its own components under `components/v3/`. The only thing shared with the live site is `content/ledger.ts`, which gains a `V3` block so that v3 copy is swept by the four mechanical copy tests that already iterate `Object.entries(ledger)`. Layout is a twelve-column CSS Grid whose spans are declared as data in the ledger, not as CSS class names, so the tiling can be unit-tested.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, plain CSS (no Tailwind on this route), `next/font/google`, `framer-motion` (already present), `@phosphor-icons/react` (already present), Vitest.

**Spec:** `docs/superpowers/specs/2026-09-09-v3-bento-home-design.md`

## Global Constraints

Every task's requirements implicitly include this section.

- **Branch:** `feat/v3-bento-home`, already created from `origin/main` at `4de6ef3`.
- **Do not modify:** `app/page.tsx`, `app/globals.css`, `app/sections.css`, `app/story.css`, `app/layout.tsx`, `app/hire-me/`, anything in `components/site/`, anything in `components/story/`, anything in `components/hire/`. If a task appears to need a change there, stop and ask.
- **No new dependencies.** `package.json` is not modified.
- **CSP:** `img-src 'self' data:`, `font-src 'self'`, `connect-src 'self' https://api.web3forms.com`, `frame-src https://cal.com https://app.cal.com`. Every image, logo, and font must be served from this origin. No `<link>` to fonts.googleapis.com, no remote SVG, no CDN.
- **Two build targets, both must pass:** `npx next build` and `NEXT_STATIC_EXPORT=true npx next build`. The second sets `output: 'export'`, which forbids `headers()`, `redirects()`, and server-side image optimization.
- **Copy rules,** enforced by `content/ledger.test.ts` sweeping `Object.entries(ledger)`. Any string added to `ledger.ts` must obey all four:
  1. No em dash (`—`) anywhere.
  2. US spelling. Not `organisation`, `programme`, `customise`.
  3. The discipline is written `Learning & Development`, never `Learning and Development`. Only `CREDENTIALS` is excepted, because certificate names are proper nouns.
  4. None of these seven words: `versatile`, `adaptable`, `transferable`, `dynamic`, `passionate`, `results-driven`, `self-motivated`.
- **Additional copy rules** from the site's own principles, not currently automated: any figure carries a line naming its scope; no adjective a number or artifact cannot prove; no causal bridge ("so", "which lets me", "that's why", "powering") between Learning & Development work and AI work.
- **Code comments are written in Indonesian.** This is the repo's convention; see any file in `components/site/`.
- **Design tokens** (measured from the mockup, do not re-derive):
  ```
  --v3-paper      #fff9f1     --v3-yellow  #ffde59
  --v3-card       #ffffff     --v3-cyan    #5ce1e6
  --v3-nav        #f5f2ed     --v3-blue    #0b66c3
  --v3-ink        #000000
  --v3-ink-soft   #5a5350     7.20:1 on paper
  --v3-ink-faint  #78706c     4.63:1 on paper
  ```
- **Radii:** tile 32px, sub-card 20px, chip and arrow button fully round. **No `box-shadow` anywhere in v3.**
- **Breakpoints:** 980px and 640px. Do not introduce others.

## File Structure

| File | Responsibility |
|---|---|
| `content/ledger.ts` | Gains a `V3` block: nav, home tiles with their grid spans, project categories, gallery-to-category map, website entries, tool list, page titles. Data only. |
| `content/ledger.test.ts` | Gains a `describe('v3 , bento home')` block. Six new tests. |
| `app/v3/v3.css` | Tokens on `.v3-root`, the grid, the tile, the nav pill, shared page furniture. The only stylesheet v3 loads. |
| `app/v3/layout.tsx` | Loads three fonts, wraps children in `.v3-root`, renders `Nav`, sets route metadata. |
| `app/v3/page.tsx` | Home. Maps `V3_HOME_TILES` onto `Grid` and `Tile`. |
| `app/v3/project/page.tsx` | Four categories plus the CRM aside. |
| `app/v3/about/page.tsx` | Bio, experience, background, leadership, skills, credentials, references. |
| `app/v3/tools/page.tsx` | The nine tools. |
| `app/v3/contact/page.tsx` | `LOOKING_FOR`, Cal.com embed, Web3Forms box. |
| `components/v3/Grid.tsx` | Twelve-column grid container. Nothing else. |
| `components/v3/Tile.tsx` | One tile. Renders as `<a>` when it has an `href`, `<div>` otherwise. Owns the arrow button. |
| `components/v3/Nav.tsx` | Floating pill nav, four items, marks the active route. |
| `components/v3/tiles/*.tsx` | One file per home tile's inner content. |
| `components/v3/sections/*.tsx` | One file per inner-page block. |
| `components/v3/ToolLogo.tsx` | Maps a tool id to its inline SVG. Keeps nine SVG paths out of the page files. |
| `public/logos/tools/*.svg` | Nine tool marks, self-hosted. |

---

### Task 1: The V3 ledger block and its tests

Data first, and fully testable before a single component exists. The grid's spans live here rather than in CSS precisely so this task can prove the tiling is correct.

**Files:**
- Modify: `content/ledger.ts` (append a new section at the end, before nothing; it is the last section)
- Modify: `content/ledger.test.ts` (append a new `describe` block at the end)

**Interfaces:**
- Consumes: `CONTACT`, `GalleryCategory`, `WORK_GALLERY`, `SKILLS` (all already exported from `content/ledger.ts`)
- Produces, for every later task:
  ```ts
  type V3Surface = 'white' | 'yellow' | 'ink' | 'blue'
  type V3Category = 'design' | 'video' | 'course' | 'website'
  interface V3Tile { id, label, span, rows, row, surface, href?, external? }
  interface V3Site { id, name, href, body, stack }
  interface V3Tool { id, name, use }
  V3_NAV: { href: string; label: string }[]
  V3_HOME_TILES: V3Tile[]
  V3_PROJECT_CATEGORIES: { id: V3Category; label: string; blurb: string }[]
  V3_GALLERY_CATEGORY: Record<GalleryCategory, V3Category>
  V3_WEBSITES: V3Site[]
  V3_TOOLS: V3Tool[]
  V3_PAGE: Record<'home'|'project'|'about'|'tools'|'contact', { title: string; lede: string }>
  V3_ROLE_CHIPS: readonly string[]
  ```

- [ ] **Step 1: Write the failing tests**

Append to `content/ledger.test.ts`. Add `V3_HOME_TILES`, `V3_PROJECT_CATEGORIES`, `V3_GALLERY_CATEGORY`, `V3_NAV`, `V3_TOOLS`, `V3_WEBSITES` to the existing named-import list at the top of the file.

```ts
describe('v3 , bento home screen', () => {
  it('setiap baris grid tertutup penuh 12 kolom, tidak lebih tidak kurang', () => {
    // Kegagalannya murni visual: satu span yang bergeser melipat grid jadi
    // baris keempat dan tidak ada satu pun baris kode yang terlihat salah.
    const rows = [1, 2, 3];
    for (const row of rows) {
      const occupying = V3_HOME_TILES.filter(
        (tile) => tile.row <= row && row < tile.row + tile.rows,
      );
      const total = occupying.reduce((sum, tile) => sum + tile.span, 0);
      expect(total, `baris ${row} berisi ${total} kolom`).toBe(12);
    }
  });

  it('grid berhenti di tiga baris', () => {
    const last = Math.max(...V3_HOME_TILES.map((tile) => tile.row + tile.rows - 1));
    expect(last).toBe(3);
  });

  it('setiap ubin-pintu internal menunjuk route yang benar-benar ada', () => {
    // Pola yang sama dipakai tes artefak di atas: keberadaan file diperiksa
    // di disk, bukan dipercaya dari string.
    const internal = V3_HOME_TILES.filter((tile) => tile.href?.startsWith('/v3'));
    expect(internal.length).toBeGreaterThan(0);
    for (const tile of internal) {
      const page = path.join(process.cwd(), 'app', tile.href!.slice(1), 'page.tsx');
      expect(existsSync(page), `${tile.href} tidak punya page.tsx`).toBe(true);
    }
  });

  it('nav dan halaman project memakai kata yang sama, jadi keduanya tidak bisa berpisah diam-diam', () => {
    const tile = V3_HOME_TILES.find((t) => t.id === 'projects');
    expect(tile?.href).toBe('/v3/project');
    expect(V3_PROJECT_CATEGORIES.map((c) => c.label)).toEqual([
      'DESIGN',
      'VIDEO',
      'COURSE',
      'WEBSITE',
    ]);
    expect(V3_NAV.map((link) => link.href)).toContain('/v3/project');
  });

  it('tidak ada satu pun item galeri yang hilang saat dilipat ke halaman project', () => {
    for (const item of WORK_GALLERY) {
      const target = V3_GALLERY_CATEGORY[item.category];
      expect(target, `${item.id} tidak punya kategori tujuan`).toBeTruthy();
      expect(V3_PROJECT_CATEGORIES.map((c) => c.id)).toContain(target);
    }
  });

  it('SKILLS tetap bersih dari nama vendor LLM meski V3_TOOLS memuat tiga', () => {
    // V3_TOOLS memang memajang Claude, OpenAI, dan Gemini, dan itu boleh:
    // kartunya berlabel Tools. Pernah memakai produk sebuah vendor bukan
    // kompetensi, jadi SKILLS tidak boleh ikut kebobolan.
    const skills = SKILLS.flatMap((group) => group.items).join(' ');
    for (const vendor of ['Claude', 'Gemini', 'OpenAI', 'GPT']) {
      expect(skills).not.toContain(vendor);
    }
    expect(V3_TOOLS.map((tool) => tool.name)).toContain('Claude');
  });

  it('setiap situs di kategori Website punya tautan yang bisa dibuka', () => {
    expect(V3_WEBSITES.length).toBeGreaterThan(0);
    for (const site of V3_WEBSITES) {
      expect(site.href, `${site.id} tidak punya href`).toMatch(/^https:\/\//);
    }
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run content/ledger.test.ts`
Expected: FAIL. The import of `V3_HOME_TILES` and friends cannot be resolved, so the file fails to collect.

- [ ] **Step 3: Write the V3 block**

Append to the end of `content/ledger.ts`.

```ts
// ─────────────────────────────────────────────────────────────────────────────
// SECTION 9 , /v3 bento home screen
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Blok ini hidup di ledger.ts, bukan di komponen, dan itu bukan soal
 * kerapian. Empat tes di ledger.test.ts berjalan dengan
 * `Object.entries(ledger)`, jadi mereka menyapu SETIAP export di file ini:
 * em dash, ejaan British, "Learning and Development", dan tujuh kata sifat
 * tanpa bukti. Copy yang ditulis langsung di komponen lolos keempatnya.
 */

export type V3Surface = 'white' | 'yellow' | 'ink' | 'blue';

export interface V3Tile {
  id: string;
  /** Teks yang dibaca screen reader untuk ubin ini. Isi visualnya diurus
   *  komponen per-ubin; label inilah yang jadi accessible name-nya. */
  label: string;
  /** Lebar dalam kolom, 1 sampai 12. */
  span: number;
  /** Baris awal, 1-indexed. */
  row: number;
  /** Berapa baris yang ditempati. */
  rows: number;
  surface: V3Surface;
  /** Ada href berarti ubin ini pintu, dan pintu selalu dapat tombol panah.
   *  Ubin tanpa href tidak pernah dapat panah, jadi pembaca tidak pernah
   *  mengarahkan kursor ke sesuatu yang tidak kemana-mana. */
  href?: string;
  external?: boolean;
}

/**
 * Enam ubin, tiga baris, dua belas kolom, nol sel sisa.
 *
 * Span-nya data, bukan nama kelas CSS, supaya tiling-nya bisa diuji. Satu
 * span yang bergeser melipat grid jadi baris keempat, dan kegagalan itu cuma
 * kelihatan di layar; di kode tidak ada yang terlihat salah.
 */
export const V3_HOME_TILES: V3Tile[] = [
  { id: 'intro', label: "hi! I'm Nur Fajar", span: 6, row: 1, rows: 1, surface: 'white' },
  { id: 'cv', label: 'Download my CV', span: 2, row: 1, rows: 1, surface: 'white', href: CONTACT.cv },
  { id: 'projects', label: 'Projects', span: 4, row: 1, rows: 2, surface: 'ink', href: '/v3/project' },
  { id: 'tools', label: 'Tools I work with', span: 6, row: 2, rows: 2, surface: 'yellow', href: '/v3/tools' },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    span: 2,
    row: 2,
    rows: 1,
    surface: 'blue',
    href: CONTACT.linkedin,
    external: true,
  },
  { id: 'connect', label: "Let's Connect", span: 6, row: 3, rows: 1, surface: 'white', href: '/v3/contact' },
];

export const V3_NAV = [
  { href: '/v3', label: 'Home' },
  { href: '/v3/about', label: 'About' },
  { href: '/v3/tools', label: 'Tools' },
  { href: '/v3/project', label: 'Project' },
] as const;

export type V3Category = 'design' | 'video' | 'course' | 'website';

/** Urutannya sama persis dengan urutan kata yang tercetak di ubin hitam di
 *  home. Sebuah tes mengunci keduanya, jadi mengubah satu tanpa yang lain
 *  akan gagal alih-alih diam-diam berbeda. */
export const V3_PROJECT_CATEGORIES: { id: V3Category; label: string; blurb: string }[] = [
  { id: 'design', label: 'DESIGN', blurb: 'Program posters and event assets, each one linked to where it was published.' },
  { id: 'video', label: 'VIDEO', blurb: 'Program videos and alumni interviews, each one linked to where it was published.' },
  { id: 'course', label: 'COURSE', blurb: 'Three courses anyone can open, the curriculum behind them, and the working method of one program from needs assessment to evaluation.' },
  { id: 'website', label: 'WEBSITE', blurb: 'Sites built and shipped.' },
];

/** Empat kategori galeri dilipat ke dua kategori project. Sebuah tes
 *  memastikan tidak ada item yang jatuh ke luar peta ini. */
export const V3_GALLERY_CATEGORY: Record<GalleryCategory, V3Category> = {
  'event-poster': 'design',
  'greeting-poster': 'design',
  'video-marketing': 'video',
  testimonial: 'video',
};

export interface V3Site {
  id: string;
  name: string;
  href: string;
  body: string;
  stack: string[];
}

/** Satu entri untuk sekarang, sengaja disusun sebagai list supaya entri
 *  berikutnya cuma menambah baris, bukan mengubah layout. */
export const V3_WEBSITES: V3Site[] = [
  {
    id: 'nurfajar-com',
    name: 'nurfajar.com',
    href: 'https://nurfajar.com',
    body:
      'This site. It deploys twice from one source: a Next.js app on Vercel, and a static export mirrored to GitHub Pages. Every number and every line of copy lives in a single file, and a test suite holds the copy rules in place so they cannot drift one harmless edit at a time.',
    stack: ['Next.js', 'TypeScript', 'Vercel', 'GitHub Pages'],
  },
];

export interface V3Tool {
  id: string;
  name: string;
  /** Satu baris yang menerangkan APA tool-nya, bukan klaim tentang apa yang
   *  dicapai dengannya. Perbedaan itu penting: yang kedua adalah klaim yang
   *  tidak bisa dibuktikan artefak, dan aturan situs melarangnya. */
  use: string;
}

export const V3_TOOLS: V3Tool[] = [
  { id: 'github', name: 'GitHub', use: 'Version control and code hosting.' },
  { id: 'canva', name: 'Canva', use: 'Poster and social asset design.' },
  { id: 'notion', name: 'Notion', use: 'Notes, outlines, and course planning documents.' },
  { id: 'miro', name: 'Miro', use: 'Whiteboarding and session mapping.' },
  { id: 'n8n', name: 'n8n', use: 'Workflow automation.' },
  { id: 'claude', name: 'Claude', use: 'Large language model.' },
  { id: 'capcut', name: 'CapCut', use: 'Video editing.' },
  { id: 'openai', name: 'OpenAI', use: 'Large language model.' },
  { id: 'gemini', name: 'Gemini', use: 'Large language model.' },
];

/** Chip peran di kepala /v3/about. Ditulis di sini, bukan di komponennya,
 *  supaya keempat sapuan copy ikut membacanya. Perhatikan yang pertama:
 *  "Learning & Development", bukan "Learning and Development", dan ada tes
 *  yang gagal kalau tertukar. */
export const V3_ROLE_CHIPS = [
  'Learning & Development',
  'Instructional Design',
  'Curriculum Development',
  'ADDIE',
] as const;

export const V3_PAGE = {
  home: { title: 'Home', lede: '' },
  project: {
    title: 'Project',
    lede: 'Four kinds of work. Everything below links to where it lives, so none of it has to be taken on trust.',
  },
  about: {
    title: 'About',
    lede: 'Where the work came from: three roles, the education behind them, and the third-party evidence for both.',
  },
  tools: {
    title: 'Tools',
    lede: 'What I work with day to day.',
  },
  contact: {
    title: 'Contact',
    lede: 'What I am looking for, and four ways to reach me.',
  },
} as const;
```

- [ ] **Step 4: Run the tests**

Run: `npx vitest run content/ledger.test.ts`
Expected: all pass except `setiap ubin-pintu internal menunjuk route yang benar-benar ada`, which fails because `app/v3/project/page.tsx` does not exist yet.

- [ ] **Step 5: Create route placeholders so the route test passes**

Create five files. Each is a placeholder that Tasks 2 to 6 replace. They exist now so the route test is meaningful from this task onward rather than being written and left red.

```tsx
// app/v3/page.tsx  (and project/, about/, tools/, contact/ with their own names)
export default function V3HomePage() {
  return <main>v3</main>;
}
```

- [ ] **Step 6: Run the full suite**

Run: `npm test`
Expected: PASS, all tests including the 55 pre-existing ones.

- [ ] **Step 7: Commit**

```bash
git add content/ledger.ts content/ledger.test.ts app/v3
git commit -m "Tambah blok V3 di ledger beserta tujuh tes bento home"
```

---

### Task 2: The v3 shell

Tokens, fonts, grid, tile, nav. The home page renders six correctly sized but empty tiles. This ships before any tile content deliberately: it puts the grid on a phone before five pages get built on top of a grid that turns out to be wrong.

**Files:**
- Create: `app/v3/v3.css`, `app/v3/layout.tsx`, `components/v3/Grid.tsx`, `components/v3/Tile.tsx`, `components/v3/Nav.tsx`
- Modify: `app/v3/page.tsx`

**Interfaces:**
- Consumes: `V3_HOME_TILES`, `V3_NAV`, `V3_PAGE` from Task 1
- Produces:
  ```tsx
  Grid({ children }: { children: React.ReactNode }): JSX.Element
  Tile(props: { tile: V3Tile; children: React.ReactNode }): JSX.Element
  Nav(): JSX.Element   // 'use client', uses usePathname()
  ```

- [ ] **Step 1: Write `app/v3/v3.css`**

```css
/* Token v3 duduk di .v3-root, TIDAK di :root.
   Situs lama masih live di / dan berbagi dokumen yang sama; menaruh token
   ini di :root akan mengecat ulang halaman itu. */
.v3-root {
  --v3-paper: #fff9f1;
  --v3-card: #ffffff;
  --v3-nav: #f5f2ed;

  /* Ketiga tingkat tinta diukur terhadap --v3-paper, bukan dipilih:
       --v3-ink        20.07:1   judul, angka
       --v3-ink-soft    7.20:1   paragraf
       --v3-ink-faint   4.63:1   label, caption
     Keduanya abu HANGAT. Abu netral terlihat kebiruan di atas krem. */
  --v3-ink: #000000;
  --v3-ink-soft: #5a5350;
  --v3-ink-faint: #78706c;

  --v3-yellow: #ffde59;
  --v3-cyan: #5ce1e6;
  --v3-blue: #0b66c3;

  --v3-r-tile: 32px;
  --v3-r-card: 20px;
  --v3-gap: 16px;
  --v3-maxw: 1180px;
  --v3-gutter: clamp(1rem, 4vw, 2rem);
  --v3-unit: 165px;

  background: var(--v3-paper);
  color: var(--v3-ink);
  font-family: var(--font-v3-body), ui-sans-serif, system-ui, sans-serif;
  min-height: 100vh;
}

.v3-root h1,
.v3-root h2,
.v3-root h3 {
  font-family: var(--font-v3-display), ui-sans-serif, system-ui, sans-serif;
  font-weight: 800;
  font-style: italic;
  letter-spacing: -0.01em;
  margin: 0;
}

.v3-shell {
  max-width: var(--v3-maxw);
  margin: 0 auto;
  padding: 0 var(--v3-gutter) 4rem;
}

/* ── Grid ─────────────────────────────────────────────────────────────── */

.v3-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: var(--v3-unit);
  gap: var(--v3-gap);
}

/* ── Tile ─────────────────────────────────────────────────────────────── */

/* Nol box-shadow, di mana pun. Kartu terpisah dari halaman lewat beda
   #ffffff dengan #fff9f1 saja, dan itulah yang membuat referensinya
   terasa tenang. */
.v3-tile {
  position: relative;
  border-radius: var(--v3-r-tile);
  padding: 32px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-decoration: none;
  color: inherit;
  transition: transform 160ms ease;
}

.v3-tile--white { background: var(--v3-card); }
.v3-tile--yellow { background: var(--v3-yellow); }
.v3-tile--ink { background: var(--v3-ink); color: #ffffff; }
.v3-tile--blue { background: var(--v3-blue); color: #ffffff; }

a.v3-tile:hover { transform: translateY(-2px); }

a.v3-tile:focus-visible {
  outline: 3px solid var(--v3-blue);
  outline-offset: 3px;
}

.v3-tile__go {
  position: absolute;
  left: 32px;
  bottom: 32px;
  width: 48px;
  height: 48px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: var(--v3-ink);
  color: #ffffff;
}

/* Panah membalik terhadap ubinnya: putih di atas hitam, hitam di atas
   sisanya. */
.v3-tile--ink .v3-tile__go {
  background: #ffffff;
  color: var(--v3-ink);
}

/* ── Nav ──────────────────────────────────────────────────────────────── */

.v3-nav {
  display: flex;
  justify-content: center;
  padding: 24px var(--v3-gutter);
}

.v3-nav__track {
  display: flex;
  gap: 4px;
  background: var(--v3-nav);
  border-radius: 999px;
  padding: 6px;
}

.v3-nav__link {
  padding: 10px 22px;
  border-radius: 999px;
  text-decoration: none;
  color: var(--v3-ink-soft);
  font-size: 0.9375rem;
  font-weight: 500;
}

.v3-nav__link[aria-current='page'] {
  background: var(--v3-card);
  color: var(--v3-ink);
}

/* ── Responsive ───────────────────────────────────────────────────────── */

/* 980px sudah jadi breakpoint tablet di app/sections.css. Dipakai ulang
   supaya situs ini tidak punya dua breakpoint yang berbeda tipis. */
@media (max-width: 980px) {
  .v3-grid { grid-template-columns: repeat(6, 1fr); }
}

@media (max-width: 640px) {
  .v3-root { --v3-unit: 150px; }
  .v3-grid { grid-template-columns: 1fr; }
  .v3-tile { padding: 24px; }
  .v3-tile__go { left: 24px; bottom: 24px; }
}

@media (prefers-reduced-motion: reduce) {
  .v3-tile { transition: none; }
  a.v3-tile:hover { transform: none; }
}
```

- [ ] **Step 2: Write `app/v3/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import { Archivo, Inter, Kaushan_Script } from 'next/font/google';
import Nav from '@/components/v3/Nav';
import './v3.css';

/* Tiga keluarga, semuanya di-self-host lewat next/font supaya
   `font-src 'self'` di CSP tetap cukup dan tidak ada request
   render-blocking ke fonts.googleapis.com. */

// Display. Italic-nya italic sungguhan, bukan miring bikinan browser:
// di ukuran sebesar "PROJECTS" oblique sintetis terlihat meleot.
const archivo = Archivo({
  subsets: ['latin'],
  weight: ['800'],
  style: ['italic'],
  variable: '--font-v3-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-v3-body',
  display: 'swap',
});

// Dipakai persis di dua tempat: ubin "Let's Connect!" dan kepala /v3/contact.
const kaushan = Kaushan_Script({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-v3-script',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nur Fajar',
};

export default function V3Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`v3-root ${archivo.variable} ${inter.variable} ${kaushan.variable}`}>
      <a className="skip-link" href="#v3-main">
        Skip to content
      </a>
      <Nav />
      <main id="v3-main" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Write `components/v3/Grid.tsx` and `components/v3/Tile.tsx`**

```tsx
// components/v3/Grid.tsx
export default function Grid({ children }: { children: React.ReactNode }) {
  return <div className="v3-grid">{children}</div>;
}
```

```tsx
// components/v3/Tile.tsx
import Link from 'next/link';
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import type { V3Tile } from '@/content/ledger';

/**
 * Satu ubin bento.
 *
 * Ubin yang punya href dirender sebagai anchor dan mendapat tombol panah;
 * yang tidak punya dirender sebagai div dan tidak pernah dapat panah.
 * Perbedaan itu bukan dekorasi: ia memberi tahu pembaca mana yang bisa
 * dibuka tanpa perlu satu kalimat pun untuk menjelaskannya.
 *
 * Span-nya ditulis sebagai inline style, bukan kelas utility, karena
 * angkanya datang dari V3_HOME_TILES di ledger dan di sanalah tes
 * tiling-nya membaca. Satu sumber, bukan dua yang harus dijaga sinkron.
 */
export default function Tile({ tile, children }: { tile: V3Tile; children: React.ReactNode }) {
  const className = `v3-tile v3-tile--${tile.surface}`;
  const style = {
    gridColumn: `span ${tile.span}`,
    gridRow: `span ${tile.rows}`,
  } as React.CSSProperties;

  const arrow = (
    <span className="v3-tile__go" aria-hidden="true">
      <ArrowUpRight size={22} weight="bold" />
    </span>
  );

  if (!tile.href) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  if (tile.external || tile.href.endsWith('.pdf')) {
    return (
      <a
        className={className}
        style={style}
        href={tile.href}
        aria-label={tile.label}
        {...(tile.external ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        {children}
        {arrow}
      </a>
    );
  }

  return (
    <Link className={className} style={style} href={tile.href} aria-label={tile.label}>
      {children}
      {arrow}
    </Link>
  );
}
```

- [ ] **Step 4: Write `components/v3/Nav.tsx`**

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { V3_NAV } from '@/content/ledger';

/**
 * Pil melayang di tengah atas, empat item.
 *
 * Item aktif ditandai lewat aria-current, dan CSS yang mengecatnya membaca
 * atribut itu, bukan kelas terpisah. Satu sumber kebenaran, dan penanda
 * visualnya otomatis ikut terbaca screen reader.
 *
 * Path dibandingkan persis untuk /v3 dan dengan awalan untuk sisanya,
 * kalau tidak /v3 akan ikut menyala di setiap halaman anaknya. Static
 * export menyajikan halaman yang sama di /v3/about/ (dengan slash), jadi
 * slash penutup dilucuti dulu.
 */
export default function Nav() {
  const pathname = (usePathname() ?? '/v3').replace(/\/$/, '') || '/v3';

  return (
    <nav className="v3-nav" aria-label="Main">
      <div className="v3-nav__track">
        {V3_NAV.map((link) => {
          const active = link.href === '/v3' ? pathname === '/v3' : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              className="v3-nav__link"
              href={link.href}
              {...(active ? { 'aria-current': 'page' as const } : {})}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

- [ ] **Step 5: Wire the home page to render empty tiles**

```tsx
// app/v3/page.tsx
import Grid from '@/components/v3/Grid';
import Tile from '@/components/v3/Tile';
import { V3_HOME_TILES } from '@/content/ledger';

export default function V3HomePage() {
  return (
    <div className="v3-shell">
      <Grid>
        {V3_HOME_TILES.map((tile) => (
          <Tile key={tile.id} tile={tile}>
            <span>{tile.label}</span>
          </Tile>
        ))}
      </Grid>
    </div>
  );
}
```

- [ ] **Step 6: Look at it**

Run: `npm run dev`, open `http://localhost:3000/v3`.

Check, at 1440px, 980px, and 390px browser widths:
- three rows at desktop, no fourth row, no gap in the bottom right
- the Projects tile is two units tall and sits to the right of Intro and CV
- the Tools tile is two units tall and sits under Intro
- nav pill is centered, Home is the white pill
- background is warm cream, tiles are white, nothing casts a shadow
- the live site at `http://localhost:3000/` is completely unchanged

One thing to watch: the root layout imports `app/globals.css` for every route,
so the live site's `--paper: #f7f8fb` still paints `body` underneath `/v3`.
`.v3-root` covers it via `min-height: 100vh` plus its own background, but check
for a cool-grey sliver when the page is short or over-scrolled. If one appears,
the fix belongs in `v3.css`, never by editing `globals.css`.

- [ ] **Step 7: Run all four gates**

```bash
npm test
npx next build
NEXT_STATIC_EXPORT=true npx next build
```
Expected: all pass. If the static export complains about `usePathname`, the Nav is missing its `'use client'` directive.

- [ ] **Step 8: Commit**

```bash
git add app/v3 components/v3
git commit -m "Rangka /v3: token, tiga font, grid 12 kolom, ubin, nav pil"
```

---

### Task 3: Home tile content and the nine tool logos

**Files:**
- Create: `components/v3/tiles/IntroTile.tsx`, `CvTile.tsx`, `ProjectsTile.tsx`, `ToolsTile.tsx`, `LinkedInTile.tsx`, `ConnectTile.tsx`
- Create: `components/v3/ToolLogo.tsx`
- Create: `public/logos/tools/{github,canva,notion,miro,n8n,claude,capcut,openai,gemini}.svg`
- Modify: `app/v3/page.tsx`, `app/v3/v3.css`

**Interfaces:**
- Consumes: `V3_HOME_TILES`, `V3_TOOLS`, `V3_PROJECT_CATEGORIES` from Task 1
- Produces:
  ```tsx
  ToolLogo({ id, name }: { id: string; name: string }): JSX.Element
  ```
  plus one default-exported, prop-less component per tile file:
  `IntroTile`, `CvTile`, `ProjectsTile`, `ToolsTile`, `LinkedInTile`, `ConnectTile`

- [ ] **Step 1: Add the nine logo files**

Each is a single-color mark on a transparent background, `viewBox="0 0 24 24"`, drawn to sit inside a 64px white circle. Source them as simple path data; do not fetch them at runtime and do not link to a CDN. The CSP forbids both.

Name them exactly by tool `id` so `ToolLogo` can resolve `` `/logos/tools/${id}.svg` `` without a lookup table.

- [ ] **Step 2: Write `ToolLogo.tsx`**

```tsx
import Image from 'next/image';

/** Logo dipakai sebagai <img>, bukan di-inline, supaya sembilan blok path
 *  SVG tidak ikut masuk ke HTML tiap halaman yang memuat ubin Tools. */
export default function ToolLogo({ id, name }: { id: string; name: string }) {
  return (
    <span className="v3-tool-chip">
      <Image src={`/logos/tools/${id}.svg`} alt={name} width={32} height={32} />
    </span>
  );
}
```

Note for the implementer: the GitHub Pages build sets `images: { unoptimized: true }`, so these render as plain `<img>` there. Both paths are fine for SVG.

- [ ] **Step 3: Write the six tile components**

```tsx
// components/v3/tiles/IntroTile.tsx
export default function IntroTile() {
  return (
    <p className="v3-intro">
      hi! I&apos;m <span className="v3-intro__name">Nur Fajar</span>
    </p>
  );
}
```

```tsx
// components/v3/tiles/CvTile.tsx
import { ReadCvLogo } from '@phosphor-icons/react/dist/ssr';

export default function CvTile() {
  return (
    <span className="v3-cv" aria-hidden="true">
      <ReadCvLogo size={64} weight="duotone" />
    </span>
  );
}
```

```tsx
// components/v3/tiles/ProjectsTile.tsx
import { V3_PROJECT_CATEGORIES } from '@/content/ledger';

/* Empat kata di ubin ini dan empat kategori di /v3/project berasal dari
   array yang sama, dan sebuah tes mengunci urutannya. Mengetik ulang
   keempatnya di sini akan membuat ubin dan halamannya bisa berpisah
   diam-diam. */
export default function ProjectsTile() {
  return (
    <div className="v3-projects">
      <p className="v3-projects__head">PROJECTS</p>
      <ul className="v3-projects__list">
        {V3_PROJECT_CATEGORIES.map((category) => (
          <li key={category.id}>{category.label}</li>
        ))}
      </ul>
    </div>
  );
}
```

```tsx
// components/v3/tiles/ToolsTile.tsx
import ToolLogo from '../ToolLogo';
import { V3_TOOLS } from '@/content/ledger';

/* Posisi kesembilan chip ditulis tetap, bukan diacak. Penempatan acak akan
   berbeda antara render server dan client dan memicu hydration mismatch,
   dan di build statis ia membeku pada satu susunan hasil undian saat build. */
const SPOTS = [
  { top: '38%', left: '6%' },
  { top: '18%', left: '24%' },
  { top: '10%', left: '46%' },
  { top: '14%', left: '70%' },
  { top: '46%', left: '30%' },
  { top: '42%', left: '58%' },
  { top: '70%', left: '14%' },
  { top: '76%', left: '44%' },
  { top: '72%', left: '68%' },
];

export default function ToolsTile() {
  return (
    <div className="v3-tools" aria-hidden="true">
      {V3_TOOLS.map((tool, index) => (
        <span className="v3-tools__spot" key={tool.id} style={SPOTS[index]}>
          <ToolLogo id={tool.id} name={tool.name} />
        </span>
      ))}
    </div>
  );
}
```

Note: the tile is marked `aria-hidden` because the `Tile` wrapper already carries `aria-label="Tools I work with"` from `V3_HOME_TILES`. Without it, a screen reader reads nine logo names before the link's own name.

```tsx
// components/v3/tiles/LinkedInTile.tsx
import { LinkedinLogo } from '@phosphor-icons/react/dist/ssr';

export default function LinkedInTile() {
  return (
    <span className="v3-linkedin" aria-hidden="true">
      <LinkedinLogo size={56} weight="fill" />
    </span>
  );
}
```

```tsx
// components/v3/tiles/ConnectTile.tsx
export default function ConnectTile() {
  return <p className="v3-connect">Let&apos;s Connect!</p>;
}
```

Add to `app/v3/v3.css`:

```css
.v3-intro {
  margin: 0;
  text-align: center;
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 500;
}

.v3-intro__name {
  font-family: var(--font-v3-display), ui-sans-serif, system-ui, sans-serif;
  font-weight: 800;
  font-style: italic;
}

.v3-cv,
.v3-linkedin { display: grid; place-items: center; }

.v3-projects { align-self: start; }

.v3-projects__head {
  margin: 0 0 0.5em;
  color: var(--v3-cyan);
  font-family: var(--font-v3-display), ui-sans-serif, system-ui, sans-serif;
  font-weight: 800;
  font-style: italic;
  font-size: clamp(1.5rem, 2.4vw, 2rem);
}

.v3-projects__list {
  list-style: none;
  margin: 0;
  padding: 0;
  font-family: var(--font-v3-display), ui-sans-serif, system-ui, sans-serif;
  font-weight: 800;
  font-style: italic;
  font-size: clamp(1.25rem, 2vw, 1.75rem);
  line-height: 1.35;
}

.v3-tools { position: absolute; inset: 0; }

.v3-tools__spot { position: absolute; }

.v3-tool-chip {
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  border-radius: 999px;
  background: var(--v3-card);
}

.v3-connect {
  margin: 0;
  text-align: center;
  font-family: var(--font-v3-script), cursive;
  font-size: clamp(2rem, 3.4vw, 2.75rem);
  color: var(--v3-blue);
  line-height: 1.2;
}
```

- [ ] **Step 4: Map tile id to component in `app/v3/page.tsx`**

```tsx
const TILE_CONTENT: Record<string, React.ComponentType> = {
  intro: IntroTile,
  cv: CvTile,
  projects: ProjectsTile,
  tools: ToolsTile,
  linkedin: LinkedInTile,
  connect: ConnectTile,
};

export default function V3HomePage() {
  return (
    <div className="v3-shell">
      <Grid>
        {V3_HOME_TILES.map((tile) => {
          const Content = TILE_CONTENT[tile.id];
          return (
            <Tile key={tile.id} tile={tile}>
              <Content />
            </Tile>
          );
        })}
      </Grid>
    </div>
  );
}
```

- [ ] **Step 5: Compare against the mockup**

Open `D:\Claude\bento home.jpg` beside `http://localhost:3000/v3` at 1440px. Check tile proportions, the cyan heading, the yellow field, the arrow button positions and their inverted colors.

- [ ] **Step 6: Run all four gates, then commit**

```bash
npm test && npx next build && NEXT_STATIC_EXPORT=true npx next build
git add app/v3 components/v3 public/logos/tools
git commit -m "Isi enam ubin home v3 dan sembilan logo tool"
```

---

### Task 4: `/v3/project`

**Files:**
- Modify: `app/v3/project/page.tsx`, `app/v3/v3.css`
- Create: `components/v3/sections/CategorySection.tsx`, `CourseSection.tsx`, `GalleryGrid.tsx`, `WebsiteList.tsx`, `CrmAside.tsx`, `AddiePanel.tsx`

**Interfaces:**
- Consumes: `V3_PROJECT_CATEGORIES`, `V3_GALLERY_CATEGORY`, `V3_WEBSITES`, `WORK`, `BUILT`, `CRM_PROJECT`, `WORK_GALLERY`, `ADDIE_PHASES`, `ADDIE_SECTION`, `V3_PAGE`

- [ ] **Step 1: Build the four category sections in the order `V3_PROJECT_CATEGORIES` declares**

- **Design** and **Video**: `GalleryGrid`, filtering `WORK_GALLERY` through `V3_GALLERY_CATEGORY`. Each item is a card with its thumbnail from `/work-gallery/<id>.jpg` linking out to `item.href`. Every thumbnail needs `sizes` matching the real breakpoints, `760px` and `980px`, not the `1180px` that `--v3-maxw` suggests.
- **Course**: `WORK`'s three ai4impact courses as outbound cards, then `BUILT`'s two cards with their `metrics` as chips.
- **Website**: `V3_WEBSITES` as a list, one card per entry, `stack` rendered as chips.

- [ ] **Step 2: Port the ADDIE panel**

Copy `components/site/InsideOneProgram.tsx` to `components/v3/sections/AddiePanel.tsx` and restyle it to v3 tokens.

**Change only:** background, radius, type, color, spacing, class name prefixes.

**Do not change:** the tab mechanics, the roving-tabindex keyboard handling, the fixed panel height, or the fact that the first tab renders from the server. A five-card bento and an accordion were both tried and dropped for reasons written in that file's header comment; read it before touching anything structural.

- [ ] **Step 3: Add the CRM aside below the four categories**

`CrmAside` renders `CRM_PROJECT` carrying its `kind` string, `Outside the Learning & Development mandate`, as a visible label. That label is the entire mechanism separating it from L&D work. It does not go inside a category and its label is not softened or dropped.

- [ ] **Step 4: Verify no gallery item was lost**

Run: `npm test`
The test `tidak ada satu pun item galeri yang hilang saat dilipat ke halaman project` from Task 1 covers this. Then count the rendered cards in the browser against `WORK_GALLERY.length`.

- [ ] **Step 5: Run all four gates, then commit**

```bash
npm test && npx next build && NEXT_STATIC_EXPORT=true npx next build
git add app/v3/project components/v3/sections app/v3/v3.css
git commit -m "Halaman /v3/project: empat kategori, panel ADDIE, kartu CRM"
```

---

### Task 5: `/v3/about`

**Files:**
- Modify: `app/v3/about/page.tsx`, `app/v3/v3.css`
- Create: `components/v3/sections/BioCard.tsx`, `ExperienceList.tsx`, `BackgroundList.tsx`, `LeadershipList.tsx`, `SkillsCard.tsx`, `CredentialsList.tsx`, `ReferencesList.tsx`

**Interfaces:**
- Consumes: `WORK_HISTORY`, `LEADERSHIP`, `BACKGROUND`, `SKILLS`, `CREDENTIALS`, `TESTIMONIALS`, `V3_PAGE`, and `REFERENCES` from `@/content/references`

- [ ] **Step 1: Bio card with role chips**

`BioCard` renders `V3_PAGE.about.lede` followed by `V3_ROLE_CHIPS`, both defined in Task 1. Do not retype the chip strings into the component: they live in the ledger so the four copy sweeps reach them, and the first one is `Learning & Development`, which a test enforces.

- [ ] **Step 2: Two columns, Experience and Background**

`ExperienceList` renders `WORK_HISTORY`'s three roles as sub-cards at `--v3-r-card`. The first carries a `Current` badge. Dates come from `lib/dates.ts`, which already formats the en-dash range; do not format them by hand, and never substitute an em dash.

`BackgroundList` renders `BACKGROUND`'s three cards with their `logos` arrays from `public/logos/`. Respect each logo's optional `scale`.

- [ ] **Step 3: Leadership, visually lighter than Experience**

`LEADERSHIP` is organizational leadership, not paid work history. The ledger's own comment requires it read as lighter than Experience. Smaller type, no badges, no logo row.

- [ ] **Step 4: Skills, Credentials, References**

`SKILLS` as three labelled chip groups. `CREDENTIALS` as rows, each entire row an outbound link to its verification URL. `TESTIMONIALS` and `REFERENCES` under their own headings, so they still read as third-party evidence and not as part of the bio.

- [ ] **Step 5: Run all four gates, then commit**

```bash
npm test && npx next build && NEXT_STATIC_EXPORT=true npx next build
git add app/v3/about components/v3/sections content/ledger.ts app/v3/v3.css
git commit -m "Halaman /v3/about: bio, riwayat, latar, skill, kredensial, referensi"
```

---

### Task 6: `/v3/tools` and `/v3/contact`

**Files:**
- Modify: `app/v3/tools/page.tsx`, `app/v3/contact/page.tsx`, `app/v3/v3.css`
- Create: `components/v3/sections/ToolList.tsx`, `LookingFor.tsx`, `ContactActions.tsx`

**Interfaces:**
- Consumes: `V3_TOOLS`, `LOOKING_FOR`, `CONTACT`, `MAILTO`, `V3_PAGE`

- [ ] **Step 1: `/v3/tools`**

`V3_TOOLS` as nine cards, each with its logo, name, and `use` line. The page heading is `Tools`, never `Skills`. `SKILLS` in the ledger is not modified by this task.

- [ ] **Step 2: `/v3/contact`**

`LOOKING_FOR`'s four rows as a definition list. The `Setup` row has a `reveal` object whose city list must be reachable by keyboard focus and readable by a screen reader at all times, not only on hover. Copy that behavior from `components/site/Contact.tsx` rather than reinventing it.

Then the Cal.com iframe (`CONTACT.cal`), the Web3Forms message box, the `MAILTO` link, and `CONTACT.responseTime`. Both the iframe and the form post are already permitted by the CSP's `frame-src` and `connect-src`; do not add new origins.

- [ ] **Step 3: Confirm the Web3Forms access key is not hardcoded into a new file**

Read how `components/site/Contact.tsx` supplies it today and use the same mechanism. Do not paste a key into a new component.

- [ ] **Step 4: Run all four gates, then commit**

```bash
npm test && npx next build && NEXT_STATIC_EXPORT=true npx next build
git add app/v3 components/v3 app/v3/v3.css
git commit -m "Halaman /v3/tools dan /v3/contact"
```

---

### Task 7: Responsive and accessibility pass

**Files:**
- Modify: `app/v3/v3.css` only, unless a real defect requires otherwise

- [ ] **Step 1: Walk all five routes at 1440px, 980px, and 390px**

At 980px the grid is six columns. Confirm Intro 6x1, Tools 6x2, Projects 6x2, CV and LinkedIn at 3x1 side by side, Let's Connect 6x1. At 390px it is one column and the Tools tile is roughly square rather than a tall yellow wall.

Nothing may scroll horizontally at any width.

- [ ] **Step 2: Keyboard only**

Tab through the home screen. Every door tile takes focus and shows the 3px focus ring. The skip link works. On `/v3/contact`, the city list under `Setup` is reachable without a mouse.

- [ ] **Step 3: Reduced motion**

Enable the OS reduced-motion setting. No tile lifts on hover.

- [ ] **Step 4: No JavaScript**

Disable JS and load `/v3/project`. The ADDIE panel must still show its first tab, because that tab renders from the server.

- [ ] **Step 5: Run all four gates, then commit and open the PR**

```bash
npm test && npx next build && NEXT_STATIC_EXPORT=true npx next build
git add app/v3/v3.css
git commit -m "Pass responsif dan aksesibilitas untuk /v3"
git push -u origin feat/v3-bento-home
```

---

## Notes for the reviewer

Three things worth a second look, none of them blocking:

1. **The nine `use` lines in `V3_TOOLS`** describe what each tool is, not what Fajar achieved with it. That is deliberate: the second kind of sentence is a claim no artifact can prove, and the site's rules forbid it. Fajar should still read those nine lines before merge.
2. **`REFERENCES` sits outside the four copy sweeps** because `ledger.ts` re-exports `./addie` but not `./references`. That is the state today, not something this work introduces. Closing it is a one-line change, deliberately left out of scope.
3. **The home screen carries no evidence at all.** The number tiles were dropped by decision, and the intro tile is a greeting rather than the site's strongest claim. The spec records the cheapest repair, setting `HERO.sub` under the name, as a recommendation that was not adopted.
