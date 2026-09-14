'use client';

import { m, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Blur-in ala HorizonX: teks masuk dari blur + sedikit geser saat masuk
 * viewport, sekali saja. Dipakai untuk lede section - dipasangkan dengan
 * MaskedLines (judul) yang tetap berupa mask reveal.
 */
export default function BlurIn({
  children,
  delay = 0,
  amount = 0.5,
  as = 'p',
  className,
}: {
  children: ReactNode;
  delay?: number;
  amount?: number;
  as?: 'p' | 'div' | 'span';
  className?: string;
}) {
  const reduced = useReducedMotion();
  const Tag = m[as] as typeof m.p;

  if (reduced) return <Tag className={className}>{children}</Tag>;

  return (
    <Tag
      className={className ? `${className} motion-safe` : 'motion-safe'}
      initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Tag>
  );
}
