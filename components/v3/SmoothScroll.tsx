'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Smooth scroll global untuk /v3, digerakkan Lenis di dalam ticker GSAP
 * supaya satu-satunya rAF loop yang berjalan adalah milik GSAP, dan setiap
 * ScrollTrigger ikut diperbarui di frame yang sama.
 *
 * Tanpa JavaScript maupun di prefers-reduced-motion komponen ini tidak
 * melakukan apa pun: scroll kembali ke perilaku bawaan browser dan halaman
 * kehilangan easing-nya saja, bukan isinya.
 *
 * anchors.offset -88 menyamai scroll-margin-top 5.5rem di .v3-section, jadi
 * lompatan anchor berhenti di posisi yang sama dengan maupun tanpa Lenis.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      anchors: { offset: -88 },
    });

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
