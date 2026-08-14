import type { Metadata } from 'next';
import { Public_Sans, IBM_Plex_Mono } from 'next/font/google';
import { MotionConfig } from 'framer-motion';
import './globals.css';

// Self-hosted via next/font instead of a <link> to fonts.googleapis.com — one
// less external host the CSP needs to trust, and no render-blocking
// cross-origin request. Two roles, mirroring v4's Calibre/SF Mono split:
// Public Sans carries body copy and headings, IBM Plex Mono is the labeling
// voice — nav, numbered headings, tags, ranges — used the way v4 uses SF Mono.
const publicSans = Public_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-public-sans',
  display: 'swap',
});
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
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
    <html lang="en" className={`${publicSans.variable} ${plexMono.variable}`}>
      <head>
        {/* CSP, Referrer-Policy, X-Frame-Options etc. are real HTTP headers
            (see next.config.mjs `headers()`) on the Vercel deploy.
            Framer Motion bakes its `initial` (pre-animation) style into the
            server-rendered HTML — reveal-on-scroll/mount elements ship as
            opacity:0 until JS runs the animation that brings them to 1. If
            JS never runs, this rule (only present when there's no JS to run
            it) forces every such element visible instead of permanently
            hidden. clip-path is included alongside the original three
            properties for About's photo reveal (PhotoFrame.tsx), which
            ships clipped to nothing server-side. */}
        <noscript>
          <style>
            {'.motion-safe{opacity:1 !important;transform:none !important;filter:none !important;clip-path:none !important;}'}
          </style>
        </noscript>
      </head>
      <body>
        {/* Collapses every Framer Motion animation in the tree to an instant,
            no-op transition under prefers-reduced-motion. */}
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </body>
    </html>
  );
}
