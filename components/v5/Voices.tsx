'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { V5_SECTIONS, V5_VOICES } from '@/content/v5';
import Section, { findSection } from './Section';

const DWELL = 6000;

/** Warna monogram per suara: biru, merah, kuning - rotasi, bukan acak. */
const SPOT_COLORS = ['blue', 'red', 'yellow'] as const;

/**
 * Voices as a spotlight rotator: one giant quote at a time, advancing
 * automatically with a progress bar. Hover or focus pauses both the timer
 * and the bar; arrows and segments give full manual control. Reduced
 * motion disables rotation entirely, leaving the manual controls.
 */
export default function Voices() {
  const section = findSection(V5_SECTIONS, 'voices');
  const total = V5_VOICES.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [auto, setAuto] = useState(true);
  const voice = V5_VOICES[index];
  const pad = (n: number) => String(n).padStart(2, '0');

  /* Ditunda satu frame: sinkron di body effect memicu cascading render
     (dan ditolak lint), padahal nilai awal true sudah cocok dengan SSR. */
  useEffect(() => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const raf = requestAnimationFrame(() => setAuto(false));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!auto || paused) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % total), DWELL);
    return () => window.clearTimeout(id);
  }, [auto, paused, index, total]);

  const go = (dir: number) => setIndex((i) => (i + dir + total) % total);

  return (
    <Section section={section}>
      <div
        className={paused ? 'v5-spot is-paused' : 'v5-spot'}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <p className="v5-spot__meta">
          <span>
            {pad(index + 1)} / {pad(total)}
          </span>
          <span className="v5-spot__tag">{voice.relation}</span>
        </p>
        {/* key me-remount kutipan tiap ganti suara: animasi masuk jalan lagi. */}
        <blockquote key={voice.name} className="v5-spot__quote" aria-live="polite">
          <p>{voice.quote}</p>
        </blockquote>
        <div className="v5-spot__who">
          <span className={`v5-spot__avatar v5-spot__avatar--${SPOT_COLORS[index % SPOT_COLORS.length]}`} aria-hidden="true">
            {voice.name.charAt(0)}
          </span>
          <div>
            <p className="v5-spot__name">{voice.name}</p>
            <p className="v5-spot__role">{voice.role}</p>
          </div>
        </div>
        <div className="v5-spot__controls">
          <button
            type="button"
            className="v5-spot__btn"
            onClick={() => go(-1)}
            aria-label={`Previous referral, showing ${pad(index + 1)} of ${pad(total)}`}
          >
            <ArrowLeft size={18} weight="bold" aria-hidden="true" />
          </button>
          {auto ? (
            <div className="v5-spot__progress" aria-hidden="true">
              <span key={index} style={{ animationDuration: `${DWELL}ms` }} />
            </div>
          ) : (
            <ol className="v5-spot__segments" aria-label="Choose referral">
              {V5_VOICES.map((v, i) => (
                <li key={v.name}>
                  <button
                    type="button"
                    className={i === index ? 'v5-spot__seg is-active' : 'v5-spot__seg'}
                    onClick={() => setIndex(i)}
                    aria-label={`Show referral ${i + 1} of ${total}: ${v.name}`}
                    aria-current={i === index ? 'true' : undefined}
                  />
                </li>
              ))}
            </ol>
          )}
          <button
            type="button"
            className="v5-spot__btn"
            onClick={() => go(1)}
            aria-label={`Next referral, showing ${pad(index + 1)} of ${pad(total)}`}
          >
            <ArrowRight size={18} weight="bold" aria-hidden="true" />
          </button>
        </div>
      </div>
    </Section>
  );
}
