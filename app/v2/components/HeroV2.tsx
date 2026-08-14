'use client';

/* ── HERO ────────────────────────────────────────────────────────────────
   Motion signature: paling "diniatkan" — satu-satunya tempat di halaman ini
   yang pakai reveal huruf per huruf, dan urutannya berantai:
     nama (huruf per huruf) → "(you can call me NF)" (delay + micro-bounce)
     → tagline (reveal per kata, "people" ditegaskan)
   Scroll cue idle di bawah menandai halaman ini satu alur scroll panjang. */

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Letters, Words } from './SplitText';
import NfModal, { type ClickOrigin } from './NfModal';

const NAME = 'Hi! My name is Nur Fajar';
// Durasi kira-kira reveal nama: 0.15s delay awal + 0.032s per huruf.
const NAME_DURATION = 0.15 + NAME.replace(/ /g, '').length * 0.032;

export default function HeroV2() {
  const [origin, setOrigin] = useState<ClickOrigin | null>(null);

  return (
    <section className="v2-hero">
      <h1 className="v2-hero-name">
        <Letters text={NAME} />
      </h1>

      <motion.p
        className="v2-hero-alias motion-safe"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: NAME_DURATION + 0.15,
          // Micro-bounce: spring lembut dengan sedikit overshoot.
          type: 'spring',
          stiffness: 420,
          damping: 12,
          mass: 0.6,
        }}
      >
        (you can call me{' '}
        <button
          type="button"
          className="v2-nf"
          onClick={(e) => setOrigin({ x: e.clientX, y: e.clientY })}
          aria-haspopup="dialog"
        >
          NF
        </button>
        )
      </motion.p>

      <p className="v2-hero-tagline">
        <Words
          text="I build people, not just curricula."
          trigger="mount"
          delay={NAME_DURATION + 0.45}
          emphasis={[{ word: 'people', className: 'v2-emph' }]}
        />
      </p>

      <motion.div
        className="v2-scroll-cue mono motion-safe"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: NAME_DURATION + 1.4, duration: 0.8 }}
      >
        <span>scroll</span>
        <motion.span
          className="v2-scroll-cue-line"
          style={{ transformOrigin: 'top' }}
          animate={{ scaleY: [0.3, 1, 0.3] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      <AnimatePresence>{origin && <NfModal origin={origin} onClose={() => setOrigin(null)} />}</AnimatePresence>
    </section>
  );
}
