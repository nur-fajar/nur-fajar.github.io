import { SKILL_GROUPS } from '@/content/skills';
import Reveal from './motion/Reveal';

export default function Skills() {
  return (
    <section id="skills">
      <Reveal as="div">
        <h2 className="numbered-heading">
          <span className="num mono">04.</span> Skills
        </h2>
      </Reveal>

      <div className="skill-groups">
        {SKILL_GROUPS.map((g, i) => (
          <Reveal as="div" key={g.id} className="skill-group" index={i}>
            <h3>{g.label}</h3>
            <ul className="skill-tags">
              {g.items.map((item) => {
                const name = typeof item === 'string' ? item : item.name;
                const accent = typeof item === 'string' ? g.accent : (item.accent ?? g.accent);
                return (
                  <li key={name} className={accent === 'signal' ? 'is-signal' : undefined}>
                    {name}
                  </li>
                );
              })}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
