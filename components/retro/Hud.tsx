// components/retro/Hud.tsx
'use client';

export function Hud(props: {
  areaName: string;
  sectionLabel: string;
  soundOn: boolean;
  onToggleSound: () => void;
  onBackToMap: () => void;
  onOpenCv: () => void;
  mapVisible: boolean;
}) {
  const { areaName, sectionLabel, soundOn, onToggleSound, onBackToMap, onOpenCv, mapVisible } = props;
  return (
    <div className="relative z-30 flex items-center gap-2.5 border-b-4 border-[var(--ink-2)] bg-[var(--ink)] px-3 py-2 font-pixel text-[9px]">
      <span className="hidden text-[var(--cream)] sm:inline">
        NUR FAJAR — <b className="text-[var(--accent)]">{sectionLabel}</b>
      </span>
      <span className="flex-1 truncate text-center text-[var(--accent)]">{areaName}</span>
      <button
        type="button"
        onClick={onBackToMap}
        disabled={mapVisible}
        className="whitespace-nowrap border-2 border-[var(--ink-2)] px-2 py-1.5 text-[8px] text-[var(--cream-d)] hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-45"
      >
        MAP
      </button>
      <button
        type="button"
        onClick={onToggleSound}
        aria-pressed={soundOn}
        className="whitespace-nowrap border-2 border-[var(--ink-2)] px-2 py-1.5 text-[8px] text-[var(--cream-d)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
      >
        {soundOn ? 'SOUND' : 'MUTED'}
      </button>
      <button
        type="button"
        onClick={onOpenCv}
        className="whitespace-nowrap border-2 border-[var(--ink-2)] px-2 py-1.5 text-[8px] text-[var(--cream-d)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
      >
        VIEW CV
      </button>
    </div>
  );
}
