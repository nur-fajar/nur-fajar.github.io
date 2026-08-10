/* ── Section wrapper ───────────────────────────────────────────────────────
   Plain passthrough — no scroll-triggered animation. The prior build faded
   every section in on scroll; the design brief calls that out by name as an
   AI-slop tell and asks for it gone everywhere except the hero's one-time
   mount entrance (Hero.tsx handles that itself) and the skill-modal open/
   close (SkillPopup.tsx). This keeps the same `as`/`index`/`className` API
   so call sites didn't need to change, but index is now unused — kept only
   so existing call sites don't need edits. */

import type { ReactNode } from 'react';

const TAGS = {
  div: 'div',
  article: 'article',
  li: 'li',
  details: 'details',
  figure: 'figure',
} as const;

export default function Reveal({
  children,
  as = 'div',
  className,
}: {
  children: ReactNode;
  index?: number;
  as?: keyof typeof TAGS;
  className?: string;
}) {
  const Tag = TAGS[as];
  return <Tag className={className}>{children}</Tag>;
}
