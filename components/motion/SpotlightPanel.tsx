'use client';

/* ── Spotlight panel ──────────────────────────────────────────────────────
   The cursor-tracked radial-highlight card you get from every 21st.dev/
   Aceternity "card spotlight" — recreated here in plain CSS custom
   properties instead of pulling in a registry component, so it stays on
   this file's own token system (it reads --group-accent when nested in a
   skill-group, and falls back to the page's default warmth accent
   everywhere else — see .spotlight-glow in globals.css).

   Deliberately cheap: one mousemove listener writes two CSS custom
   properties, no React state, no re-render, no rAF needed for something
   this small. Pointer-only — touch devices never fire mousemove, so the
   glow simply never appears there, no extra guard required. */

import { useRef, type HTMLAttributes, type ReactNode } from 'react';

export default function SpotlightPanel({
  children,
  className,
  ...rest
}: { children: ReactNode; className?: string } & HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
  }

  return (
    <div ref={ref} className={`spotlight-panel ${className ?? ''}`} onMouseMove={onMouseMove} {...rest}>
      <div className="spotlight-glow" aria-hidden="true" />
      {children}
    </div>
  );
}
