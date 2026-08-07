import ReferencesCarousel from './ReferencesCarousel';
import Reveal from './motion/Reveal';
import SectionHeading from './SectionHeading';

export default function References() {
  return (
    <section id="references" className="section">
      <Reveal as="div">
        <SectionHeading num="06" title="What People Say" />
      </Reveal>
      <Reveal as="div">
        <ReferencesCarousel />
        <p className="quote-note mono">
          Six further recommendations, including from mentees now at Apple Developer Academy alumni programmes and
          Accenture, are on LinkedIn.
        </p>
      </Reveal>
    </section>
  );
}
