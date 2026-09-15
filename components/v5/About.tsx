'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
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
 *  Desktop: strip horizontal yang bisa di-drag; mobile: tetap vertikal. */
export default function About() {
  const section = findSection(V5_SECTIONS, 'about');
  const reduced = useReducedMotion();
  const stripRef = useRef<HTMLOListElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

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

  /* Rel progres timeline: --p 0→1 saat babak melewati viewport.
     Sumbu vertikal di mobile, hairline horizontal di strip desktop (CSS).
     Scroll-driven, bukan animasi otonom: aman untuk reduced motion. */
  useEffect(() => {
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
  }, []);

  return (
    <Section section={section} stickyHead>
      <div className="v5-tlwrap" ref={wrapRef}>
        <span className="v5-spine" aria-hidden="true" />
      <ol
        className="v5-timeline"
        ref={stripRef}
        tabIndex={0}
        aria-label="Career timeline, drag to scroll"
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
