'use client';

/* Controlled accordion, not native <details> — Framer Motion animates the
   expand/collapse height (spring-like ease, not the instant snap a native
   <details> gives you for free), which is most of what makes this list feel
   alive instead of a plain document outline. Multiple rows can be open at
   once, same as the old <details> markup (several entries ship `open: true`
   by default — see content/signals.ts). */

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Signal } from '@/content/signals';
import Reveal from './motion/Reveal';

/** Renders `__word__` as bold — the only markup the signal bullets need
    (used to bold the "Output:" prefix on organizational-experience lines). */
function renderBullet(text: string) {
  const parts = text.split(/__([^_]+)__/g);
  return parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part));
}

export default function SignalList({ items }: { items: Signal[] }) {
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set(items.filter((s) => s.open).map((s) => s.id)));

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <Reveal as="div" className="signal-list panel">
      {items.map((s) => {
        const isOpen = openIds.has(s.id);
        return (
          <div className={`signal${isOpen ? ' is-open' : ''}`} key={s.id}>
            <button type="button" className="signal-summary" aria-expanded={isOpen} onClick={() => toggle(s.id)}>
              <span className="sig-id mono">{s.id}</span>
              <span className="sig-main">
                {s.category && <span className="sig-category mono">{s.category}</span>}
                <span className="sig-name">{s.name}</span>
                <span className="sig-sub">{s.sub}</span>
              </span>
              {s.fill > 0 && (
                <span className="sig-bars" data-fill={s.fill} aria-label={`signal strength ${s.fill} of 5`}>
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
              )}
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  className="motion-safe"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.2 } }}
                  style={{ overflow: 'hidden' }}
                >
                  <ul className="sig-detail">
                    {s.bullets.map((b, i) => (
                      <li key={i}>{renderBullet(b)}</li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </Reveal>
  );
}
