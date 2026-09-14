'use client';

import { useEffect, useState } from 'react';

/**
 * v5 loader: NF monogram plus a thin CSS progress line, ~500ms.
 * Skips on revisit via sessionStorage and under reduced motion.
 *
 * Sengaja TIDAK ada counter angka: teks yang berubah tiap frame
 * mendaftarkan ulang kandidat LCP sampai akhir hydration (terukur:
 * LCP naik ke 4.4s karena update terakhir counter). Bar progres
 * bergerak lewat transform CSS di compositor, jadi tidak pernah
 * repaint dan tidak menyentuh LCP.
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

  useEffect(() => {
    if (done) return;
    const id = window.setTimeout(() => {
      setDone(true);
      try {
        sessionStorage.setItem('v5-seen', '1');
      } catch {
        /* private mode: play once, never persist */
      }
    }, 520);
    return () => window.clearTimeout(id);
  }, [done]);

  if (done) return null;
  return (
    <div className="v5-loader" aria-hidden="true">
      <p className="v5-loader__word">NF</p>
      <div className="v5-loader__bar" />
    </div>
  );
}


