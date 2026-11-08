'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

/**
 * Orkestrasi gerak v9.
 *
 * Semua efek masuk dari state JavaScript, tidak pernah dari state awal CSS.
 * Itu yang membuat halaman tetap terbaca tanpa JavaScript: server mengirim
 * teks utuh, dan GSAP baru menyetel transform saat sudah berjalan.
 *
 * Gerak dimatikan seluruhnya kalau sistem meminta reduced motion, dengan
 * satu guard di paling atas (pola yang sama dipakai components/v8/Motion.tsx).
 *
 * Tiga gerak saja yang tersisa di halaman ini: shader (ambient, satu draw
 * call), mask reveal (hanya hero dan dua judul utama), dan reveal polos
 * untuk blok lain. Audit 2026-10-20: lima sistem gerak sekaligus adalah
 * tanda "dari template", dan satu pun di antaranya tidak boleh bergerak
 * tanpa diminta manusia.
 */

/** Jarak antar kartu yang masuknya dijarangkan (detik). */
const STAGGER_STEP = 0.09;

export default function Motion() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger, SplitText);

    const splits: SplitText[] = [];
    let dead = false;

    const ctx = gsap.context(() => {
      // 1. Hero: mask reveal saat halaman dibuka. Baris teks naik dari
      //    balik mask, satu per satu.
      gsap.utils.toArray<HTMLElement>('[data-mask="hero"]').forEach((el) => {
        const split = SplitText.create(el, { type: 'lines', mask: 'lines' });
        splits.push(split);
        gsap.from(split.lines, {
          yPercent: 115,
          duration: 1,
          ease: 'power4.out',
          stagger: 0.09,
          delay: 0.08,
        });
      });

      // 2. Judul section: mask reveal yang sama, tapi saat masuk viewport.
      gsap.utils.toArray<HTMLElement>('[data-mask="scroll"]').forEach((el) => {
        const split = SplitText.create(el, { type: 'lines', mask: 'lines' });
        splits.push(split);
        gsap.from(split.lines, {
          yPercent: 115,
          duration: 0.9,
          ease: 'power4.out',
          stagger: 0.07,
          scrollTrigger: { trigger: el, start: 'top 88%' },
        });
      });

      // 3. Blok lain: naik pelan saat masuk viewport. Elemen yang punya
      //    `data-stagger` (nomor urut) reveal-nya dijarangkan, supaya
      //    deretan kartu masuk satu per satu, bukan serempak.
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        const step = Number(el.getAttribute('data-stagger') ?? '0');
        gsap.from(el, {
          y: 22,
          autoAlpha: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay: step * STAGGER_STEP,
          scrollTrigger: { trigger: el, start: 'top 92%' },
        });
      });

      // 4. Garis timeline mengisi seiring halaman digulir.
      const fill = document.querySelector<HTMLElement>('.v9-timeline__fill');
      if (fill) {
        gsap.to(fill, {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.v9-timeline',
            start: 'top 72%',
            end: 'bottom 65%',
            scrub: 0.4,
          },
        });
      }
    });

    // 5. Spotlight: cahaya pada kartu mengikuti pointer. Dua variabel CSS
    //    yang dibaca .v9-tile__glow. Tanpa JS, kartu tetap utuh.
    const onPointerMove = (event: PointerEvent) => {
      const target = event.target as Element | null;
      const card = target?.closest?.('[data-spotlight]');
      if (!(card instanceof HTMLElement)) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--v9-mx', `${((event.clientX - rect.left) / rect.width) * 100}%`);
      card.style.setProperty('--v9-my', `${((event.clientY - rect.top) / rect.height) * 100}%`);
    };
    document.addEventListener('pointermove', onPointerMove, { passive: true });

    // 6. Nav: garis bawah muncul begitu halaman tidak lagi di paling atas.
    const nav = document.querySelector('.v9-nav');
    const onScroll = () => nav?.classList.toggle('v9-nav--stuck', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Font baru mengubah tinggi baris, jadi posisi trigger harus dihitung
    // ulang setelah font siap.
    document.fonts.ready.then(() => {
      if (dead) return;
      ScrollTrigger.refresh();
    });

    return () => {
      dead = true;
      document.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      splits.forEach((split) => split.revert());
      ctx.revert();
    };
  }, []);

  return null;
}
