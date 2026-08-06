'use client';

/* ── Pipeline: sticky map + scrolling agent steps ───────────────────────────
   Structure (sticky positioning, grid) does the layout; this component only
   adds two things on top: which map node is "active" (closest step to the
   viewport's vertical center — recomputed from scratch on every scroll tick,
   not from whichever elements happened to fire an intersection event, so the
   highlight never lags behind) and a once-only reveal per step as it enters.
   Without JS the page is still a readable, ordered list of 9 agents. */

import { useEffect, useRef, useState } from 'react';
import { AGENT_STEPS, PIPELINE_MAP } from '@/content/pipeline';
import Reveal from '../motion/Reveal';

/** Renders `**text**` as bold — the only markup an agent-step body needs. */
function renderBold(text: string) {
  const parts = text.split(/\*\*([^*]+)\*\*/g);
  return parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part));
}

export default function PipelineWalk() {
  const stepRefs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    let lastRun = 0;
    let pending: ReturnType<typeof setTimeout> | undefined;

    function update() {
      pending = undefined;
      lastRun = Date.now();
      const mid = window.innerHeight / 2;
      let best = -1;
      let bestDist = Infinity;
      stepRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return; // off-screen
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActive(best);
    }

    // Time-based throttle, not requestAnimationFrame: rAF pauses in a
    // background tab, and this highlight doesn't need per-frame precision.
    function schedule() {
      if (pending) return;
      const wait = Math.max(0, 60 - (Date.now() - lastRun));
      pending = setTimeout(update, wait);
    }

    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
    update();
    return () => {
      removeEventListener('scroll', schedule);
      removeEventListener('resize', schedule);
      if (pending) clearTimeout(pending);
    };
  }, []);

  return (
    <section className="pipeline" id="pipeline" aria-label="Pipeline walkthrough">
      <div className="pipeline-stage">
        <div className="stage-inner">
          {/* Peta: 9 node, 5 fase. aria-hidden karena isinya duplikat judul agen. */}
          <ol className="pmap mono" aria-hidden="true">
            {PIPELINE_MAP.map((n, i) => (
              <li
                key={n.name}
                className={[i === active && 'is-active', i < active && 'is-done', n.gate && 'pmap-gate']
                  .filter(Boolean)
                  .join(' ')}
              >
                <span className="pmap-phase">{n.phase}</span>
                <span className="pmap-name">{n.name}</span>
              </li>
            ))}
          </ol>
          <div className="pmap-rail" aria-hidden="true">
            <i className="pmap-fill" />
          </div>
        </div>
      </div>

      <div className="agent-steps">
        {AGENT_STEPS.map((step, i) => (
          <article
            key={step.id}
            className={`agent-step${step.gate ? ' agent-step-gate' : ''}`}
            ref={(el) => {
              stepRefs.current[i] = el;
            }}
          >
            <Reveal as="div">
              <p className="agent-id mono">{step.id}</p>
              <h2>{step.title}</h2>
              <p className="agent-file mono">{step.file}</p>
              {step.claim && <p className="agent-claim">{step.claim}</p>}
              {step.body.map((p, bi) => (
                <p key={bi}>{renderBold(p)}</p>
              ))}
              <dl className="agent-io mono">
                <dt>In</dt>
                <dd>{step.io.in}</dd>
                <dt>Out</dt>
                <dd>{step.io.out}</dd>
                <dt>Model</dt>
                <dd>{step.io.model}</dd>
              </dl>
              {step.note && <p className="agent-note">{step.note}</p>}
            </Reveal>
          </article>
        ))}
      </div>
    </section>
  );
}
