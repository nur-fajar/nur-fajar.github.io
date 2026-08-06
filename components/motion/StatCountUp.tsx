'use client';

/* Counts up from 0 to the stat's real value once it scrolls into view. The
   final text is parsed from `value` itself (never hand-typed twice), and
   restored exactly on completion — and immediately, with no animation, under
   prefers-reduced-motion — so nothing ever depends on this JS to be
   readable; it only ever adds motion on top of text that was already
   correct. */

import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';

export default function StatCountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.9 });
  const reducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView) return;
    // display already equals `value` (its initial state) until this effect
    // starts an animation, so reduced-motion just means: never start one.
    if (reducedMotion) return;
    const m = value.match(/^([0-9]+(?:\.[0-9]+)?)(.*)$/);
    if (!m) return;
    const target = parseFloat(m[1]);
    const suffix = m[2] || '';
    const decimals = (m[1].split('.')[1] || '').length;
    const controls = animate(0, target, {
      duration: 1.1,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(v.toFixed(decimals) + suffix),
      onComplete: () => setDisplay(value),
    });
    return () => controls.stop();
  }, [inView, reducedMotion, value]);

  return (
    <span className="stat-n" ref={ref}>
      {display}
    </span>
  );
}
