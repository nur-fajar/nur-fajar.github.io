'use client';

/* Count-up untuk angka bergaya "1,000+" — StatCountUp di halaman root cuma
   bisa parse angka polos tanpa pemisah ribuan, dan komponen itu dipakai
   halaman live, jadi tidak diubah dari sini. Teks final di-render dari nilai
   asli sejak awal (state awal = `value`), jadi angka yang benar tidak pernah
   bergantung pada JS — animasi hanya lapisan di atasnya. */

import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';

export default function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView || reducedMotion) return;
    // "1,000+" → angka 1000, suffix "+"
    const m = value.match(/^([\d,]+)(.*)$/);
    if (!m) return;
    const target = parseInt(m[1].replace(/,/g, ''), 10);
    if (!Number.isFinite(target)) return;
    const suffix = m[2] ?? '';
    const controls = animate(0, target, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v).toLocaleString('en-US') + suffix),
      onComplete: () => setDisplay(value),
    });
    return () => controls.stop();
  }, [inView, reducedMotion, value]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
