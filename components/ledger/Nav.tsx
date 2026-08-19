'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { CONTACT } from '@/content/ledger';

const ANCHORS = [
  { id: 'work', label: 'Work' },
  { id: 'proof', label: 'Proof' },
  { id: 'about', label: 'About' },
];

/**
 * Sticky nav island.
 *
 * Muncul DARI PAGE LOAD, bukan on-scroll. Versi lama situs menyembunyikannya
 * sampai pengguna scroll, yang berarti tombol Resume , satu-satunya hal yang
 * benar-benar ingin diambil hiring manager , tidak ada di viewport pertama.
 * Definition of done section ini: tombol Resume terlihat tanpa scroll di semua
 * breakpoint, termasuk 360px.
 */
export default function Nav() {
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Anchor aktif ditandai lewat IntersectionObserver, bukan listener scroll ,
  // scroll listener jalan tiap frame dan tidak punya batching.
  useEffect(() => {
    const sections = ANCHORS.map(({ id }) => document.getElementById(id)).filter(
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
      // Pita sempit di sepertiga atas layar: section dianggap "aktif" saat ia
      // melintasi zona baca, bukan saat piksel pertamanya menyentuh viewport.
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Menu sheet mobile: Escape menutup, klik di luar menutup.
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
            width={28}
            height={28}
            className="nav__avatar"
            priority
          />
          <span className="nav__name">Nur Fajar</span>
          <span className="nav__role mono">L&amp;D Specialist</span>
        </a>

        {/* Satu-satunya penggunaan --status di seluruh situs. Dot-nya
            berpasangan dengan teks, jadi warnanya bukan satu-satunya pembawa
            informasi. */}
        <p className="nav__status">
          <span className="nav__dot" aria-hidden="true" />
          Open to work
        </p>

        <nav className="nav__anchors" aria-label="Sections">
          {ANCHORS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className="nav__anchor"
              aria-current={active === id ? 'true' : undefined}
            >
              {label}
            </a>
          ))}
        </nav>

        <a
          className="btn btn--primary btn--sm nav__cv"
          href={CONTACT.cv}
          download={CONTACT.cvFilename}
        >
          Resume
          <span aria-hidden="true">↓</span>
        </a>

        <button
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="nav-sheet"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <span className="nav__toggle-bars" aria-hidden="true" />
        </button>
      </div>

      {open && (
        <div className="nav__sheet" id="nav-sheet" ref={sheetRef}>
          {ANCHORS.map(({ id, label }) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
