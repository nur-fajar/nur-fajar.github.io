import { PROGRAMS } from '@/content/programs';
import Reveal from './motion/Reveal';

export default function Programs() {
  return (
    <section id="programs" className="section">
      <Reveal as="div">
        <h2 className="section-label mono">PROGRAMS / CURRICULUM DESIGNED</h2>
        <p className="section-lede">
          Four published LMS courses, 20 hours of contact time, on <strong>ai4impact</strong> — Terra AI&apos;s own
          learning platform for teaching the software built in-house. Every course is backward designed from a
          published artifact: the learner does not leave with notes, they leave with something running. Open a card
          for the unit breakdown.
        </p>
      </Reveal>
      <div className="program-grid">
        {PROGRAMS.map((p, i) => (
          <Reveal as="div" className="panel program" key={p.id} index={i}>
            <p className="mono program-id">{p.id}</p>
            <h3>{p.title}</h3>
            <p>{p.summary}</p>
            <dl className="prg-meta mono">
              <dt>Audience</dt>
              <dd>{p.audience}</dd>
              <dt>Prerequisites</dt>
              <dd>{p.prerequisites}</dd>
            </dl>
            <details className="prg-outline">
              <summary className="mono">Unit breakdown</summary>
              <ol className="prg-units">
                {p.units.map((u) => (
                  <li key={u.title}>
                    <strong>{u.title}</strong>
                    <span>{u.detail}</span>
                  </li>
                ))}
              </ol>
              <p className="prg-outcome mono">{p.outcome}</p>
            </details>
            <a className="prg-link mono" href={p.href} target="_blank" rel="noopener">
              Open on ai4impact ↗
            </a>
          </Reveal>
        ))}
      </div>
      <p className="quote-note mono">
        Design frameworks applied across the set: backward design and Bloom&apos;s taxonomy in all four · design
        thinking in both chatbot courses · JTBD and MoSCoW in the PM track · problem-based learning in Foundations.
      </p>
    </section>
  );
}
