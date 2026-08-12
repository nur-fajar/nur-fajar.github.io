// components/retro/Track.tsx
'use client';

import type { AreaDef, StepCursor } from '@/lib/retro/gameState';
import { globalStep, totalSteps } from '@/lib/retro/gameState';

export function Track(props: {
  areas: AreaDef[];
  done: ReadonlySet<number>;
  cursor: StepCursor;
  onJumpToArea: (id: number) => void;
}) {
  const { areas, done, cursor, onJumpToArea } = props;
  const total = totalSteps(areas);
  const g = globalStep(cursor, areas);
  const pct = total > 0 ? (g / total) * 100 : 0;

  const checkpoints = areas.map((a, i) => {
    const before = areas.slice(0, i).reduce((s, x) => s + x.steps, 0);
    return { area: a, pct: ((before + a.steps / 2) / total) * 100 };
  });

  return (
    <div className="relative z-30 h-[calc(44px+env(safe-area-inset-bottom))] border-t-4 border-[var(--ink-2)] bg-[var(--ink)]">
      <div className="absolute left-2.5 right-2.5 top-3.5 h-1.5 bg-[var(--ink-2)]">
        <div className="h-full bg-[var(--accent)] transition-[width] duration-300" style={{ width: `${pct.toFixed(1)}%` }} />
      </div>
      <div className="absolute left-2.5 right-2.5 top-0 h-11">
        {checkpoints.map(({ area, pct: cpPct }) => (
          <button
            key={area.id}
            type="button"
            onClick={() => onJumpToArea(area.id)}
            style={{ left: `${cpPct}%` }}
            title={area.sectionLabel}
            className="absolute top-1.5 grid w-5.5 -translate-x-1/2 place-items-center"
          >
            <em
              className={`block h-2.5 w-2.5 rotate-45 border-2 border-[var(--ink)] not-italic transition-colors ${
                cursor.area === area.id ? 'bg-[var(--accent)]' : done.has(area.id) ? 'bg-[var(--grass)]' : 'bg-[var(--ink-2)]'
              }`}
            />
            <span
              className={`absolute top-[26px] hidden whitespace-nowrap font-pixel text-[6px] sm:block ${
                cursor.area === area.id ? 'text-[var(--accent-text)]' : 'text-[var(--cream-d)]'
              }`}
            >
              {area.sectionLabel}
            </span>
          </button>
        ))}
      </div>
      {/* text-[var(--cream-d)] (not --ink-2): --ink-2 on --ink is ~1.4:1, unreadable — see final-review I3. */}
      <span className="absolute right-3 top-3 hidden bg-[var(--ink)] px-1 font-pixel text-[7px] text-[var(--cream-d)] sm:block">
        {String(g).padStart(2, '0')}/{total}
      </span>
    </div>
  );
}
