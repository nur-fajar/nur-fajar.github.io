// app/v2/page.tsx
// Satu alur scroll dari atas ke bawah, tanpa nav dan tanpa label section
// ("01", "02", "HERO"). Halaman root ("/") tidak disentuh: yang dipakai
// bareng cuma data (content/skills.ts, content/references.ts) dan konten
// yang jadi bahan proof di Skills (content/programs, signals, pipeline,
// credibility — lihat skillProof.ts).
//
// Metadata + import v2.css ada di layout.tsx, bukan di sini.
import HeroV2 from './components/HeroV2';
import WhoIAm from './components/WhoIAm';
import ThePath from './components/ThePath';
import SkillsV2 from './components/SkillsV2';
import TestimonialsV2 from './components/TestimonialsV2';
import ClosingV2 from './components/ClosingV2';

export default function V2Page() {
  return (
    <main className="v2-flow">
      <HeroV2 />
      <WhoIAm />
      <ThePath />
      <SkillsV2 />
      <TestimonialsV2 />
      <ClosingV2 />
    </main>
  );
}
