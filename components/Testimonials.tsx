import { REFERENCES } from '@/content/references';
import Reveal from './motion/Reveal';

export default function Testimonials() {
  return (
    <section id="testimonials">
      <Reveal as="div">
        <h2 className="numbered-heading">
          <span className="num mono">06.</span> What People Say
        </h2>
      </Reveal>

      <ul className="testimonial-grid">
        {REFERENCES.map((r, i) => (
          <Reveal as="li" key={r.name} className="testimonial-card" index={i}>
            <span className="testimonial-tag mono">{r.tag}</span>
            <p className="testimonial-quote">{r.quote}</p>
            <p className="testimonial-name">{r.name}</p>
            <p className="testimonial-role">{r.role}</p>
          </Reveal>
        ))}
      </ul>
      <Reveal as="p" className="testimonial-note" index={REFERENCES.length}>
        Six further recommendations, including from mentees now at Apple Developer Academy alumni programmes and
        Accenture, are on LinkedIn.
      </Reveal>
    </section>
  );
}
