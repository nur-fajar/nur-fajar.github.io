'use client';

/* ── TESTIMONIALS ────────────────────────────────────────────────────────
   Data-nya di-reuse dari content/references.ts (sumber yang sama dengan
   halaman root), disaring ke 3 nama yang diminta brief /v2.

   Motion signature: sengaja turun ritmenya setelah Skills yang interaktif —
   crossfade carousel, satu kutipan sekali tampil, tanpa gerakan lain di
   layar. Kutipan fade in duluan, nama/role menyusul dengan delay, jadi mata
   membaca isinya dulu baru sumbernya. */

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { REFERENCES } from '@/content/references';

const EASE = [0.16, 1, 0.3, 1] as const;
const NAMES = ['Christian Jonathan', 'Kevin Naufal Eryogia', 'Andrew Benedictus Jamesie'];
const PICKED = NAMES.map((n) => REFERENCES.find((r) => r.name === n)!).filter(Boolean);

export default function TestimonialsV2() {
  const [i, setI] = useState(0);
  const active = PICKED[i];

  return (
    <section className="v2-section v2-quotes" aria-label="Testimonials">
      <div className="v2-quote-stage">
        <AnimatePresence mode="wait">
          <motion.figure
            key={active.name}
            className="v2-quote motion-safe"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <motion.blockquote
              className="v2-quote-text motion-safe"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              “{active.quote}”
            </motion.blockquote>
            <motion.figcaption
              className="v2-quote-by motion-safe"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35, ease: EASE }}
            >
              <span className="v2-quote-name">{active.name}</span>
              <span className="mono v2-quote-role">{active.role}</span>
            </motion.figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      <div className="v2-quote-nav" role="tablist" aria-label="Choose a testimonial">
        {PICKED.map((r, idx) => (
          <button
            key={r.name}
            type="button"
            role="tab"
            aria-selected={idx === i}
            aria-label={`Testimonial from ${r.name}`}
            className={`v2-quote-dot${idx === i ? ' is-active' : ''}`}
            onClick={() => setI(idx)}
          />
        ))}
      </div>
    </section>
  );
}
