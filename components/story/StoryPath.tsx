'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useReducedMotion } from 'framer-motion';
import { NUCLEUS, PATH_STEPS } from './data';
import { usePinnedStep } from './usePinnedStep';

// Caption per step. Step 1 & 3 adalah rewrite yang diminta di §4.3 —
// durasi beasiswa yang akurat (satu semester / satu tahun) dan framing
// kepemimpinan GenBI + GDSC sebagai satu cerita yang berbarengan.
const CAPTIONS: ReactNode[] = [
  <>
    It started at <b>Universitas Siliwangi</b>, where I graduated as the{' '}
    <b>best graduate of the Faculty of Engineering</b> with a <b>3.94 GPA</b>.
  </>,
  <>
    {' '}
    Along the way, I received the <b>Bank BRI</b> scholarship for a semester, and the{' '}
    <b>Bank Indonesia</b> scholarship for a year.
  </>,
  <>
    {' '}
    I joined two national programs by Indonesia&apos;s Ministry of Education —{' '}
    <b>Bangkit Academy</b> in early 2022, graduating with distinction in the Machine Learning path,
    then <b>Terra AI</b> later that year, where my project team was selected as a top project in
    mental health.
  </>,
  <>
    {' '}
    On campus, I took on leadership early — serving as QRIS competition coordinator and media staff
    at <b>GenBI</b> at the same time, and becoming <b>GDSC</b>&apos;s first-ever lead, building it
    from zero.
  </>,
];

// 4 step → ambang batas 0 / 25% / 50% / 75% (§4.3).
const THRESHOLDS = [0, 0.25, 0.5, 0.75];

function LogoChip({ src, alt, on }: { src: string; alt: string; on: boolean }) {
  return (
    <span className="story-node__chip" data-on={on}>
      {/* eslint-disable-next-line @next/next/no-img-element -- aset lokal berukuran
          tetap ≤48px; next/image hanya menambah wrapper tanpa manfaat nyata. */}
      <img src={src} alt={alt} />
    </span>
  );
}

/**
 * The Path (§4.3) — pinned / scroll-scrubbed.
 *
 * Satu ring + satu grup logo terbuka per step, digerakkan oleh progress scroll
 * di dalam wrapper tinggi (bukan oleh step mana yang masuk viewport). Node yang
 * sudah terbuka terus mengorbit pelan (40-60s per putaran, arah berselang-seling
 * per ring) lewat CSS keyframes — animasi ambient yang lepas dari scroll, dan
 * di-pause via IntersectionObserver ketika section keluar layar.
 */
export default function StoryPath() {
  const reduce = useReducedMotion();
  const { ref, step } = usePinnedStep(THRESHOLDS);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    const el = stickyRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => setPaused(!e.isIntersecting)),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Semua caption selalu ada di DOM (§5) — step yang belum aktif hanya diredam
  // opacity-nya, tidak di-unmount, supaya screen reader tetap membaca lengkap.
  const caption = (
    <div className="story-path__caption">
      <p>
        {CAPTIONS.map((c, i) => (
          <span key={i} className="story-seg" data-on={reduce ? true : i <= step}>
            {c}
          </span>
        ))}
      </p>
    </div>
  );

  if (reduce) {
    // Fallback reduced-motion (§4.3): blok bertumpuk, scroll normal, tanpa pin.
    return (
      <section className="story-section" style={{ flexDirection: 'column', gap: '6vh' }} aria-label="The Path">
        <ul className="story-path__stack">
          {PATH_STEPS.map((s, i) => (
            <li key={i}>
              <div className="story-path__stackrow">
                {i === 0 ? (
                  <LogoChip src={NUCLEUS.src} alt={NUCLEUS.alt} on />
                ) : (
                  s.nodes.map((n) => <LogoChip key={n.src} src={n.src} alt={n.alt} on />)
                )}
              </div>
              <p style={{ fontFamily: 'var(--serif)', maxWidth: 560, lineHeight: 1.7 }}>
                {CAPTIONS[i]}
              </p>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section ref={ref} style={{ height: '460vh', position: 'relative' }} aria-label="The Path">
      <div ref={stickyRef} className="story-pin__sticky">
        <div className="story-atom">
          {PATH_STEPS.map((s, i) => (
            <span
              key={`orbit-${i}`}
              className="story-orbit"
              data-on={i <= step}
              style={{ width: `${s.radius * 2}%`, height: `${s.radius * 2}%` }}
            />
          ))}

          <div className="story-nucleus" data-on={step >= 0}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={NUCLEUS.src} alt={NUCLEUS.alt} />
          </div>

          {PATH_STEPS.map((s, i) =>
            s.nodes.length === 0 ? null : (
              <div
                key={`ring-${i}`}
                className="story-ring"
                data-dir={s.direction}
                data-paused={paused || i > step}
                style={{ ['--orbit-duration' as string]: `${s.duration}s` }}
              >
                {s.nodes.map((n, ni) => {
                  const rad = (s.angles[ni] * Math.PI) / 180;
                  return (
                    <div
                      key={n.src}
                      className="story-node"
                      style={{
                        left: `${50 + s.radius * Math.cos(rad)}%`,
                        top: `${50 + s.radius * Math.sin(rad)}%`,
                      }}
                    >
                      {/* Counter-rotate: node ikut mengelilingi pusat, tapi logonya
                          sendiri tetap tegak, tidak ikut berputar. */}
                      <div
                        className="story-node__spin"
                        style={{ ['--orbit-duration' as string]: `${s.duration}s` }}
                      >
                        <LogoChip src={n.src} alt={n.alt} on={i <= step} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ),
          )}
        </div>

        {caption}
      </div>
    </section>
  );
}
