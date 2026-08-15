import './story.css';
import StoryBackdrop from '@/components/story/StoryBackdrop';
import StoryNav from '@/components/story/StoryNav';
import StoryHero from '@/components/story/StoryHero';
import StoryIntro from '@/components/story/StoryIntro';
import StoryPath from '@/components/story/StoryPath';
import StorySkills from '@/components/story/StorySkills';
import StoryShowcase from '@/components/story/StoryShowcase';
import StoryClosing from '@/components/story/StoryClosing';

/**
 * Scroll-story homepage.
 *
 * Strukturnya dua lapis, demi footer reveal:
 *   .story-scroller — opaque, tergulung normal, berisi latar rasi + semua
 *                     section. Ia yang "menutupi" footer.
 *   .story-footer   — fixed di dasar layar, satu layar penuh, tersingkap saat
 *                     scroller-nya habis tergulung ke atas.
 *
 * Halaman ini dark-only dan punya paletnya sendiri; versi portfolio yang
 * sebelumnya ada di sini pindah utuh ke `/process`.
 */
export default function HomePage() {
  return (
    <div className="story-root">
      <div className="story-scroller">
        <StoryBackdrop />
        <StoryNav />
        <main className="story-main">
          <StoryHero />
          <StoryIntro />
          <StoryPath />
          <StorySkills />
          <StoryShowcase />
        </main>
      </div>
      <StoryClosing />
    </div>
  );
}
