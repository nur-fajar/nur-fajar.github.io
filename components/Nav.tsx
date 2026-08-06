'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

const HOME_LINKS = [
  ['#tracks', 'Tracks'],
  ['#references', 'References'],
  ['#programs', 'Programs'],
  ['#design', 'Design'],
  ['#signals', 'Signals'],
  ['#skills', 'Skills'],
  ['#contact', 'Contact'],
] as const;

function LogoMark() {
  return (
    <svg className="logo-mark" viewBox="0 0 40 40" aria-hidden="true">
      <polygon points="20,3 34,12 34,28 20,37 6,28 6,12" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <rect x="15" y="16" width="10" height="10" fill="var(--blue)" />
      <circle cx="20" cy="21" r="2" fill="var(--accent)" />
    </svg>
  );
}

export default function Nav({ variant }: { variant: 'home' | 'lab' }) {
  return (
    <header className="nav">
      <Link className="logo mono" href={variant === 'home' ? '#top' : '/'}>
        <LogoMark />
        NF://
      </Link>
      <nav className="nav-links mono">
        {variant === 'home' ? (
          HOME_LINKS.map(([href, label]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))
        ) : (
          <Link href="/">← Back to portfolio</Link>
        )}
      </nav>
      {variant === 'home' && (
        <motion.a
          className="nav-cv mono"
          href="/nf.pdf"
          download="Nur-Fajar-CV-AI-LnD-2026.pdf"
          target="_blank"
          rel="noopener"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          CV&nbsp;↓
        </motion.a>
      )}
      <ThemeToggle />
    </header>
  );
}
