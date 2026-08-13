'use client';

/* ── Word-by-word mask reveal ─────────────────────────────────────────────
   Splits text into words, each wrapped in an overflow-hidden mask so the
   word itself slides up from underneath it — a "curtain rising" reveal
   instead of a plain opacity fade. Used for the hero's name and tagline,
   the two lines meant to land with the most weight. */

import { motion } from 'framer-motion';
import type { ElementType, ReactNode } from 'react';

export default function RevealWords({
  text,
  as = 'span',
  className,
  delay = 0,
  stagger = 0.07,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
}): ReactNode {
  const Tag = as;
  const words = text.split(' ');

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <span className="reveal-word-mask" key={i}>
          <motion.span
            className="reveal-word motion-safe"
            initial={{ y: '110%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: delay + i * stagger }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
