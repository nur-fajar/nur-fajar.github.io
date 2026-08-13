'use client';

/* ── Scroll-scrubbed paragraph ─────────────────────────────────────────────
   Unlike Reveal (a one-shot fade that plays once and stays), this ties
   opacity directly to scroll position: the paragraph brightens as it
   crosses the lower half of the viewport and stays lit, but dims again if
   the user scrolls back up past it — a continuous "scrub", not a trigger.
   Framer Motion's MotionConfig reducedMotion="user" (layout.tsx) can't
   neutralize a scroll-linked value the way it does a spring/tween, so this
   opts out explicitly under prefers-reduced-motion instead. */

import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

export default function ScrubText({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.92', 'start 0.45'] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0.35, 1]);

  return (
    <motion.p ref={ref} className={className ? `${className} motion-safe` : 'motion-safe'} style={reducedMotion ? undefined : { opacity }}>
      {children}
    </motion.p>
  );
}
