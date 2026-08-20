'use client';

import { useRef, useState, type RefObject } from 'react';
import { useMotionValueEvent, useScroll } from 'framer-motion';

/**
 * Port dari logika scroll-progress di `nurfajar-scroll-pattern-comparison.html`
 * (§7 spec) ke Framer Motion.
 *
 * Demo vanilla-nya menghitung:
 *   total    = outer.offsetHeight - window.innerHeight
 *   scrolled = clamp(-outer.getBoundingClientRect().top, 0, total)
 *   progress = scrolled / total
 *
 * `useScroll` dengan offset ['start start', 'end end'] menghasilkan angka yang
 * persis sama: 0 ketika atas wrapper menyentuh atas viewport, 1 ketika bawah
 * wrapper menyentuh bawah viewport — yaitu tepat saat sticky child berhenti
 * menempel. Progress itu lalu dipetakan ke indeks step diskret lewat daftar
 * ambang batas, bukan lewat step mana yang kebetulan masuk viewport.
 */
export function usePinnedStep(thresholds: number[]) {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    let next = 0;
    for (let i = 0; i < thresholds.length; i += 1) {
      if (p >= thresholds[i]) next = i;
    }
    setStep((prev) => (prev === next ? prev : next));
  });

  return { ref: ref as RefObject<HTMLDivElement | null>, step, scrollYProgress };
}
