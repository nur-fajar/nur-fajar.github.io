'use client';

/* ── Sidebar: fixed left column, desktop only ────────────────────────────
   The brittanychiang.com-style anchor for the whole redesign — name, one-
   line role, a short scroll-spied nav, then CV + socials + theme toggle
   pinned to the bottom via .sidebar-foot's margin-top: auto. Hidden below
   1024px (see .sidebar in globals.css); Nav.tsx covers that width instead. */

import { useEffect, useState, type ReactElement } from 'react';
import ThemeToggle from './ThemeToggle';
import { SOCIAL_LINKS, CV_HREF, CV_FILENAME } from '@/content/socials';
import { NAV_LINKS } from '@/content/nav';

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
function LinkedinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 8.5v9M6.5 5.5v.01M11 17.5v-5.2c0-2.3 1.4-3.3 3-3.3 1.7 0 2.7 1.1 2.7 3.4v5.1" />
      <path d="M11 12.5v5" />
    </svg>
  );
}
function GithubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2-.2 4.5-1 4.5-4.5 0-1-.4-1.8-1-2.5.1-.2.4-1.2-.1-2.5 0 0-.8-.3-2.8 1a10 10 0 0 0-5 0c-2-1.3-2.8-1-2.8-1-.5 1.3-.2 2.3-.1 2.5-.6.7-1 1.5-1 2.5 0 3.5 2.5 4.3 4.5 4.5-.3.3-.5.7-.6 1.3-.5.2-1.8.6-2.6-.7-.5-.8-1.5-.9-1.5-.9-1-.1-.1.6-.1.6.7.3 1.2 1.6 1.2 1.6.6 1.9 3.4 1.3 3.4 1.3V19" />
    </svg>
  );
}
const SOCIAL_ICON: Record<string, () => ReactElement> = { mail: MailIcon, linkedin: LinkedinIcon, github: GithubIcon };

export default function Sidebar() {
  const [active, setActive] = useState('#top');

  // Scroll-spy: highlight whichever nav section is currently nearest the
  // top of the viewport (not just "any overlap"), so the active link tracks
  // scroll position the way it visually reads on the page.
  useEffect(() => {
    const sections = NAV_LINKS.map(([href]) => document.getElementById(href.slice(1))).filter(
      (el): el is HTMLElement => el !== null
    );
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(`#${visible[0].target.id}`);
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <aside className="sidebar">
      <a className="sidebar-name" href="#top">
        Nur Fajar
      </a>
      <p className="sidebar-role mono">AI Learning &amp; Development Specialist, based in Tangerang, ID.</p>

      <nav className="sidebar-nav" aria-label="Section">
        <ul>
          {NAV_LINKS.map(([href, label]) => (
            <li key={href}>
              <a href={href} data-active={active === href}>
                <span className="rule" aria-hidden="true" />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-foot">
        <a className="btn-outline" href={CV_HREF} download={CV_FILENAME} target="_blank" rel="noopener">
          CV&nbsp;↓
        </a>
        <div className="sidebar-socials">
          {SOCIAL_LINKS.map((s) => {
            const Icon = SOCIAL_ICON[s.kind];
            return (
              <a key={s.href} href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noopener" aria-label={s.label}>
                <Icon />
              </a>
            );
          })}
        </div>
        <div className="sidebar-mode">
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
