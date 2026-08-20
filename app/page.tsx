import Nav from '@/components/site/Nav';
import Hero from '@/components/site/Hero';
import Stats from '@/components/site/Stats';
import About from '@/components/site/About';
import Experience from '@/components/site/Experience';
import Work from '@/components/site/Work';
import Testimonials from '@/components/site/Testimonials';
import Contact from '@/components/site/Contact';

/**
 * Urutan section adalah keputusan, bukan kebiasaan. Tiap posisi menjawab satu
 * pertanyaan pembaca, diurutkan berdasarkan kapan pertanyaan itu muncul:
 *
 *   Hero          siapa ini, dan apa klaim terbesarnya
 *   Stats         empat angka, hal pertama yang dicari setelah headline
 *   About         dari mana asalnya: kuliah, beasiswa, program, organisasi
 *   Experience    sudah berapa lama, di mana, peran mana yang mana, lalu skill
 *   Work          apa yang bisa dibuka dan dinilai sendiri
 *   References    apa kata orang yang pernah mengelolanya
 *   Contact       peran apa yang dicari, dan cara menghubungi
 *
 * Work sengaja duduk SEBELUM References: testimoni bekerja lebih keras setelah
 * pembaca sempat melihat sendiri barangnya, bukan sebelumnya. Urutan tautan di
 * navbar mengikuti urutan ini persis.
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
        <Stats />
        <About />
        <Experience />
        <Work />
        <Testimonials />
        <Contact />
      </main>
    </>
  );
}
