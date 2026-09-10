'use client';

import { useEffect, useRef, useState } from 'react';
import { List, X } from '@phosphor-icons/react';
import { V3_NAV } from '@/content/ledger';
import SwapWord from './SwapWord';

/**
 * Nav melayang di tengah atas: huruf kapital kecil berspasi lebar, di dalam
 * kotak bergaris rambut yang menempel ke tepi atas layar.
 *
 * Penanda section aktif memakai IntersectionObserver dengan rootMargin yang
 * menyisakan pita sempit di tengah viewport: satu tautan menyala tepat saat
 * section-nya melewati pita itu.
 *
 * Di layar ≤900px barisan tautan diganti tombol hamburger yang membuka
 * sidebar dari kanan. Tombol dan drawer selalu di DOM, tapi CSS menyembunyikan
 * tombol dan menampilkan barisan tautan geser kecuali atribut data-v3-js
 * terpasang — atribut itu ditulis skrip blocking di layout v3 sebelum paint
 * pertama, jadi tidak ada kedip dan tanpa JS tidak ada tombol mati: yang
 * tampil barisan tautan seperti sebelumnya, navigasinya tidak pernah hilang.
 *
 * Drawer menutup lewat Escape, ketuk overlay, atau klik tautan; fokus
 * dikembalikan ke tombol saat ditutup dan scroll halaman dikunci selama
 * terbuka (kelas v3-nav-open di <html>).
 */
export default function Nav() {
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    const sections = V3_NAV.map((link) => document.getElementById(link.href.slice(1))).filter(
      (section): section is HTMLElement => section !== null,
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    /* Tab berputar di dalam panel supaya fokus tidak jatuh ke halaman yang
       sedang dikunci di belakang overlay. */
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;
      /* Tombol tutup ikut dalam putaran: ia duduk di bar yang tetap di atas
         panel, jadi secara visual ia bagian dari drawer yang terbuka. */
      const links = [...panelRef.current.querySelectorAll('a[href]')].filter(
        (node): node is HTMLAnchorElement =>
          node instanceof HTMLAnchorElement && node.tabIndex >= 0,
      );
      const toggle = toggleRef.current;
      const items = toggle ? [toggle, ...links] : links;
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    document.documentElement.classList.add('v3-nav-open');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.classList.remove('v3-nav-open');
    };
  }, [open]);

  /* Fokus kembali ke tombol setiap drawer selesai ditutup, supaya pengguna
     keyboard tidak terlempar ke awal halaman. Ref, bukan state: tidak ada
     render yang perlu dipicu. */
  useEffect(() => {
    if (wasOpen.current && !open) toggleRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  return (
    <>
      <nav className={`v3-nav${open ? ' is-open' : ''}`} aria-label="Main">
        {V3_NAV.map((link) => (
          <a
            className={`v3-nav__link${active === link.href ? ' is-active' : ''}`}
            key={link.href}
            href={link.href}
          >
            <SwapWord text={link.label} />
          </a>
        ))}
        <button
          ref={toggleRef}
          type="button"
          className="v3-nav__toggle"
          aria-expanded={open}
          aria-controls="v3-drawer"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? (
            <X size={20} weight="bold" aria-hidden="true" />
          ) : (
            <List size={20} weight="bold" aria-hidden="true" />
          )}
        </button>
      </nav>

      <div className={`v3-drawer${open ? ' is-open' : ''}`} id="v3-drawer" aria-hidden={!open}>
        <div className="v3-drawer__overlay" onClick={() => setOpen(false)} />
        <div className="v3-drawer__panel" ref={panelRef} role="dialog" aria-modal="true" aria-label="Menu">
          <ul>
            {V3_NAV.map((link, index) => (
              <li
                key={link.href}
                className="v3-drawer__item"
                style={{ transitionDelay: open ? `${index * 55}ms` : '0ms' }}
              >
                <a
                  className={`v3-drawer__link${active === link.href ? ' is-active' : ''}`}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  tabIndex={open ? undefined : -1}
                >
                  <span className="v3-drawer__num" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {link.label}
                  <span className="v3-drawer__go" aria-hidden="true">
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
