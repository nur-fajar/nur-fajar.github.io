'use client';

import { motion, type Variants } from 'framer-motion';
import StatCountUp from './motion/StatCountUp';

// The L&D-delivery numbers and the "trusted to lead, performed under
// scrutiny" numbers, together in one hero zone (design brief §4a) — the
// last two are the same Kampus Merdeka placements the Credibility module
// covers in full underneath.
const STATS = [
  ['350+', 'Learners trained'],
  ['9.0/10', 'Satisfaction'],
  ['9', 'AI agents deployed'],
  ['3.94', 'GPA · best graduate'],
  ['Top 10%', 'Bangkit Academy · ML path'],
  ['Top 5', 'Terra AI apprenticeship'],
] as const;

const HEADLINE = 'Learning & Development, end to end — and the systems to scale it.';

// One quick entrance on mount, staggered — the hero is visible immediately
// on load, so this plays right away rather than waiting on scroll (that's
// what Reveal / whileInView is for, further down the page).
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut', delay: i * 0.07 } }),
};

const word: Variants = {
  hidden: { opacity: 0, y: '0.5em', filter: 'blur(6px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, delay: 0.18 + i * 0.035, ease: [0.16, 1, 0.3, 1] },
  }),
};

/** Word-by-word blur-in reveal — the headline is the single largest, most
    looked-at element on the page, so it's the one place a per-word "text
    generate" effect (the 21st.dev/Aceternity staple) earns its keep instead
    of reading as decoration. */
function AnimatedHeadline() {
  const words = HEADLINE.split(' ');
  return (
    <h1 className="motion-safe">
      {words.map((w, i) => (
        <motion.span key={i} className="headline-word" custom={i} variants={word} initial="hidden" animate="visible">
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </h1>
  );
}

export default function Hero() {
  return (
    <section className="hero">
      {/* Two soft, slowly-drifting color blobs behind the copy — depth
          without noise, gone entirely under prefers-reduced-motion since
          MotionConfig collapses the loop to a static frame. */}
      <div className="hero-glow motion-safe" aria-hidden="true">
        <motion.i
          animate={{ x: [0, 24, 0], y: [0, 18, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.i
          animate={{ x: [0, -20, 0], y: [0, -14, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
      </div>

      <div className="hero-copy">
        <motion.p className="eyebrow mono motion-safe" custom={0} variants={item} initial="hidden" animate="visible">
          Nur Fajar — Tangerang, Indonesia
        </motion.p>
        <AnimatedHeadline />
        {/* Lampu status: recruiter tidak boleh harus menebak apakah ini
             portofolio pelamar atau penawaran jasa freelance. */}
        <motion.ul className="status-lamps mono motion-safe" custom={2} variants={item} initial="hidden" animate="visible">
          <li className="lit">Open to work</li>
          <li className="lit">Relocation OK</li>
          <li className="lit">Remote OK</li>
        </motion.ul>
        <motion.p className="lede motion-safe" custom={3} variants={item} initial="hidden" animate="visible">
          Curriculum, delivery, content, evaluation. Built the automation underneath it too.
        </motion.p>
        <motion.div className="stats motion-safe" custom={4} variants={item} initial="hidden" animate="visible">
          {STATS.map(([n, l]) => (
            <div key={l}>
              <StatCountUp value={n} />
              <span className="stat-l mono">{l}</span>
            </div>
          ))}
        </motion.div>
        {/* Provenance angka. Label stat sengaja dibiarkan pendek supaya baris
             angka tetap terbaca sekali lihat; kualifikasinya dikumpulkan di sini. */}
        <motion.p className="stats-note mono motion-safe" custom={5} variants={item} initial="hidden" animate="visible">
          Learners cumulative since 2023 · satisfaction is a self-reported Kirkpatrick L1 mean across most cohorts
        </motion.p>
      </div>
    </section>
  );
}
