'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import RevealWords from './motion/RevealWords';
import MagneticButton from './motion/MagneticButton';
import HeroField from './motion/HeroField';

// v4's hero pattern: five lines/blocks, staggered fade-up on mount. Content
// is Nur Fajar's own positioning (see content/signals.ts, credibility.ts)
// condensed to the "hi, my name is / tagline / one paragraph / CTA" shape.
// Name + tagline get a word-by-word mask reveal (RevealWords) instead —
// they're the two lines meant to land hardest — everything else below
// still uses the plain fade-up.
const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut', delay: i } }),
};

function timeGreeting(hour: number) {
  if (hour < 12) return 'Good morning, my name is';
  if (hour < 18) return 'Good afternoon, my name is';
  return 'Good evening, my name is';
}

function ScrollCue() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);
  return (
    <motion.a
      href="#about"
      className="hero-scroll-cue motion-safe"
      aria-label="Scroll to About section"
      style={{ opacity }}
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 5v14M5 12l7 7 7-7" />
      </svg>
    </motion.a>
  );
}

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const [greeting, setGreeting] = useState('Hi, my name is');

  // Time-based greeting: SSR/first paint renders the neutral default so
  // there's nothing to hydrate-mismatch on; the client swaps it in right
  // after mount, before the eyebrow's own reveal animation has finished.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setGreeting(timeGreeting(new Date().getHours())), []);

  // Scroll-linked parallax exit: as the hero scrolls past, its content
  // fades, lifts, and shrinks slightly faster than the scroll itself, so
  // it reads as sinking behind About rather than getting cut off flat.
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const exitOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const exitY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const exitScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  return (
    <section className="hero" id="top" ref={heroRef}>
      <HeroField />

      <motion.div className="hero-content" style={{ opacity: exitOpacity, y: exitY, scale: exitScale }}>
        <motion.p className="hero-eyebrow mono motion-safe" custom={0} variants={item} initial="hidden" animate="visible">
          {greeting}
        </motion.p>

        <div className="hero-name-wrap">
          <RevealWords as="h1" className="hero-name motion-safe" text="Nur Fajar." delay={0.15} />
          {/* Kinetic underline — draws itself in once the name has landed.
              Anchored under the name (never wraps) rather than the longer
              tagline, which does on narrow viewports. */}
          <motion.svg
            className="hero-name-underline"
            viewBox="0 0 160 6"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <motion.path
              d="M2,3 L158,3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.svg>
        </div>

        <RevealWords as="h2" className="hero-tagline motion-safe" text="I build people, not just curricula." delay={0.5} />

        <motion.p className="hero-desc motion-safe" custom={1.5} variants={item} initial="hidden" animate="visible">
          I&apos;m a Learning &amp; Development specialist based in Tangerang, Indonesia, currently designing GenAI
          curricula and training programs at Terra Weather. I also build the automation underneath it — Python, LLM
          APIs, and a fleet of AI agents that keep the systems running.
        </motion.p>

        <motion.ul className="status-lamps mono motion-safe" custom={1.7} variants={item} initial="hidden" animate="visible">
          <li>
            <span className="lamp-dot" aria-hidden="true" />
            Open to work
          </li>
          <li>
            <span className="lamp-dot" aria-hidden="true" />
            Relocation OK
          </li>
          <li>
            <span className="lamp-dot" aria-hidden="true" />
            Remote OK
          </li>
        </motion.ul>

        <motion.div className="hero-cta motion-safe" custom={1.9} variants={item} initial="hidden" animate="visible">
          <MagneticButton className="btn" href="#experience">
            See my experience
          </MagneticButton>
          <MagneticButton className="btn btn-ghost" href="/nf.pdf" download="Nur-Fajar-CV-AI-LnD-2026.pdf" target="_blank" rel="noopener">
            Download CV
          </MagneticButton>
        </motion.div>
      </motion.div>

      <ScrollCue />
    </section>
  );
}
