'use client';

/* Word-mask reveal, v2's version of the root site's RevealWords — kept
   separate (rather than importing the root component) because this one
   needs an `emphasize` matcher that gives one word its own accent
   styling, which RevealWords doesn't support. */

import { motion } from 'framer-motion';
import type { ElementType } from 'react';

export default function SplitReveal({
  text,
  as = 'span',
  className,
  delay = 0,
  stagger = 0.08,
  emphasize,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
  /** Word (case-insensitive, punctuation-stripped) to render with the
      `.v2-emphasis` accent class. */
  emphasize?: string;
}) {
  const Tag = as;
  const words = text.split(' ');

  return (
    <Tag className={className}>
      {words.map((word, i) => {
        const bare = word.replace(/[^\w']/g, '').toLowerCase();
        const isEmphasis = emphasize && bare === emphasize.toLowerCase();
        return (
          // The space is a literal sibling text node, not the last character
          // inside the mask span — a trailing space at the very end of an
          // inline-block's own content gets trimmed by the browser (it reads
          // as end-of-line whitespace), which was collapsing "I build" into
          // "Ibuild". Keeping it outside the mask avoids that.
          <span key={i}>
            <span className="v2-word-mask">
              <motion.span
                className={`v2-word motion-safe${isEmphasis ? ' v2-emphasis' : ''}`}
                initial={{ y: '115%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: delay + i * stagger }}
              >
                {word}
              </motion.span>
            </span>
            {i < words.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </Tag>
  );
}
