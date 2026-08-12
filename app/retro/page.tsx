// app/retro/page.tsx
// Halaman /retro yang sebenarnya: game portofolio pulau, bukan lagi alias
// dari homepage (lihat docs/superpowers/specs/2026-08-12-retro-island-rebuild-design.md).
import type { Metadata } from 'next';
import { IslandGame } from '@/components/retro/IslandGame';

export const metadata: Metadata = {
  title: 'Nur Fajar — Island Portfolio (Retro)',
  description:
    "An interactive, game-styled portfolio: one island, five areas, five ways to play — organizations, work, projects, skills, and how to reach me.",
};

export default function RetroPage() {
  return <IslandGame />;
}
