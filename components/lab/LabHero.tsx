'use client';

import { motion, type Variants } from 'framer-motion';

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', delay: i * 0.08 } }),
};

export default function LabHero() {
  return (
    <section className="lab-hero">
      <motion.p className="eyebrow mono motion-safe" custom={0} variants={item} initial="hidden" animate="visible">
        LAB / 01 — PIPELINE TEARDOWN
      </motion.p>
      <motion.h1 className="motion-safe" custom={1} variants={item} initial="hidden" animate="visible">
        Nine agents.
        <br />
        One irreversible action.
      </motion.h1>
      <motion.p className="lede motion-safe" custom={2} variants={item} initial="hidden" animate="visible">
        The B2B outreach pipeline behind Track 01, taken apart agent by agent. Most of it runs unattended. Exactly
        one step does not, and that choice is the most important design decision in the system.
      </motion.p>
      <motion.p className="lab-meta mono motion-safe" custom={3} variants={item} initial="hidden" animate="visible">
        Python · GPT-4o-mini and GPT-4o · IMAP/SMTP · CRM REST API · ran live Jun–Jul 2026
      </motion.p>
      <motion.p
        className="lab-scrollcue mono motion-safe"
        custom={4}
        variants={item}
        initial="hidden"
        animate="visible"
        aria-hidden="true"
      >
        Scroll to walk the pipeline
      </motion.p>
    </section>
  );
}
