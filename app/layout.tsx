import type { Metadata } from 'next';
import { Public_Sans, IBM_Plex_Mono, Fraunces, Space_Grotesk } from 'next/font/google';
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
// Dua muka berikut hanya dipakai scroll-story homepage (`/`), yang punya
// paletnya sendiri: Fraunces sebagai serif display, Space Grotesk untuk label
// dan tag. `weight` Fraunces sengaja tidak didaftar — ia variable font, dan
// menyebut weight satu per satu gagal di-resolve Turbopack saat build.
const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-story-sans',
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
    <html
      lang="en"
      className={`${publicSans.variable} ${plexMono.variable} ${fraunces.variable} ${spaceGrotesk.variable}`}
      // Skrip anti-FOUC di bawah menulis `data-story-theme` ke elemen ini
      // sebelum React sempat hydrate — mismatch yang disengaja dan aman
      // (atribut itu bukan sesuatu yang pernah dirender RootLayout sendiri),
      // jadi cuma warning ini yang perlu dibungkam, bukan sesuatu yang
      // perlu "diperbaiki" di JSX.
      suppressHydrationWarning
    >
      <head>
        {/* CSP, Referrer-Policy, X-Frame-Options etc. are real HTTP headers
            (see next.config.mjs `headers()`) on the Vercel deploy.
            Framer Motion bakes its `initial` (pre-animation) style into the
            server-rendered HTML — reveal-on-scroll/mount elements ship as
            opacity:0 until JS runs the animation that brings them to 1. If
            JS never runs, this rule (only present when there's no JS to run
            it) forces every such element visible instead of permanently
            hidden. */}
        <noscript>
          <style>{'.motion-safe{opacity:1 !important;transform:none !important;filter:none !important;}'}</style>
        </noscript>
        {/* Anti-FOUC untuk toggle tema dark/light di scroll-story homepage
            (`StoryThemeToggle`, `/`). Harus jalan lewat blocking inline
            <script> di <head>, sebelum React hydrate dan sebelum paint
            pertama — kalau ditunda ke useEffect, pengunjung yang sebelumnya
            memilih light akan sempat melihat kedipan tema dark dulu.
            script-src CSP di next.config.mjs sudah mengizinkan
            'unsafe-inline' (dipakai juga oleh payload hydrasi RSC bawaan
            Next), jadi tidak perlu nonce di sini.
            Dipagari path `/` karena tema ini scoped ke homepage saja —
            lihat komentar token warna di app/story.css. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(location.pathname!=='/')return;var t=localStorage.getItem('story-theme')==='light'?'light':'dark';document.documentElement.setAttribute('data-story-theme',t);}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        {/* Collapses every Framer Motion animation in the tree to an instant,
            no-op transition under prefers-reduced-motion. */}
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </body>
    </html>
  );
}
