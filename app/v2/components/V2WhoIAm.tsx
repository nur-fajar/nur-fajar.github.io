'use client';

/* ── Who I Am — motion signature: "calm" ──────────────────────────────────
   The first quiet beat after the hero. Each line wipes in via a clip-path
   tied directly to scroll progress (not a whileInView trigger) — the text
   reveals exactly as fast as you scroll, then stops moving the moment you
   stop scrolling. That scroll-locked feel is the calm counterpart to the
   busier, spring-driven motion elsewhere on the page. */

import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import StatCountUp from '@/components/motion/StatCountUp';

function ClipLine({
  progress,
  range,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  children: ReactNode;
}) {
  const clip = useTransform(progress, range, [100, 0]);
  const clipPath = useTransform(clip, (v) => `inset(0 ${v}% 0 0)`);
  const opacity = useTransform(progress, [range[0], range[0] + (range[1] - range[0]) * 0.4], [0, 1]);
  const y = useTransform(progress, range, [18, 0]);

  return (
    <motion.p className="v2-whoiam-line motion-safe" style={{ clipPath, opacity, y }}>
      {children}
    </motion.p>
  );
}

export default function V2WhoIAm() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'start 0.15'] });

  return (
    <section className="v2-section v2-whoiam" id="v2-who" ref={ref}>
      <div className="v2-whoiam-inner">
        <ClipLine progress={scrollYProgress} range={[0, 0.4]}>
          I run the full cycle of Learning &amp; Development — end-to-end, as a program manager, from design to
          delivery to evaluation.
        </ClipLine>
        <ClipLine progress={scrollYProgress} range={[0.4, 0.85]}>
          I also love building things with AI. This site is one example. So is an AI agent I embedded into my
          company&apos;s CRM — it now does the work of <StatCountUp value="1,000+" /> human-hours, automatically.
        </ClipLine>
      </div>
    </section>
  );
}
