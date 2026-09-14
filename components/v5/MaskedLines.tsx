'use client';

import { m, useReducedMotion } from 'framer-motion';

/**
 * v5 mask reveal. The observed element is the mask (never clipped),
 * the inner line animates via variants. Same IntersectionObserver
 * lesson as v3: never put whileInView on the clipped line itself.
 */
export default function MaskedLines({ id, lines }: { id: string; lines: readonly [string, string] }) {
  const reduced = useReducedMotion();
  const shown = lines.filter((l) => l !== '');

  if (reduced) {
    return (
      <h2 className="v5-display v5-section__title" id={id}>
        {shown.map((line, i) => (
          <span key={line}>{i === shown.length - 1 && shown.length > 1 ? <em>{line}</em> : line}</span>
        ))}
      </h2>
    );
  }

  return (
    <h2 className="v5-display v5-section__title" id={id}>
      {shown.map((line, i) => (
        <m.span
          className="v5-mask"
          key={line}
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, amount: 0.4 }}
        >
          <m.span
            className="v5-mask__line motion-safe"
            variants={{ hidden: { y: '112%' }, shown: { y: '0%' } }}
            transition={{ duration: 0.7, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
          >
            {i === shown.length - 1 && shown.length > 1 ? <em>{line}</em> : line}
          </m.span>
        </m.span>
      ))}
    </h2>
  );
}
