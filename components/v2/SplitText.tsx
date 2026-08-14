'use client';

/* ── Primitif kinetic typography untuk /v2 ───────────────────────────────
   Semua animasi di halaman ini menyasar TEKS, bukan background. Dua bentuk
   dasar yang dipakai berulang:

     <Letters>  — reveal huruf per huruf (dipakai sekali saja, di nama hero)
     <Words>    — reveal kata per kata, bisa on-mount atau saat masuk viewport

   Aturan aksesibilitas yang dipegang keduanya: teks utuh tetap ada untuk
   screen reader (satu elemen ber-aria-label, potongan huruf/kata ditandai
   aria-hidden), dan kelas .motion-safe dipasang di elemen terluar supaya
   fallback <noscript> di app/layout.tsx tetap menampilkan teks kalau JS
   mati. MotionConfig reducedMotion="user" (juga di layout) sudah meniadakan
   animasi ini untuk prefers-reduced-motion, jadi tidak perlu cabang sendiri. */

import { motion, type Variants } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';

const EASE = [0.16, 1, 0.3, 1] as const;

const letterVariants: Variants = {
  hidden: { opacity: 0, y: '0.45em' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.15 + i * 0.032, ease: EASE },
  }),
};

export function Letters({
  text,
  className,
  style,
}: {
  text: string;
  className?: string;
  style?: CSSProperties;
}) {
  let index = 0;
  return (
    <span className={`v2-split motion-safe${className ? ` ${className}` : ''}`} style={style} aria-label={text}>
      {text.split(' ').map((word, w) => (
        // Kata dibungkus supaya baris tetap pecah per kata, bukan per huruf.
        <span className="v2-split-word" key={`${word}-${w}`} aria-hidden="true">
          {word.split('').map((char, c) => (
            <span className="v2-split-clip" key={`${char}-${c}`}>
              <motion.span
                className="v2-split-char"
                custom={index++}
                variants={letterVariants}
                initial="hidden"
                animate="visible"
              >
                {char}
              </motion.span>
            </span>
          ))}
          {w < text.split(' ').length - 1 ? <span className="v2-split-space">&nbsp;</span> : null}
        </span>
      ))}
    </span>
  );
}

const wordVariants: Variants = {
  hidden: { opacity: 0, y: '0.6em', rotate: 1.5 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { duration: 0.62, delay: i * 0.055, ease: EASE },
  }),
};

export interface WordEmphasis {
  /** Kata (lowercase, tanpa tanda baca) yang dapat treatment visual beda. */
  word: string;
  className: string;
}

export function Words({
  text,
  className,
  delay = 0,
  trigger = 'view',
  emphasis = [],
  style,
}: {
  text: string;
  className?: string;
  /** Detik, ditambahkan ke stagger tiap kata. */
  delay?: number;
  /** 'mount' = jalan saat load, 'view' = jalan saat masuk viewport. */
  trigger?: 'mount' | 'view';
  emphasis?: WordEmphasis[];
  style?: CSSProperties;
}) {
  const words = text.split(' ');
  const animateProps =
    trigger === 'mount'
      ? { animate: 'visible' as const }
      : { whileInView: 'visible' as const, viewport: { once: true, amount: 0.4, margin: '0px 0px -12% 0px' } };

  return (
    <span className={`v2-split motion-safe${className ? ` ${className}` : ''}`} style={style} aria-label={text}>
      {words.map((word, i) => {
        const key = word.toLowerCase().replace(/[^a-z0-9]/g, '');
        const hit = emphasis.find((e) => e.word === key);
        return (
          <span className="v2-split-word" key={`${word}-${i}`} aria-hidden="true">
            <span className="v2-split-clip">
              <motion.span
                className={`v2-split-char${hit ? ` ${hit.className}` : ''}`}
                custom={i + delay / 0.055}
                variants={wordVariants}
                initial="hidden"
                {...animateProps}
              >
                {word}
              </motion.span>
            </span>
            {i < words.length - 1 ? <span className="v2-split-space">&nbsp;</span> : null}
          </span>
        );
      })}
    </span>
  );
}

/** Baris teks yang naik + fade saat masuk viewport — ritme "tenang".
    Dipakai Who I Am dan penutup The Path. */
export function Line({
  children,
  index = 0,
  className,
}: {
  children: ReactNode;
  index?: number;
  className?: string;
}) {
  return (
    <motion.p
      className={`motion-safe${className ? ` ${className}` : ''}`}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: EASE }}
    >
      {children}
    </motion.p>
  );
}
