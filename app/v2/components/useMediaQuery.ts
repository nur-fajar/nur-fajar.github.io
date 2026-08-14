'use client';

/* Hook media query kecil untuk /v2. Dipakai dua hal: mematikan animasi
   scroll-linked yang lebih berat di layar kecil / device mid-range, dan
   memilih interaksi hover vs tap di section Skills.

   Default-nya `false` di server dan render pertama, lalu di-set setelah
   mount — jadi tidak ada hydration mismatch, dan varian "murah" (tanpa
   scroll-linked, mode accordion) yang jadi baseline. */

import { useEffect, useState } from 'react';

export default function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [query]);

  return matches;
}
