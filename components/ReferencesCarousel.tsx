'use client';

/* ── References: one-testimonial-at-a-time slider ──────────────────────────
   Slides are AnimatePresence siblings stacked with position:absolute (see
   .quote in globals.css); the outgoing slide animates off to one side and
   the incoming one in from the other, so it reads as a directional slide
   rather than a fade — same effect the original built by hand with class
   toggling and a forced reflow, minus the reflow hack.

   The viewport height is locked to the tallest reference so a slide-in
   never clips or jumps the page underneath. Since slides are absolutely
   positioned they can't size their own parent from content, so a hidden,
   statically-positioned copy of every reference is measured instead — same
   reason the original cloned each slide into the DOM to read its height. */

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { REFERENCES, type Reference } from '@/content/references';

function debounce<T extends (...args: never[]) => void>(fn: T, wait: number) {
  let t: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

function QuoteContent({ data }: { data: Reference }) {
  return (
    <>
      <p className="mono quote-id">{data.tag}</p>
      <blockquote>{data.quote}</blockquote>
      <figcaption>
        <span className="quote-avatar" aria-hidden="true">
          {data.initial}
        </span>
        <span className="quote-who">
          <span className="quote-name">{data.name}</span>
          <span className="quote-role mono">{data.role}</span>
        </span>
      </figcaption>
    </>
  );
}

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 28 : -28, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -28 : 28, opacity: 0 }),
};

export default function ReferencesCarousel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [height, setHeight] = useState<number>();
  const measureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reducedMotion = useReducedMotion();
  const count = REFERENCES.length;

  function go(next: number, dir: number) {
    setDirection(dir);
    setIndex(((next % count) + count) % count);
  }

  useEffect(() => {
    function updateHeight() {
      const max = Math.max(...measureRefs.current.map((el) => el?.offsetHeight ?? 0));
      if (max > 0) setHeight(max);
    }
    updateHeight();
    const onResize = debounce(updateHeight, 150);
    window.addEventListener('resize', onResize);
    document.fonts?.ready?.then(updateHeight);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <>
      <div className="quote-carousel">
        <button type="button" className="quote-nav quote-prev" aria-label="Previous reference" onClick={() => go(index - 1, -1)}>
          ‹
        </button>

        <div className="quote-viewport" style={{ height }}>
          {/* hidden, in-flow copies used only to measure natural height */}
          <div aria-hidden style={{ position: 'absolute', inset: 0, visibility: 'hidden', pointerEvents: 'none', zIndex: -1 }}>
            {REFERENCES.map((r, i) => (
              <div
                key={r.name}
                ref={(el) => {
                  measureRefs.current[i] = el;
                }}
                className="quote"
                style={{ position: 'static' }}
              >
                <QuoteContent data={r} />
              </div>
            ))}
          </div>

          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={index}
              className="quote active"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: reducedMotion ? 0 : 0.34, ease: 'easeInOut' }}
            >
              <QuoteContent data={REFERENCES[index]} />
            </motion.div>
          </AnimatePresence>
        </div>

        <button type="button" className="quote-nav quote-next" aria-label="Next reference" onClick={() => go(index + 1, 1)}>
          ›
        </button>
      </div>
      <div className="quote-dots mono" role="tablist" aria-label="Choose a reference">
        {REFERENCES.map((r, i) => (
          <button
            key={r.name}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Reference ${i + 1}`}
            onClick={() => go(i, i > index ? 1 : -1)}
          />
        ))}
      </div>
    </>
  );
}
