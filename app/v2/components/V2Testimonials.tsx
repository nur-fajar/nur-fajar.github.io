'use client';

/* ── Testimonials — motion signature: "calm, again" ───────────────────────
   After The Path's density, the ritm settles back down: one testimonial at
   a time, crossfading, auto-advancing slowly. Within each slide the quote
   lands first and the name/role follow half a beat later — attribution as
   a small reveal of its own, not simultaneous with the quote. */

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { REFERENCES } from '@/content/references';

const NAMES = ['Christian Jonathan', 'Kevin Naufal Eryogia', 'Andrew Benedictus Jamesie'];
const QUOTES = REFERENCES.filter((r) => NAMES.includes(r.name));

const AUTO_MS = 6500;

export default function V2Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % QUOTES.length), AUTO_MS);
    return () => clearInterval(id);
  }, [paused]);

  const r = QUOTES[index];

  return (
    <section
      className="v2-section v2-testimonials"
      id="v2-testimonials"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="v2-testimonials-stage">
        <AnimatePresence mode="wait">
          <motion.figure
            key={r.name}
            className="v2-testimonial motion-safe"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            <motion.blockquote
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              &ldquo;{r.quote}&rdquo;
            </motion.blockquote>
            <motion.figcaption
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="v2-testimonial-name">{r.name}</span>
              <span className="v2-testimonial-role mono">{r.role}</span>
            </motion.figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      <div className="v2-testimonial-dots" role="tablist" aria-label="Testimonials">
        {QUOTES.map((q, i) => (
          <button
            key={q.name}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Show testimonial from ${q.name}`}
            className={`v2-testimonial-dot${i === index ? ' is-active' : ''}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}
