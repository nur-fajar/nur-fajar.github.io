import { ArrowRight, ArrowUpRight, EnvelopeSimple, LinkedinLogo } from '@phosphor-icons/react/dist/ssr';
import { CONTACT, HERO } from '@/content/ledger';

/**
 * Hero: nama seukuran layar, klaimnya di kolom kanan.
 *
 * Nama dipecah dua baris dengan baris kedua miring, bentuk yang dipakai
 * seluruh judul di halaman ini. Asterisk birunya menempel di ujung baris
 * pertama.
 *
 * Kolom kanan membawa DUA hal, bukan satu. HERO.sub adalah kalimat yang
 * membuat pembaca berhenti, jadi ia yang besar; HERO.support membawa nama
 * peran dan angkanya, jadi ia yang kecil di bawahnya. Menukar keduanya
 * membuat hero berbunyi seperti ringkasan CV alih-alih seperti tawaran.
 */
export default function Hero() {
  return (
    <section className="v3-hero" aria-labelledby="v3-hero-name">
      <span className="v3-mark" aria-hidden="true">
        NF
      </span>

      {/* Tiga keraguan logistik dijawab sebelum pembaca sempat menggulir. */}
      <p className="v3-status">{HERO.meta[0]}</p>

      <div className="v3-shell">
        <div className="v3-hero__grid">
          <h1 className="v3-display v3-hero__name" id="v3-hero-name">
            <span>Nur</span>
            <span>
              <em>Fajar</em>
              <span className="v3-hero__star" aria-hidden="true">
                *
              </span>
            </span>
          </h1>

          <div>
            <p className="v3-hero__claim">{HERO.sub.join(' ')}</p>
            <p className="v3-hero__support">{HERO.support}</p>

            <div className="v3-hero__actions">
              <a className="v3-btn" href="#work">
                See my work
                <span className="v3-btn__go" aria-hidden="true">
                  <ArrowRight size={16} weight="bold" />
                </span>
              </a>

              <a className="v3-link-caps" href={CONTACT.cv}>
                Resume
                <ArrowUpRight size={12} weight="bold" aria-hidden="true" />
              </a>
            </div>

            <div className="v3-hero__socials">
              <a href={CONTACT.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <LinkedinLogo size={20} weight="fill" />
              </a>
              <a href={`mailto:${CONTACT.email}`} aria-label="Email">
                <EnvelopeSimple size={20} weight="fill" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
