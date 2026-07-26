'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LINKS } from '@/lib/constants'

const NAV_LINKS = ['About', 'Skills', 'Experience', 'Projects', 'Contact']

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-brand-bg/90 backdrop-blur-md border-b border-brand-border'
          : 'bg-transparent'
      }`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-4xl mx-auto px-8 flex justify-between items-center h-14">
        <a
          href="/"
          className="font-mono text-[13px] text-brand-accent font-medium tracking-widest"
        >
          nfajar/
        </a>
        <div className="flex items-center gap-7 md:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-brand-subtle text-[11px] tracking-widest uppercase hover:text-brand-text transition-colors duration-200"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </motion.nav>
  )
}
