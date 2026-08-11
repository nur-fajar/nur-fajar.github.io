# nur-fajar.github.io

Personal portfolio for **Nur Fajar** — AI Learning & Development Specialist.

🔗 Live: [https://nurfajar.com](https://nurfajar.com)

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion, deployed to
two targets from one codebase:

- **Vercel** (`nurfajar.com`) — the primary deploy, a real Next.js server:
  on-demand image optimization and real HTTP security headers.
- **GitHub Pages** (`nur-fajar.github.io`) — a static export of the same
  build, `output: 'export'` triggered by `NEXT_STATIC_EXPORT=true` (see
  `next.config.mjs`). No server, so no image optimization and no HTTP
  headers there — see "Deploy" below.

- **Theme** — spacecraft HUD: Dayside/Nightside orbital-terminator palette
  (navy/teal/gold sunlit ↔ cyan/green/red dark-side, the dark/light toggle
  is the two halves of one orbit), chamfered console-plate panels instead of
  rounded cards, blueprint-grid backdrop, Space Grotesk headings + JetBrains
  Mono for every label/ID/readout. All colors via CSS variables per
  `data-mode`. The bulk of the visual system (`app/globals.css`) is
  hand-written CSS rather than translated into Tailwind utilities
  one-for-one; Tailwind and Framer Motion do the rest (layout utilities,
  scroll reveals, page transitions).
- **Contact** — two console panels: a live Cal.com embed
  (`cal.com/nurfajar/15min`) to book a call, and a "drop a message" form
  that (no backend on this static site) opens the visitor's email client
  with the fields pre-filled via a `mailto:` link.
- **Hero visual** — an Ikigai-style orbit diagram (`IkigaiVenn.tsx`, data in
  `content/ikigai.ts`): six role circles clockwise around a small centered
  portrait, hover on desktop / tap on touch to see that role's skill list.
  Positioning is `em`-based off one clamp()'d font-size so the whole cluster
  scales as a unit; collapses to a 2x3 chip grid under 820px.
- **No-JS safety net** — every Framer Motion element that starts hidden for a
  scroll/mount reveal carries a `.motion-safe` class; a `<noscript>` rule in
  the root layout forces it visible when JavaScript never runs, so the
  server-rendered HTML is always readable on its own.
- **Security headers** — CSP, `Referrer-Policy`, `X-Frame-Options`, and
  `X-Content-Type-Options` are set as real HTTP headers in
  `next.config.mjs`, enforced by Vercel's edge on every response. GitHub
  Pages is static hosting and can't set custom headers at all, so the
  export build ships without this layer — an accepted gap, not an oversight.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # vitest
npm run build    # production build (Vercel mode)
NEXT_STATIC_EXPORT=true npm run build   # static export (GitHub Pages mode) → out/
```

## Deploy

Two independent pipelines, both triggered by a push to `main`:

- **Vercel** — its GitHub App builds and deploys this repo directly, a
  preview per pull request and production on every push to `main`.
  Custom domain (`nurfajar.com`) and project settings are managed in the
  Vercel dashboard, not in this repo.
- **GitHub Pages** — `.github/workflows/deploy-pages.yml` builds the static
  export and publishes it via `actions/deploy-pages`. Requires the repo's
  Settings → Pages → Source to be set to "GitHub Actions".

`.github/workflows/ci.yml` runs lint, tests, and a (Vercel-mode) production
build on every push and pull request as a pass/fail gate; it does not
publish anything itself.
