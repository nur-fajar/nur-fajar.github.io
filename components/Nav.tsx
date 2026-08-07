'use client';

/* ── Mobile nav: sticky top bar + slide-in menu ──────────────────────────
   Below 1024px there's no room for the fixed Sidebar next to readable body
   copy (see Sidebar.tsx), so this takes over instead: a slim top bar with
   the name and a hamburger, opening a full-screen menu with the same
   section links, CV, socials, and theme toggle. Hidden entirely on desktop
   via .mobile-nav's media query in globals.css — Sidebar covers that. */

import { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { SOCIAL_LINKS, CV_HREF, CV_FILENAME } from '@/content/socials';
import { NAV_LINKS } from '@/content/nav';

export default function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <>
      {/* The slide-in menu is a sibling of the header, not a child — .mobile-nav
          carries backdrop-filter (for its sticky blur), and backdrop-filter
          creates a containing block for position: fixed descendants, which
          would confine this menu's `inset: 0` to the header's own ~70px box
          instead of the viewport. */}
      <header className="mobile-nav">
        <a className="mobile-nav-logo" href="#top">
          NF://
        </a>
        <button
          type="button"
          className="mobile-menu-btn"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? '✕' : '☰'}
        </button>
      </header>

      <div className={`mobile-menu${open ? ' is-open' : ''}`} inert={open ? undefined : true}>
        <div className="mobile-menu-head">
          <span className="mono">MENU</span>
          <button type="button" className="mobile-menu-close" aria-label="Close menu" onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>
        <nav aria-label="Section">
          <ul>
            {NAV_LINKS.map(([href, label]) => (
              <li key={href}>
                <a href={href} onClick={() => setOpen(false)}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mobile-menu-foot">
          <a className="btn-outline" href={CV_HREF} download={CV_FILENAME} target="_blank" rel="noopener" onClick={() => setOpen(false)}>
            CV&nbsp;↓
          </a>
          <div className="mobile-menu-socials mono">
            {SOCIAL_LINKS.map((s) => (
              <a key={s.href} href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noopener">
                {s.kind}
              </a>
            ))}
          </div>
          <ThemeToggle />
        </div>
      </div>
    </>
  );
}
