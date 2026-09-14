'use client';

import Bento from '@/components/v3/Bento';
import ConnectTile from '@/components/v3/tiles/ConnectTile';
import CvTile from '@/components/v3/tiles/CvTile';
import LinkedInTile from '@/components/v3/tiles/LinkedInTile';
import ProjectsTile from '@/components/v3/tiles/ProjectsTile';
import ToolsTile from '@/components/v3/tiles/ToolsTile';
import { V4_HOME_TILES } from '@/content/ledger';
import HeroTile from './tiles/HeroTile';

/* Peta isi ubin v4. Yang berganti cuma satu: ubin pembuka, dari sapaan
   tiga belas bahasa jadi pernyataan posisi. Kelimanya yang lain dipakai
   ulang apa adanya, termasuk simulasi fisika sebelas chip tool , satu loop
   rAF dengan tabrakan elastis antar-chip dan tolakan kursor, nol re-render
   React. Itu kerja nyata dan tidak ada alasan menulisnya dua kali. */
const V4_CONTENT: Record<string, React.ComponentType> = {
  hero: HeroTile,
  cv: CvTile,
  projects: ProjectsTile,
  tools: ToolsTile,
  linkedin: LinkedInTile,
  connect: ConnectTile,
};

/**
 * Komponen ini ada karena satu batas teknis, bukan karena ia punya logika.
 *
 * Peta di atas memetakan id ubin ke KOMPONEN. Referensi komponen tidak bisa
 * melintasi batas Server Component ke Client Component, jadi app/v4/page.tsx
 * , yang server , tidak bisa mengoper peta itu ke <Bento/> langsung.
 * Pembungkus client ini yang menyimpannya di sisi yang benar.
 */
export default function Hero() {
  return <Bento tiles={V4_HOME_TILES} content={V4_CONTENT} />;
}
