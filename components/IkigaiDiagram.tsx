'use client';

/* ── Ikigai hero diagram ───────────────────────────────────────────────────
   The classic 4-circle ikigai construction, not a radial/orbit chart: four
   equal circles placed 2x2 (top-left/top-right/bottom-right/bottom-left),
   each overlapping its two grid-neighbors and all four meeting at one
   shared point in the middle, where the profile photo sits. Content (role
   names, skill lists, the four neighbor-overlap captions) lives in
   content/ikigai.ts — this file is only geometry + interaction.

   Geometry is plain circle-circle intersection, computed once as module
   constants against a fixed 600x600 viewBox; the SVG scales with its box
   (see .ikigai-figure in globals.css), so the same numbers hold from the
   460px desktop card down to the 340px mobile one — nothing here branches
   on viewport, only CSS resizes the box.

   Interaction: hover on devices that support it (checked via matchMedia,
   not UA-sniffed) drives the active/dimmed state; focus (keyboard) and
   click/tap always do, on every device, so touch and keyboard both reach
   the exact same state hover produces on desktop — one visual language,
   not a separate mobile layout. Hover also drives a pointer-tracked 3D tilt
   on the hovered circle (--tilt-rx/--tilt-ry, written straight to the DOM
   in onPointerMove rather than through React state — the same "skip the
   render loop for a value that repaints every frame" call SpotlightPanel
   makes for its cursor glow). */

import { useEffect, useState, type PointerEvent as ReactPointerEvent } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { IKIGAI_ROLES, IKIGAI_OVERLAPS, type IkigaiCorner, type IkigaiRole } from '@/content/ikigai';

// Circle radius vs. corner offset is chosen so three things hold at once:
// (1) all four circles cover the shared center point (needs R > offset*√2),
// (2) no circle's own center gets swallowed by a neighbor's, which would
// make that neighbor "win" pointer events right where the role's own label
// sits (needs R < 2*offset), and (3) there's enough clearance past the
// center point for the avatar photo — maximized by sitting R just under the
// 2*offset ceiling.
const CENTER = 300;
const OFFSET = 100;
const R = 185;
const AVATAR_R = 40;
const LABEL_DIST = 100;
const MAX_TILT = 9; // degrees

const CORNER_POS: Record<IkigaiCorner, [number, number]> = {
  tl: [CENTER - OFFSET, CENTER - OFFSET],
  tr: [CENTER + OFFSET, CENTER - OFFSET],
  br: [CENTER + OFFSET, CENTER + OFFSET],
  bl: [CENTER - OFFSET, CENTER + OFFSET],
};
// Unit vector pointing from the diagram center out through each corner —
// used to push that circle's own label into its exclusive (non-overlap) lobe.
const CORNER_DIR: Record<IkigaiCorner, [number, number]> = {
  tl: [-1, -1],
  tr: [1, -1],
  br: [1, 1],
  bl: [-1, 1],
};

const ROLE_BY_ID = Object.fromEntries(IKIGAI_ROLES.map((r) => [r.id, r])) as Record<string, IkigaiRole>;
const roleColor = (id: string) => `var(--ikigai-${id})`;

function roleLabelPos(corner: IkigaiCorner): [number, number] {
  const [cx, cy] = CORNER_POS[corner];
  const [dx, dy] = CORNER_DIR[corner];
  const k = LABEL_DIST / Math.SQRT2;
  return [cx + dx * k, cy + dy * k];
}

// Overlap captions start at the midpoint between the two neighboring
// circles' centers — by construction that point is inside both circles and
// outside the other two, i.e. exactly the lens it's labeling — then get
// nudged further out along the same center→midpoint line, clear of the
// avatar photo sitting at the diagram's exact center.
const OVERLAP_PUSH = 36;

function overlapPos(between: [string, string]): [number, number] {
  const [ax, ay] = CORNER_POS[ROLE_BY_ID[between[0]].corner];
  const [bx, by] = CORNER_POS[ROLE_BY_ID[between[1]].corner];
  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2;
  const vx = mx - CENTER;
  const vy = my - CENTER;
  const len = Math.hypot(vx, vy) || 1;
  return [mx + (vx / len) * OVERLAP_PUSH, my + (vy / len) * OVERLAP_PUSH];
}

