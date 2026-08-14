// app/v2/page.tsx
// Halaman /v2 — satu alur scroll dari atas ke bawah, tanpa nav dan tanpa
// label section. Halaman root (/) tidak disentuh sama sekali; yang dipakai
// bareng cuma data (content/skills.ts, content/references.ts) dan indeks
// proof project (lib/relatedProjects.ts).
import type { Metadata } from 'next';
import HeroV2 from '@/components/v2/HeroV2';
import WhoIAm from '@/components/v2/WhoIAm';
import ThePath from '@/components/v2/ThePath';
import SkillsV2 from '@/components/v2/SkillsV2';
import TestimonialsV2 from '@/components/v2/TestimonialsV2';
import ClosingV2 from '@/components/v2/ClosingV2';
import './v2.css';

export const metadata: Metadata = {
  title: 'Nur Fajar — I build people, not just curricula',
  description:
    'Learning & Development end to end — design, delivery, evaluation — plus the AI automation underneath it. One scroll, start to finish.',
};

export default function V2Page() {
  return (
    <main className="v2-page">
      <HeroV2 />
      <WhoIAm />
      <ThePath />
      <SkillsV2 />
      <TestimonialsV2 />
      <ClosingV2 />
    </main>
  );
}
