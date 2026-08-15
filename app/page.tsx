import './story.css';
import StoryScrollerFrame from '@/components/story/StoryScrollerFrame';
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
 *                     section. Dibungkus `StoryScrollerFrame`, yang mengecil
 *                     dan meredup di jatah scroll terakhir supaya lapisan ini
 *                     terasa "menutup" alih-alih footer di baliknya cuma
 *                     kelihatan merayap naik dari tepi bawah layar.
 *   .story-footer   — fixed di dasar layar, satu layar penuh, tersingkap saat
 *                     scroller-nya habis tergulung ke atas.
 *
 * `StoryNav` dipasang sebagai saudara scroller, BUKAN di dalamnya — lihat
 * komentar di `StoryScrollerFrame` soal kenapa navbar fixed tidak boleh jadi
 * descendant elemen yang di-transform.
 *
 * Halaman ini dark-only dan punya paletnya sendiri; versi portfolio yang
 * sebelumnya ada di sini pindah utuh ke `/process`.
 */
export default function HomePage() {
  return (
    <div className="story-root">
      <StoryScrollerFrame>
        <StoryBackdrop />
        <main className="story-main">
          <StoryHero />
          <StoryIntro />
          <StoryPath />
          <StorySkills />
          <StoryShowcase />
        </main>
      </StoryScrollerFrame>
      <StoryNav />
      <StoryClosing />
    </div>
  );
}
