'use client'

import { motion } from 'framer-motion'
import { STATS } from '@/lib/constants'
import { fadeUp, stagger } from '@/lib/motion'

export default function About() {
  return (
    <section
      id="about"
      className="py-[72px] px-8 border-t border-brand-border"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="grid grid-cols-2 gap-14 items-start"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger()}
        >
          {/* Bio */}
          <motion.div variants={fadeUp}>
            <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-brand-subtle mb-4">
              About
            </p>
            <h2 className="text-[26px] font-bold tracking-tight text-brand-text leading-snug mb-5">
              I make AI actually work inside a company.
            </h2>
            <p className="text-[14px] text-brand-muted leading-[1.8] mb-3">
              Engineering graduate (GPA 3.94, Best Graduate of the Faculty). At
              Terra Weather Pte. Ltd.&apos;s AI division, I built the automation
              pipelines and ran the GenAI training programs myself, at the same
              time, across enterprise cohorts.
            </p>
            <p className="text-[14px] text-brand-muted leading-[1.8] mb-3">
              I build with AI, not from scratch. I&apos;m fast at finding the
              actual problem and assembling the right AI-powered fix for it,
              not writing every line by hand.
            </p>
            <p className="text-[14px] text-brand-muted leading-[1.8] mb-3">
              Looking for remote-friendly roles where both sides of this profile
              are valued: building AI tools, training teams to use them, or
              ideally both.
            </p>
            <p className="text-[14px] text-brand-muted leading-[1.8]">
              My undergraduate thesis applied ensemble machine learning and
              SMOTE to analyze public sentiment toward the Sustainable
              Development Goals in Indonesia — that&apos;s where my interest in
              AI-for-good took root, particularly around education, decent
              work, and innovation.
            </p>
          </motion.div>

          {/* Stat cards */}
          <motion.div
            className="grid grid-cols-2 gap-3"
            variants={stagger()}
          >
            {STATS.map((s, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-2xl p-5"
              >
                <div
                  className="text-[28px] font-bold tracking-tight mb-1.5"
                  style={{ color: s.color }}
                >
                  {s.number}
                </div>
                <div className="text-[11px] text-brand-subtle">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
