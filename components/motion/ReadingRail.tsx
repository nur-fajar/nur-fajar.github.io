'use client';

/* ── Reading-progress rail ─────────────────────────────────────────────────
   A thin accent line in the text column's left margin that fills as the
   reader scrolls through it — a section-local reading indicator (the kind
   docs sites like Notion/Linear use), scoped to just this block of copy
   rather than the whole page. */

import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ReadingRail({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.75', 'end 0.4'] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="reading-rail-wrap" ref={ref}>
      <motion.span className="reading-rail motion-safe" style={{ scaleY }} aria-hidden="true" />
      {children}
    </div>
  );
}
