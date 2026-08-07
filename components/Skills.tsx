'use client';

import { useState } from 'react';
import { SKILL_GROUPS } from '@/content/skills';
import Reveal from './motion/Reveal';
import SectionHeading from './SectionHeading';
import SkillPopup from './SkillPopup';

export default function Skills() {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  return (
    <section id="skills" className="section">
      <Reveal as="div">
        <SectionHeading num="03" title="Skills" />
      </Reveal>
      <div className="skill-grid">
        {SKILL_GROUPS.map((g, i) => (
          <Reveal as="div" className="panel skill-group" key={g.id} index={i}>
            <p className="mono skill-id">
              {g.id} — {g.label}
            </p>
            <ul className="tags mono">
              {g.items.map((item) => (
                <li key={item}>
                  <button type="button" onClick={() => setActiveTag(item)}>
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      {activeTag && <SkillPopup tag={activeTag} onClose={() => setActiveTag(null)} />}
    </section>
  );
}
