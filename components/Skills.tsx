'use client'

import { motion } from 'framer-motion'
import { SKILLS, COLORS } from '@/lib/constants'
import { fadeUp, stagger } from '@/lib/motion'

interface SkillCardProps {
  label: string
  color: string
  bgColor: string
  borderColor: string
  skills: readonly string[]
}

function SkillCard({ label, color, bgColor, borderColor, skills }: SkillCardProps) {
  return (
    <motion.div
      variants={fadeUp}
      className="bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-2xl p-7"
    >
      <div className="flex items-center gap-2.5 mb-5">
        <span
          className="w-2 h-2 rounded-full"
          style={{ background: color }}
        />
        <span
          className="font-mono text-[10px] font-semibold tracking-[0.1em] uppercase"
          style={{ color }}
        >
          {label}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, i) => (
          <span
            key={i}
            className="font-mono text-[11px] px-2.5 py-1 rounded"
            style={{
              color,
              background: bgColor,
              border: `1px solid ${borderColor}`,
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="py-[72px] px-8 border-t border-brand-border">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger(0.12)}
        >
          <motion.div variants={fadeUp}>
            <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-brand-subtle mb-4">
              Skills
            </p>
            <h2 className="text-[26px] font-bold tracking-tight text-brand-text mb-8">
              What I actually do
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 gap-5">
            <SkillCard
              label="AI & Automation"
              color={COLORS.accent}
              bgColor="rgba(227,168,87,0.08)"
              borderColor="rgba(227,168,87,0.25)"
              skills={SKILLS.engineering}
            />
            <SkillCard
              label="Training & L&D"
              color={COLORS.accent2}
              bgColor="rgba(192,101,74,0.08)"
              borderColor="rgba(192,101,74,0.25)"
              skills={SKILLS.ld}
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
