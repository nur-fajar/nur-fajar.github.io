// components/retro/IslandGame.tsx
// Root: memegang state {started, cursor, done, sound, forceFallback}, menangani
// input global (wheel/touch/keyboard), dan merender scene yang sesuai. Konten
// panel dihitung dari (cursor, data) — simetris maju/mundur seperti versi asli.
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AREAS,
  CONTACT,
  ORG,
  PROJECT_CATEGORIES,
  PROJECTS,
  SKILLS,
  WORK,
  dataForArea,
} from '@/lib/retro/content';
import { advanceCursor, nextUndoneArea, type StepCursor } from '@/lib/retro/gameState';
import { createRetroSfx } from '@/lib/retro/sfx';
import { CvOverlay } from './CvOverlay';
import { FallbackList } from './FallbackList';
import { Hud } from './Hud';
import { IslandMap } from './IslandMap';
import { Panel, type PanelData } from './Panel';
import { PacmanScene } from './scenes/PacmanScene';
import { PlatformerScene } from './scenes/PlatformerScene';
import { PuzzleScene } from './scenes/PuzzleScene';
import { TetrisScene } from './scenes/TetrisScene';
import { TitleOverlay } from './TitleOverlay';
import { Track } from './Track';

const NEXT_HINT = '**SCROLL / CLICK** to continue · scroll up to go back';

function buildPanelData(cursor: StepCursor, done: ReadonlySet<number>): PanelData {
  if (cursor.area === null) {
    if (done.size >= AREAS.length) {
      return {
        eyebrow: 'DONE · 5/5 AREAS',
        title: "THE ISLAND'S FULLY EXPLORED.",
        body: [
          'Organizations, work, projects, skills, contact — all open now. One thing left: **word from you**.',
          'Click any area to replay it, or __hello@nurfajar.com__ to start a real conversation.',
        ],
        tags: [
          ['STATUS', 'OPEN TO WORK'],
          ['EMAIL', 'hello@nurfajar.com'],
        ],
        hint: 'Click an area on the map to replay it',
      };
    }
    return {
      eyebrow: `MAP · ${done.size}/5 AREAS DONE`,
      title: 'PICK AN AREA — OR KEEP SCROLLING',
      body: [
        'Five areas, five ways to play. Click one, or **keep scrolling** and I will take you to the next one myself.',
        'Everything can be opened any time, and scrolling up always takes you back one step.',
      ],
      tags: AREAS.map((a) => [a.sectionLabel, done.has(a.id) ? 'DONE' : 'OPEN'] as [string, string]),
      hint: NEXT_HINT,
    };
  }

  const area = AREAS[cursor.area];
  const data = dataForArea(area.key);

  if (cursor.step === 0) {
    return {
      eyebrow: `AREA ${area.id + 1}/5 · ${area.name} · GENRE: ${area.genre.toUpperCase()}`,
      title: area.sectionLabel,
      body: [area.intro],
      tags: [
        ['STEPS', String(area.steps)],
        ['ITEMS', `${data.length} ITEMS`],
      ],
      hint: NEXT_HINT,
    };
  }

  if (area.key === 'hire') {
    const contactStep = cursor.step;
    if (contactStep <= CONTACT.length) {
      const c = CONTACT[contactStep - 1];
      return {
        eyebrow: `BLOCK ${contactStep}/${CONTACT.length} LOCKING IN`,
        title: `${c.tag} — ${c.value}`,
        body: [c.blurb, `[Open ${c.tag.toLowerCase()}](${c.href})`],
        hint: NEXT_HINT,
      };
    }
    return {
      eyebrow: 'LINE CLEAR · DOUBLE',
      title: "THE ROW'S FULL. THE GAME ISN'T OVER.",
      body: [
        'Those four blocks are every way to reach me. The last two columns were already there: **open to work**.',
        "If you're looking for someone who can design the program __and__ build the tooling that runs it — send one line.",
      ],
      tags: [
        ['STATUS', 'OPEN TO WORK'],
        ['BASED', 'INDONESIA'],
      ],
      hint: '**SCROLL** to go back to the map',
    };
  }

  const itemIndex = Math.floor((cursor.step - 1) / 2);
  const phase = (cursor.step - 1) % 2;

  if (area.key === 'skill') {
    const s = SKILLS[itemIndex];
    if (phase === 0) {
      return {
        eyebrow: `PIECE ${itemIndex + 1}/4 · ${s.plainName}`,
        title: s.plainName.toUpperCase(),
        body: [s.blurb],
        hint: NEXT_HINT,
      };
    }
    return {
      eyebrow: `PIECE ${itemIndex + 1}/4 · PLACED`,
      title: s.plainName.toUpperCase(),
      body: [s.blurb],
      tags: s.items.map((item) => [item, ''] as [string, string]),
      hint: NEXT_HINT,
    };
  }

  const d = (area.key === 'proj' ? PROJECTS : area.key === 'org' ? ORG : WORK)[itemIndex];
  if (phase === 0) {
    return {
      eyebrow: `${area.sectionLabel} · ${itemIndex + 1}/${data.length}`,
      title: `TOWARD ${d.tag}`,
      body: ['One more step to open it up.'],
      hint: NEXT_HINT,
    };
  }
  return {
    eyebrow: `${area.sectionLabel} · ${itemIndex + 1}/${data.length} · ${d.sub}`,
    title: d.title,
    body: [d.problem, d.resolution],
    tags: d.stats,
    hint: NEXT_HINT,
  };
}

