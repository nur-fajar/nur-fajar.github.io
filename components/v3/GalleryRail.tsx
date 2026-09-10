'use client';

import { useEffect, useRef } from 'react';

/** Laju jalan otomatis, piksel per detik. */
const SPEED = 42;

/** Geser mouse maksimum yang masih dihitung klik, bukan seret. */
const TAP_SLOP = 6;

/** Jeda sebelum jalan otomatis lanjut setelah interaksi, ms. */
const RESUME_DELAY = 2500;

/** Napas di tiap ujung sebelum berbalik arah, ms. */
const DWELL = 1200;

/**
 * Rel galeri yang berjalan sendiri bolak-balik, bisa diseret, tanpa
 * scrollbar — dan tanpa konten ganda: satu set kartu saja, arah berbalik
 * di tiap ujung setelah jeda singkat.
 *
 * Berhenti saat: hover, fokus keyboard di dalamnya, sedang diseret, di luar
 * viewport, tab tersembunyi (rAF berhenti sendiri), rel di-pin GalleryPin
 * (atribut data-pinned), atau prefers-reduced-motion (loop tidak mulai).
 * Tanpa JavaScript yang tampil strip statis yang tetap bisa digeser sentuh
 * secara bawaan.
 *
 * Seret mouse dibuat sendiri (pointerdown/move/up, pointer mouse saja):
 * sentuh dibiarkan ke scroll bawaan browser dan tidak disentuh sama sekali.
 * Klik setelah seret dibatalkan via capture, dengan ambang yang sama dengan
 * TAP_SLOP; Enter keyboard tidak punya gerakan sehingga selalu lolos.
 */
export default function GalleryRail({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let last = performance.now();
    let visible = true;
    let holding = false;
    let direction = 1;
    let dwellUntil = 0;
    let resumeTimer: ReturnType<typeof setTimeout> | undefined;

    const hold = () => {
      holding = true;
      clearTimeout(resumeTimer);
    };
    const release = () => {
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        holding = false;
      }, RESUME_DELAY);
    };

    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      /* data-pinned = GalleryPin sedang menyopiri scrollLeft rel ini lewat
         scrub; jalan otomatis mundur supaya satu setir satu sopir. */
      if (visible && !holding && !el.hasAttribute('data-pinned') && now >= dwellUntil) {
        const max = el.scrollWidth - el.clientWidth;
        if (max > 0) {
          /* Melambat masuk ujung, bukan membentur lalu berbalik: laju
             diskala dari jarak ke ujung terdekat (zona 140px). */
          const edge = Math.min(el.scrollLeft, max - el.scrollLeft);
          const ease = 0.25 + 0.75 * Math.min(1, Math.max(0, edge) / 140);
          let next = el.scrollLeft + direction * SPEED * ease * dt;
          if (next >= max) {
            next = max;
            direction = -1;
            dwellUntil = now + DWELL;
          } else if (next <= 0) {
            next = 0;
            direction = 1;
            dwellUntil = now + DWELL;
          }
          el.scrollLeft = next;
        }
      }
      raf = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? true;
      },
      { threshold: 0 },
    );
    io.observe(el);

    let dragX: number | null = null;
    let dragScroll = 0;
    let moved = false;

    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      dragX = event.clientX;
      dragScroll = el.scrollLeft;
      moved = false;
      el.classList.add('is-drag');
      hold();
    };
    const onMove = (event: PointerEvent) => {
      if (dragX === null) return;
      const dx = event.clientX - dragX;
      if (Math.abs(dx) > TAP_SLOP) moved = true;
      el.scrollLeft = dragScroll - dx;
    };
    const onUp = () => {
      if (dragX === null) return;
      dragX = null;
      el.classList.remove('is-drag');
      release();
    };
    const onClick = (event: MouseEvent) => {
      if (!moved) return;
      event.preventDefault();
      event.stopPropagation();
      moved = false;
    };
    /* Ghost-drag bawaan link: begitu browser mengambil alih seret sebagai
       drag-and-drop, pointermove berhenti mengalir ke halaman dan konten
       lepas dari kursor. Dibunuh di sini (img sudah draggable=false). */
    const onDragStart = (event: DragEvent) => {
      event.preventDefault();
    };

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('dragstart', onDragStart);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    el.addEventListener('click', onClick, true);
    el.addEventListener('pointerenter', hold);
    el.addEventListener('pointerleave', release);
    el.addEventListener('focusin', hold);
    el.addEventListener('focusout', release);

    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resumeTimer);
      io.disconnect();
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('dragstart', onDragStart);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      el.removeEventListener('click', onClick, true);
      el.removeEventListener('pointerenter', hold);
      el.removeEventListener('pointerleave', release);
      el.removeEventListener('focusin', hold);
      el.removeEventListener('focusout', release);
    };
  }, []);

  return (
    <ul ref={ref} className="v3-gallery">
      {children}
    </ul>
  );
}
