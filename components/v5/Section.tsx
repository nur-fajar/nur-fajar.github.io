import Reveal from '@/components/site/Reveal';
import MaskedLines from './MaskedLines';
import type { V5Section } from '@/content/v5';

/**
 * Shared furniture for every v5 section: eyebrow, two-line title, lede.
 *
 * stickyHead pins that furniture in a left column while the body scrolls
 * (Capabilities). It is opt-in per section: making every head sticky would
 * fight sections whose bodies are short or whose closers must stay attached
 * (Contact's mega wordmark, Work's accordion rhythm).
 */
export default function Section({
  section,
  children,
  stickyHead,
  backdrop,
  headExtra,
}: {
  section: V5Section;
  children: React.ReactNode;
  stickyHead?: boolean;
  /** Latar full-bleed di belakang section (mis. PuzzleField di Contact). */
  backdrop?: React.ReactNode;
  /** Tambahan di kolom kepala, setelah lede (mis. barisan tool di Capabilities). */
  headExtra?: React.ReactNode;
}) {
  const titleId = `${section.id}-title`;
  const head = (
    <>
      <Reveal>
        <p className="v5-eyebrow">{section.eyebrow}</p>
      </Reveal>
      <MaskedLines id={titleId} lines={section.heading} />
      <Reveal delay={0.14}>
        <p className="v5-lede">{section.lede}</p>
      </Reveal>
      {headExtra}
    </>
  );

  return (
    <section
      className={
        `v5-section${stickyHead ? ' v5-section--sticky-head' : ''}` +
        (backdrop ? ' v5-section--backdrop' : '')
      }
      id={section.id}
      aria-labelledby={titleId}
    >
      {backdrop}
      <div className="v5-shell">
        {stickyHead ? (
          <>
            <div className="v5-section__head">{head}</div>
            <div className="v5-section__body">
              <Reveal delay={0.08} amount={0}>
                {children}
              </Reveal>
            </div>
          </>
        ) : (
          <>
            {head}
            <Reveal delay={0.08} amount={0}>
              {children}
            </Reveal>
          </>
        )}
      </div>
    </section>
  );
}

export function findSection(sections: readonly V5Section[], id: string): V5Section {
  const section = sections.find((c) => c.id === id);
  if (!section) throw new Error(`Section "${id}" missing in V5_SECTIONS`);
  return section;
}
