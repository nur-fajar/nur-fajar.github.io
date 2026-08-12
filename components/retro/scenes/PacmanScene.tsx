// components/retro/scenes/PacmanScene.tsx
// Dipakai untuk area 'proj': avatar berjalan sepanjang jalur tetap lewat 5
// checkpoint proyek, memakan pellet di sepanjang jalan. Gerak sepanjang path
// dianimasikan pakai GSAP (tween x/y per titik jalur), bukan setInterval manual.
'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import type { ProjectEntry } from '@/lib/retro/content';

const CELL = 40;
const WAY: [number, number][] = [
  [1, 7], [1, 1], [5, 1], [5, 4], [9, 4], [9, 1], [13, 1], [13, 5], [7, 5], [7, 7], [1, 7],
];
const STOPS: [number, number][] = [[1, 1], [5, 4], [9, 1], [13, 5], [7, 7]];

function cellCenter([cx, cy]: [number, number]) {
  return [cx * CELL + 30, cy * CELL + 40];
}

export function PacmanScene({
  data,
  categories,
  step,
}: {
  data: ProjectEntry[];
  categories: [string, string][];
  step: number;
}) {
  const pacRef = useRef<SVGGElement>(null);
  const index = step <= 0 ? -1 : Math.floor((step - 1) / 2);
  const phase = step <= 0 ? -1 : (step - 1) % 2;

  useGSAP(() => {
    const dest = index < 0 ? WAY[0] : STOPS[index];
    const [x, y] = cellCenter(dest);
    gsap.to(pacRef.current, { x, y, duration: 0.5, ease: 'power1.inOut' });
  }, [index]);

  return (
    <svg viewBox="0 0 620 400" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      <rect x={-800} y={-700} width={2200} height={1900} fill="#0f0a1e" />
      <path
        d={`M ${WAY.map(cellCenter).map(([x, y]) => `${x},${y}`).join(' L ')}`}
        fill="none"
        stroke="#241a44"
        strokeWidth={4}
      />
      {STOPS.map((s, i) => {
        const [cx, cy] = cellCenter(s);
        const eaten = step > 0 && (i < index || (i === index && phase === 1));
        return (
          <g key={data[i].tag}>
            <circle cx={cx} cy={cy} r={13} fill={categories[data[i].categoryIndex][1]} opacity={0.28} />
            <circle cx={cx} cy={cy} r={9} fill={categories[data[i].categoryIndex][1]} opacity={eaten ? 0 : 1} />
          </g>
        );
      })}
      <g ref={pacRef}>
        <circle cx={0} cy={0} r={14} fill="#ffcb2e" />
        <path d="M0,0 L16,-9 L16,9 Z" fill="#0f0a1e" />
      </g>
    </svg>
  );
}
