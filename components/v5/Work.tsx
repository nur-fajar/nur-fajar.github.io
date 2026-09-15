'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import { V5_CASES, V5_PIPELINE_STAGES, V5_PROOF, V5_PROOF_HIGHLIGHT, V5_SECTIONS, type V5Case, type V5CaseTool } from '@/content/v5';
import MaskedLines from './MaskedLines';
import BlurIn from './BlurIn';
import Reveal from '@/components/site/Reveal';
import Section, { findSection } from './Section';

/**
 * Numbers with method, living at the foot of Work instead of its own
 * section: three rows (reach, quality, outcome), each with its denominator.
 */
function ProofValue({ value }: { value: string }) {
  const ref = useRef<HTMLElement>(null);
  const [text, setText] = useState(value);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const m = value.match(/^([\d.]+)(.*)$/);
    if (!m) return;
    const end = parseFloat(m[1]);
    const suffix = m[2] ?? '';
    const decimals = m[1].includes('.') ? (m[1].split('.')[1]?.length ?? 0) : 0;
    if (!Number.isFinite(end)) return;
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const t0 = performance.now();
        const dur = 1200;
        const step = (t: number) => {
          const p = Math.min((t - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setText(`${(end * eased).toFixed(decimals)}${suffix}`);
          if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);
  return (
    <dd className="v5-proof__value" ref={ref}>
      {text}
    </dd>
  );
}

function WorkNumbers() {
  return (
    <div className="v5-worknumbers">
      <p className="v5-kind">Numbers with method</p>
      <dl className="v5-proof">
        {V5_PROOF.map((cell) => (
          <div key={cell.label} className="v5-proofrow">
            <dt>{cell.label}</dt>
            <ProofValue value={cell.value} />
            <dd className="v5-proof__method">{cell.method}</dd>
          </div>
        ))}
        <div className="v5-proofrow v5-proofrow--hot">
          <dt>{V5_PROOF_HIGHLIGHT.label}</dt>
          <ProofValue value={V5_PROOF_HIGHLIGHT.value} />
          <dd className="v5-proof__method">{V5_PROOF_HIGHLIGHT.method}</dd>
        </div>
      </dl>
    </div>
  );
}

/** Monogram 2 huruf untuk tool tanpa logo (Python→PY, Next.js→NE). */
function toolMono(name: string) {
  const mono = name.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase();
  return mono || '•';
}

/** Daftar isi rel tools, dipakai rel inline CaseBody dan rel pin.
 *  Ikon dibungkus .v5-tooltile supaya 3 gerak tidak tabrakan: li = pop
 *  entrance, tile = float idle, img = hover spring (properti transform
 *  yang sama tidak boleh dipegang dua animasi sekaligus). */
function ToolsList({ tools }: { tools: V5CaseTool[] }) {
  return (
    <ul>
      {tools.map((t) => (
        <li key={t.name} title={t.name}>
          <span className={t.dark ? 'v5-tooltile v5-tooltile--dark' : 'v5-tooltile'} aria-hidden="true">
            {t.logo ? (
              <Image src={t.logo} alt="" width={22} height={22} sizes="22px" loading="lazy" />
            ) : (
              <span className="v5-toolbadge">{toolMono(t.name)}</span>
            )}
          </span>
          <span>{t.name}</span>
        </li>
      ))}
    </ul>
  );
}

/** Rel pin: fixed di gutter kiri, hidup hanya saat workpin terlihat
 *  (data-inview di wrap), isi mengikuti case aktif. me-remount per case. */
function PinRail({ c }: { c: V5Case }) {
  return (
    <aside className="v5-case__tools v5-case__tools--pin" aria-label={`Tools used in ${c.title}`}>
      <p className="v5-case__tools-label">Stack</p>
      <ToolsList tools={c.tools} />
    </aside>
  );
}
function CaseBody({ c }: { c: V5Case }) {
  return (
    <>
      <p className="v5-kind">{c.kind}</p>
      <h3 className="v5-stagepanel__title">{c.title}</h3>
      <p className="v5-case__context">{c.context}</p>
      <ul className="v5-case__build">
        {c.build.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>

      {c.id === 'crm-pipeline' ? (
        <ol className="v5-pipe" aria-label="Simplified pipeline stages">
          {V5_PIPELINE_STAGES.map((stage, s) => (
            <li key={stage} className="v5-pipe__stage" style={{ ['--i' as string]: s }}>
              <span className="v5-pipe__dot" aria-hidden="true">
                {s + 1}
              </span>
              {stage}
            </li>
          ))}
        </ol>
      ) : null}

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
      <aside className="v5-case__tools" aria-label={`Tools used in ${c.title}`}>
        <p className="v5-case__tools-label">Stack</p>
        <ToolsList tools={c.tools} />
      </aside>
      {c.media.length ? (
        <div className="v5-case__media" aria-label="Case visuals">
          {c.media.map((m) => (
            <figure key={m.src} className="v5-case__shot">
              {m.href ? (
                <a href={m.href} target="_blank" rel="noreferrer" aria-label={m.caption ?? c.title}>
                  <span className="v5-case__frame">
                    <Image
                      src={m.src}
                      alt={m.caption ?? c.title}
                      fill
                      sizes="(max-width: 1100px) 100vw, 20rem"
                      loading="lazy"
                    />
                  </span>
                </a>
              ) : (
                <span className="v5-case__frame">
                  <Image
                    src={m.src}
                    alt={m.caption ?? c.title}
                    fill
                    sizes="(max-width: 1100px) 100vw, 20rem"
                    loading="lazy"
                  />
                </span>
              )}
              {m.caption ? <figcaption className="v5-case__cap">{m.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
      ) : null}
    </>
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
      /* Visibilitas rel pin mengikuti progres: 0 tepat saat pin mulai
         mengunci (rel agent 01 fade-in) dan 0 menjelang pin lepas (rel
         social 04 fade-out). Tepi 5% traverse. */
      const rail = Math.min(1, p / 0.05, (1 - p) / 0.05);
      el.style.setProperty('--rail', rail.toFixed(3));
      /* Gerbang visibilitas rel pin: fixed tidak tahu section, jadi wrap
         menandai dirinya sendiri setiap frame ukur. */
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (el.dataset.inview !== String(inView)) el.dataset.inview = String(inView);
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
              data-cursor="Open case"
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
          <PinRail key={c.id} c={c} />
          <div className="v5-workpin__stage">
            <Reveal>
              <p className="v5-eyebrow">{section.eyebrow}</p>
            </Reveal>
            <MaskedLines id={titleId} lines={section.heading} />
            <BlurIn delay={0.14} className="v5-lede">
              {section.lede}
            </BlurIn>
            <div className="v5-workpin__bar">
              {V5_CASES.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  className={i === active ? 'v5-tab is-active' : 'v5-tab'}
                  aria-label={`Go to case ${item.index}: ${item.title}`}
                  aria-current={i === active ? 'true' : undefined}
                  data-cursor="Open case"
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
