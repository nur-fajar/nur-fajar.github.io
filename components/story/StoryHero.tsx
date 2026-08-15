'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

/**
 * Hero. Chat bubble "you also can call me NF :D" duduk PERSIS DI ATAS nama,
 * dengan ekor menunjuk ke bawah ke arah kata "Nur Fajar" — menempel secara
 * visual tapi tidak menutupi satu huruf pun. Ia bertahan selama pengunjung
 * masih di hero, dan baru menghilang begitu halaman mulai di-scroll.
 */
export default function StoryHero() {
  const reduce = useReducedMotion();
  const [bubble, setBubble] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBubble(true), 900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section id="story-hero" className="story-section story-hero">
      <h1 className="story-sr">Nur Fajar — I build people, not just curricula</h1>

      <motion.p
        className="story-hero__greet"
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      >
        Hi! My name is{' '}
        <span className="story-hero__name">
          Nur Fajar.
          <AnimatePresence>
            {bubble && !scrolled && (
              <motion.span
                className="story-bubble"
                aria-hidden="true"
                initial={{ opacity: 0, scale: 0.6, rotate: -5, y: 10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 6, transition: { duration: 0.28 } }}
                transition={{ type: 'spring', stiffness: 420, damping: 17 }}
              >
                you also can call me NF 😄
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </motion.p>

      <motion.p
        className="story-hero__thesis"
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.15, ease: 'easeOut' }}
      >
        I build <em>people,</em>
        <br />
        not just curricula.
      </motion.p>

      <motion.div
        className="story-scrollcue"
        aria-hidden="true"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: scrolled ? 0 : 1 }}
        transition={{ duration: 1, delay: scrolled ? 0 : 1.6 }}
      >
        <span>Scroll</span>
        <span className="story-scrollcue__line" />
      </motion.div>
    </section>
  );
}
