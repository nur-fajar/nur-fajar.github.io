'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CONTACT } from '@/content/ledger';
import {
  V6_HATS,
  V6_STAGE_HINT,
  type HatId,
  type V6StageMode,
} from '@/content/v6-hats';
import AudioController, { playSfx, setSfxMuted } from './AudioController';
import ContentPanel from './ContentPanel';
import HatSelector from './HatSelector';
import PixelCharacter, { HatGlyph } from './PixelCharacter';

/**
 * HatStage: orkestrator scene. State = daftar topi terpakai (urut waktu).
 * - Ketiga topi terpakai → mode 'unicorn' (secret easter egg).
 * - Equip: topi pixel terbang dari chip ke kepala sprite (CSS transition,
 *   diukur dari posisi asli, di-skip saat prefers-reduced-motion), lalu
 *   outfit berganti + sfx.
 * - Remove: topi langsung lepas + sfx turun.
 *
 * Tanpa JS: <noscript> menampilkan daftar topi sebagai tautan biasa.
 */
export default function HatStage() {
  const [worn, setWorn] = useState<HatId[]>([]);
  const [flight, setFlight] = useState<{ hat: HatId; sx: number; sy: number; dx: number; dy: number; id: number } | null>(null);
  const [muted, setMuted] = useState(false);
  const reduceMotion = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const spriteRef = useRef<HTMLDivElement>(null);
  const flightTimer = useRef<number | null>(null);

  const mode: V6StageMode =
    worn.length === V6_HATS.length ? 'unicorn' : worn.length > 0 ? worn[worn.length - 1] : 'neutral';
  const activeHat = mode === 'unicorn' ? null : V6_HATS.find((hat) => hat.id === mode) ?? null;

  useEffect(() => {
    reduceMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return () => {
      if (flightTimer.current !== null) window.clearTimeout(flightTimer.current);
    };
  }, []);

  useEffect(() => setSfxMuted(muted), [muted]);

  const land = useCallback((hat: HatId) => {
    setFlight(null);
    setWorn((prev) => (prev.includes(hat) ? prev : [...prev, hat]));
    playSfx('equip');
  }, []);

  const equip = useCallback(
    (hat: HatId) => {
      if (worn.includes(hat)) return;
      // Unicorn: topi ketiga masuk tanpa penerbangan — langsung transformasi.
      if (worn.length === V6_HATS.length - 1) {
        setWorn([...worn, hat]);
        playSfx('unicorn');
        return;
      }
      const chip = stageRef.current?.querySelector<HTMLButtonElement>(`[data-hat="${hat}"]`);
      const sprite = spriteRef.current;
      if (!chip || !sprite || reduceMotion.current) {
        land(hat);
        return;
      }
      const stageRect = stageRef.current!.getBoundingClientRect();
      const chipRect = chip.getBoundingClientRect();
      const spriteRect = sprite.getBoundingClientRect();
      /* Target mendarat: puncak kepala, dikurangi setengah lebar flyer. */
      setFlight({
        hat,
        sx: chipRect.left - stageRect.left,
        sy: chipRect.top - stageRect.top,
        dx: spriteRect.left + spriteRect.width / 2 - chipRect.left - 28,
        dy: spriteRect.top - chipRect.top,
        id: Date.now(),
      });
    },
    [worn, land],
  );

  /* Penerbangan selesai → topi mendarat. */
  useEffect(() => {
    if (!flight) return undefined;
    flightTimer.current = window.setTimeout(() => land(flight.hat), 620);
    return () => {
      if (flightTimer.current !== null) window.clearTimeout(flightTimer.current);
    };
  }, [flight, land]);

  function remove(hat: HatId) {
    if (!worn.includes(hat)) return;
    setWorn((prev) => prev.filter((item) => item !== hat));
    playSfx('remove');
  }

  function toggleMute() {
    setMuted((prev) => !prev);
  }

  return (
    <div ref={stageRef} className={`v6-stage${mode === 'unicorn' ? ' v6-stage--unicorn' : ''}`}>
      <div className="v6-stage__toolbar">
        <p className="v6-stage__hint">{V6_STAGE_HINT}</p>
        <AudioController muted={muted} onToggle={toggleMute} />
      </div>

      <div className="v6-stage__scene">
        <div ref={spriteRef} className="v6-sprite-wrap" style={{ ['--accent' as string]: activeHat?.accent ?? '#5a6988' }}>
          {mode === 'unicorn' ? (
            <span className="v6-sparkles" aria-hidden="true">
              <i /> <i /> <i /> <i /> <i />
            </span>
          ) : null}
          <div key={mode} className="v6-sprite-hit">
            <PixelCharacter mode={mode} className="v6-sprite" />
          </div>
          <div className="v6-shadow" aria-hidden="true" />
        </div>

        {activeHat ? (
          <aside className="v6-bubble" aria-live="polite">
            <p className="v6-bubble__greeting">{activeHat.greeting}</p>
            <p className="v6-bubble__detail">{activeHat.detail}</p>
          </aside>
        ) : null}

        {flight ? (
          <span className="v6-flyer" style={{ left: flight.sx, top: flight.sy, ['--dx' as string]: `${flight.dx}px`, ['--dy' as string]: `${flight.dy}px` }} key={flight.id} aria-hidden="true">
            <HatGlyph hat={flight.hat} className="v6-flyer__glyph" />
          </span>
        ) : null}
      </div>

      <HatSelector
        worn={worn}
        onEquip={equip}
        onRemove={remove}
      />

      <ContentPanel mode={mode} />

      <noscript>
        <ul className="v6-stage__list">
          {V6_HATS.map((hat) => (
            <li key={hat.id}>
              <strong>
                {hat.glyph} {hat.name}
              </strong>{' '}
              — {hat.title}.{' '}
              <a href={hat.links[0]?.href ?? `mailto:${CONTACT.email}`}>{hat.links[0]?.label ?? 'Say hi'}</a>
            </li>
          ))}
        </ul>
      </noscript>
    </div>
  );
}
