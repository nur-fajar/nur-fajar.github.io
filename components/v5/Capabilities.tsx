import Image from 'next/image';
import { Code, Megaphone, Robot } from '@phosphor-icons/react/dist/ssr';
import { V3_TOOLS } from '@/content/ledger';
import { V5_PILLARS, V5_SECTIONS } from '@/content/v5';
import Section, { findSection } from './Section';

const ICONS = {
  build: Code,
  automate: Robot,
  amplify: Megaphone,
} as const;

/**
 * Capabilities with a sticky section head: the eyebrow, title, and lede
 * stay pinned left while the stacking cards slide past on the right.
 * Pure CSS sticky, no JS, static on mobile.
 *
 * Di ujung bawah section: barisan tool yang dipakai — statis, grayscale,
 * berwarna saat hover. Bukan latar melayang: di layar sempit logo yang
 * mengembar menabrak judul sticky.
 */
export default function Capabilities() {
  const section = findSection(V5_SECTIONS, 'capabilities');
  const toolRow = (
    <div className="v5-toolrow">
      <p className="v5-toolrow__label">Tools I reach for</p>
      <ul className="v5-toolrow__list" aria-label="Tools I use">
        {V3_TOOLS.map((tool) => (
          <li key={tool.id} className="v5-toolrow__item">
            <Image src={`/logos/tools/${tool.id}.png`} alt="" width={26} height={26} sizes="26px" />
            <span>{tool.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <Section section={section} stickyHead headExtra={toolRow}>
      <ol className="v5-stack">
        {V5_PILLARS.map((pillar, i) => {
          const Icon = ICONS[pillar.id as keyof typeof ICONS];
          return (
            <li
              key={pillar.id}
              className={`v5-stack__card v5-stack__card--${pillar.id}`}
              style={{ ['--v5-stack-i' as string]: i }}
            >
              <span className="v5-stack__num" aria-hidden="true">
                {pillar.index}
              </span>
              <p className="v5-stack__tag">
                {Icon ? <Icon size={15} weight="bold" aria-hidden="true" /> : null}
                {pillar.tag}
              </p>
              <h3 className="v5-stack__title">{pillar.title}</h3>
              <p className="v5-stack__body">{pillar.body}</p>
              <ul className="v5-stack__points">
                {pillar.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
