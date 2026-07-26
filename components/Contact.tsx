'use client'

import { motion } from 'framer-motion'
import { Linkedin, Github, Mail } from 'lucide-react'
import { LINKS } from '@/lib/constants'
import { fadeUp } from '@/lib/motion'
import CTAButton from '@/components/CTAButton'

export default function Contact() {
  return (
    <section
      id="contact"
      className="py-[72px] px-8 border-t border-brand-border text-center"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-brand-subtle mb-4">
            Contact
          </p>
          <h2 className="text-[32px] font-bold tracking-tight text-brand-text mb-3">
            Get in touch
          </h2>
          <p className="text-[15px] text-brand-subtle max-w-md mx-auto mb-9">
            Open to full-time, contract, and freelance — remote-friendly roles
            in AI, automation, or GenAI training.
          </p>

          <div className="flex justify-center gap-3 flex-wrap">
            <CTAButton href={LINKS.linkedin} icon={Linkedin} variant="primary" external>
              LinkedIn
            </CTAButton>
            <CTAButton href={LINKS.github} icon={Github} external>
              GitHub
            </CTAButton>
            <CTAButton href={LINKS.email} icon={Mail}>
              Email
            </CTAButton>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
