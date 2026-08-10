'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { SKILL_GROUPS, type Accent } from '@/content/skills';
import Reveal from './motion/Reveal';
import SpotlightPanel from './motion/SpotlightPanel';
import SkillPopup from './SkillPopup';

const ACCENT_VAR: Record<Accent, string> = {
  warmth: 'var(--accent)',
  signal: 'var(--accent-2)',
};

export default function Skills() {
  const [active, setActive] = useState<{ tag: string; accent: Accent } | null>(null);

  return (
    <section id="skills" className="section">
      <Reveal as="div">
        <h2 className="section-label">Skills</h2>
      </Reveal>
      <div className="skill-grid">
        {SKILL_GROUPS.map((g, i) => (
          <SpotlightPanel
            key={g.id}
            className="panel skill-group"
            style={{ '--group-span': g.span, '--group-accent': ACCENT_VAR[g.accent] } as React.CSSProperties}
          >
            <Reveal as="div" index={i}>
              <p className="mono skill-id">{g.label}</p>
              <ul className="tags mono">
                {g.items.map((item) => {
                  const name = typeof item === 'string' ? item : item.name;
                  const accent = typeof item === 'string' ? g.accent : (item.accent ?? g.accent);
                  return (
                    <li key={name} style={accent !== g.accent ? ({ '--tag-accent': ACCENT_VAR[accent] } as React.CSSProperties) : undefined}>
                      <button type="button" onClick={() => setActive({ tag: name, accent })}>
                        {name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </SpotlightPanel>
        ))}
      </div>

      <AnimatePresence>
        {active && <SkillPopup tag={active.tag} accent={active.accent} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  );
}
