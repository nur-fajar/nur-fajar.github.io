import Nav from '@/components/Nav';
import HomeBackdrop from '@/components/HomeBackdrop';
import Starfield from '@/components/Starfield';
import RocketButton from '@/components/RocketButton';
import Hero from '@/components/Hero';
import References from '@/components/References';
import { WorkSignals, OrganizationSignals } from '@/components/Signals';
import Skills from '@/components/Skills';
import Programs from '@/components/Programs';
import DesignCaseStudy from '@/components/DesignCaseStudy';
import Education from '@/components/Education';
import Contact from '@/components/Contact';

export default function HomePage() {
  return (
    <>
      <HomeBackdrop />
      <Starfield />
      <RocketButton />

      <div className="wrap">
        <Nav variant="home" />

        <main id="top">
          <Hero />
          <WorkSignals />
          <OrganizationSignals />
          <Skills />
          <Programs />
          <DesignCaseStudy />
          <Education />
          <References />
        </main>

        <Contact />
      </div>
    </>
  );
}
