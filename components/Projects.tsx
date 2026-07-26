'use client'

import { motion } from 'framer-motion'
import clsx from 'clsx'
import { PROJECTS } from '@/lib/constants'
import { fadeUp, stagger } from '@/lib/motion'

export default function Projects() {
  return (
    <section
      id="projects"
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
              Projects
            </p>
            <h2 className="text-[26px] font-bold tracking-tight text-brand-text mb-8">
              Things I&apos;ve built
            </h2>
          </motion.div>

          <div className="flex flex-col">
            {PROJECTS.map((project, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className={clsx(
                  'group py-6 flex flex-col md:flex-row md:items-baseline md:justify-between gap-3 transition-all hover:pl-2',
                  i !== PROJECTS.length - 1 && 'border-b border-brand-border'
                )}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="w-[6px] h-[6px] rounded-full flex-shrink-0"
                      style={{ background: project.color }}
                    />
                    <h3 className="text-[15px] font-semibold text-brand-text">
                      {project.title}
                    </h3>
                  </div>
                  <p className="text-[13px] text-brand-subtle leading-[1.7] max-w-xl">
                    {project.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 md:justify-end md:max-w-[240px] md:flex-shrink-0">
                  {project.tags.map((tag, j) => (
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
          </div>
        </motion.div>
      </div>
    </section>
  )
}
