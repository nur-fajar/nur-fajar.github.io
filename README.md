# nur-fajar.github.io

Personal portfolio for **Nur Fajar** — AI Learning & Development Specialist.

🔗 Live: [https://nurfajar.com](https://nurfajar.com)

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion, statically
exported (`output: 'export'`) — no server, deployed straight to GitHub Pages.

- **Theme** — mecha/Gundam-inspired: near-black or paper backgrounds, chamfered
  panel corners, amber (dark) / blue (light) accent, dark/light toggle,
  all colors via CSS variables per `data-mode`. The bulk of the visual system
  (`app/globals.css`) is hand-written CSS carried over from the original build
  — clip-path plates, the blueprint grid, the scan beam — rather than
  translated into Tailwind utilities one-for-one; Tailwind and Framer Motion
  do the rest (layout utilities, scroll reveals, page transitions).
- **Starfield** — `<canvas>` background: ambient dust + real RA/Dec
  constellation data, ported to `content/constellations.ts`. Respects
  `prefers-reduced-motion`.
- **Widgets** — hero flip-card carousel (photo / draggable zodiac globe /
  sudoku / chess / book quotes), all client components under `components/`.
  The sudoku generator and the hand-rolled chess engine live in `lib/` with
  their own logic separated from rendering; the chess engine has a Vitest
  suite (`lib/chess-engine.test.ts`).
- **No-JS safety net** — every Framer Motion element that starts hidden for a
  scroll/mount reveal carries a `.motion-safe` class; a `<noscript>` rule in
  the root layout forces it visible when JavaScript never runs, so the
  server-rendered HTML is always readable on its own.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # vitest — chess engine test suite
npm run build    # static export to out/
```

## Deploy

Every push to `main` runs the test suite, builds the static export, and
publishes `out/` to GitHub Pages via `.github/workflows/deploy.yml`.
