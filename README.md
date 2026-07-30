# nur-fajar.github.io

Personal portfolio for **Nur Fajar** — AI Learning & Development Specialist.

🔗 Live: [https://nur-fajar.github.io](https://nur-fajar.github.io)

## Grey Space

Static site, zero dependencies, zero build step. Plain HTML + CSS + JS.

- **Theme** — monochrome grey with a single cyan accent (`#54D6DE`), dark/light
  toggle (default dark), all colors via CSS variables per `data-mode`.
- **Starfield** — fixed `<canvas>` background: ambient dust + 10 drifting
  constellations (Ursa Major, Orion, Cassiopeia, …). Respects
  `prefers-reduced-motion`.
- **Terminal** — interactive CLI résumé: commands (`help`, `experience`,
  `skills`, …) plus free-text Q&A in English or Bahasa Indonesia.

## Development

Open `index.html` in a browser, or:

```bash
python3 -m http.server
```

## Deploy

Every push to `main` deploys straight to GitHub Pages via
`.github/workflows/deploy.yml` — no build, files are uploaded as-is.
