'use client';

/* ── Hero background field ────────────────────────────────────────────────
   A faint grid (echoing the mecha/armor-plate motif) plus a handful of
   slow-drifting nodes connected by thin lines — a quieter callback to the
   node-diagram visuals used for the pipeline/program cards in Work.tsx.
   Fully decorative: aria-hidden, pointer-events: none, and inert under
   prefers-reduced-motion via MotionConfig's global reducedMotion="user". */

import { motion } from 'framer-motion';

const NODES = [
  { x: 8, y: 22 },
  { x: 88, y: 12 },
  { x: 94, y: 58 },
  { x: 18, y: 78 },
  { x: 58, y: 90 },
  { x: 72, y: 38 },
];

const LINKS: [number, number][] = [
  [0, 1],
  [1, 5],
  [5, 2],
  [0, 3],
  [3, 4],
  [4, 5],
];

export default function HeroField() {
  return (
    <div className="hero-field" aria-hidden="true">
      <svg className="hero-field-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
        {LINKS.map(([a, b], i) => (
          <line key={i} x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y} />
        ))}
      </svg>
      {NODES.map((n, i) => (
        <motion.span
          key={i}
          className="hero-field-node motion-safe"
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5 + (i % 3), repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
        />
      ))}
    </div>
  );
}
