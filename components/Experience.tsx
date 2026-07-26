'use client'

import { motion } from 'framer-motion'
import { EXPERIENCE, COLORS } from '@/lib/constants'
import { fadeUp, stagger } from '@/lib/motion'

export default function Experience() {
  return (
    <section
      id="experience"
      className="py-[72px] px-8 border-t border-brand-border"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger()}
        >
          <motion.div variants={fadeUp}>
            <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-brand-subtle mb-4">
              Experience
            </p>
            <h2 className="text-[26px] font-bold tracking-tight text-brand-text mb-8">
              Where I&apos;ve worked
            </h2>
          </motion.div>

          <div className="relative border-l border-brand-border pl-8 flex flex-col gap-10">
            {EXPERIENCE.map((exp, i) => (
              <motion.div key={i} variants={fadeUp} className="relative">
                <span
                  className="absolute -left-[calc(2rem+5px)] top-1 w-[9px] h-[9px] rounded-full border-2"
                  style={{ borderColor: exp.color, background: COLORS.bg }}
                />

                <div className="flex justify-between items-start gap-4 mb-4 flex-wrap">
                  <div>
                    <h3 className="text-[17px] font-semibold text-brand-text mb-1">
                      {exp.role}
                    </h3>
                    <p
                      className="text-[14px] font-medium mb-1"
                      style={{ color: exp.color }}
                    >
                      {exp.company}
                    </p>
                    <p className="font-mono text-[10px] text-brand-subtle tracking-[0.04em]">
                      {exp.type}
                    </p>
                  </div>
                  <span className="font-mono text-[11px] text-brand-subtle whitespace-nowrap">
                    {exp.period}
                  </span>
                </div>

                <ul className="flex flex-col gap-2.5">
                  {exp.bullets.map((bullet, j) => (
                    <li
                      key={j}
                      className="flex gap-3 text-[14px] text-brand-muted leading-[1.65]"
                    >
                      <span
                        className="flex-shrink-0 mt-[2px]"
                        style={{ color: exp.color }}
                      >
                        →
                      </span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
