'use client';

/* ── The Path — motion signature: "dense" ─────────────────────────────────
   The busiest, most packed section on the page — the counterpoint to the
   calm of Who I Am before it. Sentence two shatters into alternating
   left/right chips instead of reading as one paragraph; the standalone
   transition line at the end drifts its two halves apart on scroll (the
   "Scroll Text Lines" idea — multiple lines of text moving at different
   speeds), a brief kinetic beat before Skills goes quiet and gridded. */

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Reveal from '@/components/motion/Reveal';
import InstitutionMark from './InstitutionChip';
import { ANCHOR_CREDENTIALS, PATH_CHIPS, PATH_TRAIL } from '../data';

function TransitionLine() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const xLeft = useTransform(scrollYProgress, [0, 1], ['-6%', '2%']);
  const xRight = useTransform(scrollYProgress, [0, 1], ['6%', '-2%']);
  const opacity = useTransform(scrollYProgress, [0.15, 0.4, 0.75, 1], [0, 1, 1, 0]);

  return (
    <div className="v2-path-transition motion-safe" ref={ref}>
      <motion.p className="v2-path-transition-line" style={{ x: xLeft, opacity }}>
        What I bring to your team
      </motion.p>
      <motion.p className="v2-path-transition-line" style={{ x: xRight, opacity }}>
        is this versatile skillset.
      </motion.p>
    </div>
  );
}

export default function V2Path() {
  return (
    <section className="v2-section v2-path" id="v2-path">
      <div className="v2-path-anchor">
        <Reveal as="p" className="v2-path-anchor-text">
          It started at <span className="v2-highlight">Universitas Siliwangi</span>, where I graduated as the best
          graduate of the Faculty of Engineering with a 3.94 GPA — on scholarship from BRI and Bank Indonesia.
        </Reveal>
        <Reveal as="div" className="v2-path-credentials" index={1}>
          {ANCHOR_CREDENTIALS.map((c) => (
            <span className="v2-path-credential" key={c.name}>
              <InstitutionMark logo={c} />
            </span>
          ))}
        </Reveal>
      </div>

      <ul className="v2-path-chips">
        {PATH_CHIPS.map((chip, i) => (
          <motion.li
            key={chip.id}
            className="v2-path-chip motion-safe"
            initial={{ opacity: 0, x: i % 2 === 0 ? -64 : 64, rotate: i % 2 === 0 ? -2 : 2 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.55, delay: i * 0.14, ease: [0.16, 1, 0.3, 1] }}
          >
            {chip.logo && (
              <span className="v2-path-chip-logo">
                <InstitutionMark logo={chip.logo} />
              </span>
            )}
            <span className="v2-path-chip-name">{chip.name}</span>
            <span className="v2-path-chip-stat mono">{chip.stat}</span>
          </motion.li>
        ))}
      </ul>

      <Reveal as="div" className="v2-path-narrative">
        <p>
          Twice, I was selected for Kampus Merdeka: first as a Machine Learning mentor at Bangkit Academy, then as an
          apprentice-turned-Training Specialist at Terra AI — a role that grew into my current one: Learning &amp;
          Development Specialist.
        </p>
        <div className="v2-path-trail">
          {PATH_TRAIL.map((t) => (
            <InstitutionMark logo={t} key={t.name} />
          ))}
        </div>
      </Reveal>

      <TransitionLine />
    </section>
  );
}
