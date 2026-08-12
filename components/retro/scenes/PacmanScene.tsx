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
  // Tracks the WAY index the avatar is currently sitting at, so the next tween
  // can walk every intermediate corridor point instead of cutting a straight
  // line to the destination (final-review I7). null on first render — WAY[0] is
  // "empty" (untweened), so the mount tween below is a single hop, same as before.
  const prevWayIndexRef = useRef<number | null>(null);

  // STOPS[i] always sits at WAY[2*i + 1] — see the STOPS/WAY constants above.
  const stopToWayIndex = (i: number) => (i < 0 ? 0 : 2 * i + 1);

  useGSAP(() => {
    const destWayIndex = stopToWayIndex(index);
    const startWayIndex = prevWayIndexRef.current;
    prevWayIndexRef.current = destWayIndex;

    const path: [number, number][] =
      startWayIndex === null
        ? [WAY[destWayIndex]]
        : (() => {
            const dir = destWayIndex >= startWayIndex ? 1 : -1;
            const pts: [number, number][] = [];
            for (let i = startWayIndex; i !== destWayIndex; i += dir) pts.push(WAY[i + dir]);
            return pts;
          })();

    if (path.length === 0) return;

    const tl = gsap.timeline();
    const perSegment = Math.max(0.5 / path.length, 0.16);
    path.forEach((point, i) => {
      const [x, y] = cellCenter(point);
      tl.to(pacRef.current, {
        x,
        y,
        duration: perSegment,
        ease: i === path.length - 1 ? 'power1.inOut' : 'none',
      });
    });
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
