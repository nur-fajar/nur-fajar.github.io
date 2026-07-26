'use client'

import { motion } from 'framer-motion'
import { Award, BookOpen } from 'lucide-react'
import { CERTIFICATIONS, PUBLICATIONS, COLORS } from '@/lib/constants'
import { fadeUp, stagger } from '@/lib/motion'

export default function Certifications() {
  return (
    <section className="py-[72px] px-8 border-t border-brand-border">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger()}
        >
          <motion.div variants={fadeUp}>
            <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-brand-subtle mb-4">
              Certifications
            </p>
            <h2 className="text-[26px] font-bold tracking-tight text-brand-text mb-8">
              Credentials
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {CERTIFICATIONS.map((cert, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-2xl p-6 flex items-center gap-4 hover:border-white/20 transition-colors"
              >
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(227,168,87,0.12)' }}
                >
                  <Award size={20} color={COLORS.accent} />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-brand-text mb-1">
                    {cert.name}
                  </p>
                  <p className="text-[12px] text-brand-subtle">
                    {cert.issuer} · {cert.year}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {PUBLICATIONS.map((pub, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors"
            >
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={16} color={COLORS.accent2} />
                <span className="font-mono text-[10px] font-semibold tracking-[0.1em] uppercase text-brand-subtle">
                  Published Research
                </span>
              </div>
              <p className="text-[14px] font-semibold text-brand-text leading-snug mb-1.5">
                {pub.title}
              </p>
              <p className="text-[12px] text-brand-subtle italic mb-1">
                {pub.journal}
              </p>
              <p className="text-[12px] text-brand-muted mb-4">{pub.role}</p>
              <div className="flex flex-wrap gap-1.5">
                {pub.tags.map((tag, j) => (
                  <span
                    key={j}
                    className="font-mono text-[10px] px-2 py-1 rounded text-brand-muted bg-brand-border/50 border border-brand-border"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
