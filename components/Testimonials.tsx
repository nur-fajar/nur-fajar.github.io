'use client';

/* ── Testimonials — card stack ─────────────────────────────────────────
   Was a flex-wrap grid, everything visible at once. Now a stack of
   overlapping cards — one at a time, front and center, with the next two
   peeking behind it. Drag/swipe the front card away, or use the arrows
   or dots, and the stack cycles: the front card retires to the back, the
   next one steps up. Order is client state only (no routing), so this
   stays a plain client component with no data fetching. */

import { useState } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { REFERENCES } from '@/content/references';
import Reveal from './motion/Reveal';

const VISIBLE = 3; // cards rendered at once — front + 2 peeking behind

export default function Testimonials() {
  const [order, setOrder] = useState(() => REFERENCES.map((_, i) => i));

  const advance = () => setOrder((o) => [...o.slice(1), o[0]]);
  const retreat = () => setOrder((o) => [o[o.length - 1], ...o.slice(0, -1)]);
  const jumpTo = (refIndex: number) =>
    setOrder((o) => {
      const pos = o.indexOf(refIndex);
      return [...o.slice(pos), ...o.slice(0, pos)];
    });

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 90) advance();
  };

  return (
    <section id="testimonials">
      <Reveal as="div">
        <h2 className="numbered-heading">
          <span className="num mono">06.</span> What People Say
        </h2>
      </Reveal>

      <Reveal as="div" className="testimonial-stack-wrap">
        <div className="testimonial-stack">
          <AnimatePresence initial={false}>
            {order.slice(0, VISIBLE).map((refIndex, depth) => {
              const r = REFERENCES[refIndex];
              const isFront = depth === 0;
              return (
                <motion.article
                  key={r.name}
                  className={`testimonial-card${isFront ? ' is-front' : ''}`}
                  style={{ zIndex: VISIBLE - depth }}
                  initial={false}
                  animate={{
                    y: depth * 14,
                    scale: 1 - depth * 0.05,
                    rotate: depth === 0 ? 0 : depth % 2 === 0 ? 2 : -2,
                    opacity: 1 - depth * 0.35,
                  }}
                  exit={{ opacity: 0, y: -24, scale: 0.92, transition: { duration: 0.25 } }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  drag={isFront ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.65}
                  whileDrag={{ cursor: 'grabbing' }}
                  onDragEnd={isFront ? onDragEnd : undefined}
                  aria-hidden={!isFront}
                  inert={!isFront || undefined}
                >
                  <span className="testimonial-tag mono">{r.tag}</span>
                  <p className="testimonial-quote">{r.quote}</p>
                  <p className="testimonial-name">{r.name}</p>
                  <p className="testimonial-role">{r.role}</p>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="testimonial-controls">
          <button type="button" className="testimonial-nav" aria-label="Previous testimonial" onClick={retreat}>
            ‹
          </button>
          <div className="testimonial-dots">
            {REFERENCES.map((r, i) => (
              <button
                key={r.name}
                type="button"
                className={`testimonial-dot${order[0] === i ? ' is-active' : ''}`}
                aria-label={`Show testimonial from ${r.name}`}
                aria-current={order[0] === i}
                onClick={() => jumpTo(i)}
              />
            ))}
          </div>
          <button type="button" className="testimonial-nav" aria-label="Next testimonial" onClick={advance}>
            ›
          </button>
        </div>
      </Reveal>

      <Reveal as="p" className="testimonial-note" index={1}>
        Six further recommendations, including from mentees now at Apple Developer Academy alumni programmes and
        Accenture, are on LinkedIn.
      </Reveal>
    </section>
  );
}
