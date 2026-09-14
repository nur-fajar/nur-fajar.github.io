'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { WORK_GALLERY } from '@/content/ledger';

const DWELL = 2600;

/**
 * Strip konten IG (24 aset work-gallery) untuk case content-engine:
 * baris geser native (swipe/trackpad), auto-maju satu kartu tiap DWELL,
 * jeda saat hover/tekan/fokus, dan mati total di reduced-motion.
 */
export default function GalleryStrip() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [auto, setAuto] = useState(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const raf = requestAnimationFrame(() => setAuto(false));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!auto || paused) return;
    const track = trackRef.current;
    if (!track) return;
    const id = window.setInterval(() => {
      const card = track.querySelector('li');
      if (!card) return;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      const step = card.getBoundingClientRect().width + gap;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      if (atEnd) track.scrollTo({ left: 0 });
      else track.scrollBy({ left: step, behavior: 'smooth' });
    }, DWELL);
    return () => window.clearInterval(id);
  }, [auto, paused]);

  return (
    <div
      className={`v5-strip${paused ? ' is-paused' : ''}`}
      role="region"
      aria-label="Instagram posts from ai4impact.id"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onPointerDown={() => setPaused(true)}
      onPointerUp={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <ul className="v5-strip__track" ref={trackRef}>
        {WORK_GALLERY.map((item) => (
          <li key={item.id} className="v5-strip__item">
            <a href={item.href} target="_blank" rel="noreferrer" aria-label={`${item.title} (opens Instagram)`}>
              <Image
                className="v5-strip__img"
                src={item.thumbnail}
                alt=""
                width={360}
                height={450}
                sizes="(max-width: 980px) 38vw, 152px"
                loading="lazy"
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
