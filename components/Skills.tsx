import { SKILL_GROUPS } from '@/content/skills';
import Reveal from './motion/Reveal';

export default function Skills() {
  return (
    <section id="skills" className="section">
      <Reveal as="div">
        <h2 className="section-label mono">SKILL GROUPS</h2>
      </Reveal>
      <div className="skill-grid">
        {SKILL_GROUPS.map((g, i) => (
          <Reveal as="div" className="panel skill-group" key={g.id} index={i}>
            <p className="mono skill-id">
              {g.id} — {g.label}
            </p>
            <ul className="tags mono">
              {g.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
