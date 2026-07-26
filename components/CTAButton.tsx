'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import type { LucideIcon } from 'lucide-react'
import clsx from 'clsx'

interface CTAButtonProps {
  href: string
  icon: LucideIcon
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  external?: boolean
}

export default function CTAButton({
  href,
  icon: Icon,
  children,
  variant = 'secondary',
  external = false,
}: CTAButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  const moveX = useRef<gsap.QuickToFunc | null>(null)
  const moveY = useRef<gsap.QuickToFunc | null>(null)

  useEffect(() => {
    if (!ref.current) return
    moveX.current = gsap.quickTo(ref.current, 'x', { duration: 0.4, ease: 'power3' })
    moveY.current = gsap.quickTo(ref.current, 'y', { duration: 0.4, ease: 'power3' })
  }, [])

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    moveX.current?.((e.clientX - rect.left - rect.width / 2) * 0.35)
    moveY.current?.((e.clientY - rect.top - rect.height / 2) * 0.35)
  }

  function handleMouseLeave() {
    moveX.current?.(0)
    moveY.current?.(0)
  }

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
      className={clsx(
        'inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full transition-colors',
        variant === 'primary'
          ? 'bg-brand-accent text-brand-bg font-semibold hover:opacity-85'
          : 'border border-brand-border text-brand-text font-medium hover:border-brand-accent hover:text-brand-accent'
      )}
    >
      <Icon size={14} />
      {children}
    </a>
  )
}
