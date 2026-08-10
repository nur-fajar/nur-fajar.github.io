'use client';

/* Thin warmth→signal gradient bar tracking scroll position — the one piece
   of constant visual feedback while scrolling a long single-page site, so
   the page reads as "moving" rather than a static document you happen to
   be paging down. useSpring smooths the raw scroll fraction so it settles
   instead of stepping. */

import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 32, restDelta: 0.001 });
  return <motion.div className="scroll-progress motion-safe" style={{ scaleX }} />;
}
