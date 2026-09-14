'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from '@phosphor-icons/react';
import { V5_CASES, V5_PROOF, V5_PROOF_HIGHLIGHT, V5_SECTIONS, type V5Case } from '@/content/v5';
import MaskedLines from './MaskedLines';
import Reveal from '@/components/site/Reveal';
import Section, { findSection } from './Section';
import WorkVisual from './WorkVisual';

/**
 * Numbers with method, living at the foot of Work instead of its own
 * section: three rows (reach, quality, outcome), each with its denominator.
 */
function WorkNumbers() {
  return (
    <div className="v5-worknumbers">
      <p className="v5-kind">Numbers with method</p>
      <dl className="v5-proof">
        {V5_PROOF.map((cell) => (
          <div key={cell.label} className="v5-proofrow">
            <dt>{cell.label}</dt>
            <dd className="v5-proof__value">{cell.value}</dd>
            <dd className="v5-proof__method">{cell.method}</dd>
          </div>
        ))}
        <div className="v5-proofrow v5-proofrow--hot">
          <dt>{V5_PROOF_HIGHLIGHT.label}</dt>
          <dd className="v5-proof__value">{V5_PROOF_HIGHLIGHT.value}</dd>
          <dd className="v5-proof__method">{V5_PROOF_HIGHLIGHT.method}</dd>
        </div>
      </dl>
    </div>
  );
}

/** Isi satu case, dipakai mode pin dan mode tab biasa: teks kiri, visual kanan. */
function CaseBody({ c }: { c: V5Case }) {
  return (
    <div className="v5-case">
      <div className="v5-case__text">
        <p className="v5-kind">{c.kind}</p>
        <h3 className="v5-stagepanel__title">{c.title}</h3>
        <p className="v5-case__context">{c.context}</p>
        <ul className="v5-case__build">
          {c.build.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>

        <ul className="v5-chips" aria-label="Results and stack">
          {c.metrics.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
        {c.note ? <p className="v5-case__note">{c.note}</p> : null}
        {c.links.length ? (
          <ul className="v5-case__links">
            {c.links.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noreferrer">
                  {l.label}
                  <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <div className="v5-case__visual">
        <WorkVisual id={c.id} />
      </div>
    </div>
  );
}

/**
 * Selected work sebagai pin scroll: section setinggi 4 viewport, panggungnya
 * menempel selayar, tiap tahap scroll ganti case, lalu angka-angka menyusul
 * setelah pin lepas. Bar progres menunjukkan posisi.
 *
 * Fallback tanpa pin (reduced motion / layar sempit): tab panggung biasa
 * yang diklik, perilaku versi sebelumnya.
 */
export default function Work() {
  const section = findSection(V5_SECTIONS, 'work');
  const total = V5_CASES.length;
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [pinned, setPinned] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqNarrow = window.matchMedia('(max-width: 640px)');
    const compute = () => setPinned(!mqMotion.matches && !mqNarrow.matches);
    compute();
    mqMotion.addEventListener('change', compute);
    mqNarrow.addEventListener('change', compute);
    const id = window.location.hash.replace('#work-', '');
    const found = V5_CASES.findIndex((item) => item.id === id);
    /* Deep link ditunda satu frame: setState sinkron di body effect
       ditolak lint (cascading render); nilai awal 0 cocok dengan SSR. */
    let raf = 0;
    if (found >= 0) raf = requestAnimationFrame(() => setActive(found));
    return () => {
      cancelAnimationFrame(raf);
      mqMotion.removeEventListener('change', compute);
      mqNarrow.removeEventListener('change', compute);
    };
  }, []);

  useEffect(() => {
    if (!pinned) return;
    let raf = 0;
    const measure = () => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - window.innerHeight;
      const p = Math.min(Math.max(-rect.top / scrollable, 0), 1);
      setProgress(p);
      setActive(Math.min(total - 1, Math.floor(p * total)));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [pinned, total]);

  const scrollToCase = (i: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const scrollable = el.offsetHeight - window.innerHeight;
    const y =
      el.getBoundingClientRect().top + window.scrollY + (scrollable * (i + 0.5)) / total;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  const travel = (dir: number) => setActive((i) => (i + dir + total) % total);

  if (!pinned) {
    return (
      <Section section={section}>
        <div
          className="v5-tabs"
          role="tablist"
          aria-label="Selected work cases"
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight') travel(1);
            else if (event.key === 'ArrowLeft') travel(-1);
            else if (event.key === 'Home') setActive(0);
            else if (event.key === 'End') setActive(total - 1);
            else return;
            event.preventDefault();
          }}
        >
          {V5_CASES.map((item, i) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`work-tab-${item.id}`}
              aria-selected={i === active}
              aria-controls={`work-${item.id}-panel`}
              tabIndex={i === active ? undefined : -1}
              className={i === active ? 'v5-tab is-active' : 'v5-tab'}
              onClick={() => setActive(i)}
            >
              <span className="v5-tab__index" aria-hidden="true">
                {item.index}
              </span>
              {item.title}
            </button>
          ))}
        </div>

        <div
          key={V5_CASES[active].id}
          id={`work-${V5_CASES[active].id}-panel`}
          role="tabpanel"
          aria-labelledby={`work-tab-${V5_CASES[active].id}`}
          className="v5-stagepanel"
        >
          <CaseBody c={V5_CASES[active]} />
        </div>
        <WorkNumbers />
      </Section>
    );
  }

  const c = V5_CASES[active];
  const titleId = 'work-title';

  /* Mode pin: kepala section (eyebrow + judul + lede) ikut nempel di dalam
     stage, di atas tab. Ruang case menyempit; stage boleh scroll internal
     dan rantainya tersambung ke halaman (tanpa contain). */
  return (
    <section className="v5-section" id="work" aria-labelledby={titleId}>
      <div className="v5-shell">
        <div className="v5-workpin" ref={wrapRef}>
          <div className="v5-workpin__stage">
            <Reveal>
              <p className="v5-eyebrow">{section.eyebrow}</p>
            </Reveal>
            <MaskedLines id={titleId} lines={section.heading} />
            <Reveal delay={0.14}>
              <p className="v5-lede">{section.lede}</p>
            </Reveal>
            <div className="v5-workpin__bar">
              {V5_CASES.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  className={i === active ? 'v5-tab is-active' : 'v5-tab'}
                  aria-label={`Go to case ${item.index}: ${item.title}`}
                  aria-current={i === active ? 'true' : undefined}
                  onClick={() => scrollToCase(i)}
                >
                  <span className="v5-tab__index" aria-hidden="true">
                    {item.index}
                  </span>
                  {item.title}
                </button>
              ))}
            </div>
            <div
              className="v5-workpin__progress"
              aria-hidden="true"
              style={{ transform: `scaleX(${progress})` }}
            />
            <div key={c.id} className="v5-workpin__case">
              <CaseBody c={c} />
            </div>
          </div>
        </div>
        <WorkNumbers />
      </div>
    </section>
  );
}
