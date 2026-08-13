'use client';

/* ── Section wrapper — scroll reveal, done properly ──────────────────────
   The plain opacity fade-in-on-scroll got cut entirely in the last pass
   (it's a well-known AI-slop tell when it's the SAME fade on every single
   section). This brings it back with more craft instead of more of it:
   a short blur-to-clear + rise, spring-eased, staggered by `index` when a
   parent maps a list into it — closer to the kind of reveal you'd get from
   a 21st.dev/Aceternity primitive than a generic CSS fade. Still plays only
   once per element (`viewport={{ once: true }}`), and MotionConfig's
   reducedMotion="user" (see layout.tsx) collapses it to an instant, no-op
   transition under prefers-reduced-motion — nothing here needs its own
   reduced-motion branch. */

import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

const variants: Variants = {
  hidden: { opacity: 0, y: 22, filter: 'blur(6px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, delay: (i ?? 0) * 0.07, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Reveal({
  children,
  as = 'div',
  className,
  index = 0,
}: {
  children: ReactNode;
  index?: number;
  as?: 'div' | 'article' | 'li' | 'figure' | 'p' | 'ul' | 'ol';
  className?: string;
}) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className ? `${className} motion-safe` : 'motion-safe'}
      custom={index}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2, margin: '0px 0px -60px 0px' }}
    >
      {children}
    </MotionTag>
  );
}
