// components/retro/scenes/PlatformerScene.tsx
// Dipakai untuk area 'org' dan 'work': karakter berjalan dari blok ke blok,
// tiap blok punya 2 langkah (buka -> baca). Kamera dan sprite dianimasikan
// lewat GSAP timeline setiap `step` berubah.
'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import type { AreaDef } from '@/lib/retro/gameState';
import type { StoryBeat } from '@/lib/retro/content';
import { spriteRects } from '@/lib/retro/sprite';

const SPAN = 520;

export function PlatformerScene({ area, data, step }: { area: AreaDef; data: StoryBeat[]; step: number }) {
  const camRef = useRef<SVGGElement>(null);
  const heroRef = useRef<SVGGElement>(null);
  const jumpRef = useRef<SVGGElement>(null);
  const blockRefs = useRef<(SVGGElement | null)[]>([]);

  const index = step <= 0 ? 0 : Math.floor((step - 1) / 2);
  const phase = step <= 0 ? -1 : (step - 1) % 2; // 0 = arrived at block, 1 = block opened
  const focusX = step <= 0 ? 60 : 260 + index * SPAN;

  useGSAP(() => {
    const viewWidth = 1000;
    gsap.to(camRef.current, { x: -(focusX - viewWidth / 2), duration: 0.6, ease: 'power2.out' });
    gsap.to(heroRef.current, { x: step <= 0 ? 60 : 260 + index * SPAN - 30, duration: 0.55, ease: 'power2.out' });
    gsap.to(jumpRef.current, { y: phase === 1 ? -46 : 0, duration: 0.22, ease: 'power1.inOut' });

    data.forEach((_, i) => {
      const opened = i < index || (i === index && phase === 1);
      const block = blockRefs.current[i];
      if (!block) return;
      gsap.to(block.querySelector('.pf-question'), { opacity: opened ? 0 : 1, duration: 0.18 });
      gsap.to(block.querySelector('.pf-opened'), { opacity: opened ? 1 : 0, y: opened ? -10 : 0, duration: 0.3 });
      gsap.to(block.querySelector('.pf-label'), { opacity: opened ? 1 : 0, y: opened ? 0 : 10, duration: 0.35 });
      gsap.to(block.querySelector('.pf-flag'), { opacity: opened ? 1 : 0, duration: 0.4 });
    });
  }, [step, index, phase, focusX, data]);

  return (
    <svg viewBox="0 0 1000 560" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      <g ref={camRef}>
        <rect x={-900} y={-200} width={1000 * data.length + 1800} height={960} fill={area.key === 'org' ? '#7fd0ef' : '#9fd7f0'} />
        <rect x={-900} y={470} width={1000 * data.length + 1800} height={290} fill={area.key === 'org' ? '#6cc24a' : '#b98f5e'} />

        {data.map((d, i) => {
          const x = 260 + i * SPAN;
          const opened = i < index || (i === index && phase === 1);
          return (
            <g
              key={d.tag}
              ref={(el) => {
                blockRefs.current[i] = el;
              }}
            >
              <g className="pf-question" opacity={opened ? 0 : 1}>
                <rect x={x - 26} y={300} width={52} height={52} fill="#e8a92e" />
                <text x={x} y={335} fill="#fdf6e8" fontSize={22} textAnchor="middle">
                  ?
                </text>
              </g>
              <g className="pf-opened" opacity={opened ? 1 : 0}>
                <rect x={x - 26} y={300} width={52} height={52} fill="#b98f5e" />
                <text x={x} y={336} fill="#ffcb2e" fontSize={20} textAnchor="middle">
                  !
                </text>
              </g>
              <g className="pf-label" opacity={opened ? 1 : 0} transform="translate(0,10)">
                <rect x={x - 72} y={222} width={144} height={30} fill="#20182e" />
                <rect x={x - 69} y={225} width={138} height={24} fill="#fdf6e8" />
                <text x={x} y={242} fill="#20182e" fontSize={9} textAnchor="middle">
                  {d.tag}
                </text>
              </g>
              <rect x={x + 120} y={330} width={5} height={140} fill="#cbb9a0" />
              <g className="pf-flag" opacity={opened ? 1 : 0}>
                <rect x={x + 125} y={334} width={34} height={22} fill={area.color} />
              </g>
            </g>
          );
        })}

        <g ref={heroRef}>
          <g ref={jumpRef}>
            {spriteRects(4.6, area.key === 'org' ? 0 : 2).map((r, i) => (
              <rect key={i} x={r.x} y={r.y + 396} width={r.w} height={r.h} fill={r.fill} />
            ))}
          </g>
        </g>
      </g>
    </svg>
  );
}
