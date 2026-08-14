'use client';

/* ── THE PATH ────────────────────────────────────────────────────────────
   Motion signature: bagian paling "ramai" di halaman — tiga tekstur berbeda
   yang naik-turun kepadatannya:

     1. Kalimat pembuka  → reveal per kata, jadi anchor text yang tenang
     2. Chip per entitas → masuk staggered bergantian kiri/kanan, DAN tiap
        baris chip digeser horizontal dengan kecepatan berbeda mengikuti
        scrollYProgress (ide "Scroll Text Lines" dari Motion.dev). Parallax
        horizontalnya cuma aktif di layar besar — di mobile chip-nya diam,
        cukup stagger masuknya saja.
     3. Kalimat penutup  → balik ke narasi utuh, spacing lebih lega
     4. Transisi         → large type, clip-path reveal yang terikat langsung
        ke posisi scroll (bukan tween sekali jalan), berdiri sendiri di
        tengah viewport sebelum lanjut ke Skills */

import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import {
  PATH_CHIPS,
  PATH_CHIPS_LEAD,
  PATH_CHIPS_TAIL,
  PATH_CLOSING,
  PATH_CLOSING_CHIPS,
  PATH_OPENING,
  PATH_OPENING_LOGOS,
  PATH_TRANSITION,
  type PathChip,
} from '@/content/v2Path';
import { Line, Words } from './SplitText';
import LogoMark from './LogoMark';
import useMediaQuery from './useMediaQuery';

const EASE = [0.16, 1, 0.3, 1] as const;

function Chip({ chip, index }: { chip: PathChip; index: number }) {
  // Ganjil masuk dari kanan, genap dari kiri.
  const from = index % 2 === 0 ? -48 : 48;
  return (
    <motion.div
      className="v2-chip motion-safe"
      initial={{ opacity: 0, x: from, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: EASE }}
    >
      {chip.logo ? <LogoMark logo={chip.logo} height={20} /> : null}
      <span className="v2-chip-text">
        <span className="v2-chip-name">{chip.name}</span>
        <span className="mono v2-chip-stat">{chip.stat}</span>
      </span>
    </motion.div>
  );
}

export default function ThePath() {
  const wide = useMediaQuery('(min-width: 900px)');
  const chipsRef = useRef<HTMLDivElement>(null);
  const transitionRef = useRef<HTMLDivElement>(null);

  // Parallax horizontal per baris chip — dua kecepatan berbeda, arah
  // berlawanan, kecil saja (max ~40px) supaya memperkuat bacaan, bukan
  // bikin teks susah dikejar mata.
  const { scrollYProgress: chipsProgress } = useScroll({
    target: chipsRef,
    offset: ['start end', 'end start'],
  });
  const rowA = useTransform(chipsProgress, [0, 1], wide ? [40, -40] : [0, 0]);
  const rowB = useTransform(chipsProgress, [0, 1], wide ? [-28, 28] : [0, 0]);

  // Clip-path reveal kalimat transisi, terikat langsung ke scroll: teks
  // tersingkap dari kiri ke kanan seiring section ini naik ke tengah layar.
  const { scrollYProgress: transitionProgress } = useScroll({
    target: transitionRef,
    offset: ['start 0.85', 'center 0.55'],
  });
  const clipRight = useTransform(transitionProgress, [0, 1], [100, 0]);
  const clipPath = useMotionTemplate`inset(0 ${clipRight}% 0 0)`;

  return (
    <section className="v2-section v2-path">
      <p className="v2-lede">
        <Words text={PATH_OPENING} />
      </p>

      <motion.div
        className="v2-logo-row motion-safe"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
      >
        {PATH_OPENING_LOGOS.map((logo) => (
          <LogoMark key={logo.src + logo.alt} logo={logo} height={24} />
        ))}
      </motion.div>

      <div className="v2-chips-block" ref={chipsRef}>
        <Line className="v2-body v2-chips-lead">{PATH_CHIPS_LEAD}</Line>
        <ul className="v2-chips">
          {PATH_CHIPS.map((chip, i) => (
            <motion.li key={chip.name} style={{ x: i % 2 === 0 ? rowA : rowB }} className="v2-chip-track">
              <Chip chip={chip} index={i} />
            </motion.li>
          ))}
        </ul>
        <Line index={1} className="v2-note">
          {PATH_CHIPS_TAIL}
        </Line>
      </div>

      <div className="v2-path-closing">
        <Line className="v2-body">{PATH_CLOSING}</Line>
        <motion.ul
          className="v2-chips v2-chips--inline motion-safe"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
        >
          {PATH_CLOSING_CHIPS.map((chip) => (
            <li className="v2-chip v2-chip--sm" key={chip.name}>
              {chip.logo ? <LogoMark logo={chip.logo} height={18} /> : null}
              <span className="v2-chip-text">
                <span className="v2-chip-name">{chip.name}</span>
                <span className="mono v2-chip-stat">{chip.stat}</span>
              </span>
            </li>
          ))}
        </motion.ul>
      </div>

      <div className="v2-transition" ref={transitionRef}>
        {/* Teks asli tetap ada di DOM (di bawah, opacity rendah) supaya
            terbaca walau JS/scroll-linked-nya tidak jalan; lapisan ber-clip
            di atasnya yang membawa animasinya. */}
        <p className="v2-transition-ghost" aria-hidden="true">
          {PATH_TRANSITION}
        </p>
        <motion.p className="v2-transition-text motion-safe" style={{ clipPath }}>
          {PATH_TRANSITION}
        </motion.p>
      </div>
    </section>
  );
}
