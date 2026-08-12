// components/retro/scenes/PuzzleScene.tsx
// Dipakai untuk area 'skill': 4 keping terbang masuk dari luar layar ke slot
// 2x2 (TL/TR/BR/BL), pakai easing overshoot ('back') di GSAP untuk efek "klik pas".
'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import type { SkillPiece } from '@/lib/retro/content';

const SIZE = 210;
const SLOTS: [number, number][] = [
  [110, 80],
  [320, 80],
  [320, 290],
  [110, 290],
];
const OFFSCREEN: [number, number][] = [
  [-320, -260],
  [320, -260],
  [320, 260],
  [-320, 260],
];

export function PuzzleScene({ data, step }: { data: SkillPiece[]; step: number }) {
  const pieceRefs = useRef<(SVGGElement | null)[]>([]);
  const index = step <= 0 ? -1 : Math.floor((step - 1) / 2);

  useGSAP(() => {
    data.forEach((_, i) => {
      const placed = step > 0 && i <= index;
      const el = pieceRefs.current[i];
      if (!el) return;
      gsap.to(el, {
        opacity: placed ? 1 : 0,
        x: placed ? 0 : OFFSCREEN[i][0],
        y: placed ? 0 : OFFSCREEN[i][1],
        duration: 0.5,
        ease: placed ? 'back.out(1.6)' : 'power1.in',
      });
    });
  }, [index, step, data]);

  return (
    <svg viewBox="0 0 660 520" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      <rect x={-700} y={-600} width={2100} height={1800} fill="#1a1030" />
      {SLOTS.map((p, i) => (
        <rect key={i} x={p[0]} y={p[1]} width={SIZE} height={SIZE} fill="#20143c" />
      ))}
      {data.map((s, i) => {
        const p = SLOTS[i];
        return (
          <g key={s.name} ref={(el) => { pieceRefs.current[i] = el; }} opacity={0}>
            <rect x={p[0]} y={p[1]} width={SIZE} height={SIZE} fill={s.color} />
            <text x={p[0] + SIZE / 2} y={p[1] + (i < 2 ? 58 : SIZE - 42)} fill="#20182e" fontSize={13} textAnchor="middle">
              {s.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
