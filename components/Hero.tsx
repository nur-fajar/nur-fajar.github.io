'use client';

import { motion, type Variants } from 'framer-motion';
import StatCountUp from './motion/StatCountUp';

const STATS = [
  ['350+', 'Learners trained'],
  ['9.0/10', 'Satisfaction'],
  ['9', 'AI agents deployed'],
  ['3.94', 'GPA · best graduate'],
] as const;

// One quick entrance on mount, staggered — the hero is visible immediately
// on load, so this plays right away rather than waiting on scroll (that's
// what Reveal / whileInView is for, further down the page).
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut', delay: i * 0.07 } }),
};

export default function Hero() {
  return (
    <section className="hero" id="top">
      <motion.p className="hero-kicker mono motion-safe" custom={0} variants={item} initial="hidden" animate="visible">
        <span className="prompt-user">nurfajar@portfolio</span>
        <span>:~$</span>
        <span className="prompt-cmd">whoami — Tangerang, ID</span>
      </motion.p>
      <motion.h1 className="motion-safe" custom={1} variants={item} initial="hidden" animate="visible">
        Nur Fajar<span className="caret" aria-hidden="true" />
      </motion.h1>
      <motion.h2 className="hero-role motion-safe" custom={2} variants={item} initial="hidden" animate="visible">
        AI Learning &amp; Development Specialist.
      </motion.h2>
      {/* Lampu status: recruiter tidak boleh harus menebak apakah ini
           portofolio pelamar atau penawaran jasa freelance. */}
      <motion.ul className="status-lamps mono motion-safe" custom={3} variants={item} initial="hidden" animate="visible">
        <li className="lit">Open to work</li>
        <li className="lit">Relocation OK</li>
        <li className="lit">Remote OK</li>
      </motion.ul>
      <motion.p className="lede motion-safe" custom={4} variants={item} initial="hidden" animate="visible">
        End-to-end — curriculum, marketing, delivery, evaluation. All in one person.
      </motion.p>
      <motion.div className="stats motion-safe" custom={5} variants={item} initial="hidden" animate="visible">
        {STATS.map(([n, l]) => (
          <div key={l}>
            <StatCountUp value={n} />
            <span className="stat-l mono">{l}</span>
          </div>
        ))}
      </motion.div>
      {/* Provenance angka. Label stat sengaja dibiarkan pendek supaya baris
           angka tetap terbaca sekali lihat; kualifikasinya dikumpulkan di sini. */}
      <motion.p className="stats-note mono motion-safe" custom={6} variants={item} initial="hidden" animate="visible">
        Learners cumulative since 2023 · satisfaction is a self-reported Kirkpatrick L1 mean across most cohorts
      </motion.p>
      <motion.div className="hero-cta motion-safe" custom={7} variants={item} initial="hidden" animate="visible">
        <a className="btn-solid" href="#playground">
          See my work ↓
        </a>
        <a className="btn-outline" href="#contact">
          Get in touch
        </a>
      </motion.div>
    </section>
  );
}
