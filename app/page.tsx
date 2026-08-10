import Nav from '@/components/Nav';
import RocketButton from '@/components/RocketButton';
import Hero from '@/components/Hero';
import References from '@/components/References';
import { WorkSignals, OrganizationSignals } from '@/components/Signals';
import Skills from '@/components/Skills';
import Credibility from '@/components/Credibility';
import Contact from '@/components/Contact';

export default function HomePage() {
  return (
    <>
      <RocketButton />

      <div className="wrap">
        <Nav />

        <main id="top">
          <Hero />
          <Credibility />
          <WorkSignals />
          <OrganizationSignals />
          <Skills />
          <References />
        </main>

        <Contact />
      </div>
    </>
  );
}
