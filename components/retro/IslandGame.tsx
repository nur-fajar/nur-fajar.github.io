// components/retro/IslandGame.tsx
// Root: memegang state {started, cursor, done, sound, forceFallback}, menangani
// input global (wheel/touch/keyboard), dan merender scene yang sesuai. Konten
// panel dihitung dari (cursor, data) — simetris maju/mundur seperti versi asli.
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AREAS, CONTACT, ORG, PROJECT_CATEGORIES, PROJECTS, SKILLS, WORK } from '@/lib/retro/content';
import { advanceCursor, nextUndoneArea, type StepCursor } from '@/lib/retro/gameState';
import { buildPanelData } from '@/lib/retro/panelData';
import { createRetroSfx } from '@/lib/retro/sfx';
import { CvOverlay } from './CvOverlay';
import { FallbackList } from './FallbackList';
import { Hud } from './Hud';
import { IslandMap } from './IslandMap';
import { Panel } from './Panel';
import { PacmanScene } from './scenes/PacmanScene';
import { PlatformerScene } from './scenes/PlatformerScene';
import { PuzzleScene } from './scenes/PuzzleScene';
import { TetrisScene } from './scenes/TetrisScene';
import { TitleOverlay } from './TitleOverlay';
import { Track } from './Track';

// Lightens an area's accent color by blending in 25% white, used for --accent-text.
// Some accent colors (notably the purple SKILLS color, #8b5fe0) fall under the
// 4.5:1 AA contrast ratio when used as small text against --ink or as a
// dark-text background — see final-review I3. Blending toward white raises the
// luminance enough to clear AA for all 5 area colors while keeping the
// per-area color identity.
function accentTextColor(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const mix = (c: number) => Math.round(c * 0.75 + 255 * 0.25);
  return `#${[mix(r), mix(g), mix(b)].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}

export function IslandGame() {
  const [started, setStarted] = useState(false);
  const [cursor, setCursor] = useState<StepCursor>({ area: null, step: 0 });
  const [done, setDone] = useState<ReadonlySet<number>>(new Set());
  const [soundOn, setSoundOn] = useState(true);
  const [cvOpen, setCvOpen] = useState(false);
  // 'auto' defers to the OS prefers-reduced-motion setting; 'game'/'fallback'
  // are explicit user overrides that win regardless of that setting, so the
  // "try the animated version"/"switch to text-only" toggles always work.
  const [motionMode, setMotionMode] = useState<'auto' | 'game' | 'fallback'>('auto');
  // Lazily initialized (not set synchronously inside an effect body — that trips
  // react-hooks/set-state-in-effect, final-review C1) and SSR-guarded, since this
  // is a page-level component with no guarantee it only ever mounts client-side.
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const sfxRef = useRef(createRetroSfx());
  const lockRef = useRef(0);
  const touchStartRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    function onChange(e: MediaQueryListEvent) {
      setPrefersReducedMotion(e.matches);
    }
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const useFallback = motionMode === 'fallback' || (motionMode === 'auto' && prefersReducedMotion);

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
    // In fallback (reduced-motion/text-only) mode nothing here should ever run:
    // the game never renders, so hijacking arrow/space/PageUp/PageDown or
    // wheel/touch would only break native scroll and silently mutate game
    // state behind a page the user can't see (final-review C2).
    if (useFallback) return;

    // Whether the panel (#retro-panel) should keep this wheel/touch gesture for
    // its own native scroll instead of it advancing the game step. Mirrors
    // island-v7.html's panelEats(d, target): the panel keeps the gesture while
    // it still has more content to reveal in that direction, and only lets the
    // gesture "escape" into game-step advancement once it's already scrolled to
    // the edge (final-review I1).
    function panelBlocksGesture(target: EventTarget | null, forward: boolean): boolean {
      const panel = (target as Element | null)?.closest('#retro-panel') as HTMLElement | null;
      if (!panel || panel.scrollHeight <= panel.clientHeight) return false;
      const atTop = panel.scrollTop <= 0;
      const atBottom = panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 1;
      return forward ? !atBottom : !atTop;
    }

    function onWheel(e: WheelEvent) {
      if (cvOpen) return;
      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(delta) < 3) return;
      if (panelBlocksGesture(e.target, delta > 0)) return;
      applyStep(delta > 0 ? 1 : -1);
    }
    function onKeydown(e: KeyboardEvent) {
      if (cvOpen) {
        if (e.key === 'Escape') setCvOpen(false);
        return;
      }
      // Don't hijack Enter/Space/arrows when a focusable control is the actual
      // target — otherwise this cancels activation of HUD/Track/map buttons
      // and both skip links.
      const target = e.target as HTMLElement | null;
      const onInteractive = !!target?.closest('a,button,[role="button"],input,textarea,select');
      if (!onInteractive) {
        if (['ArrowDown', 'ArrowRight', ' ', 'Enter', 'PageDown'].includes(e.key)) {
          e.preventDefault();
          applyStep(1);
        }
        if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) {
          e.preventDefault();
          applyStep(-1);
        }
      }
      if (e.key === 'Escape' && cursor.area !== null) setCursor({ area: null, step: 0 });
    }
    function onTouchStart(e: TouchEvent) {
      touchStartRef.current = e.touches[0]?.clientY ?? null;
    }
    function onTouchEnd(e: TouchEvent) {
      if (cvOpen || touchStartRef.current === null) return;
      const endY = e.changedTouches[0]?.clientY;
      if (endY === undefined) return;
      const diff = touchStartRef.current - endY; // swipe up (finger moves up) == scroll down == forward
      touchStartRef.current = null;
      if (Math.abs(diff) < 24) return;
      if (panelBlocksGesture(e.target, diff > 0)) return;
      applyStep(diff > 0 ? 1 : -1);
    }
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('keydown', onKeydown);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeydown);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [applyStep, cvOpen, cursor.area, useFallback]);

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
            onClick={() => setMotionMode('game')}
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

  const accentColor = currentArea?.color ?? '#ffcb2e';

  return (
    <div
      className="flex h-dvh w-full flex-col"
      style={{ ['--accent' as string]: accentColor, ['--accent-text' as string]: accentTextColor(accentColor) }}
    >
      {/* A real button (not an anchor to #retro-panel, which was neither the CV nor
          moved focus) that opens the CV overlay and moves focus into it — see
          CvOverlay.tsx's focus effect and final-review I4. */}
      <button
        type="button"
        onClick={() => setCvOpen(true)}
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-[var(--gold)] focus:p-3"
      >
        Skip game, open full CV
      </button>

      <Hud
        areaName={currentArea?.name ?? 'FAJAR ISLAND'}
        sectionLabel={currentArea?.sectionLabel ?? 'L&D'}
        soundOn={soundOn}
        onToggleSound={() => setSoundOn((v) => !v)}
        onBackToMap={() => setCursor({ area: null, step: 0 })}
        onOpenCv={() => setCvOpen(true)}
        mapVisible={cursor.area === null}
        motionMode={motionMode}
        onToggleMotionMode={() => setMotionMode(useFallback ? 'game' : 'fallback')}
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

      <button
        type="button"
        onClick={() => setMotionMode('fallback')}
        className="sr-only focus:not-sr-only focus:fixed focus:bottom-16 focus:right-3 focus:z-50 focus:border-2 focus:border-[var(--ink)] focus:bg-[var(--cream)] focus:px-2 focus:py-1 focus:text-xs"
      >
        Switch to text-only version
      </button>
    </div>
  );
}
