'use client';

import { m, useReducedMotion } from 'framer-motion';
import { LEADERSHIP, WORK_HISTORY, type Role } from '@/content/ledger';
import Reveal from './Reveal';

/**
 * SECTION 4 — Experience. Sebelumnya tidak ada sama sekali, sehingga hiring
 * manager tidak bisa menjawab pertanyaan gerbang paling dasar: "sudah berapa
 * lama dia L&D, dan di mana?".
 *
 * Dua blok terpisah, mengikuti pemisahan yang memang sudah ada di CV. GDSC dan
 * GenBI bukan pekerjaan berbayar; menaruhnya sebaris dengan tiga jabatan
 * Terra AI/Bangkit akan mengencerkan sinyal seniority peran berbayar dan
 * membuat situs tidak lagi match dengan CV.
 */
export default function Experience() {
  return (
    <section className="section" aria-labelledby="experience-title">
      <div className="shell">
        <Reveal>
          <p className="kicker">Experience</p>
          <h2 className="section-title" id="experience-title">
            Three roles, one through-line.
          </h2>
        </Reveal>

        <RoleList roles={WORK_HISTORY} variant="work" />

        <Reveal>
          <hr className="rule exp__divider" />
          <h3 className="kicker exp__subhead" id="leadership-title">
            Leadership &amp; organizational
          </h3>
        </Reveal>

        <RoleList roles={LEADERSHIP} variant="leadership" labelledBy="leadership-title" />
      </div>
    </section>
  );
}

function RoleList({
  roles,
  variant,
  labelledBy,
}: {
  roles: Role[];
  variant: 'work' | 'leadership';
  labelledBy?: string;
}) {
  const reduced = useReducedMotion();
  const isWork = variant === 'work';
  // Blok kerja duduk langsung di bawah <h2> section; blok kepemimpinan duduk di
  // bawah <h3> sub-headnya sendiri. Levelnya ikut, supaya tidak ada lompatan
  // tingkat heading buat pembaca layar.
  const RoleHeading = isWork ? 'h3' : 'h4';

  return (
    <div className={`exp exp--${variant}`}>
      {/* Rule vertikal menggambar dirinya sendiri saat masuk viewport. Ini satu
          dari sedikit tempat di situs ini yang motion-nya benar-benar meng-
          encode informasi: garisnya tumbuh searah dengan arah waktu. */}
      <m.span
        className="exp__spine"
        aria-hidden="true"
        initial={reduced ? undefined : { scaleY: 0 }}
        whileInView={reduced ? undefined : { scaleY: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* <ol> karena urutannya bermakna — ini kronologi, bukan kumpulan. */}
      <ol className="exp__list" aria-labelledby={labelledBy}>
        {roles.map((role, index) => (
          <Reveal
            as="li"
            key={`${role.title}-${role.start}`}
            delay={index * 0.06}
            amount={0.4}
            /* Baris paling atas Blok 4a diberi bg tenggelam sebagai penanda
               "paling baru". Blok 4b tidak memakai penanda ini. */
            className={
              isWork && index === 0 ? 'exp__row exp__row--current' : 'exp__row'
            }
          >
            <p className="exp__dates">
              {role.start}
              <span className="exp__dash" aria-hidden="true">
                {' — '}
              </span>
              <span className="sr-only"> to </span>
              {role.end}
            </p>

            <div className="exp__body">
              <RoleHeading className="exp__title">{role.title}</RoleHeading>
              <p className="exp__org">
                {role.org} · {role.place}
              </p>
              <p className="exp__detail">{role.detail}</p>

              {/* Uraian peran, kata per kata dari CV.
                  <details> dipakai alih-alih state React karena tiga alasan
                  yang semuanya penting di sini: isinya tetap ada di HTML
                  (bisa di-Ctrl+F dan terindeks mesin pencari meski tertutup),
                  ia bisa dibuka dengan keyboard tanpa satu baris JS, dan ia
                  tidak menambah apa pun ke bundle. */}
              <details className="exp__more">
                <summary className="exp__summary">
                  <span className="exp__summary-label">What this involved</span>
                  <span className="exp__summary-mark" aria-hidden="true" />
                </summary>
                <ul className="exp__bullets">
                  {role.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </details>
            </div>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}
