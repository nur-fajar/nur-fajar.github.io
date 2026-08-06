'use client';

/* ── Hero flip card: 5-page carousel ──────────────────────────────────────
   One flip button cycles forward through photo → zodiac globe → sudoku →
   chess → book quotes → photo. Every page stays mounted once it has been
   shown once (Globe always, since it self-animates in the background the
   same way the original vanilla build did; Sudoku/Chess only from their
   first activation, so a visitor who never flips to them never pays for
   puzzle generation or the chess engine).

   The flip itself is Framer Motion driving `rotateY` on each page: the
   incoming page is always given the `+100deg → 0` arc and the page that was
   just active gets `0 → -100deg`, everything else parks at `+100deg,
   opacity 0` — same two-stage motion the hand-rolled version built with
   manual class toggling and a forced reflow, minus the reflow hack. */

import { useState, type ReactNode } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import Globe from './Globe';
import SudokuWidget from './SudokuWidget';
import ChessWidget from './ChessWidget';
import { BOOK_QUOTES, FLIP_TOOLTIPS } from '@/content/quotes';

const PAGE_COUNT = 5;

function pickQuoteIndex(exclude: number) {
  if (BOOK_QUOTES.length <= 1) return 0;
  let i: number;
  do {
    i = Math.floor(Math.random() * BOOK_QUOTES.length);
  } while (i === exclude);
  return i;
}

function pose(idx: number, current: number, previous: number | null) {
  if (idx === current) return { rotateY: 0, opacity: 1 };
  if (idx === previous) return { rotateY: -100, opacity: 0 };
  return { rotateY: 100, opacity: 0 };
}

// Declared outside FlipCard (not as a nested function) so it's a stable
// component identity across renders — an inline component recreated every
// render loses its DOM/motion state every time, and repeatedly interrupts
// the very transition it's supposed to be running.
function Page({
  idx,
  current,
  previous,
  reducedMotion,
  children,
}: {
  idx: number;
  current: number;
  previous: number | null;
  reducedMotion: boolean | null;
  children: ReactNode;
}) {
  const active = idx === current;
  return (
    <motion.div
      className="flip-page"
      style={{ zIndex: active ? 2 : 1, pointerEvents: active ? 'auto' : 'none' }}
      animate={pose(idx, current, previous)}
      initial={false}
      transition={{ duration: reducedMotion ? 0 : 0.34, ease: 'easeInOut' }}
      inert={active ? undefined : true}
    >
      {children}
    </motion.div>
  );
}

export default function FlipCard() {
  const [current, setCurrent] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [activated, setActivated] = useState([true, true, false, false, false]);
  // Fixed index 0 on first render so server and client markup match exactly
  // (Math.random() would pick differently on each) — goNext() re-randomizes
  // it the moment the quote page actually activates, same as the original.
  const [quoteIndex, setQuoteIndex] = useState(0);
  const reducedMotion = useReducedMotion();

  function goNext() {
    const next = (current + 1) % PAGE_COUNT;
    setPrevious(current);
    setCurrent(next);
    setActivated((prev) => (prev[next] ? prev : prev.map((v, i) => v || i === next)));
    if (next === 4) setQuoteIndex((i) => pickQuoteIndex(i));
  }

  const quote = BOOK_QUOTES[quoteIndex];

  return (
    <div className="globe-box" id="flip-card">
      {/* Scoped scan beam — the one HUD sweep left on the page, confined to
          this card (see .card-scan-beam in globals.css). It used to sweep
          the whole viewport; now it's local to the box that actually has
          something worth scanning (photo / globe / sudoku / chess / quote). */}
      <div className="card-scan-beam" aria-hidden="true" />
      <div className="flip-controls">
        <span className="flip-count mono" aria-hidden="true">
          {current + 1}/{PAGE_COUNT}
        </span>
        <button type="button" className="flip-btn" aria-label="Flip to the next card" title="Flip to the next card" onClick={goNext}>
          ⇄
        </button>
      </div>
      <div className="flip-pages">
        <Page idx={0} current={current} previous={previous} reducedMotion={reducedMotion}>
          <Image className="flip-photo" src="/foto-profile-nf.jpg" alt="Portrait of Nur Fajar" fill sizes="340px" priority />
        </Page>

        <Page idx={1} current={current} previous={previous} reducedMotion={reducedMotion}>
          <Globe />
        </Page>

        <Page idx={2} current={current} previous={previous} reducedMotion={reducedMotion}>
          {activated[2] && <SudokuWidget />}
        </Page>

        <Page idx={3} current={current} previous={previous} reducedMotion={reducedMotion}>
          {activated[3] && <ChessWidget />}
        </Page>

        <Page idx={4} current={current} previous={previous} reducedMotion={reducedMotion}>
          <div className="quote-page">
            <p className="quote-page-text mono">{quote.text}</p>
            <p className="quote-page-meta mono">
              {quote.author} — {quote.book}
            </p>
            <button type="button" className="quote-more mono" onClick={() => setQuoteIndex((i) => pickQuoteIndex(i))}>
              More
            </button>
          </div>
        </Page>
      </div>
      <p className="flip-tooltip mono" role="tooltip">
        {FLIP_TOOLTIPS[current]}
      </p>
    </div>
  );
}
