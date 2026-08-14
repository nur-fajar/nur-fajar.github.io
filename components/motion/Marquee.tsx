/* ── Infinite marquee ──────────────────────────────────────────────────────
   A row of items that scrolls horizontally forever. Renders the item list
   twice back-to-back and animates the whole track left by exactly one
   copy's width (-50%) on an infinite linear loop, so the seam between the
   end of copy one and the start of copy two is invisible — plain CSS
   animation, no JS measuring. The duplicated copy is aria-hidden so screen
   readers see the role list once. Pauses under prefers-reduced-motion
   (handled in globals.css) and falls back to a horizontally scrollable row. */

import type { CSSProperties, ReactNode } from 'react';

export default function Marquee({
  items,
  className,
  duration = 26,
}: {
  items: ReactNode[];
  className?: string;
  duration?: number;
}) {
  return (
    <div className={className ? `marquee ${className}` : 'marquee'} style={{ '--marquee-duration': `${duration}s` } as CSSProperties}>
      <div className="marquee-track">
        <ul className="marquee-group">
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
        <ul className="marquee-group" aria-hidden="true">
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
