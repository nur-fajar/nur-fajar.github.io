// components/retro/scenes/TetrisScene.tsx
// Dipakai untuk area 'hire': satu balok kontak jatuh per langkah, baris
// "line clear" muncul setelah balok terakhir. Jatuhnya dianimasikan GSAP
// dengan easing masuk yang landai (mendekati gravitasi).
'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import type { ContactMethod } from '@/lib/retro/content';

const CELL = 40;
const COLUMN_X = [4, 5, 6, 7];
const ROW_Y = 4;

export function TetrisScene({ data, step }: { data: ContactMethod[]; step: number }) {
  const pieceRefs = useRef<(SVGGElement | null)[]>([]);
  const clearedRef = useRef<SVGGElement>(null);

  useGSAP(() => {
    data.forEach((_, i) => {
      const landed = step >= i + 1;
      const el = pieceRefs.current[i];
      if (!el) return;
      gsap.to(el, { opacity: landed ? 1 : 0, y: landed ? 0 : -420, duration: 0.42, ease: 'power2.in' });
    });
    gsap.to(clearedRef.current, { opacity: step >= data.length + 1 ? 1 : 0, duration: 0.4 });
  }, [step, data]);

  return (
    <svg viewBox="0 0 520 420" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      <rect x={-800} y={-700} width={2200} height={1900} fill="#0d0a1c" />
      {data.map((c, i) => {
        const x = 10 + COLUMN_X[i] * CELL;
        const y = 10 + ROW_Y * CELL;
        return (
          <g key={c.tag} ref={(el) => { pieceRefs.current[i] = el; }} opacity={0}>
            <rect x={x + 2} y={y + 2} width={CELL - 4} height={CELL - 4} fill={c.color} />
            <text x={x + CELL / 2} y={y + CELL / 2 + 3} fill="#fdf6e8" fontSize={7} textAnchor="middle">
              {c.tag}
            </text>
          </g>
        );
      })}
      <g ref={clearedRef} opacity={0}>
        <rect x={10} y={10 + ROW_Y * CELL} width={COLUMN_X.length * CELL} height={CELL * 2} fill="#6cc24a" />
        <text x={10 + (COLUMN_X.length * CELL) / 2} y={10 + ROW_Y * CELL + 48} fill="#20182e" fontSize={12} textAnchor="middle">
          LINE CLEAR — READY TO TALK
        </text>
      </g>
    </svg>
  );
}
