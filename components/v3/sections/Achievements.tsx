import { TESTIMONIALS, V3_SECTIONS } from '@/content/ledger';
import Section, { findSection } from '../Section';

/**
 * Tersisa testimoni: menyebut siapa yang bicara dan dari sudut pandang
 * mana menggantikan verifikasi yang tidak bisa diklik.
 */
export default function Achievements() {
  const section = findSection(V3_SECTIONS, 'achievements');

  return (
    <Section section={section}>
      <ul className="v3-quotes v3-quotes--stack">
        {TESTIMONIALS.map((item) => (
          <li className="v3-card v3-quote" key={item.name}>
            <blockquote className="v3-quote__text">{item.quote}</blockquote>
            <p className="v3-quote__who">
              {item.name}
              <span className="v3-quote__role">
                {item.relation} <span aria-hidden="true">·</span> {item.role}
              </span>
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
