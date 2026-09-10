'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Parallax kartu About: selama section melintasi viewport, dua kartu tepi
 * tertinggal ke bawah (+28) sementara kartu tengah naik (-28). Selisih dua
 * kecepatan itu membuka grid 3 kolom yang datar jadi kipas dangkal.
 *
 * Polanya sama dengan HeroDrift: GSAP cuma menyentuh transform li kartu
 * (bukan milik Framer Motion siapa pun), pemicu dicari lewat id section
 * supaya About tetap server component, dan semuanya dibersihkan lewat
 * ctx.revert. Tanpa JavaScript atau di prefers-reduced-motion, grid diam
 * sejajar: yang hilang cuma geraknya.
 */
export default function CardsDrift() {
  useEffect(() => {
    const trigger = document.getElementById('about');
    if (!trigger) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const pass = { trigger, start: 'top bottom', end: 'bottom top', scrub: true } as const;

    const ctx = gsap.context(() => {
      gsap.to('.v3-bg__card:nth-child(1)', { y: 28, ease: 'none', scrollTrigger: pass });
      gsap.to('.v3-bg__card:nth-child(2)', { y: -28, ease: 'none', scrollTrigger: pass });
      gsap.to('.v3-bg__card:nth-child(3)', { y: 28, ease: 'none', scrollTrigger: pass });
    }, trigger);

    return () => ctx.revert();
  }, []);

  return null;
}
