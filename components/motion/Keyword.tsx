'use client';

/* ── Keyword sweep ─────────────────────────────────────────────────────────
   The institution names in About's copy (Universitas Siliwangi, Bangkit
   Academy) get an underline that draws itself in once scrolled into view,
   instead of the plain grow-on-hover .inline-link used to have — those two
   names are exactly what a skimming reader should land on first. */

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export default function Keyword({ children }: { children: ReactNode }) {
  return (
    <span className="keyword">
      {children}
      <motion.span
        className="keyword-sweep motion-safe"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.9 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      />
    </span>
  );
}
