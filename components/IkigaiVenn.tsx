'use client';

/* ── Hero visual: Ikigai-style radial diagram ─────────────────────────────
   Five role circles clockwise around a small centered portrait, each
   overlapping the center and its two neighbors — not a mathematically
   precise 5-way Venn (mutually-overlapping circles reads as mud past three
   or four), but a radial cluster where the overlap with each neighbor gets
   its own label (see IKIGAI_INTERSECTIONS in content/ikigai.ts — order is
   load-bearing there, not just aesthetic). The photo itself carries no
   interaction; it's just the "point of convergence" all five roles orbit.

   Positions are computed here (polar → --tx/--ty custom properties) rather
   than hand-derived per role count in CSS nth-child rules — this diagram's
   role count has already changed once between revisions, so whatever picks
   the angles needs to survive that without a trig rewrite every time.
   ROLE_RADIUS_EM/ROLE_DIAMETER_EM/CENTER_DIAMETER_EM (sizes, not angles)
   still live in CSS since they don't depend on N.

   Interaction is hover on desktop, tap on touch — detected once via
   matchMedia('(hover: hover)') rather than guessed from the event type,
   since mouseenter/click both fire on some hybrid devices. Whichever mode
   is active, the same activeId state drives the circle's active/dimmed
   classes and the skill panel below — CSS transitions do the animating
   (per the brief: hover/tap state changes are plain CSS, not Motion). */

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import { IKIGAI_ROLES, IKIGAI_INTERSECTIONS, type IkigaiRole } from '@/content/ikigai';

const ACCENT_VAR: Record<IkigaiRole['accent'], string> = {
  warmth: 'var(--accent)',
  signal: 'var(--accent-2)',
};

const IDLE_HINT = 'Five roles, one point of convergence — hover or tap a circle for the skills underneath.';

// Same radius for roles and intersection labels: a label placed at a role's
// own placement radius, but at the angle exactly between it and its
// neighbor, lands inside the lens both circles' overlap makes (see the
// distance-to-center-of-either-circle math in the PR description) without
// needing the intersection's actual geometric centroid.
const ROLE_RADIUS_EM = 8.5;
const START_ANGLE_DEG = -90; // 12 o'clock
const N = IKIGAI_ROLES.length;
const STEP_DEG = 360 / N;

function polarStyle(angleDeg: number, radiusEm: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    '--tx': `${(radiusEm * Math.cos(rad)).toFixed(3)}em`,
    '--ty': `${(radiusEm * Math.sin(rad)).toFixed(3)}em`,
  };
}

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
      <div className="ikigai" role="group" aria-label="Five professional roles">
        {IKIGAI_ROLES.map((role, i) => {
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
          const angle = START_ANGLE_DEG + i * STEP_DEG;
          return (
            <button
              type="button"
              key={role.id}
              className={`ikigai-role${isActive ? ' is-active' : ''}${isDimmed ? ' is-dimmed' : ''}`}
              style={{ '--role-accent': ACCENT_VAR[role.accent], ...polarStyle(angle, ROLE_RADIUS_EM) } as CSSProperties}
              aria-pressed={isActive}
              {...handlers}
            >
              <span className="ikigai-role-label mono">{role.label}</span>
            </button>
          );
        })}

        {IKIGAI_INTERSECTIONS.map((label, i) => {
          const angle = START_ANGLE_DEG + i * STEP_DEG + STEP_DEG / 2;
          return (
            <span key={label} className="ikigai-label" style={polarStyle(angle, ROLE_RADIUS_EM) as CSSProperties} aria-hidden="true">
              {/* Text sizing lives on this inner span, not the positioned
                  outer one — --tx/--ty are `em` values, and `em` resolves
                  against whatever element it's used on, so shrinking the
                  outer element's own font-size would shrink the radius
                  along with the text (see the CSS comment on .ikigai-label). */}
              <span className="ikigai-label-text mono">{label}</span>
            </span>
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
