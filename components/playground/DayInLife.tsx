'use client';

/* Easter egg: a scroll-parallax "day in the life", the same trick
   rleonardi.com/interactive-resume runs (background layers moving at
   different scroll-linked speeds), minus the custom illustration budget —
   emoji stand in for hand-drawn art. Every scene fact below is pulled from
   content/signals.ts (WORK_EXPERIENCE), not invented for the bit.

   Mechanism: one tall .track div sized to SCENE_COUNT screens. useScroll
   against it yields scrollYProgress 0→1 for the whole track. A sticky
   .pinned layer stays glued to the viewport for that entire scroll distance
   and repaints itself purely from scrollYProgress (sky colour crossfade,
   sun→moon arc, drifting clouds). Foreground .scene cards advance in normal
   document flow underneath it, each fading in/out over its own slice of
   the same progress value — so backdrop and text stay in lockstep without
   any manual scroll-position math per element. */

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import styles from './DayInLife.module.css';

interface Scene {
  time: string;
  emoji: string;
  title: string;
  body: string;
  sky: string;
}

const SCENES: Scene[] = [
  {
    time: '06:30',
    emoji: '☕',
    title: 'Brew the coffee',
    sky: 'linear-gradient(180deg,#ffd9a0 0%,#ff9a76 45%,#fef3e0 100%)',
    body: "I'm Nur Fajar — a Learning & Development specialist who also happens to write the automation underneath it.",
  },
  {
    time: '09:00',
    emoji: '📋',
    title: 'Design the curriculum',
    sky: 'linear-gradient(180deg,#8ec9f0 0%,#c7e8ff 55%,#eaf7ff 100%)',
    body: '4 GenAI training modules across business, education, and product tracks — built on ADDIE and backward design.',
  },
  {
    time: '13:00',
    emoji: '🎤',
    title: 'Run the live session',
    sky: 'linear-gradient(180deg,#5fb3ec 0%,#a9dcf7 55%,#eef9ff 100%)',
    body: '5 learning programs, 200+ participants across webinars and workshops — plus Train the Trainers for 6 university lecturers.',
  },
  {
    time: '16:00',
    emoji: '🤖',
    title: 'Ship the automation',
    sky: 'linear-gradient(180deg,#f2b25c 0%,#f7d488 50%,#fff3d6 100%)',
    body: '9 AI agents run the CRM outreach pipeline, human-in-the-loop before anything sends — per-prospect prep cut from ~30 min to under 5.',
  },
  {
    time: '20:00',
    emoji: '🌙',
    title: 'Wrap the day',
    sky: 'linear-gradient(180deg,#2b2560 0%,#6a3f8f 45%,#c96a63 100%)',
    body: "That's the loop: teach people, then build the systems that scale it.",
  },
];

const N = SCENES.length;

/** [fadeIn-start, fadeIn-end, fadeOut-start, fadeOut-end] for scene `i` of N,
    each scene owning an equal 1/N slice of overall scroll progress. First
    scene starts fully visible, last scene ends fully visible, so nothing
    is invisible at the very top/bottom of the track. */
function fadeRange(i: number): [number, number, number, number] {
  const slice = 1 / N;
  const start = i * slice;
  const end = start + slice;
  const pad = slice * 0.18;
  return [start, start + pad, end - pad, end];
}

function useCardMotion(scrollYProgress: MotionValue<number>, i: number) {
  const [a, b, c, d] = fadeRange(i);
  const opacity = useTransform(scrollYProgress, [a, b, c, d], [i === 0 ? 1 : 0, 1, 1, i === N - 1 ? 1 : 0]);
  const y = useTransform(scrollYProgress, [a, b, c, d], [i === 0 ? 0 : 18, 0, 0, i === N - 1 ? 0 : -18]);
  return { opacity, y };
}

