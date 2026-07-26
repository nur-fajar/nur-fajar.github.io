# nur-fajar.github.io

Personal portfolio site for **Nur Fajar** — builds AI systems, trains the team.

🔗 Live: [https://nur-fajar.github.io](https://nur-fajar.github.io)

## Stack

- [Next.js](https://nextjs.org) (App Router, static export)
- Tailwind CSS
- Framer Motion + GSAP untuk animasi
- Three.js / React Three Fiber untuk hero canvas

## Development

```bash
npm install
npm run dev      # jalankan development server
npm run build    # build static export ke folder /out
```

## Deploy

Setiap push ke branch `main` otomatis di-build dan di-deploy ke GitHub Pages lewat GitHub Actions (`.github/workflows/deploy.yml`).
