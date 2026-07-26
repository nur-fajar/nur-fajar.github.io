'use client'

import { useEffect, useState } from 'react'

const SECTIONS = ['intro', 'about', 'skills', 'experience', 'projects', 'contact']

export default function SideNav() {
  const [active, setActive] = useState('intro')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -40% 0px' }
    )

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <nav className="hidden md:flex fixed right-8 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-4">
      {SECTIONS.map((id) => (
        <a
          key={id}
          href={`#${id}`}
          className={`flex items-center gap-3 font-mono text-[11px] tracking-widest uppercase transition-colors duration-200 ${
            active === id
              ? 'text-brand-text'
              : 'text-brand-subtle hover:text-brand-muted'
          }`}
        >
          {id}
          <span
            className={`h-px transition-all duration-300 ${
              active === id ? 'w-6 bg-brand-accent' : 'w-3 bg-brand-subtle'
            }`}
          />
        </a>
      ))}
    </nav>
  )
}
