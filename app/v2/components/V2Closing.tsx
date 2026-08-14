'use client';

/* ── Closing — motion signature: "bold, once more" ────────────────────────
   The page's second loud beat after The Path — "puzzle piece" assembles
   itself letter by letter (scattered → snapped into place), "diamond"
   gets a one-shot light sweep across the text. Everything else here is
   quiet by comparison: the email is the page's one conversion point, and
   the weekday/weekend sign-off fades in last and calmly, closing the page
   the way it opened. */

import { useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';
import MagneticButton from '@/components/motion/MagneticButton';

const CONTACT_EMAIL = 'hi.nurfajar@gmail.com';

function PuzzleWord({ text }: { text: string }) {
  return (
    <span className="v2-puzzle-word" aria-label={text}>
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          className="v2-puzzle-letter motion-safe"
          aria-hidden="true"
          initial={{ opacity: 0, x: (i % 2 === 0 ? -1 : 1) * (10 + i * 2), y: (i % 3) * 10 - 10, rotate: (i % 2 === 0 ? -1 : 1) * 18 }}
          whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.5, delay: i * 0.035, ease: [0.34, 1.56, 0.64, 1] }}
        >
          {ch === ' ' ? ' ' : ch}
        </motion.span>
      ))}
    </span>
  );
}

function DiamondWord({ text }: { text: string }) {
  return (
    <motion.span
      className="v2-diamond-word motion-safe"
      initial={{ backgroundPosition: '150% 0' }}
      whileInView={{ backgroundPosition: '-50% 0' }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 1.1, delay: 0.25, ease: 'easeInOut' }}
    >
      {text}
    </motion.span>
  );
}

// useSyncExternalStore, not useEffect+setState: the "store" here is really
// just "the visitor's local clock", which never changes for the lifetime
// of the page, but reading it must still be deferred to the client so the
// server-rendered HTML (built in a different timezone) can't disagree with
// hydration. getServerSnapshot returning null is what makes that safe.
const noopSubscribe = () => () => {};
function getDayKindSnapshot(): 'weekday' | 'weekend' {
  const day = new Date().getDay(); // 0 Sun .. 6 Sat, local to the visitor's browser
  return day === 0 || day === 6 ? 'weekend' : 'weekday';
}
function getServerDayKindSnapshot() {
  return null;
}

function useDayKind() {
  return useSyncExternalStore(noopSubscribe, getDayKindSnapshot, getServerDayKindSnapshot);
}

export default function V2Closing() {
  const dayKind = useDayKind();

  return (
    <section className="v2-section v2-closing" id="v2-closing">
      <p className="v2-closing-line">
        See me as your last <PuzzleWord text="puzzle piece" /> — or the <DiamondWord text="diamond" /> that grows
        your company.
      </p>

      <MagneticButton
        className="v2-closing-cta motion-safe"
        href={`mailto:${CONTACT_EMAIL}`}
        strength={0.25}
      >
        <span className="v2-closing-cta-label mono">Let&apos;s talk</span>
        <span className="v2-closing-cta-email">{CONTACT_EMAIL}</span>
      </MagneticButton>

      <motion.p
        className="v2-closing-signoff mono motion-safe"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.9 }}
        transition={{ duration: 1, delay: 0.3 }}
        aria-live="off"
      >
        Thank you for visiting. Have a great {dayKind ?? 'day'}!
      </motion.p>
    </section>
  );
}
