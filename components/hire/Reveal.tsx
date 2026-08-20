'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Reveal "pelat armor mengunci": panel meluncur naik sedikit lalu berhenti
 * dengan sentakan pendek, bukan melayang halus.
 *
 * Kelas `.motion-safe` WAJIB ikut terpasang: Framer memanggang state `initial`
 * (opacity 0) ke dalam HTML yang dirender server, dan aturan `<noscript>` di
 * app/layout.tsx memakai kelas itu untuk memaksa elemennya terlihat kalau JS
 * tidak pernah jalan. Tanpa kelas itu, isi section ini akan hilang permanen
 * bagi siapa pun yang JS-nya mati.
 *
 * `prefers-reduced-motion` sudah ditangani satu tingkat di atas oleh
 * `<MotionConfig reducedMotion="user">` di layout — tidak perlu diperiksa lagi
 * di sini.
 */
export default function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`motion-safe ${className}`.trim()}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1.02, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
