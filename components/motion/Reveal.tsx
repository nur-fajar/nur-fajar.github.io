'use client';

/* ── Scroll reveal, the Framer Motion replacement for the old GSAP +
   ScrollTrigger layer ─────────────────────────────────────────────────────
   Same restraint as the original motion.js: 14px of travel, not 60 — this
   marks a section boundary, not a performance. `viewport={{ once: true }}`
   means it plays once and then gets out of the way, and MotionConfig at the
   root (see layout.tsx) already collapses all of this to an instant, no-op
   transition under prefers-reduced-motion — no manual reduced-motion checks
   needed here, unlike the canvas widgets which drive their own RAF loops. */

import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

const TAGS = {
  div: motion.div,
  article: motion.article,
  li: motion.li,
  details: motion.details,
  figure: motion.figure,
} as const;

const variants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

export default function Reveal({
  children,
  index = 0,
  as = 'div',
  className,
}: {
  children: ReactNode;
  index?: number;
  as?: keyof typeof TAGS;
  className?: string;
}) {
  const MotionTag = TAGS[as];
  return (
    <MotionTag
      className={className ? `${className} motion-safe` : 'motion-safe'}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: Math.min(index, 8) * 0.07 }}
    >
      {children}
    </MotionTag>
  );
}
