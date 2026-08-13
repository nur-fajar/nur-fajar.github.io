'use client';

/* ── Magnetic button ──────────────────────────────────────────────────────
   The button nudges a few px toward the cursor as it approaches, spring-
   loaded back to rest on mouse leave. A standard micro-interaction on
   premium portfolios; MotionConfig's reducedMotion="user" (layout.tsx)
   already collapses the spring to an instant snap under
   prefers-reduced-motion, so there's no separate reduced-motion branch
   needed here. */

import { useRef, type MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, type HTMLMotionProps } from 'framer-motion';

export default function MagneticButton({
  children,
  strength = 0.35,
  ...props
}: HTMLMotionProps<'a'> & { strength?: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  const onMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };
  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a ref={ref} style={{ x: springX, y: springY }} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} {...props}>
      {children}
    </motion.a>
  );
}
