'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Saat hero didorong keluar viewport, grid bento tertinggal sedikit (y -70)
 * sementara baris hint menghilang lebih dulu. Dua kecepatan itu membuat
 * bento terasa disusun di ruang, bukan ditempel di kertas.
 *
 * GSAP menyentuh transform .v3-grid, WADAHNYA; ubin-ubin di dalamnya tetap
 * milik Framer Motion (entrance, drag, layout). Keduanya tidak pernah
 * menulis transform ke elemen yang sama.
 */
export default function HeroDrift({
  triggerRef,
}: {
  triggerRef: React.RefObject<HTMLElement | null>;
}) {
  useEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.to('.v3-grid', {
        y: -70,
        ease: 'none',
        scrollTrigger: { trigger, start: 'top top', end: 'bottom top', scrub: true },
      });

      /* Hint cuma ada di perangkat hover (Bento menyembunyikannya di
         sentuh): tanpa penjaga, GSAP mengeluh target tidak ketemu. */
      if (trigger.querySelector('.v3-bento__hint')) {
        gsap.to('.v3-bento__hint', {
          y: -30,
          opacity: 0,
          ease: 'none',
          scrollTrigger: { trigger, start: 'top top', end: '40% top', scrub: true },
        });
      }
    }, trigger);

    return () => ctx.revert();
  }, [triggerRef]);

  return null;
}
