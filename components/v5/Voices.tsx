'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { V5_SECTIONS, V5_VOICES } from '@/content/v5';
import Section, { findSection } from './Section';

/** Detik per loop tiap baris (fwd/rev) — menyamai ritme CSS fallback. */
const LOOP_S = [46, 52] as const;

/** Warna monogram per suara: biru, merah, kuning - rotasi, bukan acak. */
const SPOT_COLORS = ['blue', 'red', 'yellow'] as const;

/** Frasa kunci per suara yang di-highlight, verbatim dari ledger. */
const HIGHLIGHTS: Record<string, string[]> = {
  'Arnold Doray': ['takes ownership', 'extremely happy'],
  'Christian Jonathan': ['organizational skills', 'proactive approach'],
  'Kevin Naufal Eryogia': ["mentee's progress", 'every milestone'],
  'Diki Hamdani': ['Communication stayed clear', 'successful finish'],
};

/** Quote dengan frasa kunci di-<mark>. Tanpa ubah ledger. */
function HiQuote({ quote, name }: { quote: string; name: string }) {
  const marks = HIGHLIGHTS[name] ?? [];
  let parts: React.ReactNode[] = [quote];
  marks.forEach((m, mi) => {
    const next: React.ReactNode[] = [];
    parts.forEach((p) => {
      if (typeof p !== 'string') {
        next.push(p);
        return;
      }
      const i = p.indexOf(m);
      if (i < 0) {
        next.push(p);
        return;
      }
      next.push(
        p.slice(0, i),
        <mark key={`${mi}-${i}`} className="v5-wall__hl">
          {m}
        </mark>,
        p.slice(i + m.length),
      );
    });
    parts = next;
  });
  return <p>{parts}</p>;
}

/**
 * Voices sebagai dinding marquee dua arah: semua suara terlihat sekaligus
 * (kredibilitas), bukan disembunyikan di rotator. Hover/focus menjeda.
 * Reduced motion: grid statis. Runs digandakan untuk loop mulus.
 */
export default function Voices() {
  const section = findSection(V5_SECTIONS, 'voices');
  const rows = [V5_VOICES, [...V5_VOICES].reverse()];
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* Dinding marquee satu driver per baris: jalan otomatis + drag mouse +
     lempar momentum yang meluruh kembali ke ritme dasar. Hover/focus
     menjeda perlahan. CSS animation hanya fallback no-JS/reduced-motion.
     ponytail: heuristik kasar (BASE dari lebar run, decay lerp). */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const tracks = trackRefs.current.filter((t): t is HTMLDivElement => !!t);
    if (!tracks.length) return;
    const fine = window.matchMedia('(pointer: fine)').matches;

    const states = tracks.map((track, r) => ({
      track,
      row: track.parentElement as HTMLElement,
      idx: r,
      runW: 0,
      offset: 0,
      v: 0,
      dragging: false,
      hover: false,
      lastX: 0,
      lastT: 0,
    }));
    const measure = () => {
      states.forEach((s) => {
        s.runW = s.track.children[0] ? (s.track.children[0] as HTMLElement).offsetWidth : 0;
      });
    };
    measure();
    states.forEach((s) => s.track.classList.add('is-driven'));

    const paint = (s: (typeof states)[number]) => {
      const w = s.runW || 1;
      const x = -(((-s.offset % w) + w) % w);
      s.track.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
    };
    const onTick = (_time: number, dtMs: number) => {
      const dt = Math.min(dtMs / 1000, 0.05);
      states.forEach((s) => {
        if (s.dragging || s.runW <= 0) return;
        const base = s.hover ? 0 : ((s.idx === 0 ? -s.runW : s.runW) / LOOP_S[s.idx]);
        s.v += (base - s.v) * (s.hover ? 0.12 : 0.04);
        if (!s.hover && Math.abs(s.v - base) < 0.5) s.v = base;
        s.offset += s.v * dt;
        paint(s);
      });
    };
    gsap.ticker.add(onTick);
    window.addEventListener('resize', measure);

    const cleanups: (() => void)[] = [];
    states.forEach((s) => {
      const enter = () => {
        s.hover = true;
      };
      const leave = () => {
        s.hover = false;
      };
      s.row.addEventListener('pointerenter', enter);
      s.row.addEventListener('pointerleave', leave);
      s.row.addEventListener('focusin', enter);
      s.row.addEventListener('focusout', leave);
      cleanups.push(() => {
        s.row.removeEventListener('pointerenter', enter);
        s.row.removeEventListener('pointerleave', leave);
        s.row.removeEventListener('focusin', enter);
        s.row.removeEventListener('focusout', leave);
      });
      if (!fine) return;
      const down = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse' || e.button !== 0) return;
        s.dragging = true;
        s.lastX = e.clientX;
        s.lastT = performance.now();
        s.v = 0;
        s.row.classList.add('is-grabbed');
        e.preventDefault();
      };
      const move = (e: PointerEvent) => {
        if (!s.dragging) return;
        const now = performance.now();
        const dx = e.clientX - s.lastX;
        const dt = Math.max((now - s.lastT) / 1000, 0.001);
        s.offset += dx;
        paint(s);
        s.v = 0.65 * s.v + 0.35 * (dx / dt);
        s.v = Math.max(-1800, Math.min(1800, s.v));
        s.lastX = e.clientX;
        s.lastT = now;
      };
      const up = () => {
        s.dragging = false;
        s.row.classList.remove('is-grabbed');
      };
      s.row.addEventListener('pointerdown', down);
      window.addEventListener('pointermove', move, { passive: true });
      window.addEventListener('pointerup', up);
      cleanups.push(() => {
        s.row.removeEventListener('pointerdown', down);
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
      });
    });

    return () => {
      gsap.ticker.remove(onTick);
      window.removeEventListener('resize', measure);
      cleanups.forEach((fn) => fn());
      states.forEach((s) => {
        s.track.classList.remove('is-driven');
        s.track.style.transform = '';
        s.row.classList.remove('is-grabbed');
      });
    };
  }, []);

  return (
    <Section section={section}>
      <div className="v5-wall">
        {rows.map((row, r) => (
          <div key={r} className="v5-wall__row" aria-label={`Referrals row ${r + 1}`} data-cursor="Drag">
            <div
              className={`v5-wall__track v5-wall__track--${r === 0 ? 'fwd' : 'rev'}`}
              ref={(n) => {
                trackRefs.current[r] = n;
              }}
            >
              {[0, 1].map((copy) => (
                <div className="v5-wall__run" key={copy} aria-hidden={copy === 1}>
                  {row.map((voice, i) => (
                    <figure key={voice.name} className="v5-wall__card">
                      <blockquote className="v5-wall__quote">
                        <HiQuote quote={voice.quote} name={voice.name} />
                      </blockquote>
                      <figcaption className="v5-wall__who">
                        <span
                          className={`v5-spot__avatar v5-spot__avatar--${SPOT_COLORS[i % SPOT_COLORS.length]}`}
                          aria-hidden="true"
                        >
                          {voice.name.charAt(0)}
                        </span>
                        <span className="v5-wall__id">
                          <span className="v5-wall__name">{voice.name}</span>
                          <span className="v5-wall__role">{voice.relation}</span>
                        </span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
