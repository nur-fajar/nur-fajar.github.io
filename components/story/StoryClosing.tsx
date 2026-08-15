'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CLOSING_WORDS, SOCIAL } from './data';
import { Diamond, PuzzleCluster } from './PuzzleGem';
import { DownloadIcon, LinkedInIcon, MailIcon } from './icons';

const line = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

/** Kata terakhir kalimat berganti-ganti: company → startup → business → … */
function WordRoller({ reduce }: { reduce: boolean | null }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((v) => (v + 1) % CLOSING_WORDS.length), 2100);
    return () => clearInterval(id);
  }, [reduce]);

  if (reduce) return <em className="story-roller__word">{CLOSING_WORDS[0]}</em>;

  return (
    <span className="story-roller">
      {/* Pengukur lebar: SEMUA kata ditumpuk di satu sel grid dalam keadaan
          tak terlihat, jadi lebarnya otomatis selebar kata terlebar yang
          benar-benar dirender. Menebak lewat jumlah huruf tidak cukup — dalam
          serif miring, "company" lebih lebar daripada "business". */}
      <span className="story-roller__ghost" aria-hidden="true">
        {CLOSING_WORDS.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </span>
      {/* Kliping ditaruh di lapisan dalam, BUKAN di .story-roller: inline-block
          dengan overflow ≠ visible memakai tepi bawahnya sebagai baseline, dan
          kata yang berputar jadi melorot di bawah baris kalimatnya. */}
      <span className="story-roller__clip">
        <AnimatePresence initial={false}>
          <motion.em
            key={CLOSING_WORDS[i]}
            className="story-roller__word"
            initial={{ y: '90%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: '-90%', opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          >
            {CLOSING_WORDS[i]}
          </motion.em>
        </AnimatePresence>
      </span>
    </span>
  );
}

/**
 * Closing — dipasang sebagai footer reveal: ia diam di belakang (fixed), dan
 * badan halaman yang menggulung naik untuk membukanya. Urutannya: puzzle →
 * kalimat pertama → garis → kalimat kedua dengan kata yang berputar → berlian
 * → ajakan kontak.
 */
export default function StoryClosing() {
  const reduce = useReducedMotion();

  return (
    <footer className="story-footer" aria-labelledby="story-closing-h">
      <motion.div
        className="story-footer__inner"
        initial={reduce ? false : 'hidden'}
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ staggerChildren: 0.16 }}
      >
        <PuzzleCluster reduce={reduce} />

        <motion.h2
          className="story-closing__line"
          id="story-closing-h"
          variants={line}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          See me as your last puzzle piece,
        </motion.h2>

        <motion.span
          className="story-closing__rule"
          aria-hidden="true"
          variants={{ hidden: { scaleX: 0, opacity: 0 }, show: { scaleX: 1, opacity: 1 } }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />

        <motion.p className="story-closing__line" variants={line} transition={{ duration: 0.8, ease: 'easeOut' }}>
          or the diamond that grows your <WordRoller reduce={reduce} />
        </motion.p>

        <Diamond reduce={reduce} />

        <motion.a
          className="story-closing__contact"
          href={`mailto:${SOCIAL.email}`}
          variants={line}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          Let&apos;s talk: {SOCIAL.email}
          {!reduce && (
            <span className="story-cursor" aria-hidden="true">
              <motion.svg
                width="20"
                height="20"
                viewBox="0 0 18 18"
                initial={{ opacity: 0, x: 34, y: 26, scale: 1 }}
                whileInView={{
                  opacity: [0, 1, 1, 1, 1],
                  x: [34, 0, 0, 0, 0],
                  y: [26, 0, 0, 0, 0],
                  scale: [1, 1, 0.76, 1, 1],
                }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{
                  duration: 3.8,
                  times: [0, 0.26, 0.38, 0.5, 1],
                  repeat: Infinity,
                  repeatDelay: 1.6,
                  ease: 'easeOut',
                }}
              >
                <path
                  d="M2 1.6 L2 13.2 L5.1 10.3 L7.2 15 L9.4 14 L7.3 9.4 L11.6 9.2 Z"
                  fill="#0F1420"
                  stroke="#E8A33D"
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                />
              </motion.svg>
              <motion.span
                className="story-cursor__ping"
                initial={{ opacity: 0, scale: 0.4 }}
                whileInView={{ opacity: [0, 0.9, 0], scale: [0.4, 2.8, 3.4] }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{
                  duration: 3.8,
                  times: [0.38, 0.54, 0.72],
                  repeat: Infinity,
                  repeatDelay: 1.6,
                  ease: 'easeOut',
                }}
              />
            </span>
          )}
        </motion.a>

        <motion.ul className="story-social" variants={line} transition={{ duration: 0.8, ease: 'easeOut' }}>
          <li>
            <a href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer">
              <LinkedInIcon size={19} />
              <span>LinkedIn</span>
            </a>
          </li>
          <li>
            <a href={`mailto:${SOCIAL.email}`}>
              <MailIcon size={19} />
              <span>Email</span>
            </a>
          </li>
          <li>
            <a href={SOCIAL.resume} target="_blank" rel="noopener noreferrer">
              <DownloadIcon size={19} />
              <span>Resume</span>
            </a>
          </li>
        </motion.ul>

        <motion.p className="story-closing__thanks" variants={line} transition={{ duration: 0.8, ease: 'easeOut' }}>
          Thank you for visiting my site.
        </motion.p>
      </motion.div>
    </footer>
  );
}
