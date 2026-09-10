'use client';

import { m, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { useRef } from 'react';

/** Kemiringan maksimum ke tiap sisi, derajat. */
const MAX = 8;

/**
 * Kemiringan 3D mengikuti kursor: kartu berputar pada sumbu X/Y menjauhi
 * posisi pointer. Dipakai daftar tool di Technologies; perspective-nya
 * dipasang induknya lewat CSS (lihat .v3-tool).
 *
 * Nilainya hidup di motion value, bukan state, seperti Magnetic: pointer
 * yang bergerak tidak pernah memicu render ulang React. Cuma pointer mouse
 * yang didengar: di layar sentuh tidak ada kursor untuk diikuti, dan
 * pointermove saat scroll sentuh cuma mengunci kartu dalam posisi miring
 * setengah jalan.
 */
export default function Tilt({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 18 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 18 });

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      ref={ref}
      className={className}
      style={{ rotateX: springX, rotateY: springY }}
      whileHover={{ scale: 1.02 }}
      onPointerMove={(event) => {
        if (event.pointerType !== 'mouse') return;
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        rotateY.set(px * MAX * 2);
        rotateX.set(-py * MAX * 2);
      }}
      onPointerLeave={() => {
        rotateX.set(0);
        rotateY.set(0);
      }}
    >
      {children}
    </m.div>
  );
}
