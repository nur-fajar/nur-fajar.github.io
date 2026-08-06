'use client';

import { useEffect, useState } from 'react';
import { getMode, setMode, type Mode } from '@/lib/theme';

export default function ThemeToggle() {
  // Render the SSR-safe default ('light', matching <html data-mode="light">)
  // on first client render so hydration matches the prerendered markup
  // exactly, then correct from the live DOM one commit later. theme-init.js
  // has already applied the real mode before paint, so the page itself never
  // flashes — only this toggle's pressed-state could lag by a frame.
  const [mode, setModeState] = useState<Mode>('light');

  useEffect(() => {
    // Deliberate one-time sync from the DOM (an external system theme-init.js
    // already mutated before this component mounted), not derived state —
    // the lint rule's cascading-render concern doesn't apply to a value that
    // can only be read after mount in the first place.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setModeState(getMode());
    const onChange = (e: Event) => setModeState((e as CustomEvent<Mode>).detail);
    window.addEventListener('nf:mode-change', onChange);
    return () => window.removeEventListener('nf:mode-change', onChange);
  }, []);

  return (
    <div className="mode-toggle mono" role="group" aria-label="Color mode">
      <button type="button" data-set-mode="dark" aria-pressed={mode === 'dark'} onClick={() => setMode('dark')}>
        DARK
      </button>
      <button type="button" data-set-mode="light" aria-pressed={mode === 'light'} onClick={() => setMode('light')}>
        LIGHT
      </button>
    </div>
  );
}