export default function DayInLife() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });

  // Explicit per-scene hooks (not called in a loop) — rules-of-hooks needs a
  // fixed call count, and SCENES.length is fixed, so this is just five
  // written-out calls instead of a .map().
  const card0 = useCardMotion(scrollYProgress, 0);
  const card1 = useCardMotion(scrollYProgress, 1);
  const card2 = useCardMotion(scrollYProgress, 2);
  const card3 = useCardMotion(scrollYProgress, 3);
  const card4 = useCardMotion(scrollYProgress, 4);
  const cards = [card0, card1, card2, card3, card4];

  const sky0 = useTransform(scrollYProgress, fadeRange(0), [1, 1, 1, 0]);
  const sky1 = useTransform(scrollYProgress, fadeRange(1), [0, 1, 1, 0]);
  const sky2 = useTransform(scrollYProgress, fadeRange(2), [0, 1, 1, 0]);
  const sky3 = useTransform(scrollYProgress, fadeRange(3), [0, 1, 1, 0]);
  const sky4 = useTransform(scrollYProgress, fadeRange(4), [0, 1, 1, 1]);
  const skyOpacities = [sky0, sky1, sky2, sky3, sky4];

  // Sun arcs up then down across the whole day; swaps to a moon for the
  // final (night) scene.
  const sunLeft = useTransform(scrollYProgress, [0, 1], ['8%', '90%']);
  const sunTop = useTransform(scrollYProgress, [0, 0.5, 1], ['78%', '14%', '78%']);
  const sunOpacity = useTransform(scrollYProgress, [0.78, 0.92], [1, 0]);
  const moonOpacity = useTransform(scrollYProgress, [0.78, 0.92], [0, 1]);

  const cloudA = useTransform(scrollYProgress, [0, 1], ['-10%', '35%']);
  const cloudB = useTransform(scrollYProgress, [0, 1], ['30%', '75%']);
  const hillBackX = useTransform(scrollYProgress, [0, 1], ['0%', '-6%']);
  const hillFrontX = useTransform(scrollYProgress, [0, 1], ['0%', '-12%']);

  return (
    <div className={styles.root}>
      <div className={styles.intro}>
        <Link href="/" className={styles.introBack}>
          ← back to the resume
        </Link>
        <h1 className={styles.introTitle}>A day in the life</h1>
        <p className={styles.introSub}>
          Same trick as rleonardi.com/interactive-resume — scroll-linked parallax layers — minus the custom
          illustration budget. Scroll on.
        </p>
        <span className={styles.scrollHint}>↓ scroll ↓</span>
      </div>

      <div className={styles.track} ref={trackRef} style={{ height: `${N * 100}vh` }}>
        <div className={styles.pinned} aria-hidden="true">
          {SCENES.map((s, i) => (
            <motion.div key={s.time} className={styles.skyLayer} style={{ background: s.sky, opacity: skyOpacities[i] }} />
          ))}
          <motion.div className={`${styles.hill} ${styles.hillBack}`} style={{ x: hillBackX }}>
            <HillShape color="#3a2f52" />
          </motion.div>
          <motion.div className={styles.hill} style={{ x: hillFrontX }}>
            <HillShape color="#241a38" />
          </motion.div>
          <motion.span className={styles.cloud} style={{ left: cloudA, top: '18%' }}>
            ☁️
          </motion.span>
          <motion.span className={styles.cloud} style={{ left: cloudB, top: '10%' }}>
            ☁️
          </motion.span>
          <motion.span className={styles.sun} style={{ left: sunLeft, top: sunTop, opacity: sunOpacity }}>
            ☀️
          </motion.span>
          <motion.span className={styles.sun} style={{ left: sunLeft, top: sunTop, opacity: moonOpacity }}>
            🌙
          </motion.span>
        </div>

        <div className={styles.scenes}>
          {SCENES.map((s, i) => (
            <section className={styles.scene} key={s.time}>
              <motion.div className={styles.card} style={{ opacity: cards[i].opacity, y: cards[i].y }}>
                <p className={styles.cardTime}>{s.time}</p>
                <span className={styles.cardEmoji}>{s.emoji}</span>
                <h2 className={styles.cardTitle}>{s.title}</h2>
                <p className={styles.cardBody}>{s.body}</p>
              </motion.div>
            </section>
          ))}
        </div>
      </div>

      <div className={styles.outro}>
        <h2 className={styles.outroTitle}>That&apos;s the loop, every day</h2>
        <p className={styles.outroSub}>Teaching people, then building the systems that scale it. Full detail is one click away.</p>
        <div className={styles.ctaRow}>
          <Link className={`${styles.btn} ${styles.btnSolid}`} href="/#experience">
            See the full resume
          </Link>
          <a className={styles.btn} href="/nf.pdf" download="Nur-Fajar-CV-AI-LnD-2026.pdf" target="_blank" rel="noopener">
            Download CV
          </a>
        </div>
      </div>
    </div>
  );
}

function HillShape({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" width="100%" height="100%">
      <path d="M0,30 L0,18 Q15,6 30,16 T60,14 T100,18 L100,30 Z" fill={color} />
    </svg>
  );
}
