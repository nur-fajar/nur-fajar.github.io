'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { List, X } from '@phosphor-icons/react/dist/ssr';
import { V5_NAV } from '@/content/v5';

/**
 * v5 nav: floating top pill on desktop, hamburger drawer on mobile.
 * Logic reused from v3 Nav (active observer, focus trap, scroll lock).
 */
export default function Nav() {
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  /* #top tidak pernah jadi `current` (tidak ada section melewati garis di
     paling atas): link Home aktif saat belum ada section yang lewat. */
  const isActive = (href: string) => (href === '#top' ? active === null : active === href);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    /* Lookup fresh tiap pick: <section id="work"> di-remount saat Work
       ganti mode pin <-> tab (desktop <-> mobile), jadi referensi yang
       di-cache sekali saat mount menunjuk node mati (rect nol, top 0) dan
       highlight nyangkut di Work padahal masih di Capabilities.
       ponytail: scroll listener O(5 rect) per frame, ganti ke observer
       ulang saat node stabil kalau section membengkak. */
    const ids = V5_NAV.map((link) => link.href.slice(1));
    let raf = 0;
    /* Satu keputusan per pemicu: section terakhir yang sudah melewati garis
       40% viewport. Versi lama menulis active per entry yang intersect,
       jadi dua section yang masuk zona bersamaan berebut dan highlight
       macet di satu tempat. */
    const pick = () => {
      const line = window.innerHeight * 0.4;
      let current: string | null = null;
      for (const id of ids) {
        const s = document.getElementById(id);
        if (s && s.getBoundingClientRect().top <= line) current = `#${id}`;
      }
      setActive(current);
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(pick);
    };
    pick();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    /* Fokus masuk ke tombol tutup di panel, bukan tertinggal di navbar
       yang sedang disembunyikan. */
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;
      const links = [...panelRef.current.querySelectorAll('a[href],button:not([disabled])')].filter(
        (n): n is HTMLAnchorElement | HTMLButtonElement =>
          (n instanceof HTMLAnchorElement || n instanceof HTMLButtonElement) && n.tabIndex >= 0,
      );
      if (!links.length) return;
      const first = links[0];
      const last = links[links.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    document.documentElement.classList.add('v5-nav-open');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.classList.remove('v5-nav-open');
    };
  }, [open ]);

  useEffect(() => {
    /* Navbar baru terlihat lagi setelah fade 0.25s, jadi fokusnya
       menyusul, bukan mendarat di tombol yang masih hidden. */
    if (wasOpen.current && !open) {
      const id = window.setTimeout(() => toggleRef.current?.focus(), 300);
      return () => window.clearTimeout(id);
    }
    wasOpen.current = open;
  }, [open ]);

  return (
    <>
      <nav className={`v5-nav${open ? ' is-open' : ''}`} aria-label="Main">
        <a
          className={`v5-nav__brand${active === null ? ' is-active' : ''}`}
          href="#top"
          aria-label="Nur Fajar, back to top"
          aria-current={active === null ? 'true' : undefined}
        >
          {/* img polos, bukan next/image: srcset swap pasca-hydration membuat
              avatar ini mendaftar ulang sebagai kandidat LCP di akhir load
              (terukur di Lighthouse). 32px tidak butuh optimizer. */}
          {/* eslint-disable-next-line @next/next/no-img-element -- 32px avatar, src stabil mengalahkan optimasi */}
          <img
            src="/foto-profile-nf-avatar.jpg"
            alt="Nur Fajar"
            width={32}
            height={32}
            fetchPriority="high"
            decoding="async"
          />
        </a>
        <span className="v5-nav__links">
          {V5_NAV.filter((link) => link.href !== '#contact').map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`v5-nav__link${isActive(link.href) ? ' is-active' : ''}`}
              aria-current={isActive(link.href) ? 'true' : undefined}
            >
              {link.label}
            </a>
          ))}
        </span>
        {/* Contact di ujung kanan sebagai CTA, bukan bagian link tengah. */}
        {V5_NAV.filter((link) => link.href === '#contact').map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={`v5-nav__cta${active === link.href ? ' is-active' : ''}`}
            aria-current={active === link.href ? 'true' : undefined}
          >
            {link.label}
          </a>
        ))}
        <button
          ref={toggleRef}
          type="button"
          className="v5-nav__toggle"
          aria-expanded={open}
          aria-controls="v5-drawer"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} weight="bold" aria-hidden="true" /> : <List size={20} weight="bold" aria-hidden="true" />}
        </button>
      </nav>

      <div className={`v5-drawer${open ? ' is-open' : ''}`} id="v5-drawer" aria-hidden={!open}>
        <div className="v5-drawer__overlay" onClick={() => setOpen(false)} />
        <div className="v5-drawer__panel" ref={panelRef} role="dialog" aria-modal="true" aria-label="Menu">
          <div className="v5-drawer__head">
            <span className="v5-drawer__brand" aria-hidden="true">
              <Image src="/foto-profile-nf-avatar.jpg" alt="" width={32} height={32} sizes="32px" />
            </span>
            <button
              ref={closeRef}
              type="button"
              className="v5-drawer__close"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              tabIndex={open ? undefined : -1}
            >
              <X size={20} weight="bold" aria-hidden="true" />
            </button>
          </div>
          <ul>
            {V5_NAV.map((link, i) => (
              <li key={link.href} className="v5-drawer__item" style={{ transitionDelay: open ? `${i * 55}ms` : '0ms' }}>
                <a
                  className={`v5-drawer__link${isActive(link.href) ? ' is-active' : ''}`}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  tabIndex={open ? undefined : -1}
                  aria-current={isActive(link.href) ? 'true' : undefined}
                >
                  <span className="v5-drawer__num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {link.label}
                  <span className="v5-drawer__go" aria-hidden="true">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
