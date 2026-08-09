'use client';

/* ── References: staggered card stack ───────────────────────────────────
   Adapted from a "stagger testimonials" pattern (click a side card, or the
   arrows, to bring it to the front) — reskinned onto this file's own
   chamfer/panel/accent tokens instead of a separate shadcn-style palette,
   so it stays one visual system with the rest of the site. Reuses the
   .quote-avatar/-id/-name/-role type already defined below for the old
   one-at-a-time slider this replaced.

   Rotation is array-shift, not index math: clicking a card moves it (and
   everything between it and the front) across the array, same as the
   source component. See lib/stagger.ts for the rotation/position math,
   unit-tested there without needing a DOM. */

import { useEffect, useState } from 'react';
import { REFERENCES, type Reference } from '@/content/references';
import { centeredPosition, rotateSlots, toSlots, type Slot } from '@/lib/stagger';

let keySeq = 0;
const nextKey = () => keySeq++;

const CARD = {
  desktop: { width: 340, height: 440 },
  mobile: { width: 260, height: 400 },
};

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
    <button
      type="button"
      onClick={onSelect}
      disabled={isActive}
      aria-label={isActive ? undefined : `Show reference from ${reference.name}`}
      aria-current={isActive ? 'true' : undefined}
      className={`ref-card${isActive ? ' ref-card--active' : ''}`}
      style={{
        width: cardWidth,
        height: cardHeight,
        transform: `
          translate(-50%, -50%)
          translateX(${(cardWidth / 1.5) * position}px)
          translateY(${isActive ? -70 : position % 2 ? 15 : -15}px)
          rotate(${isActive ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        zIndex: isActive ? 10 : 5 - Math.abs(position),
      }}
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
    </button>
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
