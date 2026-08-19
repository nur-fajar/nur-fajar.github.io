import Nav from '@/components/site/Nav';
import Hero from '@/components/site/Hero';
import Logos from '@/components/site/Logos';
import About from '@/components/site/About';
import Experience from '@/components/site/Experience';
import Testimonials from '@/components/site/Testimonials';
import Work from '@/components/site/Work';
import Contact from '@/components/site/Contact';

/**
 * Urutan section adalah keputusan, bukan kebiasaan. Tiap posisi menjawab satu
 * pertanyaan pembaca, diurutkan berdasarkan kapan pertanyaan itu muncul:
 *
 *   Hero          siapa ini, dan apa klaim terbesarnya
 *   Logos         di mana dia benar-benar pernah ada
 *   About         kenapa percaya, dan apa yang bisa diserahkan hari pertama
 *   Experience    sudah berapa lama, di mana, dan peran mana yang mana
 *   References    apa kata orang yang pernah mengelolanya
 *   Work          apa yang bisa dibuka dan dinilai sendiri
 *   Contact       peran apa yang dicari, dan cara menghubungi
 */
export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#about">
        Skip to content
      </a>

      {/* Tiga blob yang di-blur berat, fixed di belakang segalanya. */}
      <div className="aurora" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <Nav />
      <main>
        <Hero />
        <Logos />
        <About />
        <Experience />
        <Testimonials />
        <Work />
        <Contact />
      </main>
    </>
  );
}
