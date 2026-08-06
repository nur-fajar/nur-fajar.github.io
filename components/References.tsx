import ReferencesCarousel from './ReferencesCarousel';
import Reveal from './motion/Reveal';

export default function References() {
  return (
    <section id="references" className="section">
      <Reveal as="div">
        <h2 className="section-label mono">REFERENCES / WHAT PEOPLE SAY</h2>
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
