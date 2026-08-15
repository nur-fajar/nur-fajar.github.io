'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

/**
 * Bungkus scroller cerita. `.story-scroller` sudah punya `margin-bottom: 100vh`
 * sebagai jatah scroll untuk menyingkap footer di baliknya (lihat komentar di
 * `app/page.tsx`) — tapi tanpa treatment apa pun di scroller itu sendiri, efeknya
 * cuma kelihatan seperti footer merayap naik dari tepi bawah layar, bukan seperti
 * halaman ini "menutup" untuk membukanya.
 *
 * Di sinilah closing-nya terjadi: begitu scroll masuk jatah 100vh itu, lapisan
 * ini sedikit mengecil dan meredup, seolah ditarik menjauh seperti tutup —
 * footer di baliknya pun terasa tersingkap, bukan muncul dari bawah.
 *
 * `useScroll` diukur terhadap elemen ini sendiri dengan offset
 * `['end end', 'end start']`: progress 0 persis saat tepi bawah elemen
 * menyentuh tepi bawah viewport (awal jatah reveal), progress 1 saat tepi
 * bawah elemen itu keluar dari tepi atas viewport (reveal selesai). Rentang
 * itu otomatis sama persis dengan jatah `margin-bottom: 100vh` di CSS, jadi
 * animasinya selalu pas sepanjang scroll reveal — tidak perlu disinkron manual.
 *
 * `StoryNav` sengaja TIDAK dipasang di dalam elemen ini: ia `position: fixed`,
 * dan transform CSS apa pun pada leluhurnya menjadikan leluhur itu containing
 * block baru untuk fixed descendant — navbar akan ikut mengecil/bergeser
 * alih-alih tetap menempel di viewport. Ia dipasang sebagai saudara di
 * `app/page.tsx`, di luar bungkus ini.
 */
export default function StoryScrollerFrame({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['end end', 'end start'] });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const brightness = useTransform(scrollYProgress, [0, 1], [1, 0.55]);
  const filter = useTransform(brightness, (b) => `brightness(${b})`);

  return (
    <motion.div ref={ref} className="story-scroller" style={reduce ? undefined : { scale, filter }}>
      {children}
    </motion.div>
  );
}
