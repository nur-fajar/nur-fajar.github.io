'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { V5_ABOUT, V5_SECTIONS, V5_TOOLS, V5_TOOLS_MORE } from '@/content/v5';
import Section, { findSection } from './Section';

/** Logo lembaga per babak timeline, dari public/logos/story. */
const CHAPTER_LOGOS = [
  ['/logos/story/unsil.png', '/logos/story/bri.png', '/logos/story/bank-indonesia.png'],
  ['/logos/story/gdsc.png'],
  ['/logos/story/bangkit.png'],
  ['/logos/story/terra-ai.png'],
] as const;

/** About: sticky head, timeline strip with ghost numbers, then the stack.
 *  Tiap babak muncul per scroll (fade + rise, stagger), bukan sekaligus.
 *  Desktop: section nge-pin (320vh) dan scroll halaman menggeser strip
 *  horizontal Katie babak per babak — tidak bisa kelewat. Mobile /
 *  reduced motion: alur vertikal biasa + drag. */
export default function About() {
  const section = findSection(V5_SECTIONS, 'about');
  const reduced = useReducedMotion();
  const stripRef = useRef<HTMLOListElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);

  /* Mode pin = pola yang sama dengan Work: desktop + pointer halus tanpa
     reduced motion. Selain itu fallback alur biasa. */
  useEffect(() => {
    const mqW = window.matchMedia('(min-width: 980px)');
    const mqP = window.matchMedia('(pointer: fine)');
    const mqM = window.matchMedia('(prefers-reduced-motion: reduce)');
    const compute = () => setPinned(mqW.matches && mqP.matches && !mqM.matches);
    compute();
    mqW.addEventListener('change', compute);
    mqP.addEventListener('change', compute);
    mqM.addEventListener('change', compute);
    return () => {
      mqW.removeEventListener('change', compute);
      mqP.removeEventListener('change', compute);
      mqM.removeEventListener('change', compute);
    };
  }, []);

  useEffect(() => {
    if (!window.matchMedia('(min-width: 980px)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const strip = stripRef.current;
    if (!strip) return;
    let down = false;
    let startX = 0;
    let startLeft = 0;

    const grab = (e: PointerEvent) => {
      down = true;
      startX = e.clientX;
      startLeft = strip.scrollLeft;
      strip.classList.add('is-dragging');
    };
    const drag = (e: PointerEvent) => {
      if (!down) return;
      strip.scrollLeft = startLeft - (e.clientX - startX);
    };
    const release = () => {
      down = false;
      strip.classList.remove('is-dragging');
    };

    strip.addEventListener('pointerdown', grab);
    strip.addEventListener('pointermove', drag);
    window.addEventListener('pointerup', release);
    return () => {
      strip.removeEventListener('pointerdown', grab);
      strip.removeEventListener('pointermove', drag);
      window.removeEventListener('pointerup', release);
    };
  }, []);

  /* Babak yang sedang terlihat menandai dirinya is-active: logonya
     berwarna dan relnya menyala. Murni informatif, jalan juga tanpa
     motion (kelas CSS, bukan animasi). */
  useEffect(() => {
    const root = stripRef.current;
    if (!root) return;
    const items = [...root.querySelectorAll('.v5-chapter')];
    if (!items.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) entry.target.classList.toggle('is-active', entry.isIntersecting);
      },
      { threshold: 0.35 },
    );
    items.forEach((item) => io.observe(item));
    return () => io.disconnect();
  }, []);

  /* Roda mouse = geser satu babak: wheel vertikal di atas strip
     menggeser horizontal satu kartu (smooth + snap). Di ujung strip,
     scroll dibiarkan lewat ke halaman. Hanya mouse presisi tanpa
     reduced motion; akumulasi delta supaya satu flick = satu langkah. */
  useEffect(() => {
    if (pinned) return; // mode pin: scroll halaman yang mengemudikan strip
    if (!window.matchMedia('(min-width: 980px)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const strip = stripRef.current;
    if (!strip || strip.children.length < 2) return;
    let acc = 0;
    let accTimer = 0;
    let lockUntil = 0;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // pinch-zoom: jangan ganggu
      const now = performance.now();
      if (now < lockUntil) {
        e.preventDefault();
        return;
      }
      acc += e.deltaY;
      window.clearTimeout(accTimer);
      accTimer = window.setTimeout(() => {
        acc = 0;
      }, 180);
      if (Math.abs(acc) < 40) return;
      const dir = Math.sign(acc);
      acc = 0;
      const step =
        (strip.children[1] as HTMLElement).offsetLeft - (strip.children[0] as HTMLElement).offsetLeft;
      if (step <= 0) return;
      const max = strip.scrollWidth - strip.clientWidth;
      if (max <= 0) return;
      if ((dir < 0 && strip.scrollLeft <= 1) || (dir > 0 && strip.scrollLeft >= max - 1)) return;
      const next = Math.min(
        Math.max(Math.round(strip.scrollLeft / step) + dir, 0),
        Math.round(max / step),
      );
      e.preventDefault();
      lockUntil = now + 650;
      strip.scrollTo({ left: Math.min(next * step, max), behavior: 'smooth' });
    };
    strip.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      window.clearTimeout(accTimer);
      strip.removeEventListener('wheel', onWheel);
    };
  }, [pinned]);
  /* Rel progres timeline: --p 0→1 saat babak melewati viewport.
     Sumbu vertikal di mobile, hairline horizontal di strip desktop (CSS).
     Scroll-driven, bukan animasi otonom: aman untuk reduced motion. */
  useEffect(() => {
    if (pinned) return; // mode pin: --p ditulis efek pin-drive di bawah
    const wrap = wrapRef.current;
    const list = stripRef.current;
    if (!wrap || !list) return;
    let raf = 0;
    const measure = () => {
      const r = list.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = Math.max(r.height - vh * 0.5, 1);
      const p = Math.min(Math.max((vh * 0.75 - r.top) / total, 0), 1);
      wrap.style.setProperty('--p', p.toFixed(3));
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
  }, [pinned]);

  /* Pin-drive: panggung menempel selayar sementara scroll halaman
     menggeser strip horizontal + mengisi rel --p. Pola rAF yang sama
     dengan Work pin (tanpa ScrollTrigger, tanpa layout thrash). */
  useEffect(() => {
    if (!pinned) return;
    const wrap = wrapRef.current;
    const list = stripRef.current;
    if (!wrap || !list) return;
    let raf = 0;
    const measure = () => {
      const rect = wrap.getBoundingClientRect();
      const travel = Math.max(wrap.offsetHeight - window.innerHeight, 1);
      const p = Math.min(Math.max(-rect.top / travel, 0), 1);
      const max = list.scrollWidth - list.clientWidth;
      if (max > 0) list.scrollLeft = p * max;
      wrap.style.setProperty('--p', p.toFixed(3));
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
  }, [pinned]);

  return (
    <Section section={section} stickyHead>
      <div className={`v5-tlpin${pinned ? ' is-pinned' : ''}`} ref={wrapRef}>
        <div className="v5-tlpin__stage">
          <span className="v5-spine" aria-hidden="true" />
      <ol
        className="v5-timeline"
        ref={stripRef}
        tabIndex={0}
        aria-label="Career timeline: drag, or scroll to move one chapter at a time"
        data-cursor="Drag"
      >
        {V5_ABOUT.timeline.map((chapter, i) => (
          <m.li
            key={chapter.span}
            className="v5-chapter"
            initial={reduced ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="v5-chapter__num" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <p className="v5-chapter__span" aria-label={`Period: ${chapter.span}`}>
              {chapter.span}
            </p>
            <div className="v5-chapter__body">
              <h3 className="v5-chapter__title">{chapter.title}</h3>
              <p className="v5-chapter__text">{chapter.body}</p>
            </div>
            <ul className="v5-chapter__logos" aria-label="Institutions">
              {CHAPTER_LOGOS[i].map((src) => (
                <li key={src}>
                  <Image src={src} alt="" width={40} height={40} sizes="40px" loading="lazy" />
                </li>
              ))}
            </ul>
          </m.li>
        ))}
      </ol>
        </div>
      </div>
      <ul className="v5-about__tools" aria-label="Working stack">
        {[...V5_TOOLS, ...V5_TOOLS_MORE].map((tool) => (
          <li key={tool.name}>
            <Image src={tool.logo} alt={tool.name} width={22} height={22} sizes="22px" />
            <span>{tool.name}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
