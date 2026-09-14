'use client';

import { m, useScroll, useSpring } from 'framer-motion';

/** 2px top progress bar. Decorative only, mirrors scrollbar. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.001 });
  return <m.div className="v5-progress" style={{ scaleX }} aria-hidden="true" />;
}
