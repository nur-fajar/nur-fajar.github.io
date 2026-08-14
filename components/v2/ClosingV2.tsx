'use client';

/* ── CLOSING ─────────────────────────────────────────────────────────────
   Motion signature: paling berani di halaman, dan sengaja ditaruh terakhir
   supaya kontras dengan Testimonials yang tenang.
     - "puzzle piece" masuk potongan demi potongan (dua kata, dua arah,
        sedikit rotasi) — seperti kepingan yang dipasang
     - "diamond" naik pelan sambil dari blur ke tajam, satu gerakan mulus —
        beda karakter dari puzzle-nya
     - email = satu-satunya conversion point: magnetic hover + underline
       yang menggambar sendiri
     - sign-off weekday/weekend fade in paling akhir, tenang */

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import useMediaQuery from './useMediaQuery';

const EASE = [0.16, 1, 0.3, 1] as const;
const EMAIL = 'hi.nurfajar@gmail.com';

function MagneticEmail() {
  const canHover = useMediaQuery('(hover: hover) and (pointer: fine)');
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 20, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 260, damping: 20, mass: 0.5 });

  function onMove(e: React.MouseEvent) {
    if (!canHover || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    // Tarikan maksimal ~18% dari ukuran tombol — cukup terasa, tidak lompat.
    x.set((e.clientX - (r.left + r.width / 2)) * 0.18);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.28);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      ref={ref}
      href={`mailto:${EMAIL}`}
      className="v2-email motion-safe"
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={reset}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <span className="v2-email-label">Let’s talk: {EMAIL}</span>
      <span className="v2-email-underline" aria-hidden="true" />
    </motion.a>
  );
}

export default function ClosingV2() {
  // Hari lokal browser pengunjung — dihitung setelah mount supaya markup
  // server dan client tidak beda (hydration). Sebelum itu tampil "day",
  // kalimatnya tetap masuk akal kalau JS tidak jalan sama sekali.
  const [when, setWhen] = useState('day');
  useEffect(() => {
    const d = new Date().getDay();
    setWhen(d === 0 || d === 6 ? 'weekend' : 'weekday');
  }, []);

  return (
    <section className="v2-section v2-closing">
      <p className="v2-closing-line">
        <motion.span
          className="v2-closing-lead motion-safe"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          See me as your last{' '}
        </motion.span>
        {/* "puzzle piece" — dua kepingan yang dipasang dari dua arah */}
        <span className="v2-puzzle">
          {[
            { w: 'puzzle', from: -60, rot: -8 },
            { w: 'piece', from: 60, rot: 7 },
          ].map((p, i) => (
            <motion.span
              key={p.w}
              className="v2-puzzle-piece motion-safe"
              initial={{ opacity: 0, x: p.from, rotate: p.rot }}
              whileInView={{ opacity: 1, x: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.25 + i * 0.12 }}
            >
              {p.w}
              {i === 0 ? ' ' : ''}
            </motion.span>
          ))}
        </span>
        <motion.span
          className="v2-closing-lead motion-safe"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {' '}
          — or the{' '}
        </motion.span>
        {/* "diamond" — satu gerakan mulus, blur ke tajam */}
        <motion.span
          className="v2-diamond motion-safe"
          initial={{ opacity: 0, y: 26, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
        >
          diamond
        </motion.span>
        <motion.span
          className="v2-closing-lead motion-safe"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          {' '}
          that grows your company.
        </motion.span>
      </p>

      <MagneticEmail />

      <motion.p
        className="v2-signoff motion-safe"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
      >
        Thank you for visiting. Have a great {when}!
      </motion.p>
    </section>
  );
}
