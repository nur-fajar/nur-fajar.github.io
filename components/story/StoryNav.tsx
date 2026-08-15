'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { SOCIAL } from './data';
import { DownloadIcon, LinkedInIcon, MailIcon } from './icons';

// Menu radial dibuka ke BAWAH karena navbar-nya menempel di atas layar.
// Sudut dalam derajat, 90° = lurus ke bawah.
const RADIAL = [
  { angle: 138, label: 'LinkedIn', href: SOCIAL.linkedin, icon: <LinkedInIcon />, external: true },
  { angle: 90, label: 'Email', href: `mailto:${SOCIAL.email}`, icon: <MailIcon />, external: false },
  { angle: 42, label: 'Download resume', href: SOCIAL.resume, icon: <DownloadIcon />, external: true },
];
const RADIUS = 62;

/**
 * Island navbar. Avatar-nya sendiri jadi tombol: dikelilingi teks melingkar
 * "CV · LINKEDIN · EMAIL" yang berputar pelan, dan saat di-tap/klik memancarkan
 * menu radial berisi tiga aksi kontak.
 */
export default function StoryNav() {
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = document.getElementById('story-hero');
    if (!hero) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          const visible = !e.isIntersecting;
          setShow(visible);
          // Navbar tersembunyi lagi saat Hero terlihat; menu yang masih terbuka
          // harus ikut ditutup, kalau tidak ia "menggantung" saat navbar
          // meluncur balik ke atas layar.
          if (!visible) setOpen(false);
        }),
      { threshold: 0.15 },
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <nav className="story-nav" data-show={show} aria-label="Site">
      <div className="story-avatar" ref={wrapRef}>
        <button
          type="button"
          className="story-avatar__btn"
          aria-expanded={open}
          aria-haspopup="true"
          aria-label={open ? 'Close contact menu' : 'Open contact menu — CV, LinkedIn, email'}
          onClick={() => setOpen((v) => !v)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- ukuran tetap, aset lokal. */}
          <img className="story-avatar__img" src="/foto-profile-nf.jpg" alt="Nur Fajar" width={32} height={32} />
          {/* Teks melingkar di sekeliling foto. Cincinnya berputar pelan; saat
              menu terbuka putarannya berhenti supaya tidak berisik. */}
          <svg className="story-avatar__ring" data-spin={!open} viewBox="0 0 100 100" aria-hidden="true">
            <defs>
              <path id="story-avatar-arc" d="M 50 8 A 42 42 0 1 1 49.99 8" fill="none" />
            </defs>
            <text>
              <textPath href="#story-avatar-arc" startOffset="0%">
                CV · LINKEDIN · EMAIL ·
              </textPath>
            </text>
          </svg>
          <span className="story-avatar__pulse" aria-hidden="true" />
        </button>

        <AnimatePresence>
          {open && (
            <motion.ul
              className="story-radial"
              initial={reduce ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {RADIAL.map((item, i) => {
                const rad = (item.angle * Math.PI) / 180;
                const x = Math.cos(rad) * RADIUS;
                const y = Math.sin(rad) * RADIUS;
                return (
                  <motion.li
                    key={item.label}
                    initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
                    animate={{ x, y, opacity: 1, scale: 1 }}
                    exit={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
                    transition={{
                      type: 'spring',
                      stiffness: 420,
                      damping: 26,
                      delay: reduce ? 0 : i * 0.05,
                    }}
                  >
                    <a
                      className="story-radial__item"
                      href={item.href}
                      aria-label={item.label}
                      title={item.label}
                      {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      onClick={() => setOpen(false)}
                    >
                      {item.icon}
                    </a>
                  </motion.li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      <span className="story-nav__name">Nur Fajar</span>
      <span className="story-nav__status">
        <span className="story-nav__dot" aria-hidden="true" />
        Open to work
      </span>

      <a className="story-nav__resume" href={SOCIAL.resume} target="_blank" rel="noopener noreferrer">
        <DownloadIcon size={14} />
        <span>Resume</span>
        {/* Kilau yang menyapu pelan — bikin tombol ini yang paling menarik
            perhatian di navbar tanpa harus jadi animasi yang bergerak terus. */}
        <span className="story-nav__shine" aria-hidden="true" />
      </a>
    </nav>
  );
}
