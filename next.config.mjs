// Real HTTP security headers — Vercel runs this as an actual server (not a
// static host like GitHub Pages), so these are enforced for real instead of
// the best-effort <meta http-equiv> version the old GitHub Pages build had
// to settle for. frame-ancestors and X-Frame-Options specifically only work
// as headers — they're two of the exact things the meta-tag version had to
// leave out.
//
// script-src/style-src still need 'unsafe-inline': the App Router ships its
// React Server Components hydration payload as inline <script> tags, and
// Framer Motion animates by writing inline style properties. A nonce would
// cover both correctly (Next middleware can mint one per request now that
// there's a real server), but that's a bigger change than this pass — noted
// here as the upgrade path, not done speculatively.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  // Contact form's "drop a message" box posts straight to Web3Forms
  // (web3forms.com) — no backend of our own, see components/Contact.tsx.
  "connect-src 'self' https://api.web3forms.com",
  // Contact section embeds a Cal.com booking iframe (cal.com/nurfajar/15min).
  "frame-src https://cal.com https://app.cal.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

// Two deploy targets share this file now:
//   - Vercel (nurfajar.com / *.vercel.app) — a real Next.js server, so it
//     gets the headers() below plus on-demand next/image optimization.
//   - GitHub Pages (nur-fajar.github.io) — static hosting, no server at all.
//     Built via `NEXT_STATIC_EXPORT=true next build`
//     (.github/workflows/deploy-pages.yml), which flips this into
//     `output: 'export'`. Next refuses to combine `output: 'export'` with
//     headers()/redirects()/rewrites() — those need a server to run — so
//     the Pages build ships without the headers below (the pre-existing
//     <meta http-equiv> gap this comment already describes) and with
//     next/image unoptimized (the optimizer needs a server too).
const STATIC_EXPORT = process.env.NEXT_STATIC_EXPORT === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = STATIC_EXPORT
  ? {
      output: 'export',
      images: { unoptimized: true },
    }
  : {
      // Situs lama menautkan resume sebagai /nf.pdf, dan URL itu sudah duduk di
      // riwayat browser serta email orang. File-nya sendiri diganti versi
      // terbaru dengan nama yang deskriptif, jadi tautan lamanya diarahkan ke
      // sana alih-alih dibiarkan jadi 404.
      async redirects() {
        return [{ source: '/nf.pdf', destination: '/Nur-Fajar-LnD-Specialist-CV.pdf', permanent: true }];
      },
      async headers() {
        return [
          {
            source: '/:path*',
            headers: [
              { key: 'Content-Security-Policy', value: CSP },
              { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
              { key: 'X-Frame-Options', value: 'DENY' },
              { key: 'X-Content-Type-Options', value: 'nosniff' },
            ],
          },
        ];
      },
    };

export default nextConfig;
