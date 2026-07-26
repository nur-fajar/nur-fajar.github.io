'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { Linkedin, Github, Download, Globe } from 'lucide-react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { ROLES, LINKS } from '@/lib/constants'
import TrackingEyes from '@/components/TrackingEyes'
import CTAButton from '@/components/CTAButton'
import GradientText from '@/components/GradientText'

const HeroCanvas = dynamic(() => import('@/components/HeroCanvas'), { ssr: false })

gsap.registerPlugin(SplitText)

function useTypewriter(speed = 70, pause = 2200) {
  const [index, setIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'deleting'>('typing')

  useEffect(() => {
    const current = ROLES[index].text
    let timer: ReturnType<typeof setTimeout>

    if (phase === 'typing') {
      if (displayed.length < current.length) {
        timer = setTimeout(
          () => setDisplayed(current.slice(0, displayed.length + 1)),
          speed
        )
      } else {
        timer = setTimeout(() => setPhase('pausing'), pause)
      }
    } else if (phase === 'pausing') {
      timer = setTimeout(() => setPhase('deleting'), 100)
    } else {
      if (displayed.length > 0) {
        timer = setTimeout(
          () => setDisplayed(displayed.slice(0, -1)),
          speed / 2
        )
      } else {
        setIndex((i) => (i + 1) % ROLES.length)
        setPhase('typing')
      }
    }

    return () => clearTimeout(timer)
  }, [displayed, phase, index, speed, pause])

  return { displayed, color: ROLES[index].color }
}

export default function Hero() {
  const { displayed, color } = useTypewriter()
  const nameRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!nameRef.current) return
    const split = new SplitText(nameRef.current, { type: 'chars' })
    gsap.fromTo(
      split.chars,
      { opacity: 0, yPercent: 40 },
      {
        opacity: 1,
        yPercent: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.035,
        delay: 0.3,
      }
    )
    return () => split.revert()
  }, [])

  return (
    <section id="intro" className="relative overflow-hidden pt-32 pb-20 px-8">
      <HeroCanvas />
      <div className="relative max-w-4xl mx-auto">
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Available badge */}
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-dot" />
            <span className="font-mono text-[10px] text-brand-subtle tracking-[0.12em] uppercase">
              Available · Immediately
            </span>
          </div>

          {/* Name */}
          <h1 className="text-[clamp(40px,7vw,60px)] font-bold leading-[1.05] tracking-[-0.025em] text-brand-text mb-5">
            <span ref={nameRef} className="inline-block">
              Nur
            </span>{' '}
            <motion.span
              className="inline-block"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
            >
              <GradientText>Fajar</GradientText>
            </motion.span>
          </h1>

          {/* Typewriter */}
          <div className="text-[22px] font-medium mb-3 h-8 flex items-center">
            <span style={{ color }} className="transition-colors duration-300">
              {displayed}
            </span>
            <span
              className="inline-block w-[2px] h-[1.1em] ml-[2px] align-[-0.1em] animate-blink"
              style={{ background: color }}
            />
          </div>

          {/* Location */}
          <p className="font-mono text-[11px] text-brand-subtle tracking-[0.08em] uppercase mb-2">
            Tangerang, Indonesia · Remote-ready · SG / ID / Global
          </p>

          {/* SDG focus */}
          <div className="flex items-center gap-1.5 mb-7">
            <Globe size={11} className="text-brand-accent2 flex-shrink-0" />
            <p className="font-mono text-[11px] text-brand-accent2 tracking-[0.08em] uppercase">
              SDGs Enthusiast · Education · Decent Work · Innovation
            </p>
          </div>

          {/* Bio */}
          <p className="text-[16px] text-brand-muted leading-[1.75] max-w-[520px] mb-9">
            I find the problem, build the automation with AI (not from
            scratch), and train the team to run it. Two skills, one
            throughline: making AI actually work inside a company.
          </p>

          {/* CTAs */}
          <div className="flex gap-3 flex-wrap">
            <CTAButton href={LINKS.linkedin} icon={Linkedin} variant="primary" external>
              LinkedIn
            </CTAButton>
            <CTAButton href={LINKS.github} icon={Github} external>
              GitHub
            </CTAButton>
            <CTAButton href={LINKS.cv} icon={Download}>
              Download CV
            </CTAButton>
          </div>

          <div className="mt-12 flex items-center gap-4">
            <span className="font-mono text-[11px] text-brand-subtle tracking-widest uppercase">
              watching you
            </span>
            <TrackingEyes />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
