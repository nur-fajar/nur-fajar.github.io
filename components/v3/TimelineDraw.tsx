'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Garis merah di rel timeline Experience digambar mengikuti scroll: scaleY
 * 0 → 1 dengan scrub, jadi garisnya tumbuh seiring pembaca menuruni daftar
 * peran. Polanya sama dengan HeroDrift: GSAP cuma menyentuh transform satu
 * elemen (.v3-timeline__fill) yang bukan milik siapa-siapa, dan semuanya
 * dibersihkan lewat ctx.revert.
 *
 * Pemicunya dicari lewat id section, bukan lewat ref: Experience tetap server
 * component dan tidak perlu jadi client cuma untuk menenteng satu ref.
 * Id-nya terkunci ledger (ada tes yang gagal kalau V3_NAV dan V3_SECTIONS
 * tidak cocok), jadi ia bukan string liar. Preceden yang sama dipakai Nav.
 *
 * Tanpa JavaScript atau di prefers-reduced-motion, isiannya tetap scaleY(1)
 * dari CSS: garis tampil penuh, yang hilang cuma gerak menggambarnya.
 */
export default function TimelineDraw() {
  useEffect(() => {
    const trigger = document.getElementById('experience');
    if (!trigger) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.v3-timeline__fill',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger, start: 'top 75%', end: 'bottom 50%', scrub: true },
        },
      );
    }, trigger);

    return () => ctx.revert();
  }, []);

  return null;
}