function MultiLineText({
  x,
  y,
  lines,
  lineHeight,
  className,
}: {
  x: number;
  y: number;
  lines: string[];
  lineHeight: number;
  className?: string;
}) {
  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  return (
    <text x={x} y={startY} textAnchor="middle" dominantBaseline="middle" className={className}>
      {lines.map((line, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : lineHeight}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

// Pointer-tracked tilt: rotate the hovered circle a few degrees toward
// wherever inside it the cursor currently sits, like tilting a physical
// disc under your finger. Written directly to the element's style (no
// setState) so it can run every pointermove without triggering a re-render.
function handleTilt(e: ReactPointerEvent<SVGGElement>) {
  if (e.pointerType !== 'mouse') return;
  const rect = e.currentTarget.getBoundingClientRect();
  const px = (e.clientX - rect.left) / rect.width - 0.5;
  const py = (e.clientY - rect.top) / rect.height - 0.5;
  e.currentTarget.style.setProperty('--tilt-rx', `${(-py * MAX_TILT).toFixed(2)}deg`);
  e.currentTarget.style.setProperty('--tilt-ry', `${(px * MAX_TILT).toFixed(2)}deg`);
}
function resetTilt(e: ReactPointerEvent<SVGGElement>) {
  e.currentTarget.style.removeProperty('--tilt-rx');
  e.currentTarget.style.removeProperty('--tilt-ry');
}

export default function IkigaiDiagram() {
  const [activeId, setActiveId] = useState<string | null>(null);
  // Only mouse/trackpad devices get hover-driven highlighting — touch
  // devices rely on click (which fires for taps too) instead, so a tap
  // doesn't leave a "stuck" highlight behind from a synthetic hover event.
  // Read synchronously from the initializer (not an effect body) since it's
  // just reflecting an external API's current value, not reacting to one.
  const [canHover, setCanHover] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const onChange = (e: MediaQueryListEvent) => setCanHover(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  function toggle(id: string) {
    setActiveId((cur) => (cur === id ? null : id));
  }

  const activeRole = activeId ? ROLE_BY_ID[activeId] : null;

  return (
    <div className="ikigai-box">
      <div className="ikigai-figure">
        <svg
          className="ikigai-svg"
          viewBox={`0 0 ${CENTER * 2} ${CENTER * 2}`}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          {IKIGAI_ROLES.map((role) => {
            const [cx, cy] = CORNER_POS[role.corner];
            const [lx, ly] = roleLabelPos(role.corner);
            const state = activeId === null ? '' : activeId === role.id ? ' is-active' : ' is-dimmed';
            return (
              <g
                key={role.id}
                className={`ikigai-role${state}`}
                role="button"
                tabIndex={0}
                aria-pressed={activeId === role.id}
                aria-label={`${role.fullName}: ${role.skills.join(', ')}`}
                onMouseEnter={canHover ? () => setActiveId(role.id) : undefined}
                onMouseLeave={canHover ? () => setActiveId((cur) => (cur === role.id ? null : cur)) : undefined}
                onPointerMove={canHover ? handleTilt : undefined}
                onPointerLeave={canHover ? resetTilt : undefined}
                onFocus={() => setActiveId(role.id)}
                onBlur={() => setActiveId((cur) => (cur === role.id ? null : cur))}
                onClick={() => toggle(role.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggle(role.id);
                  }
                }}
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r={R}
                  className={`ikigai-circle ikigai-circle--${role.id}`}
                  style={{ transformOrigin: `${cx}px ${cy}px` }}
                />
                <MultiLineText
                  x={lx}
                  y={ly}
                  lines={role.labelLines}
                  lineHeight={role.labelLines.length > 1 ? 24 : 0}
                  className={`ikigai-role-label${role.labelLines.length > 1 ? '' : ' ikigai-role-label--solo'}`}
                />
              </g>
            );
          })}

          {IKIGAI_OVERLAPS.map((o) => {
            const [x, y] = overlapPos(o.between);
            const active = activeId !== null && o.between.includes(activeId);
            const dimmed = activeId !== null && !active;
            const cls = `ikigai-overlap-label${active ? ' is-active' : ''}${dimmed ? ' is-dimmed' : ''}`;
            return <MultiLineText key={o.id} x={x} y={y} lines={o.lines} lineHeight={17} className={cls} />;
          })}

          {/* Definition ring behind the HTML avatar photo (see .ikigai-avatar,
              positioned by percentage over this same viewBox) — without it the
              photo's edge gets lost against four stacked, translucent fills. */}
          <circle cx={CENTER} cy={CENTER} r={AVATAR_R + 7} className="ikigai-avatar-ring" />
        </svg>

        <div className="ikigai-avatar">
          <Image src="/foto-profile-nf.jpg" alt="Nur Fajar" fill sizes="140px" priority />
        </div>
      </div>

      <div className="ikigai-panel" style={activeRole ? ({ '--role-accent': roleColor(activeRole.id) } as React.CSSProperties) : undefined}>
        <AnimatePresence mode="wait">
          {activeRole ? (
            <motion.div
              key={activeRole.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <p className="mono ikigai-eyebrow">{activeRole.fullName}</p>
              <ul className="ikigai-skill-list mono">
                {activeRole.skills.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <p className="mono ikigai-eyebrow">Ikigai</p>
              <p className="ikigai-hint">Hover a circle — tap on mobile — for the skill set behind each role.</p>
              <ul className="ikigai-legend mono">
                {IKIGAI_ROLES.map((r) => (
                  <li key={r.id} style={{ '--role-accent': roleColor(r.id) } as React.CSSProperties}>
                    <i aria-hidden="true" />
                    {r.fullName}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
