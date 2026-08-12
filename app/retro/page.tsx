// app/retro/page.tsx
// Halaman /retro yang sebenarnya: game portofolio pulau, bukan lagi alias
// dari homepage (lihat docs/superpowers/specs/2026-08-12-retro-island-rebuild-design.md).
import type { Metadata } from 'next';
import { Press_Start_2P, Pixelify_Sans } from 'next/font/google';
import { IslandGame } from '@/components/retro/IslandGame';
import './retro.css';

// Self-hosted via next/font, sama seperti font situs utama di app/layout.tsx
// — CSP-nya (next.config.mjs) cuma percaya font-src 'self' dan style-src
// tanpa fonts.googleapis.com, jadi <link> ke Google Fonts langsung (seperti
// versi asli nurfajar-island-v7.html) akan diblokir browser.
const pressStart2P = Press_Start_2P({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-press-start',
  display: 'swap',
});
const pixelifySans = Pixelify_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-pixelify',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nur Fajar — Island Portfolio (Retro)',
  description:
    "An interactive, game-styled portfolio: one island, five areas, five ways to play — organizations, work, projects, skills, and how to reach me.",
};

export default function RetroPage() {
  return (
    <div className={`retro-root ${pressStart2P.variable} ${pixelifySans.variable}`}>
      <IslandGame />
    </div>
  );
}
