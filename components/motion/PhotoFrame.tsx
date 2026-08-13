'use client';

/* ── About's photo treatment ───────────────────────────────────────────────
   Replaces the v4-style offset blue box with three things instead:
   1. A clip-path reveal that "opens" the frame in from the right once it
      scrolls into view. Driven by a plain CSS transition off a boolean
      class (`useInView` + `is-in-view`), not Framer Motion's own
      `animate`/`whileInView` on a `clipPath` value.
      The `useInView` ref sits on an *outer*, unclipped wrapper rather than
      the clipped element itself — Chromium's IntersectionObserver folds an
      element's own `clip-path` into its intersection-ratio calculation, so
      an element clipped to zero visible width reports `intersectionRatio:
      0` forever (confirmed directly against a native IntersectionObserver:
      `isIntersecting: true`, `intersectionRatio: 0`) — it can never cross
      the `amount` threshold needed to un-clip itself. Watching an
      unclipped ancestor instead sidesteps that entirely.
   2. A HUD/viewfinder corner-bracket frame (mecha callback) that draws
      itself in right after via `pathLength` on `motion.path` — those sit
      one level deeper (inside the clipped element, not clipped
      themselves), so Framer's own `whileInView` works fine for them.
   3. A subtle cursor-tilt on hover/pointer-move — the photo itself still
      does the existing grayscale → color swap (plain CSS, unchanged) as
      the main "you're looking at it" cue. */

import { useRef, type MouseEvent, type ReactNode } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';

const TILT_RANGE = 8; // deg, max rotation either way

export default function PhotoFrame({ children }: { children: ReactNode }) {
  const watchRef = useRef<HTMLDivElement>(null);
  const inView = useInView(watchRef, { once: true, amount: 0.4 });

  const tiltRef = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 20, mass: 0.5 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 20, mass: 0.5 });

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = tiltRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * TILT_RANGE * 2);
    rotateX.set(py * -TILT_RANGE * 2);
  };
  const onMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div ref={watchRef} className="photo-watch">
      <div className={`photo-reveal motion-safe${inView ? ' is-in-view' : ''}`}>
        <motion.div
          ref={tiltRef}
          className="photo-tilt"
          style={{ rotateX: springX, rotateY: springY }}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
        >
          {children}

          <svg className="photo-hud" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {[
              'M4,16 L4,4 L16,4', // top-left
              'M84,4 L96,4 L96,16', // top-right
              'M96,84 L96,96 L84,96', // bottom-right
              'M16,96 L4,96 L4,84', // bottom-left
            ].map((d, i) => (
              <motion.path
                key={d}
                d={d}
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}
          </svg>
        </motion.div>
      </div>
    </div>
  );
}
