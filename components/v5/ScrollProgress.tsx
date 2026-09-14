'use client';

import { m, useScroll, useSpring, useTransform } from 'framer-motion';

/** 2px top progress bar with a puzzle piece riding its tip. Decorative
 *  only, mirrors scrollbar; the piece is positioned via the same spring
 *  so it never desyncs from the bar. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.001 });
  /* Posisi keping mengikuti spring yang sama, jadi duduk persis di ujung
     bar yang sedang tumbuh - keping "terpasang" seiring halaman dibaca.
     Diclamp 0.2rem..100vw-1.2rem supaya keping tidak keluar viewport. */
  const x = useTransform(scaleX, (v) => `calc(${v} * (100vw - 1.4rem) + 0.2rem)`);
  return (
    <>
      <m.div className="v5-progress" style={{ scaleX }} aria-hidden="true" />
      <m.div className="v5-progress__piece" style={{ left: x }} aria-hidden="true" />
    </>
  );
}
