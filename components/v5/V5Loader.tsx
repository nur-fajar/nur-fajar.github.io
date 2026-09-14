'use client';

import { useEffect, useState } from 'react';

/**
 * v5 loader: NF monogram plus a 0-100 counter, ~900ms.
 * Skips on revisit via sessionStorage and under reduced motion.
 */
export default function V5Loader() {
  const [done, setDone] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
    try {
      return sessionStorage.getItem('v5-seen') === '1';
    } catch {
      return false;
    }
  });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (done) return;
    let raf = 0;
    const start = performance.now();
    const span = 850;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / span);
      setCount(Math.round(p * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => {
          setDone(true);
          try {
            sessionStorage.setItem('v5-seen', '1');
          } catch {
            /* private mode: play once, never persist */
          }
        }, 120);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [done]);

  if (done) return null;
  return (
    <div className="v5-loader" aria-hidden="true">
      <p className="v5-loader__word">NF</p>
      <p className="v5-loader__count">{count}</p>
    </div>
  );
}
