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

  return (
    <Section section={section} stickyHead>
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
