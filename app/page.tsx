import Nav from '@/components/site/Nav';
import Hero from '@/components/site/Hero';
import Stats from '@/components/site/Stats';
import Work from '@/components/site/Work';
import Experience from '@/components/site/Experience';
import Skills from '@/components/site/Skills';
import Credentials from '@/components/site/Credentials';
import Testimonials from '@/components/site/Testimonials';
import About from '@/components/site/About';
import Contact from '@/components/site/Contact';

/**
 * Urutan section adalah keputusan, bukan kebiasaan. Prinsipnya satu baris:
 *
 *   apa yang bisa kamu buka sendiri
 *     lalu apa yang saya kerjakan
 *       lalu apa yang bisa diverifikasi pihak ketiga
 *         lalu dari mana asalnya
 *           lalu cara menghubungi
 *
 * Dijalankan, itu jadi:
 *
 *   Hero          siapa ini, apa klaim terbesarnya, di mana, kapan bisa mulai
 *   Stats         empat angka, hal pertama yang dicari setelah headline
 *   Work          apa yang bisa dibuka dan dinilai sendiri, sekarang juga
 *   Experience    sudah berapa lama, di mana, dan peran mana yang mana
 *   Skills        dengan apa dia mengerjakannya
 *   Credentials   bukti pihak ketiga yang bisa diklik satu per satu
 *   References    bukti pihak ketiga yang berbicara
 *   About         dari mana asalnya: kuliah, beasiswa, program, organisasi
 *   Contact       peran apa yang dicari, dan cara menghubungi
 *
 * Yang berpindah paling jauh adalah About, dari posisi kedua ke keenam. Di
 * urutan lama, pembaca menghabiskan perhatian pertamanya di riwayat kuliah
 * dan organisasi kampus sebelum sempat melihat satu pun artefak yang bisa
 * dibuka. Work naik ke posisi itu justru karena ia satu-satunya bagian
 * halaman yang bisa diperiksa tanpa mempercayai kalimat apa pun di
 * sekitarnya.
 *
 * Credentials dipisah keluar dari About, tempatnya selama ini duduk. Ia bukan
 * bagian dari cerita masa kuliah, ia bukti pihak ketiga, dan tempatnya di
 * sebelah References.
 */
export default function HomePage() {
  return (
    <>
      {/* Targetnya #main, bukan #about. Versi sebelumnya melompat ke About,
          yang berarti pengguna keyboard yang menekan skip link melewati
          seluruh hero: headline, kedua tombol, dan baris bukti sekaligus.
          Skip link seharusnya melompati navigasi, bukan melompati isi. */}
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      {/* Tiga blob yang di-blur berat, fixed di belakang segalanya. */}
      <div className="aurora" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <Nav />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Stats />
        <Work />
        <Experience />
        <Skills />
        <Credentials />
        <Testimonials />
        <About />
        <Contact />
      </main>
    </>
  );
}
