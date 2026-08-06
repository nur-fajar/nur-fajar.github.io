'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { getRelatedProjects } from '@/lib/relatedProjects';

/* ── Skill popup ───────────────────────────────────────────────────────────
   Every tag in the skill grid is a button (see Skills.tsx); this is what
   opens on click. Portalled to document.body so it always sits above the
   page regardless of any transformed ancestor (Reveal's Framer Motion
   wrappers create their own containing blocks once animated), and closes on
   Escape, backdrop click, or the close button — never navigates or scrolls
   the page on its own, only the (optional) link inside does that, on a
   deliberate click. */

export default function SkillPopup({ tag, onClose }: { tag: string; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const related = getRelatedProjects(tag);

  useEffect(() => {
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div className="skill-popup-backdrop" onMouseDown={onClose}>
      <div
        className="panel skill-popup"
        role="dialog"
        aria-modal="true"
        aria-labelledby="skill-popup-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button type="button" className="skill-popup-close" ref={closeRef} onClick={onClose} aria-label="Close">
          ✕
        </button>
        <p className="mono skill-popup-eyebrow">RELATED PROJECT</p>
        <h3 id="skill-popup-title">{tag}</h3>

        {related.length > 0 ? (
          <ul className="skill-popup-list">
            {related.map((r) => (
              <li key={r.title}>
                <p className="skill-popup-item-title">{r.title}</p>
                <p className="skill-popup-item-blurb">{r.blurb}</p>
                {r.external ? (
                  <a className="mono skill-popup-link" href={r.href} target="_blank" rel="noopener">
                    Open ↗
                  </a>
                ) : (
                  <a className="mono skill-popup-link" href={r.href} onClick={onClose}>
                    View section ↓
                  </a>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="skill-popup-empty">No linked project documented on this site yet.</p>
        )}
      </div>
    </div>,
    document.body
  );
}
