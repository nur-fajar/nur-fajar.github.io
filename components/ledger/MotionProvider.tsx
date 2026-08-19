'use client';

import { domAnimation, LazyMotion, MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Satu boundary client untuk seluruh lapisan motion situs.
 *
 * `domAnimation` adalah feature bundle Framer Motion yang berisi persis apa
 * yang dipakai halaman ini — animasi, variants, exit, dan gesture termasuk
 * `inView` yang menggerakkan setiap reveal-on-scroll. Yang TIDAK ikut: layout
 * animation dan drag, dua fitur paling mahal di library, dan tidak satu pun
 * dipakai di sini. Perbedaannya nyata di bundle, bukan teoretis.
 *
 * `strict` membuat komponen `motion.*` melempar error kalau ada yang memakainya
 * — satu-satunya cara memastikan bundle lengkap tidak diam-diam masuk lagi
 * lewat satu import yang lupa diganti jadi `m.*`.
 *
 * `reducedMotion="user"` meruntuhkan setiap animasi jadi no-op instan di bawah
 * prefers-reduced-motion, satu tempat untuk seluruh pohon komponen.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
