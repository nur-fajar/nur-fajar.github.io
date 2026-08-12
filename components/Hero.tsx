'use client';

import { motion, type Variants } from 'framer-motion';

// v4's hero pattern: five lines/blocks, staggered fade-up on mount. Content
// is Nur Fajar's own positioning (see content/signals.ts, credibility.ts)
// condensed to the "hi, my name is / tagline / one paragraph / CTA" shape.
const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut', delay: i * 0.1 } }),
};

export default function Hero() {
  return (
    <section className="hero" id="top">
      <motion.p className="hero-eyebrow mono motion-safe" custom={0} variants={item} initial="hidden" animate="visible">
        Hi, my name is
      </motion.p>
      <motion.h1 className="hero-name motion-safe" custom={1} variants={item} initial="hidden" animate="visible">
        Nur Fajar.
      </motion.h1>
      <motion.h2 className="hero-tagline motion-safe" custom={2} variants={item} initial="hidden" animate="visible">
        I build people, not just curricula.
      </motion.h2>
      <motion.p className="hero-desc motion-safe" custom={3} variants={item} initial="hidden" animate="visible">
        I&apos;m a Learning &amp; Development specialist based in Tangerang, Indonesia, currently designing GenAI
        curricula and training programs at Terra Weather. I also build the automation underneath it — Python, LLM
        APIs, and a fleet of AI agents that keep the systems running.
      </motion.p>
      <motion.ul className="status-lamps mono motion-safe" custom={4} variants={item} initial="hidden" animate="visible">
        <li>Open to work</li>
        <li>Relocation OK</li>
        <li>Remote OK</li>
      </motion.ul>
      <motion.div className="hero-cta motion-safe" custom={5} variants={item} initial="hidden" animate="visible">
        <a className="btn" href="#experience">
          See my experience
        </a>
        <a className="btn btn-ghost" href="/nf.pdf" download="Nur-Fajar-CV-AI-LnD-2026.pdf" target="_blank" rel="noopener">
          Download CV
        </a>
      </motion.div>
    </section>
  );
}
