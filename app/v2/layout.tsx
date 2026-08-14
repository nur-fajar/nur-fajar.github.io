import type { Metadata } from 'next';
import './v2.css';

// Deliberately its own layout, not a re-export of the root one: it imports
// v2.css instead of touching app/globals.css, so nothing in here can bleed
// into the live "/" page. It still nests under the root layout (fonts +
// MotionConfig reducedMotion="user" from app/layout.tsx keep applying here
// for free — no need to redeclare either).
export const metadata: Metadata = {
  title: 'v2 — Kinetic Portfolio',
  description:
    'Nur Fajar — a single-scroll, kinetic-typography take on the portfolio. Learning & Development, end to end, and the AI automation underneath it.',
  robots: { index: false, follow: false },
};

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return <div className="v2-root">{children}</div>;
}
