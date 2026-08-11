'use client';

/* ── Hero visual: Ikigai-style orbit diagram ──────────────────────────────
   Six role circles clockwise around a small centered portrait — not a
   mathematically precise 6-way Venn (six mutually-overlapping circles reads
   as mud), but a radial cluster where every circle touches the center and
   its two neighbors (see the --tx/--ty positions and the design note in
   app/globals.css). The photo itself carries no interaction; it's just the
   "point of convergence" all six roles orbit.

   Interaction is hover on desktop, tap on touch — detected once via
   matchMedia('(hover: hover)') rather than guessed from the event type,
   since mouseenter/click both fire on some hybrid devices. Whichever mode
   is active, the same activeId state drives the circle's active/dimmed
   classes and the skill panel below — CSS transitions do the animating
   (per the brief: hover/tap state changes are plain CSS, not Motion). */

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import { IKIGAI_ROLES, type IkigaiRole } from '@/content/ikigai';

const ACCENT_VAR: Record<IkigaiRole['accent'], string> = {
  warmth: 'var(--accent)',
  signal: 'var(--accent-2)',
};

const IDLE_HINT = 'Six roles, one point of convergence — hover or tap a circle for the skills underneath.';

// SSR has no matchMedia, so this defaults to the desktop-hover assumption
// there; the client's first render calls it again with the real value
// (event handlers aren't part of the SSR'd markup, so the two passes
// disagreeing here never triggers a hydration mismatch).
function getHasHover() {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

export default function IkigaiVenn() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hasHover, setHasHover] = useState(getHasHover);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const onChange = (e: MediaQueryListEvent) => setHasHover(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // No-hover devices get no mouseleave/blur to close the panel with — tap
  // outside the diagram or Escape does that job instead.
  useEffect(() => {
    if (hasHover) return;
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setActiveId(null);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setActiveId(null);
    }
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [hasHover]);

  const active = IKIGAI_ROLES.find((r) => r.id === activeId) ?? null;

  return (
    <div className="ikigai-wrap" ref={rootRef}>
      <div className="ikigai" role="group" aria-label="Six professional roles">
        {IKIGAI_ROLES.map((role) => {
          const isActive = role.id === activeId;
          const isDimmed = activeId !== null && !isActive;
          const handlers = hasHover
            ? {
                onMouseEnter: () => setActiveId(role.id),
                onMouseLeave: () => setActiveId((cur) => (cur === role.id ? null : cur)),
                onFocus: () => setActiveId(role.id),
                onBlur: () => setActiveId((cur) => (cur === role.id ? null : cur)),
              }
            : { onClick: () => setActiveId((cur) => (cur === role.id ? null : role.id)) };
          return (
            <button
              type="button"
              key={role.id}
              className={`ikigai-role${isActive ? ' is-active' : ''}${isDimmed ? ' is-dimmed' : ''}`}
              style={{ '--role-accent': ACCENT_VAR[role.accent] } as CSSProperties}
              aria-pressed={isActive}
              {...handlers}
            >
              <span className="ikigai-role-label mono">{role.label}</span>
            </button>
          );
        })}

        <div className="ikigai-center">
          <Image src="/foto-profile-nf.jpg" alt="Portrait of Nur Fajar" fill sizes="140px" priority />
        </div>
      </div>

      <div className="ikigai-panel panel" aria-live="polite">
        {active ? (
          <>
            <p className="mono ikigai-panel-eyebrow" style={{ color: ACCENT_VAR[active.accent] }}>
              {active.label}
            </p>
            <ul className="ikigai-panel-list mono">
              {active.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </>
        ) : (
          <p className="ikigai-panel-hint mono">{IDLE_HINT}</p>
        )}
      </div>
    </div>
  );
}
