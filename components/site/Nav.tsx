'use client';

import Image from 'next/image';
import { List, X, LinkedinLogo } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import { CONTACT } from '@/content/ledger';

const LINKS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'work', label: 'Work' },
  { id: 'contact', label: 'Contact' },
];

/**
 * Island navigasi yang mengambang.
 *
 * Ia hadir dari page load, bukan on-scroll: tombol ajakan bicara adalah satu
 * hal yang paling ingin diambil pembaca, dan menyembunyikannya sampai orang
 * scroll berarti menyembunyikannya dari sebagian orang selamanya.
 */
export default function Nav() {
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Section aktif ditandai lewat IntersectionObserver, bukan listener scroll:
  // listener scroll jalan tiap frame dan tidak punya batching.
  useEffect(() => {
    const sections = LINKS.map(({ id }) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-25% 0px -65% 0px', threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    const onClick = (event: MouseEvent) => {
      if (sheetRef.current && !sheetRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  return (
    <header className="nav">
      <div className="nav__inner">
        <a className="nav__identity" href="#top">
          <Image
            src="/foto-profile-nf.jpg"
            alt=""
            width={34}
            height={34}
            className="nav__avatar"
            priority
          />
          <span className="nav__name">Nur Fajar.</span>
        </a>

        <nav className="nav__links" aria-label="Sections">
          {LINKS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className="nav__link"
              aria-current={active === id ? 'true' : undefined}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="nav__spacer" />

        <a
          className="nav__icon"
          href={CONTACT.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <LinkedinLogo size={20} weight="bold" />
        </a>

        <a
          className="btn btn--primary btn--sm nav__cta"
          href={CONTACT.cal}
          target="_blank"
          rel="noopener noreferrer"
        >
          Book 15 min
        </a>

        <button
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="nav-sheet"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          {open ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
        </button>
      </div>

      {open && (
        <div className="nav__sheet" id="nav-sheet" ref={sheetRef}>
          {LINKS.map(({ id, label }) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
          <a href={CONTACT.cal} target="_blank" rel="noopener noreferrer">
            Book 15 min
          </a>
        </div>
      )}
    </header>
  );
}
