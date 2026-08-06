'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { getDetailKindForTag, getRelatedProjects, type DetailKind } from '@/lib/relatedProjects';
import CurriculumDetail from './skill-details/CurriculumDetail';
import InstructionalDesignDetail from './skill-details/InstructionalDesignDetail';
import LabPipelineDetail from './skill-details/LabPipelineDetail';

/* ── Skill popup ───────────────────────────────────────────────────────────
   Every tag in the skill grid is a button (see Skills.tsx); this is what
   opens on click. Portalled to document.body so it always sits above the
   page regardless of any transformed ancestor (Reveal's Framer Motion
   wrappers create their own containing blocks once animated), and closes on
   Escape, backdrop click, or the close button — never navigates or scrolls
   the page on its own; only a deliberate click on a link inside it does
   that.

   Three tags — Curriculum development, Instructional design, AI agents —
   render a full detail view (the content that used to be its own page
   section/route) directly. Everything else shows a short related-project
   list; an item sourced from one of those three areas opens the matching
   detail view instead of a dead link, since there's nowhere else for it to
   point anymore. */

const DETAIL_TITLE: Record<DetailKind, string> = {
  curriculum: 'Programs / Curriculum Designed',
  design: 'Instructional Design / Case Study',
  lab: 'Lab / Pipeline Teardown',
};

const DETAIL_COMPONENT: Record<DetailKind, React.ComponentType> = {
  curriculum: CurriculumDetail,
  design: InstructionalDesignDetail,
  lab: LabPipelineDetail,
};

export default function SkillPopup({ tag, onClose }: { tag: string; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const initialDetail = getDetailKindForTag(tag);
  const [detailKind, setDetailKind] = useState<DetailKind | null>(initialDetail);
  const related = initialDetail ? [] : getRelatedProjects(tag);

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

  const showingDetail = detailKind !== null;
  const DetailComponent = detailKind ? DETAIL_COMPONENT[detailKind] : null;
  const title = detailKind ? DETAIL_TITLE[detailKind] : tag;

  return createPortal(
    <div className="skill-popup-backdrop" onMouseDown={onClose}>
      <div
        className={`panel skill-popup${showingDetail ? ' skill-popup--wide' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="skill-popup-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button type="button" className="skill-popup-close" ref={closeRef} onClick={onClose} aria-label="Close">
          ✕
        </button>

        {!initialDetail && showingDetail && (
          <button type="button" className="skill-popup-back mono" onClick={() => setDetailKind(null)}>
            ← Back
          </button>
        )}

        <p className="mono skill-popup-eyebrow">RELATED PROJECT</p>
        <h3 id="skill-popup-title">{title}</h3>

        {DetailComponent ? (
          <DetailComponent />
        ) : related.length > 0 ? (
          <ul className="skill-popup-list">
            {related.map((r) => {
              const itemDetail = r.detail;
              return (
                <li key={r.title}>
                  <p className="skill-popup-item-title">{r.title}</p>
                  <p className="skill-popup-item-blurb">{r.blurb}</p>
                  {itemDetail ? (
                    <button type="button" className="mono skill-popup-link skill-popup-link-btn" onClick={() => setDetailKind(itemDetail)}>
                      View full breakdown →
                    </button>
                  ) : r.href ? (
                    <a className="mono skill-popup-link" href={r.href} onClick={onClose}>
                      View section ↓
                    </a>
                  ) : null}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="skill-popup-empty">No linked project documented on this site yet.</p>
        )}
      </div>
    </div>,
    document.body
  );
}