export function IslandGame() {
  const [started, setStarted] = useState(false);
  const [cursor, setCursor] = useState<StepCursor>({ area: null, step: 0 });
  const [done, setDone] = useState<ReadonlySet<number>>(new Set());
  const [soundOn, setSoundOn] = useState(true);
  const [cvOpen, setCvOpen] = useState(false);
  const [forceFallback, setForceFallback] = useState(false);
  const sfxRef = useRef(createRetroSfx());
  const lockRef = useRef(0);

  const prefersReducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );
  const useFallback = forceFallback || prefersReducedMotion;

  useEffect(() => {
    sfxRef.current.setEnabled(soundOn);
  }, [soundOn]);

  const enterArea = useCallback((id: number) => {
    sfxRef.current.enter();
    setCursor({ area: id, step: 0 });
  }, []);

  const applyStep = useCallback(
    (delta: number) => {
      const now = Date.now();
      if (now < lockRef.current) return;
      lockRef.current = now + 420;

      if (!started) {
        if (delta > 0) {
          setStarted(true);
          sfxRef.current.enter();
        }
        return;
      }
      if (cvOpen) return;

      if (cursor.area === null) {
        if (delta > 0) {
          const next = nextUndoneArea(AREAS, done);
          if (next !== null) enterArea(next);
        }
        return;
      }

      const result = advanceCursor(cursor, AREAS, delta);
      if (result.completedAreaId !== null) {
        setDone((prev) => new Set(prev).add(result.completedAreaId as number));
        sfxRef.current.coin();
      } else {
        delta > 0 ? sfxRef.current.step() : sfxRef.current.back();
      }
      setCursor(result.cursor);
    },
    [started, cvOpen, cursor, done, enterArea],
  );

  useEffect(() => {
    function onWheel(e: WheelEvent) {
      if (cvOpen) return;
      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(delta) < 3) return;
      applyStep(delta > 0 ? 1 : -1);
    }
    function onKeydown(e: KeyboardEvent) {
      if (cvOpen) {
        if (e.key === 'Escape') setCvOpen(false);
        return;
      }
      if (['ArrowDown', 'ArrowRight', ' ', 'Enter', 'PageDown'].includes(e.key)) {
        e.preventDefault();
        applyStep(1);
      }
      if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        applyStep(-1);
      }
      if (e.key === 'Escape' && cursor.area !== null) setCursor({ area: null, step: 0 });
    }
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('keydown', onKeydown);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeydown);
    };
  }, [applyStep, cvOpen, cursor.area]);

  const panelData = useMemo(() => buildPanelData(cursor, done), [cursor, done]);
  const currentArea = cursor.area !== null ? AREAS[cursor.area] : null;

  if (useFallback) {
    return (
      <div>
        <a href="#fallback-main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-[var(--gold)] focus:p-3">
          Skip to content
        </a>
        <div className="flex justify-end p-3">
          <button
            type="button"
            onClick={() => setForceFallback(false)}
            className="border-2 border-[var(--ink)] px-2 py-1 text-xs"
          >
            Try the animated version instead
          </button>
        </div>
        <div id="fallback-main">
          <FallbackList />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-dvh w-full flex-col" style={{ ['--accent' as string]: currentArea?.color ?? '#ffcb2e' }}>
      <a href="#retro-panel" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-[var(--gold)] focus:p-3">
        Skip game, jump to CV summary
      </a>

      <Hud
        areaName={currentArea?.name ?? 'FAJAR ISLAND'}
        sectionLabel={currentArea?.sectionLabel ?? 'L&D'}
        soundOn={soundOn}
        onToggleSound={() => setSoundOn((v) => !v)}
        onBackToMap={() => setCursor({ area: null, step: 0 })}
        onOpenCv={() => setCvOpen(true)}
        mapVisible={cursor.area === null}
      />

      <div className="relative min-h-0 flex-1 overflow-hidden bg-[#0d0a1c]" onClick={() => applyStep(1)}>
        {!started && <TitleOverlay onStart={() => applyStep(1)} />}
        {started && cursor.area === null && <IslandMap done={done} onEnterArea={enterArea} />}
        {started && currentArea?.key === 'org' && <PlatformerScene area={currentArea} data={ORG} step={cursor.step} />}
        {started && currentArea?.key === 'work' && <PlatformerScene area={currentArea} data={WORK} step={cursor.step} />}
        {started && currentArea?.key === 'proj' && (
          <PacmanScene data={PROJECTS} categories={PROJECT_CATEGORIES} step={cursor.step} />
        )}
        {started && currentArea?.key === 'skill' && <PuzzleScene data={SKILLS} step={cursor.step} />}
        {started && currentArea?.key === 'hire' && <TetrisScene data={CONTACT} step={cursor.step} />}
      </div>

      <div aria-live="polite" className="sr-only">
        {panelData.title} — {panelData.body.join(' ')}
      </div>

      <Panel data={panelData} />
      <Track areas={AREAS} done={done} cursor={cursor} onJumpToArea={enterArea} />
      <CvOverlay open={cvOpen} onClose={() => setCvOpen(false)} />

      {!prefersReducedMotion && (
        <button
          type="button"
          onClick={() => setForceFallback(true)}
          className="sr-only focus:not-sr-only focus:fixed focus:bottom-16 focus:right-3 focus:z-50 focus:border-2 focus:border-[var(--ink)] focus:bg-[var(--cream)] focus:px-2 focus:py-1 focus:text-xs"
        >
          Switch to text-only version
        </button>
      )}
    </div>
  );
}
