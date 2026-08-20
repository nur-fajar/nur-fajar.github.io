'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CLOSING_WORDS } from '@/components/story/data';

/**
 * Kata terakhir kalimat penutup yang berganti-ganti — company → startup →
 * business → … — di sini dibingkai sebagai readout penargetan yang mengunci
 * sasaran baru tiap beberapa detik.
 *
 * Trik pengukur lebarnya sengaja sama persis dengan `WordRoller` di
 * `components/story/StoryClosing.tsx`: semua kata ditumpuk tak terlihat di satu
 * sel grid supaya lebar kotaknya otomatis selebar kata terlebar yang
 * BENAR-BENAR dirender. Menebak dari jumlah huruf tidak cukup, dan kotak yang
 * lebarnya ikut berubah tiap kata akan membuat kalimatnya mengalir ulang tiap
 * 2 detik.
 *
 * `prefers-reduced-motion` mematikan PERGANTIANNYA saja, bukan bentuk yang
 * dirender: `useReducedMotion` selalu mengembalikan `null` di server dan baru
 * bernilai benar setelah mount, jadi merender markup yang berbeda untuk kasus
 * itu akan membuat HTML server dan render klien berselisih — hydration
 * mismatch, dan React membuang lalu membangun ulang seluruh cabangnya. Karena
 * strukturnya kini sama di kedua keadaan, yang perlu dijaga cuma intervalnya.
 */
export default function TargetWord() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((v) => (v + 1) % CLOSING_WORDS.length), 2100);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <span className="tw">
      <span className="tw__ghost" aria-hidden="true">
        {CLOSING_WORDS.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </span>
      <span className="tw__clip">
        <AnimatePresence initial={false}>
          <motion.span
            key={CLOSING_WORDS[i]}
            className="tw__word"
            initial={{ y: '90%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: '-90%', opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          >
            {CLOSING_WORDS[i]}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="tw__lock" aria-hidden="true" />
    </span>
  );
}
