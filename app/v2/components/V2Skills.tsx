'use client';

/* ── Skills — motion signature: "interactive" ─────────────────────────────
   A grid-stagger reveal on entry, then the motion becomes reader-driven
   rather than autoplaying: hover (desktop) or tap (touch) opens a proof
   line per group. The expand/collapse itself is a CSS grid-template-rows
   0fr→1fr transition, not a JS height measurement — cheap enough to stay
   smooth on mid-range devices, per the performance note in the brief. */

import { useState } from 'react';
import { SKILL_GROUPS } from '@/content/skills';
import Reveal from '@/components/motion/Reveal';
import InstitutionMark from './InstitutionChip';
import { AI_TOOLS } from '../data';

// One line of "here's where this actually got used" per group — new copy,
// not a restatement of any number already used earlier on this page.
const PROOF: Record<string, string> = {
  '01': 'Used across cohort programs — from curriculum blueprint to live facilitation to post-program evaluation.',
  '02': 'The visual layer of every program — recap videos, posters, and the assets a curriculum ships with.',
  '03': 'The frame behind every program launch — from stakeholder map to a rollout someone can actually run.',
  '04': 'The backbone of the CRM agent — from data enrichment to the human-in-the-loop review gate before it sends.',
  '05': 'The daily toolkit — from workspace docs and community channels to the AI copilots below.',
};

export default function V2Skills() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section className="v2-section v2-skills" id="v2-skills">
      <ul className="v2-skills-grid">
        {SKILL_GROUPS.map((g, i) => (
          <Reveal as="li" key={g.id} className="v2-skill-card-wrap" index={i}>
            <div className={`v2-skill-card${expanded === g.id ? ' is-expanded' : ''}`}>
              <button
                type="button"
                className="v2-skill-card-toggle"
                aria-expanded={expanded === g.id}
                onClick={() => setExpanded((cur) => (cur === g.id ? null : g.id))}
              >
                <h3>{g.label}</h3>
                <span className="v2-skill-card-caret" aria-hidden="true">
                  +
                </span>
              </button>

              <ul className="v2-skill-tags">
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

              <div className="v2-skill-proof-wrap">
                <div className="v2-skill-proof-inner">
                  <p className="v2-skill-proof">{PROOF[g.id]}</p>
                  {g.id === '04' && (
                    <ul className="v2-ai-tools" aria-label="AI models used">
                      {AI_TOOLS.map((t) => (
                        <li key={t.name}>
                          {t.logo && (
                            <span className="v2-ai-tool-logo">
                              <InstitutionMark logo={t.logo} />
                            </span>
                          )}
                          <span className="mono">{t.name}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
