'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { SKILL_GROUPS } from './data';
import { usePinnedStep } from './usePinnedStep';

/**
 * Geometri lingkaran, semua dalam persen sisi panggung (panggung selalu bujur
 * sangkar, jadi persen untuk `left` dan `top` menghasilkan jarak yang sama).
 *
 * - `petal`: 4 lingkaran berjari-jari 25% dengan pusat berjarak 25% dari titik
 *   tengah — tepi keempatnya lewat satu titik pusat bersama, pola kelopak
 *   seperti gambar referensi. Dipakai di step pembuka DAN step penutup.
 * - `grid`: posisi terpisah 2×2 saat tiap grup dibedah satu per satu.
 */
type Side = 'top' | 'right' | 'bottom' | 'left';

const LAYOUT: {
  side: Side;
  petal: [number, number];
  grid: [number, number];
  /**
   * ARAH geser tag menjauh dari titik pusat bersama saat menyatu (-1/0/1).
   * Besarnya diatur CSS lewat `--nudge`, bukan di sini — di layar sempit
   * lingkarannya jauh lebih kecil dan geseran yang sama akan mendorong tag
   * keluar dari tepi lingkaran.
   */
  nudge: [number, number];
}[] = [
  { side: 'top', petal: [0, -25], grid: [-25, -25], nudge: [0, -1] }, // L&D
  { side: 'right', petal: [25, 0], grid: [25, -25], nudge: [1, 0] }, // AI Automation
  { side: 'bottom', petal: [0, 25], grid: [25, 25], nudge: [0, 1] }, // Program
  { side: 'left', petal: [-25, 0], grid: [-25, 25], nudge: [-1, 0] }, // Content
];

const PETAL_DIAMETER = 50; // % panggung
const GRID_DIAMETER = 46;

/**
 * Path lingkaran untuk label melengkung, digambar di viewBox 0 0 100 100 yang
 * lebih besar dari lingkarannya, jadi teks selalu jatuh di LUAR tepi. Keempat
 * potongan ini adalah satu putaran searah jarum jam — sama seperti gambar
 * referensi, di mana label bawah memang terbaca terbalik.
 */
const LABEL_R = 43;
const LABEL_PATHS: Record<Side, string> = {
  top: `M ${50 - LABEL_R} 50 A ${LABEL_R} ${LABEL_R} 0 0 1 ${50 + LABEL_R} 50`,
  right: `M 50 ${50 - LABEL_R} A ${LABEL_R} ${LABEL_R} 0 0 1 50 ${50 + LABEL_R}`,
  bottom: `M ${50 + LABEL_R} 50 A ${LABEL_R} ${LABEL_R} 0 0 1 ${50 - LABEL_R} 50`,
  left: `M 50 ${50 + LABEL_R} A ${LABEL_R} ${LABEL_R} 0 0 1 50 ${50 - LABEL_R}`,
};

/**
 * 6 step: menyatu (nama grup saja) → memencar & dibedah satu per satu (4 step)
 * → menyatu lagi, kali ini dengan seluruh tag tetap terbaca. Step terakhir
 * sengaja diberi porsi progress paling besar supaya sempat dilihat sebelum
 * pin dilepas.
 */
const THRESHOLDS = [0, 0.16, 0.31, 0.46, 0.61, 0.76];

const tagList = {
  hide: { transition: { staggerChildren: 0.015, staggerDirection: -1 } },
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
};
const tagItem = {
  hide: { opacity: 0, scale: 0.88 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.26, ease: 'easeOut' as const } },
};

function CurvedLabel({ side, name, id }: { side: Side; name: string; id: string }) {
  return (
    <svg className="story-circle__label" viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <path id={id} d={LABEL_PATHS[side]} fill="none" />
      </defs>
      <text>
        <textPath href={`#${id}`} startOffset="50%" textAnchor="middle">
          {name}
        </textPath>
      </text>
    </svg>
  );
}

export default function StorySkills() {
  const reduce = useReducedMotion();
  const { ref, step } = usePinnedStep(THRESHOLDS);

  const heading = (
    <h2 className="story-skills__heading">
      What I bring to your team is this <em>versatile skillset.</em>
    </h2>
  );

  if (reduce) {
    return (
      <section className="story-section" style={{ flexDirection: 'column' }}>
        {heading}
        <div className="story-skills__grid">
          {SKILL_GROUPS.map((g) => (
            <div key={g.name} className="story-skills__card">
              <h3>{g.name}</h3>
              <div className="story-tags">
                {g.tags.map((t) => (
                  <span key={t} className="story-tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const merged = step === 0 || step === 5; // menyatu di awal dan di akhir
  const finale = step === 5;
  const isActive = (i: number) => (step === 0 ? false : finale ? true : step - 1 === i);

  return (
    // Heading ikut masuk ke dalam sticky viewport supaya selalu satu frame
    // dengan lingkarannya — di layar pendek/mobile, heading sebagai section
    // terpisah membuat keduanya tidak pernah terlihat bersamaan.
    <section ref={ref} className="story-skills-pin" aria-label="Skills">
      <div className="story-pin__sticky">
        {heading}

        <div className="story-stage" data-merged={merged}>
          {SKILL_GROUPS.map((group, i) => {
            const { side, petal, grid, nudge } = LAYOUT[i];
            const [dx, dy] = merged ? petal : grid;
            const diameter = merged ? PETAL_DIAMETER : GRID_DIAMETER;
            const active = isActive(i);

            return (
              <motion.div
                key={group.name}
                className="story-circle__slot"
                animate={{
                  left: `${50 + dx}%`,
                  top: `${50 + dy}%`,
                  width: `${diameter}%`,
                  height: `${diameter}%`,
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div
                  className="story-circle"
                  data-active={active}
                  animate={{
                    scale: active && !finale ? 1.06 : 1,
                    opacity: merged || active ? 1 : 0.42,
                  }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  <CurvedLabel side={side} name={group.name} id={`story-arc-${i}`} />

                  {/* Semua tag selalu ada di DOM — yang berubah hanya
                      opacity/scale-nya, supaya screen reader membaca lengkap.
                      Saat menyatu, tiap daftar digeser menjauh dari titik
                      tumpang tindih di tengah dan mengecil agar tetap muat. */}
                  {/* Geserannya dipasang lewat CSS transform + transition, bukan
                      lewat prop `animate` Framer: prop `animate` bernilai objek
                      akan memutus rantai varian, dan stagger tag-nya ikut mati. */}
                  <motion.div
                    className="story-tags"
                    data-compact={finale}
                    variants={tagList}
                    initial="hide"
                    animate={active ? 'show' : 'hide'}
                    style={
                      {
                        pointerEvents: 'none',
                        '--nx': finale ? nudge[0] : 0,
                        '--ny': finale ? nudge[1] : 0,
                      } as React.CSSProperties
                    }
                  >
                    {group.tags.map((t) => (
                      <motion.span key={t} className="story-tag" variants={tagItem}>
                        {t}
                      </motion.span>
                    ))}
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
