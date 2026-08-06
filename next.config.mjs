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
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

/** @type {import('next').NextConfig} */
const nextConfig = {
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
