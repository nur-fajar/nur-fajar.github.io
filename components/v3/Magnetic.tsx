'use client';

import { m, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { useRef } from 'react';

/**
 * Pembungkus magnetik: isinya tertarik ke arah kursor dengan pegas, lalu
 * kembali ke tempatnya. Dipakai untuk dua titik yang ingin terasa "hidup":
 * ubin Connect di hero dan tombol Book 15 min di Contact.
 *
 * Nilainya hidup di motion value, bukan state, jadi pointer yang bergerak
 * tidak pernah memicu render ulang React.
 */
export default function Magnetic({
  children,
  strength = 0.3,
}: {
  children: React.ReactNode;
  strength?: number;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 160, damping: 12, mass: 0.2 });
  const springY = useSpring(y, { stiffness: 160, damping: 12, mass: 0.2 });

  if (reduced) {
    return <span className="v3-magnetic">{children}</span>;
  }

  return (
    <m.span
      ref={ref}
      className="v3-magnetic"
      style={{ x: springX, y: springY }}
      onPointerMove={(event) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
        y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </m.span>
  );
}
