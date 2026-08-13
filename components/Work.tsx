'use client';

/* ── Featured Work — expanding bento grid ─────────────────────────────────
   Was a stacked list (visual left, copy right, repeated per item). Now a
   bento grid: the pipeline gets the big 2x2 tile, the four programs fill
   in around it as 1x1 tiles. Click/tap/Enter any tile and it pops open
   into a full detail panel — portaled to <body> so it isn't clipped or
   repositioned by any transformed ancestor (Reveal's scroll-in animation
   leaves a lingering `transform` on its wrapper, which would otherwise
   turn `position: fixed` into "fixed to that wrapper" instead of the
   viewport). Esc, backdrop click, or the close button dismisses it. */

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { PIPELINE_MAP } from '@/content/pipeline';
import { PROGRAMS } from '@/content/programs';
import { CloseIcon, ExpandIcon, ExternalLinkIcon } from './icons';
import Reveal from './motion/Reveal';

type FeaturedItem = {
  key: string;
  overline: string;
  title: string;
  paragraphs: string[];
  tags: string[];
  href?: string;
  nodes: { phase: string; name: string; gate?: boolean }[];
};

// "Featured Work, all of it" — the automation pipeline plus every program
// designed (content/programs.ts), each rendered the same way instead of
// splitting a couple out into a smaller "other projects" grid.
const items: FeaturedItem[] = [
  {
    key: 'pipeline',
    overline: 'Featured Project',
    title: 'B2B Outreach Automation Pipeline',
    paragraphs: [
      'A 9-agent Python pipeline built solo at Terra Weather: enriches CRM contacts, pulls company news, drafts personalized cold email plus a 3-step follow-up cadence, then classifies and drafts replies — all on GPT-4o-mini, escalating to GPT-4o only for reply classification, where misreading an opt-out is a compliance problem rather than a wasted call.',
      'Outbound send is the one step that never runs unattended — dispatch waits for a human-approved review window every evening. Everything else runs on its own.',
      '~3,000 leads processed · 600 qualified prospects surfaced · per-prospect prep time cut 83%.',
    ],
    tags: ['Python', 'GPT-4o-mini', 'GPT-4o', 'CRM Automation', 'Human-in-the-loop'],
    nodes: PIPELINE_MAP,
  },
  ...PROGRAMS.map((p): FeaturedItem => {
    const [, level, duration] = p.id.split(' · ');
    return {
      key: p.id,
      overline: 'Featured Program',
      title: p.title,
      paragraphs: [p.summary],
      tags: [level, duration, p.audience].filter(Boolean),
      href: p.href,
      nodes: p.units.map((u, i) => ({ phase: `Step ${i + 1}`, name: u.title })),
    };
  }),
];

const TAG_PREVIEW_COUNT = 3;
const NODE_PREVIEW_COUNT = 5;

export default function Work() {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const expandedItem = items.find((item) => item.key === expandedKey) ?? null;

  const collapse = useCallback(() => {
    setExpandedKey(null);
    triggerRef.current?.focus();
  }, []);

  const expand = (key: string, el: HTMLElement) => {
    triggerRef.current = el;
    setExpandedKey(key);
  };

  useEffect(() => {
    if (!expandedItem) return;
    closeButtonRef.current?.focus();
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') collapse();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [expandedItem, collapse]);

  return (
    <section id="work">
      <Reveal as="div">
        <h2 className="numbered-heading">
          <span className="num mono">05.</span> Featured Work
        </h2>
      </Reveal>

      <ul className="bento-grid">
        {items.map((item, i) => {
          const isLarge = i === 0;
          return (
            <Reveal as="li" key={item.key} index={i} className={`bento-cell${isLarge ? ' is-lg' : ''}`}>
              <article
                className={`bento-card${isLarge ? ' is-lg' : ''}`}
                role="button"
                aria-haspopup="dialog"
                aria-labelledby={`bento-title-${item.key}`}
                tabIndex={0}
                onClick={(e) => expand(item.key, e.currentTarget)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    expand(item.key, e.currentTarget);
                  }
                }}
              >
                <span className="bento-expand-hint" aria-hidden="true">
                  <ExpandIcon />
                </span>

                <p className="bento-overline mono">{item.overline}</p>
                <h3 className="bento-title" id={`bento-title-${item.key}`}>
                  {item.title}
                </h3>

                <div className="bento-desc">
                  <p className="is-clamped">{item.paragraphs[0]}</p>
                </div>

                <ul className="bento-tags mono">
                  {item.tags.slice(0, TAG_PREVIEW_COUNT).map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                  {item.tags.length > TAG_PREVIEW_COUNT && (
                    <li className="bento-tags-more">+{item.tags.length - TAG_PREVIEW_COUNT}</li>
                  )}
                </ul>

                {isLarge && (
                  <div className="node-diagram is-mini">
                    {item.nodes.slice(0, NODE_PREVIEW_COUNT).map((n) => (
                      <div key={n.phase + n.name} className={`p-node${n.gate ? ' is-gate' : ''}`}>
                        <span className="p-phase mono">{n.phase}</span>
                        <span className="p-name">{n.name}</span>
                      </div>
                    ))}
                    {item.nodes.length > NODE_PREVIEW_COUNT && (
                      <div className="p-node p-node-more">
                        <span className="p-name">+{item.nodes.length - NODE_PREVIEW_COUNT} more</span>
                      </div>
                    )}
                  </div>
                )}
              </article>
            </Reveal>
          );
        })}
      </ul>

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {expandedItem && (
              <motion.div
                className="bento-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={collapse}
              >
                <motion.div
                  className="bento-modal"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby={`bento-title-${expandedItem.key}`}
                  initial={{ opacity: 0, scale: 0.94, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 10 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button type="button" className="bento-close" aria-label="Close" ref={closeButtonRef} onClick={collapse}>
                    <CloseIcon />
                  </button>

                  <p className="bento-overline mono">{expandedItem.overline}</p>
                  <h3 className="bento-title" id={`bento-title-${expandedItem.key}`}>
                    {expandedItem.title}
                  </h3>

                  <div className="bento-desc">
                    {expandedItem.paragraphs.map((p, pi) => (
                      <p key={pi}>{p}</p>
                    ))}
                  </div>

                  <ul className="bento-tags mono">
                    {expandedItem.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>

                  {expandedItem.href && (
                    <div className="bento-links">
                      <a href={expandedItem.href} aria-label={`Open ${expandedItem.title}`} target="_blank" rel="noreferrer">
                        <ExternalLinkIcon />
                      </a>
                    </div>
                  )}

                  <div className="node-diagram">
                    {expandedItem.nodes.map((n) => (
                      <div key={n.phase + n.name} className={`p-node${n.gate ? ' is-gate' : ''}`}>
                        <span className="p-phase mono">{n.phase}</span>
                        <span className="p-name">{n.name}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </section>
  );
}
