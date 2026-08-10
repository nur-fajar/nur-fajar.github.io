'use client';

/* ── References: staggered card stack ───────────────────────────────────
   Adapted from a "stagger testimonials" pattern (click a side card, or the
   arrows, to bring it to the front) — reskinned onto this file's own
   panel/accent tokens instead of a separate shadcn-style palette, so it
   stays one visual system with the rest of the site. Reuses the
   .quote-avatar/-id/-name/-role type already defined below for the old
   one-at-a-time slider this replaced.

   Position/rotation/scale are driven by Framer Motion springs rather than a
   CSS transition on a hand-built transform string — same array-shift logic
   as before (see lib/stagger.ts, unit-tested there without needing a DOM),
   but the settle now has real physics (slight overshoot) instead of a
   linear/eased tween, and side cards get a small hover lift to invite the
   click. Centering is handled by plain CSS (left/top + negative margin) so
   Framer's x/y only ever carry the *offset* from center, never fighting
   with it. */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { REFERENCES, type Reference } from '@/content/references';
import { centeredPosition, rotateSlots, toSlots, type Slot } from '@/lib/stagger';

let keySeq = 0;
const nextKey = () => keySeq++;

const CARD = {
  desktop: { width: 340, height: 440 },
  mobile: { width: 260, height: 400 },
};

const SPRING = { type: 'spring', stiffness: 300, damping: 28, mass: 0.7 } as const;

function ReferenceCard({
  position,
  reference,
  onSelect,
  cardWidth,
  cardHeight,
}: {
  position: number;
  reference: Reference;
  onSelect: () => void;
  cardWidth: number;
  cardHeight: number;
}) {
  const isActive = position === 0;

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      disabled={isActive}
      aria-label={isActive ? undefined : `Show reference from ${reference.name}`}
      aria-current={isActive ? 'true' : undefined}
      className={`ref-card motion-safe${isActive ? ' ref-card--active' : ''}`}
      style={{
        width: cardWidth,
        height: cardHeight,
        left: '50%',
        top: '50%',
        marginLeft: -cardWidth / 2,
        marginTop: -cardHeight / 2,
        zIndex: isActive ? 10 : 5 - Math.abs(position),
      }}
      initial={false}
      animate={{
        x: (cardWidth / 1.5) * position,
        y: isActive ? -70 : position % 2 ? 15 : -15,
        rotate: isActive ? 0 : position % 2 ? 2.5 : -2.5,
        scale: isActive ? 1 : 0.95,
      }}
      whileHover={!isActive ? { scale: 0.98, y: (position % 2 ? 15 : -15) - 6 } : undefined}
      transition={SPRING}
    >
      <span className="quote-avatar mono" aria-hidden="true">
        {reference.initial}
      </span>
      <p className="mono quote-id">{reference.tag}</p>
      <p className="ref-card-quote">{reference.quote}</p>
      <figcaption>
        <span className="quote-who">
          <span className="quote-name">{reference.name}</span>
          <span className="quote-role mono">{reference.role}</span>
        </span>
      </figcaption>
    </motion.button>
  );
}

export default function ReferencesCarousel() {
  const [card, setCard] = useState(CARD.mobile);
  const [slots, setSlots] = useState<Slot<Reference>[]>(() => toSlots(REFERENCES, nextKey));

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia('(min-width: 640px)');
      setCard(matches ? CARD.desktop : CARD.mobile);
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  function move(steps: number) {
    setSlots((current) => rotateSlots(current, steps, nextKey));
  }

  return (
    <div className="ref-stack" style={{ height: card.height + 150 }}>
      {slots.map((slot, index) => {
        const position = centeredPosition(index, slots.length);
        return (
          <ReferenceCard
            key={slot.key}
            reference={slot.value}
            position={position}
            onSelect={() => move(position)}
            cardWidth={card.width}
            cardHeight={card.height}
          />
        );
      })}
      <div className="ref-stack-nav">
        <button type="button" className="quote-nav" aria-label="Previous reference" onClick={() => move(-1)}>
          ‹
        </button>
        <button type="button" className="quote-nav" aria-label="Next reference" onClick={() => move(1)}>
          ›
        </button>
      </div>
    </div>
  );
}
