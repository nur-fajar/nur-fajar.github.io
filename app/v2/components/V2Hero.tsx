'use client';

/* ── Hero — motion signature: "intentional" ───────────────────────────────
   Everything here happens once, in a fixed sequence, on load: name typed
   in letter-by-letter, the "(you can call me NF)" aside lands after with a
   small bounce, then the tagline reveals word by word. Nothing loops.
   That deliberate, one-shot pacing is what makes it read as intentional
   rather than restless — the busier, looping motion is saved for The Path
   further down. */

import { useMemo, useState, type MouseEvent } from 'react';
import { motion } from 'framer-motion';
import SplitReveal from './SplitReveal';
import NameModal from './NameModal';

const NAME = 'Hi! My name is Nur Fajar';
const CHAR_STAGGER = 0.032;

function nameDuration(text: string) {
  return text.length * CHAR_STAGGER + 0.5;
}

export default function V2Hero() {
  const [modalOpen, setModalOpen] = useState(false);
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);

  const asideDelay = useMemo(() => nameDuration(NAME), []);
  const taglineDelay = asideDelay + 0.9;

  const openModal = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    setModalOpen(true);
  };

  return (
    <section className="v2-section v2-hero" id="v2-top">
      <div className="v2-hero-inner">
        <h1 className="v2-hero-name" aria-label={NAME}>
          {NAME.split('').map((ch, i) => (
            <motion.span
              key={i}
              className="v2-char motion-safe"
              aria-hidden="true"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, delay: i * CHAR_STAGGER, ease: [0.16, 1, 0.3, 1] }}
            >
              {ch === ' ' ? ' ' : ch}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="v2-hero-aside motion-safe"
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: asideDelay,
            duration: 0.55,
            ease: [0.34, 1.56, 0.64, 1], // small overshoot — the "micro-bounce"
          }}
        >
          (you can call me{' '}
          <button type="button" className="v2-nf-trigger" onClick={openModal}>
            NF
          </button>
          )
        </motion.p>

        <h2 className="v2-hero-tagline">
          <SplitReveal
            as="span"
            className="v2-hero-tagline-line"
            text="I build people,"
            delay={taglineDelay}
            emphasize="people"
          />
          <SplitReveal
            as="span"
            className="v2-hero-tagline-line"
            text="not just curricula."
            delay={taglineDelay + 0.45}
          />
        </h2>
      </div>

      <motion.div
        className="v2-scroll-cue motion-safe"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          opacity: { delay: taglineDelay + 1.2, duration: 0.6 },
          y: { delay: taglineDelay + 1.2, duration: 1.9, repeat: Infinity, ease: 'easeInOut' },
        }}
        aria-hidden="true"
      >
        <span className="mono">scroll</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </motion.div>

      <NameModal open={modalOpen} origin={origin} onClose={() => setModalOpen(false)} />
    </section>
  );
}
