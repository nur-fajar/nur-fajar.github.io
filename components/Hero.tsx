'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import RevealWords from './motion/RevealWords';
import MagneticButton from './motion/MagneticButton';
import HeroField from './motion/HeroField';
import TypewriterGreeting from './motion/TypewriterGreeting';
import Marquee from './motion/Marquee';

// Content is Nur Fajar's own positioning (see content/signals.ts,
// credibility.ts) condensed to the "hi! I'm / tagline / roles / paragraph /
// CTA" shape. The name now only appears inline in the small eyebrow line —
// the tagline is the one giant headline carrying the hero, so it's the
// element that gets the word-by-word mask reveal (RevealWords); everything
// else uses the plain fade-up.
const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut', delay: i } }),
};

// "a"/"an" prefixed per role (matches the mockup's spoken-aloud phrasing) —
// "an" only for the one that starts on a vowel sound.
const ROLES = [
  'a Learning and Development Specialist',
  'a Curriculum Developer',
  'an Instructional Designer',
  'a Program Manager',
];

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
        <motion.p className="hero-eyebrow motion-safe" custom={0} variants={item} initial="hidden" animate="visible">
          <TypewriterGreeting className="hero-greeting-typed" />
          <span>! I&apos;m Nur Fajar</span>
        </motion.p>

        {/* Two explicit lines (not just a wide h1 that happens to wrap) —
            "Not Just Curricula." always starts its own line, desktop and
            mobile alike, instead of wherever the viewport width forces a
            break. */}
        <h1 className="hero-tagline">
          <RevealWords as="span" className="hero-tagline-line motion-safe" text="I Build People," delay={0.15} />
          <RevealWords as="span" className="hero-tagline-line motion-safe" text="Not Just Curricula." delay={0.36} />
        </h1>

        <motion.div className="hero-roles-marquee motion-safe" custom={1.2} variants={item} initial="hidden" animate="visible">
          <Marquee items={ROLES} />
        </motion.div>

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
