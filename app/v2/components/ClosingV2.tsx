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

import { useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';
import MagneticButton from '@/components/motion/MagneticButton';

const EASE = [0.16, 1, 0.3, 1] as const;
const EMAIL = 'hi.nurfajar@gmail.com';

/* Magnet-nya pakai MagneticButton yang sudah ada di situs ini (dipakai
   halaman "/" juga) — tidak ditulis ulang. Fade masuknya dipisah ke
   wrapper supaya animasi `y` dari whileInView tidak berebut dengan spring
   x/y milik magnetnya. Underline yang menggambar sendiri murni CSS. */
function MagneticEmail() {
  return (
    <motion.div
      className="v2-email-wrap motion-safe"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <MagneticButton href={`mailto:${EMAIL}`} className="v2-email" strength={0.22}>
        <span className="v2-email-label">Let’s talk: {EMAIL}</span>
        <span className="v2-email-underline" aria-hidden="true" />
      </MagneticButton>
    </motion.div>
  );
}

// Hari lokal browser pengunjung. Dibaca lewat useSyncExternalStore, bukan
// useState + useEffect: server snapshot-nya "day" (kalimatnya tetap masuk
// akal kalau JS tidak jalan sama sekali dan tidak bikin hydration mismatch),
// client snapshot-nya hari asli. Tanggal bukan store yang berubah-ubah, jadi
// subscribe-nya no-op.
const NO_SUBSCRIBE = () => () => {};
const localDayLabel = () => {
  const d = new Date().getDay();
  return d === 0 || d === 6 ? 'weekend' : 'weekday';
};
const SERVER_DAY_LABEL = () => 'day';

export default function ClosingV2() {
  const when = useSyncExternalStore(NO_SUBSCRIBE, localDayLabel, SERVER_DAY_LABEL);

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
