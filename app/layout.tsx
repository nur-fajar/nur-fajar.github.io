import type { Metadata } from 'next';
import { Public_Sans, Fraunces, IBM_Plex_Mono } from 'next/font/google';
import Script from 'next/script';
import { MotionConfig } from 'framer-motion';
import './globals.css';

// Self-hosted via next/font (downloaded at build time, served from /_next/static
// on the same origin) instead of the old <link> to fonts.googleapis.com — one
// less external host the CSP below needs to trust, and one less render-blocking
// cross-origin request.
//
// Three roles, not two (design brief §3): Public Sans is the quiet reading
// workhorse for body copy and skill-list items; Fraunces is the "voice"
// display serif for the hero statement and human-register section titles;
// IBM Plex Mono is the labeling voice — nav, stat numbers, eyebrows — used
// sparingly, never as a headline face.
const publicSans = Public_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-public-sans',
  display: 'swap',
});
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-fraunces',
  display: 'swap',
});
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://nurfajar.com'),
  title: {
    default: 'Nur Fajar — Learning & Development Specialist',
    template: '%s — Nur Fajar',
  },
  description:
    'Nur Fajar — Learning & Development, end to end, and the systems to scale it. Curriculum, delivery, content, evaluation, plus the AI automation underneath. 350+ learners trained.',
  openGraph: {
    title: 'Nur Fajar — Learning & Development Specialist',
    description: 'Curriculum, delivery, content, evaluation — and the automation underneath it. 350+ learners trained.',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light" className={`${publicSans.variable} ${fraunces.variable} ${plexMono.variable}`}>
      <head>
        {/* CSP, Referrer-Policy, X-Frame-Options etc. are real HTTP headers now
            (see next.config.mjs `headers()`) — Vercel runs this as an actual
            server, unlike the old GitHub Pages static export, which could only
            fake CSP via a <meta http-equiv> tag and had no way to set
            frame-ancestors or X-Frame-Options at all. */}
        {/* Framer Motion bakes its `initial` (pre-animation) style into the
            server-rendered HTML — reveal-on-scroll and reveal-on-mount
            elements ship as opacity:0 until JS runs the animation that
            brings them to 1. If JS never runs, they'd stay invisible
            forever. The original build's motion.js treated "text hidden by
            an unfinished animation" as a real loss, not a cosmetic bug, and
            went to real lengths to guarantee it couldn't happen (deferred
            tweens, clearProps, a timeout failsafe) — this is that same
            guarantee for the JS-disabled case: every element Framer Motion
            might render pre-hidden carries `.motion-safe`, and this rule
            only exists when there is no JS to have run the animation. */}
        <noscript>
          <style>{'.motion-safe{opacity:1 !important;transform:none !important;}'}</style>
        </noscript>
      </head>
      <body>
        <Script src="/theme-init.js" strategy="beforeInteractive" />
        {/* Collapses every Framer Motion animation in the tree to an instant,
            no-op transition under prefers-reduced-motion — the one central
            guard motion.js used to reimplement per-effect with an early
            `if (reduced.matches) return`. The hero flip card's canvas Globe
            widget still checks it itself since it drives its own RAF loop
            rather than Motion's animate engine. */}
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </body>
    </html>
  );
}
