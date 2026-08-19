'use client';

import { m, useReducedMotion } from 'framer-motion';
import { CONTACT, HERO_STATS } from '@/content/ledger';

/* Fade + rise 12px, stagger 60ms, total di bawah 500ms. Fold pertama tidak
   boleh menunggu animasi selesai untuk bisa dibaca. */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] as const } },
};

/**
 * Hero — semua pertanyaan screening dijawab tanpa scroll: siapa, peran apa,
 * cari apa, bukti utama, di mana, dan bagaimana menghubungi.
 *
 * Dua hal yang sengaja TIDAK ada di sini:
 *   1. Kata "Scroll". Affordance scroll paling universal adalah konten yang
 *      terpotong, jadi section berikutnya dibiarkan mengintip di bawah fold.
 *   2. Angka apa pun dari proyek AI. Keempat sel stat adalah metrik
 *      L&D/kurikulum murni — kesan pertama harus 100% menjawab peran yang
 *      dilamar, bukan memancing "jadi dia mau kerja apa?".
 */
export default function Hero() {
  const reduced = useReducedMotion();

  return (
    <section className="hero" id="top">
      <div className="shell">
        <m.div
          variants={reduced ? undefined : container}
          initial={reduced ? undefined : 'hidden'}
          animate={reduced ? undefined : 'show'}
        >
          <m.p variants={item} className="kicker hero__kicker motion-safe">
            L&amp;D Specialist · Instructional Design · Curriculum Development
          </m.p>

          <m.h1 variants={item} className="hero__title motion-safe">
            I run the whole cycle —<br />
            not just the training day.
          </m.h1>

          <m.p variants={item} className="hero__lede motion-safe">
            I run learning programs end to end — design, delivery, and evaluation. Three
            years, five programs, 300+ learners, and a curriculum now taught by people I
            trained to teach it.
          </m.p>

          {/* Stat strip: empat sel dipisah rule vertikal hairline — bahasa
              ledger. Angkanya STATIS. Angka yang bergerak tidak bisa dibaca
              sekilas dan tidak bisa di-screenshot, dan hiring manager
              melakukan keduanya. */}
          <m.dl variants={item} className="statstrip motion-safe">
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className="statstrip__cell">
                {/* Istilahnya dibaca screen reader, definisinya dilihat mata —
                    keduanya membawa isi yang sama, jadi <dt> tidak perlu
                    diulang secara visual. */}
                <dt className="sr-only">{stat.label}</dt>
                <dd className="statstrip__cellbody">
                  <span className="statstrip__value">{stat.value}</span>
                  <span className="statstrip__label">{stat.label}</span>
                  <span className="statstrip__method">{stat.method}</span>
                </dd>
              </div>
            ))}
          </m.dl>

          <m.div variants={item} className="hero__actions motion-safe">
            <a
              className="btn btn--primary"
              href={CONTACT.cal}
              target="_blank"
              rel="noopener noreferrer"
            >
              Book 15 min
              <span aria-hidden="true">→</span>
            </a>
            <a className="btn" href={CONTACT.cv} download={CONTACT.cvFilename}>
              Download CV (PDF)
            </a>
          </m.div>

          <m.p variants={item} className="hero__meta mono motion-safe">
            {CONTACT.location} ({CONTACT.timezone}) · Open to work · Full-time, remote or
            hybrid
          </m.p>
        </m.div>
      </div>
    </section>
  );
}
