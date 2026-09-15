'use client';

import { V5_SECTIONS, V5_VOICES } from '@/content/v5';
import Section, { findSection } from './Section';

/** Warna monogram per suara: biru, merah, kuning - rotasi, bukan acak. */
const SPOT_COLORS = ['blue', 'red', 'yellow'] as const;

/** Frasa kunci per suara yang di-highlight, verbatim dari ledger. */
const HIGHLIGHTS: Record<string, string[]> = {
  'Christian Jonathan': ['organizational skills', 'proactive approach'],
  'Kevin Naufal Eryogia': ["mentee's progress", 'every milestone'],
  'Diki Hamdani': ['Communication stayed clear', 'successful finish'],
};

/** Quote dengan frasa kunci di-<mark>. Tanpa ubah ledger. */
function HiQuote({ quote, name }: { quote: string; name: string }) {
  const marks = HIGHLIGHTS[name] ?? [];
  let parts: React.ReactNode[] = [quote];
  marks.forEach((m, mi) => {
    const next: React.ReactNode[] = [];
    parts.forEach((p) => {
      if (typeof p !== 'string') {
        next.push(p);
        return;
      }
      const i = p.indexOf(m);
      if (i < 0) {
        next.push(p);
        return;
      }
      next.push(
        p.slice(0, i),
        <mark key={`${mi}-${i}`} className="v5-wall__hl">
          {m}
        </mark>,
        p.slice(i + m.length),
      );
    });
    parts = next;
  });
  return <p>{parts}</p>;
}

/**
 * Voices sebagai dinding marquee dua arah: semua suara terlihat sekaligus
 * (kredibilitas), bukan disembunyikan di rotator. Hover/focus menjeda.
 * Reduced motion: grid statis. Runs digandakan untuk loop mulus.
 */
export default function Voices() {
  const section = findSection(V5_SECTIONS, 'voices');
  const rows = [V5_VOICES, [...V5_VOICES].reverse()];

  return (
    <Section section={section}>
      <div className="v5-wall">
        {rows.map((row, r) => (
          <div key={r} className="v5-wall__row" aria-label={`Referrals row ${r + 1}`}>
            <div className={`v5-wall__track v5-wall__track--${r === 0 ? 'fwd' : 'rev'}`}>
              {[0, 1].map((copy) => (
                <div className="v5-wall__run" key={copy} aria-hidden={copy === 1}>
                  {row.map((voice, i) => (
                    <figure key={voice.name} className="v5-wall__card">
                      <blockquote className="v5-wall__quote">
                        <HiQuote quote={voice.quote} name={voice.name} />
                      </blockquote>
                      <figcaption className="v5-wall__who">
                        <span
                          className={`v5-spot__avatar v5-spot__avatar--${SPOT_COLORS[i % SPOT_COLORS.length]}`}
                          aria-hidden="true"
                        >
                          {voice.name.charAt(0)}
                        </span>
                        <span className="v5-wall__id">
                          <span className="v5-wall__name">{voice.name}</span>
                          <span className="v5-wall__role">{voice.relation}</span>
                        </span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
