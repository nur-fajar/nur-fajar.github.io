'use client';

import { Fragment, useRef, useState } from 'react';
import { useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion';

type Kind = 'plain' | 'em' | 'mark';
type Token = { t: Kind; text: string };

const PARAGRAPHS: Token[][] = [
  [
    {
      t: 'plain',
      text: 'I run the full cycle of Learning & Development — end-to-end, from ',
    },
    { t: 'em', text: 'design' },
    { t: 'plain', text: ' to ' },
    { t: 'em', text: 'delivery' },
    { t: 'plain', text: ' to ' },
    { t: 'em', text: 'evaluation' },
    { t: 'plain', text: '.' },
  ],
  [
    { t: 'plain', text: 'I also love building things with AI — like the AI agent I embedded into my company’s CRM, which now does the work of ' },
    { t: 'mark', text: '1,000+ human-hours' },
    { t: 'plain', text: ', automatically.' },
  ],
];

/**
 * Pecah jadi kata dengan spasi di sekitarnya IKUT menempel pada katanya.
 * Kalau spasi dipecah jadi token sendiri, separuh langkah pengetikan hanya
 * memunculkan spasi — tak ada perubahan yang terlihat, dan ketikannya terasa
 * tersendat dua langkah per kata.
 */
function splitWords(text: string) {
  return text.match(/\s*\S+\s*/g) ?? [];
}

/**
 * Bangun model sekali saja: tiap kata dapat indeks global berurutan melintasi
 * kedua paragraf, jadi paragraf 2 secara otomatis baru mulai mengetik setelah
 * kata terakhir paragraf 1 keluar. Tiap segmen `mark` mencatat indeks kata
 * terakhirnya, dipakai untuk menunda sapuan stabilo sampai teksnya benar-benar
 * sudah ada.
 */
function buildModel() {
  let cursor = 0;
  const paragraphs = PARAGRAPHS.map((tokens) =>
    tokens.map((token) => {
      const words = splitWords(token.text).map((w) => ({ w, i: cursor++ }));
      return { kind: token.t, words, lastIndex: cursor - 1 };
    }),
  );
  return { paragraphs, total: cursor };
}

// Datanya statis, jadi modelnya dihitung sekali di level modul — tidak ada
// alasan membangun ulang array-nya tiap render.
const MODEL = buildModel();

// Jendela progress tempat pengetikan berlangsung. Ada jeda di awal dan akhir
// supaya kalimat terakhir sempat terbaca sebelum pin dilepas — dipersempit
// (bukan dihilangkan) supaya section ini tidak buka dengan layar nyaris
// kosong selama puluhan vh sebelum kata pertama muncul.
const TYPE_START = 0.05;
const TYPE_END = 0.88;

export default function StoryIntro() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const model = MODEL;
  const [count, setCount] = useState(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const t = (p - TYPE_START) / (TYPE_END - TYPE_START);
    const next = Math.max(0, Math.min(model.total, Math.round(t * model.total)));
    setCount((prev) => (prev === next ? prev : next));
  });

  const shown = reduce ? model.total : count;

  const body = (
    <div className="story-intro__body">
      <div className="story-intro__paper" aria-hidden="true" />

      {model.paragraphs.map((segments, pi) => (
        <p key={pi}>
          {segments.map((seg, si) => {
            const inner = seg.words.map(({ w, i }) => (
              <Fragment key={i}>
                <span className="story-word" data-on={i < shown}>
                  {w}
                </span>
                {/* Kursor ditempelkan tepat SESUDAH kata terakhir yang sudah
                    keluar. Kata yang belum keluar tetap menempati ruangnya
                    (opacity, bukan display) supaya baris tidak mengalir ulang —
                    jadi kursor tidak bisa sekadar ditaruh di akhir paragraf,
                    ia akan terdampar jauh di ujung kanan. */}
                {!reduce && i === shown - 1 && <span className="story-caret" aria-hidden="true" />}
              </Fragment>
            ));
            if (seg.kind === 'plain') return <Fragment key={si}>{inner}</Fragment>;
            return (
              <span key={si} className={seg.kind} data-on={shown > seg.lastIndex}>
                {inner}
              </span>
            );
          })}
        </p>
      ))}
    </div>
  );

  if (reduce) {
    return (
      <section className="story-section story-intro" aria-label="What I do">
        <div className="story-intro__inner">{body}</div>
      </section>
    );
  }

  return (
    <section ref={ref} className="story-intro-pin" aria-label="What I do">
      <div className="story-pin__sticky story-intro">
        <div className="story-intro__inner">{body}</div>
      </div>
    </section>
  );
}
