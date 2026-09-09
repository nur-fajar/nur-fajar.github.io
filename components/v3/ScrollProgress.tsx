'use client';

import { m, useScroll, useSpring } from 'framer-motion';

/**
 * Bar 4px di tepi atas viewport, memanjang dari kiri mengikuti posisi scroll.
 *
 * Satu-satunya penanda seberapa jauh pembaca sudah berjalan di halaman
 * sepanjang ini. Tanpa batas halaman, tidak ada cara lain untuk tahu apakah
 * masih ada dua section lagi atau enam.
 *
 * Dibungkus useSpring supaya tidak menyentak saat scroll cepat. Kalau
 * pengguna meminta reduced motion, MotionConfig di MotionProvider sudah
 * meruntuhkan animasinya jadi no-op, jadi barnya tetap akurat tapi berhenti
 * mengejar.
 *
 * Ia murni dekoratif dalam arti sesungguhnya: tidak ada informasi di sini
 * yang tidak sudah dibawa scrollbar browser, jadi aria-hidden.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.001 });

  return <m.div className="v3-progress" style={{ scaleX }} aria-hidden="true" />;
}
