import { Code, Megaphone, Robot } from '@phosphor-icons/react/dist/ssr';
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
 */
export default function Capabilities() {
  const section = findSection(V5_SECTIONS, 'capabilities');
  return (
    <Section section={section} stickyHead>
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
