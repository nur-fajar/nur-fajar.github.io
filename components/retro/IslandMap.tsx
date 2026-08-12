// components/retro/IslandMap.tsx
// Peta pulau: latar laut+pasir+rumput sebagai path statis, landmark tiap area
// sebagai tombol yang bisa diklik/di-fokus, avatar pemain di dermaga.
'use client';

import { AREAS } from '@/lib/retro/content';
import { spriteRects } from '@/lib/retro/sprite';

const ISLAND_PATH =
  'M 508 60 C 664 50 800 116 868 220 C 940 320 944 436 856 530 C 782 610 690 668 560 660 C 470 654 430 616 372 626 C 288 640 196 604 148 512 C 96 412 78 266 178 178 C 262 102 392 68 508 60 Z';
const ROAD_PATH =
  'M 250 470 Q 216 330 300 200 Q 424 122 610 155 Q 772 226 790 395 Q 706 542 520 560 Q 352 566 250 470';

function LandmarkIcon({ icon, color }: { icon: string; color: string }) {
  switch (icon) {
    case 'camp':
      return (
        <>
          <rect x={-22} y={-4} width={44} height={6} fill="#8a5a3b" />
          <polygon points="0,-40 22,2 -22,2" fill={color} />
          <rect x={-30} y={-10} width={10} height={12} fill="#8a5a3b" />
          <rect x={20} y={-10} width={10} height={12} fill="#8a5a3b" />
        </>
      );
    case 'tower':
      return (
        <>
          <rect x={-20} y={-52} width={40} height={54} fill={color} />
          <rect x={-20} y={-58} width={40} height={7} fill="#20182e" />
        </>
      );
    case 'forest':
      return (
        <>
          {[[-30, 0], [-10, -8], [12, 2], [30, -6], [0, 10]].map(([px, py], i) => (
            <polygon key={i} points={`${px},${py - 42} ${px + 17},${py + 2} ${px - 17},${py + 2}`} fill={color} />
          ))}
        </>
      );
    case 'temple':
      return (
        <>
          <rect x={-26} y={-8} width={52} height={10} fill="#cbb9a0" />
          <rect x={-20} y={-34} width={40} height={26} fill={color} />
          <polygon points="0,-52 32,-32 -32,-32" fill="#e0d3b8" />
        </>
      );
    default:
      return (
        <>
          <rect x={-11} y={-56} width={22} height={58} fill="#fdf6e8" />
          <rect x={-11} y={-56} width={22} height={8} fill={color} />
          <rect x={-11} y={-40} width={22} height={8} fill={color} />
        </>
      );
  }
}

export function IslandMap({ done, onEnterArea }: { done: ReadonlySet<number>; onEnterArea: (id: number) => void }) {
  return (
    <svg viewBox="0 0 1000 700" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      <rect x={-900} y={-900} width={2800} height={2600} fill="var(--sea)" />
      <path d={ISLAND_PATH} fill="var(--sand)" stroke="var(--sand-d)" strokeWidth={10} />
      <path d={ISLAND_PATH} fill="var(--grass)" transform="translate(500,356) scale(.945) translate(-500,-356)" />
      <path d={ROAD_PATH} fill="none" stroke="var(--sand-d)" strokeWidth={26} strokeLinecap="round" />
      <path d={ROAD_PATH} fill="none" stroke="var(--sand)" strokeWidth={17} strokeLinecap="round" />

      {AREAS.map((area) => (
        <g
          key={area.id}
          role="button"
          tabIndex={0}
          aria-label={`Open ${area.sectionLabel}${done.has(area.id) ? ' (completed)' : ''}`}
          transform={`translate(${area.mapPos[0]},${area.mapPos[1]})`}
          className="cursor-pointer focus-visible:outline focus-visible:outline-4 focus-visible:outline-[var(--gold)]"
          onClick={() => onEnterArea(area.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onEnterArea(area.id);
            }
          }}
        >
          <ellipse cx={0} cy={4} rx={42} ry={12} fill="#20182e" opacity={0.16} />
          <LandmarkIcon icon={area.icon} color={area.iconColor ?? area.color} />
          <rect x={-58} y={14} width={116} height={26} fill="#20182e" />
          <rect x={-55} y={17} width={110} height={20} fill="#fdf6e8" />
          <text x={0} y={31} fill="#20182e" fontSize={9} textAnchor="middle">
            {area.sectionLabel}
          </text>
          {done.has(area.id) && (
            <g transform="translate(34,-58)">
              <rect x={0} y={0} width={2} height={26} fill="#20182e" />
              <rect x={2} y={0} width={16} height={11} fill="#6cc24a" />
            </g>
          )}
        </g>
      ))}

      <rect x={300} y={600} width={64} height={14} fill="#8a5a3b" />
      <g transform="translate(308,542)">
        <ellipse cx={24} cy={50} rx={16} ry={5} fill="#20182e" opacity={0.2} />
        <g transform="translate(0,-2)">
          {spriteRects(4, 0).map((r, i) => (
            <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill={r.fill} />
          ))}
        </g>
      </g>
    </svg>
  );
}
