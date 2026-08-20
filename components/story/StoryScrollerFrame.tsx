'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform, useReducedMotion } from 'framer-motion';

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
  // `brightness(1)` BUKAN no-op buat browser: begitu ada properti `filter`,
  // elemen setinggi dokumen ini jadi satu render surface yang harus di-raster
  // utuh — sepanjang scroll, bukan cuma di jatah reveal. Di HP itu cukup untuk
  // membuat raster ketinggalan waktu scroll cepat, dan setiap petak yang belum
  // sempat digambar membocorkan footer di baliknya. Jadi selama belum meredup,
  // jangan pasang filter sama sekali.
  const filter = useTransform(scrollYProgress, (p) => (p === 0 ? 'none' : `brightness(${1 - p * 0.45})`));

  // Footer-nya `position: fixed` satu layar penuh dan duduk DI BALIK scroller
  // sepanjang halaman — jadi apa pun yang membuat scroller bolong sesaat
  // (raster ketinggalan saat pengunjung baru scroll kencang di HP) langsung
  // memperlihatkan footer di tengah cerita. Ia tidak perlu tergambar sebelum
  // jatah reveal-nya dimulai: tandai <html> begitu progress-nya lepas dari 0
  // — sama seperti `StoryThemeToggle` menandai tema — dan `story.css` yang
  // menyembunyikannya sebelum itu. Kalau tandanya gagal dipasang, yang bocor
  // cuma background `--ink` milik body: warna yang sama dengan scroller.
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    document.documentElement.toggleAttribute('data-story-revealing', p > 0);
  });

  // `change` cuma jalan kalau nilainya bergerak; halaman yang dibuka langsung
  // di posisi bawah (reload) perlu disinkronkan sekali di mount.
  useEffect(() => {
    const root = document.documentElement;
    root.toggleAttribute('data-story-revealing', scrollYProgress.get() > 0);
    return () => root.removeAttribute('data-story-revealing');
  }, [scrollYProgress]);

  return (
    <motion.div ref={ref} className="story-scroller" style={reduce ? undefined : { scale, filter }}>
      {children}
    </motion.div>
  );
}
