'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import BorderBeam from './motion/BorderBeam';

const HOME_LINKS = [
  ['#credibility', 'Track record'],
  ['#signals', 'Experience'],
  ['#skills', 'Skills'],
  ['#references', 'References'],
  ['#contact', 'Contact'],
] as const;

// Past this point the hero's own photo / status lamps have scrolled out of
// view, so the nav grows a compact stand-in for them (same pattern as
// RocketButton's ROCKET_SHOW_AT threshold).
const NAV_PROFILE_SHOW_AT = 220;

function LogoMark() {
  return (
    <svg className="logo-mark" viewBox="0 0 40 40" aria-hidden="true">
      <polygon points="20,3 34,12 34,28 20,37 6,28 6,12" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="20" cy="20" r="6" fill="var(--accent)" />
    </svg>
  );
}

export default function Nav() {
  const [profileVisible, setProfileVisible] = useState(false);

  useEffect(() => {
    const update = () => setProfileVisible(window.scrollY > NAV_PROFILE_SHOW_AT);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <header className="nav">
      <Link className="logo" href="#top">
        <LogoMark />
        Nur Fajar
      </Link>
      <AnimatePresence initial={false}>
        {profileVisible && (
          <motion.div
            className="nav-profile"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.38, ease: 'easeOut' }}
          >
            <Image className="nav-avatar" src="/foto-profile-nf.jpg" alt="Nur Fajar" width={30} height={30} />
            <span className="nav-id">
              <span className="nav-name">Nur Fajar</span>
              <span className="nav-role mono">Learning &amp; Development</span>
            </span>
            <span className="nav-otw mono">Open to work</span>
          </motion.div>
        )}
      </AnimatePresence>
      <nav className="nav-links mono">
        {HOME_LINKS.map(([href, label]) => (
          <a key={href} href={href}>
            {label}
          </a>
        ))}
      </nav>
      <motion.a
        className="nav-cv mono"
        href="/nf.pdf"
        download="Nur-Fajar-CV-AI-LnD-2026.pdf"
        target="_blank"
        rel="noopener"
        whileHover={{ y: -2 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
      >
        <BorderBeam />
        CV&nbsp;↓
      </motion.a>
      <ThemeToggle />
    </header>
  );
}
