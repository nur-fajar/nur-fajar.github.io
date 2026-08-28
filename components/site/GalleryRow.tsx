'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useReducedMotion } from 'framer-motion';
import { ArrowUpRight, CaretLeft, CaretRight } from '@phosphor-icons/react/dist/ssr';
import { GALLERY_CATEGORY_LABEL, type GalleryItem } from '@/content/ledger';

/** Piksel per detik. Pelan sengaja: cukup buat terasa hidup, tidak cukup
 *  cepat untuk membuat judul kartu sulit dibaca sambil jalan. */
const SPEED_PX_PER_SEC = 26;
/** Jeda sebelum autoscroll jalan lagi setelah disentuh. */
const RESUME_DELAY_MS = 2000;
/** Berapa jauh satu klik panah menggeser baris. */
const ARROW_STEP_PX = 400;

/**
 * Satu baris bento yang autoscroll, tapi kalah dari scroll manusia.
 *
 * Ini BUKAN animasi CSS yang loop di atas scroll asli, karena itu berarti
 * dua sistem gerak berebut posisi yang sama: scroll manual pembaca akan
 * ditimpa ulang setiap frame oleh animasinya sendiri. Di sini yang bergerak
 * adalah `scrollLeft` asli lewat rAF, jadi begitu pembaca men-scroll, drag,
 * nge-tap manual, atau klik panah kiri/kanan, itu SATU-satunya yang
 * menggerakkan elemennya; autoscroll cuma menambah nilai yang sama yang
 * juga dibaca gesture manusia.
 *
 * Berhenti saat hover, sentuh, fokus keyboard, atau klik panah, dan baru
 * jalan lagi 2 detik setelah dilepas, supaya tidak ada tautan yang bergeser
 * tepat saat mau diklik. Kalau prefers-reduced-motion aktif, autoscroll
 * tidak pernah jalan sama sekali, baris tetap bisa digulir tangan/panah.
 *
 * Daftar item digandakan sekali di DOM supaya loop-nya mulus: begitu
 * `scrollLeft` lewat satu set penuh, ia digeser mundur satu set tanpa
 * kelihatan. Salinan kedua ditandai `aria-hidden` dan `tabIndex={-1}` biar
 * pembaca keyboard/screen reader cuma ketemu setiap tautan sekali.
 */
export default function GalleryRow({
  items,
  direction,
  label,
}: {
  items: GalleryItem[];
  direction: 'left' | 'right';
  label: string;
}) {
  const trackRef = useRef<HTMLUListElement>(null);
  const pausedUntilRef = useRef(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const track = trackRef.current;
    if (!track || reduced || items.length === 0) return;

    const sign = direction === 'left' ? 1 : -1;
    /* Baris "right" mulai dari tengah set gandanya, supaya ada ruang untuk
       mundur dulu sebelum wrap, bukan langsung mentok di scrollLeft 0. */
    if (direction === 'right') {
      track.scrollLeft = track.scrollWidth / 2;
    }

    let raf = 0;
    let last = performance.now();

    function step(now: number) {
      const dt = now - last;
      last = now;
      if (now >= pausedUntilRef.current) {
        const half = track!.scrollWidth / 2;
        let next = track!.scrollLeft + sign * SPEED_PX_PER_SEC * (dt / 1000);
        if (next >= half) next -= half;
        else if (next <= 0) next += half;
        track!.scrollLeft = next;
      }
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);

    const pause = () => {
      pausedUntilRef.current = Infinity;
    };
    const resume = () => {
      pausedUntilRef.current = performance.now() + RESUME_DELAY_MS;
    };

    track.addEventListener('pointerenter', pause);
    track.addEventListener('pointerleave', resume);
    track.addEventListener('pointerdown', pause);
    track.addEventListener('pointerup', resume);
    track.addEventListener('focusin', pause);
    track.addEventListener('focusout', resume);
    track.addEventListener('touchstart', pause, { passive: true });
    track.addEventListener('touchend', resume);

    return () => {
      cancelAnimationFrame(raf);
      track.removeEventListener('pointerenter', pause);
      track.removeEventListener('pointerleave', resume);
      track.removeEventListener('pointerdown', pause);
      track.removeEventListener('pointerup', resume);
      track.removeEventListener('focusin', pause);
      track.removeEventListener('focusout', resume);
      track.removeEventListener('touchstart', pause);
      track.removeEventListener('touchend', resume);
    };
  }, [direction, items, reduced]);

  /* Klik panah menggeser lewat scrollBy asli, bukan mengubah scrollLeft
     langsung, jadi geraknya mulus (browser yang menganimasikan) dan tetap
     satu mekanisme yang sama dengan drag/wheel manusia. Dihitung sebagai
     interaksi juga, jadi autoscroll berhenti dulu sebentar. */
  const scrollByStep = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    pausedUntilRef.current = performance.now() + RESUME_DELAY_MS;
    track.scrollBy({ left: dir * ARROW_STEP_PX, behavior: 'smooth' });
  };

  const doubled = [...items, ...items];

  return (
    <div className="gallery__rowWrap">
      <button
        type="button"
        className="gallery__arrow gallery__arrow--left"
        aria-label="Scroll left"
        onClick={() => scrollByStep(-1)}
      >
        <CaretLeft size={16} weight="bold" />
      </button>

      <ul className="gallery__row" ref={trackRef} aria-label={label}>
        {doubled.map((item, index) => {
          const duplicate = index >= items.length;
          return (
            <li
              className="gallery__item"
              key={`${item.id}-${index}`}
              aria-hidden={duplicate || undefined}
            >
              <a
                className="gallery__card"
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={duplicate ? -1 : undefined}
              >
                <span className="gallery__thumb">
                  <Image src={item.thumbnail} alt={duplicate ? '' : item.title} fill sizes="260px" />
                </span>
                <span className="gallery__pill">{GALLERY_CATEGORY_LABEL[item.category]}</span>
                <span className="gallery__go" aria-hidden="true">
                  <ArrowUpRight size={14} weight="bold" />
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        className="gallery__arrow gallery__arrow--right"
        aria-label="Scroll right"
        onClick={() => scrollByStep(1)}
      >
        <CaretRight size={16} weight="bold" />
      </button>
    </div>
  );
}
