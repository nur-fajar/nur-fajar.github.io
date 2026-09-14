import { ArrowDown, EnvelopeSimple } from '@phosphor-icons/react/dist/ssr';
import Magnetic from '@/components/v3/Magnetic';
import { CONTACT } from '@/content/ledger';
import { V5_FOUNDER_MAILTO, V5_HERO, V5_PILLARS } from '@/content/v5';
import PuzzleField from './PuzzleField';

/**
 * v5 hero, statement pass: no photo, no index. Organic puzzle backdrop
 * with cursor parallax behind everything, one red piece as the missing one.
 */
export default function Hero() {
  return (
    <header className="v5-hero" id="top">
      <PuzzleField />
      <div className="v5-shell v5-hero__inner">
        <h1 className="v5-mega">
          <span className="v5-mega__line v5-rise" style={{ ['--v5-rise-delay' as string]: '120ms' }}>
            {V5_HERO.titleLead}
          </span>
          <span
            className="v5-mega__line v5-mega__line--serif v5-rise"
            style={{ ['--v5-rise-delay' as string]: '230ms' }}
          >
            {V5_HERO.indexPrompt}
            <span className="v5-mega__mark" aria-hidden="true">
              ✳
            </span>
          </span>
        </h1>

        {V5_HERO.sub.length ? (
          <div className="v5-hero__sub v5-rise" style={{ ['--v5-rise-delay' as string]: '420ms' }}>
            {V5_HERO.sub.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        ) : null}

        <ul className="v5-hero__menu v5-rise" style={{ ['--v5-rise-delay' as string]: '480ms' }} aria-label="Where I help">
          {V5_PILLARS.map((pillar) => (
            <li key={pillar.id}>
              <a href="#capabilities">
                <span className="v5-hero__menu-tag">{pillar.tag}</span>
                <span className="v5-hero__menu-title">{pillar.title}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="v5-hero__ctas v5-rise" style={{ ['--v5-rise-delay' as string]: '520ms' }}>
          <Magnetic strength={0.25}>
            <a
              className="v5-btn v5-btn--big"
              href={V5_FOUNDER_MAILTO}
              aria-label="Email Nur Fajar"
            >
              <EnvelopeSimple size={19} weight="bold" aria-hidden="true" />
              {CONTACT.email}
            </a>
          </Magnetic>
          <a className="v5-hero__secondary" href="#work">
            {V5_HERO.secondaryCta}
            <ArrowDown size={15} weight="bold" aria-hidden="true" />
          </a>
        </div>

      </div>

      <div className="v5-ticker v5-rise" style={{ ['--v5-rise-delay' as string]: '740ms' }} aria-label="Services">
        <div className="v5-ticker__track">
          {[0, 1].map((copy) => (
            <div className="v5-ticker__run" key={copy} aria-hidden={copy === 1}>
              {V5_HERO.ticker.map((item) => (
                <span className="v5-ticker__item" key={item}>
                  {item}
                  <span className="v5-ticker__star" aria-hidden="true">
                    ✳
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
