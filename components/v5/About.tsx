'use client';

import Image from 'next/image';
import { m, useReducedMotion } from 'framer-motion';
import { V5_ABOUT, V5_SECTIONS, V5_TOOLS, V5_TOOLS_MORE } from '@/content/v5';
import Section, { findSection } from './Section';

/** About: sticky head, timeline strip with ghost numbers, then the stack.
 *  Tiap babak muncul per scroll (fade + rise, stagger), bukan sekaligus. */
export default function About() {
  const section = findSection(V5_SECTIONS, 'about');
  const reduced = useReducedMotion();
  return (
    <Section section={section} stickyHead>
      <ol className="v5-timeline">
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
