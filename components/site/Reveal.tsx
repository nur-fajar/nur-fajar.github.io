'use client';

import { m, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Reveal fade + rise, satu kali saja.
 *
 * Komponen ini sengaja hanya bisa melakukan satu hal, memunculkan sebuah blok,
 * supaya tidak ada godaan menggerakkan angka, testimoni, atau tanggal. Data
 * tidak bergerak; yang bergerak hanya urutan munculnya.
 *
 * `once: true` penting: elemen yang muncul-hilang-muncul saat pengguna scroll
 * naik-turun terbaca sebagai bug, bukan sebagai polish.
 */
export default function Reveal({
  children,
  delay = 0,
  amount = 0.25,
  as = 'div',
  className,
}: {
  children: ReactNode;
  delay?: number;
  amount?: number;
  as?: 'div' | 'li' | 'section' | 'article';
  className?: string;
}) {
  const reduced = useReducedMotion();
  const MotionTag = m[as] as typeof m.div;

  if (reduced) return <MotionTag className={className}>{children}</MotionTag>;

  return (
    <MotionTag
      className={className ? `${className} motion-safe` : 'motion-safe'}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  );
}
