import { V9_HERO } from '@/content/v9';
import Shader from './Shader';

/**
 * Hero v9.
 *
 * Susunannya: nama mono di atas, headline mask-reveal (bukan warna putih
 * di atas gelap: seluruh halaman terang, jadi headline-nya tinta), satu baris
 * subdomain dari kanon meta, lalu tiga aksi.
 *
 * Tiga lapis latar, berurutan dari belakang: fallback CSS (radial gradient)
 * selalu ada, canvas WebGL menimpanya kalau bisa, scrim putih di paling
 * depan supaya pita tidak pernah memakan headline.
 */
export default function Hero() {
  return (
    <header className="v9-hero" id="top">
      <div className="v9-hero__fallback" aria-hidden="true" />
      <Shader />
      <div className="v9-hero__scrim" aria-hidden="true" />

      <div className="v9-shell v9-hero__inner">
        <div className="v9-hero__copy">
          <p className="v9-hero__name">{V9_HERO.name}</p>
          <h1 className="v9-h1" data-mask="hero">
            {V9_HERO.headline}
          </h1>
          <p className="v9-hero__sub">{V9_HERO.sub}</p>
          <div className="v9-cta v9-hero__cta">
            <a className="v9-btn v9-btn--primary" href={V9_HERO.mailto}>
              Get in touch
            </a>
            <a className="v9-btn v9-btn--ghost" href="#work">
              View work
            </a>
            <a className="v9-btn v9-btn--quiet" href={V9_HERO.cv} download={V9_HERO.cvFilename}>
              Resume
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
