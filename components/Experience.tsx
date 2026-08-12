'use client';

import { useState, type CSSProperties } from 'react';
import { WORK_EXPERIENCE, ORGANIZATION_EXPERIENCE } from '@/content/signals';
import { splitSub } from '@/lib/parseJobSub';
import Reveal from './motion/Reveal';

/** Renders `__word__` as bold — the only markup the signal bullets use
    (bolds the "Output:" prefix on organizational-experience lines). */
function renderBullet(text: string) {
  const parts = text.split(/__([^_]+)__/g);
  return parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part));
}

export default function Experience() {
  const [active, setActive] = useState(0);
  const jobs = WORK_EXPERIENCE.map((job) => ({ ...job, ...splitSub(job.sub) }));

  return (
    <section id="experience">
      <Reveal as="div">
        <h2 className="numbered-heading">
          <span className="num mono">02.</span> Where I&apos;ve Worked
        </h2>
      </Reveal>

      <Reveal as="div" className="jobs-inner">
        <div className="tab-list" role="tablist" aria-label="Job tabs">
          {jobs.map((job, i) => (
            <button
              key={job.id}
              type="button"
              role="tab"
              id={`tab-${job.id}`}
              aria-selected={active === i}
              aria-controls={`panel-${job.id}`}
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
            >
              {job.company}
            </button>
          ))}
          <span className="tab-highlight" style={{ '--active-tab': active } as CSSProperties} aria-hidden="true" />
        </div>

        <div className="tab-panels">
          {jobs.map((job, i) => (
            <div
              key={job.id}
              id={`panel-${job.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${job.id}`}
              hidden={active !== i}
              className="tab-panel"
            >
              <h3>
                {job.name} <span className="company">@ {job.company}</span>
              </h3>
              <p className="range mono">{job.range}</p>
              <ul className="fancy-list">
                {job.bullets.map((b, bi) => (
                  <li key={bi}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal as="div" className="org-list" index={1}>
        {ORGANIZATION_EXPERIENCE.map((org) => (
          <details key={org.id}>
            <summary>
              {org.category && <span className="mono">{org.category}</span>}
              <span className="org-name">{org.name}</span>
            </summary>
            <div className="org-body">
              <span className="org-sub">{org.sub}</span>
              <ul className="fancy-list">
                {org.bullets.map((b, i) => (
                  <li key={i}>{renderBullet(b)}</li>
                ))}
              </ul>
            </div>
          </details>
        ))}
      </Reveal>
    </section>
  );
}
