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

export default function HomePage() {
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
