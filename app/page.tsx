import Nav from '@/components/Nav';
import Sidebar from '@/components/Sidebar';
import RocketButton from '@/components/RocketButton';
import Hero from '@/components/Hero';
import { WorkSignals, OrganizationSignals } from '@/components/Signals';
import Skills from '@/components/Skills';
import Playground from '@/components/Playground';
import Education from '@/components/Education';
import References from '@/components/References';
import Contact from '@/components/Contact';

export default function HomePage() {
  return (
    <>
      <RocketButton />
      <Nav />

      <div className="wrap">
        <div className="layout">
          <Sidebar />

          {/* .content is the one flex sibling next to the sticky Sidebar — main
              content *and* the footer live inside it so the sidebar stays
              pinned for the full page height, contact section included. */}
          <div className="content">
            <main>
              <Hero />
              <WorkSignals />
              <OrganizationSignals />
              <Skills />
              <Playground />
              <Education />
              <References />
            </main>

            <Contact />
          </div>
        </div>
      </div>
    </>
  );
}
