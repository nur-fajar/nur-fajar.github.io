'use client';

/* ── Floating pill nav ────────────────────────────────────────────────────
   Styled after Framer's "Neo Pill Nav" community component: instead of a
   full-width bar pinned flush to the top edge, the whole nav lives inside
   one rounded, glassy capsule that floats with margin on every side. A
   hover indicator (framer-motion layoutId) slides between links instead
   of just recoloring text — the capsule's signature move. */

import Link from 'next/link';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LogoMark } from './icons';

// Numbers here match each section's own numbered-heading exactly (see
// About/Experience/TrackRecord/Skills/Work/Testimonials) — previously the
// nav counted its own link position instead, so "03. Skills" in the nav
// pointed at a section headed "04. Skills" on the page.
const NAV_LINKS = [
  ['#about', '01', 'About'],
  ['#experience', '02', 'Experience'],
  ['#track-record', '03', 'Track Record'],
  ['#skills', '04', 'Skills'],
  ['#work', '05', 'Work'],
  ['#testimonials', '06', 'Praise'],
] as const;

export default function Nav() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <header className="nav">
      <div className="nav-pill" onMouseLeave={() => setHovered(null)}>
        <Link className="logo" href="#top">
          <LogoMark className="logo-mark" />
          Nur Fajar
        </Link>
        <nav className="nav-links">
          {NAV_LINKS.map(([href, num, label]) => (
            <a key={href} href={href} onMouseEnter={() => setHovered(href)} onFocus={() => setHovered(href)}>
              <AnimatePresence>
                {hovered === href && (
                  <motion.span
                    layoutId="nav-pill-indicator"
                    className="nav-pill-indicator motion-safe"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
              </AnimatePresence>
              <span className="nav-link-label">
                <span className="idx mono">{num}.</span>
                {label}
              </span>
            </a>
          ))}
          <a href="#contact" onMouseEnter={() => setHovered('#contact')} onFocus={() => setHovered('#contact')}>
            <AnimatePresence>
              {hovered === '#contact' && (
                <motion.span
                  layoutId="nav-pill-indicator"
                  className="nav-pill-indicator motion-safe"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
            </AnimatePresence>
            <span className="nav-link-label">Contact</span>
          </a>
        </nav>
        <a className="btn btn-small nav-resume" href="/nf.pdf" download="Nur-Fajar-CV-AI-LnD-2026.pdf" target="_blank" rel="noopener">
          Resume
        </a>
      </div>
    </header>
  );
}
