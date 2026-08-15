import Nav from '@/components/Nav';
import Social from '@/components/Social';
import EmailSide from '@/components/EmailSide';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Experience from '@/components/Experience';
import TrackRecord from '@/components/TrackRecord';
import Skills from '@/components/Skills';
import Work from '@/components/Work';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

// Halaman ini dulunya adalah homepage (`/`). Sejak scroll-story landing page
// dipasang di `/`, versi lengkap ini pindah ke `/process` dan tetap jalan apa
// adanya — tidak ada perubahan konten, hanya rutenya yang berpindah.
export const metadata = {
  title: 'The Process',
  description:
    'The long version: experience, track record, selected work, and what people say — section by section.',
};

export default function ProcessPage() {
  return (
    <>
      <Nav />
      <Social />
      <EmailSide />

      <div id="content">
        <main>
          <Hero />
          <About />
          <Experience />
          <TrackRecord />
          <Skills />
          <Work />
          <Testimonials />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}
