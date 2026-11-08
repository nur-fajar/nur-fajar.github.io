import {
  EnvelopeSimpleIcon,
  LinkedinLogoIcon,
} from '@phosphor-icons/react/dist/ssr';
import { V9_FOOTER } from '@/content/v9';

/**
 * Footer v9: wordmark besar di atas lantai perspektif.
 *
 * Polanya diambil dari komponen "retro grid" di 21st.dev (dillionverma,
 * 695 unduhan, featured): lantai garis yang menghadap ke cakrawala, garis
 * mendatar makin rapat ke atas, dan garis vertikal menyatu di titik
 * hilang. Kode di sini ditulis sendiri, tidak diambil dari katalog.
 *
 * Yang dipakai dari polanya: bentuk dan ritmenya. Yang tidak: warna
 * magenta-oranye, karena halaman ini punya satu keluarga kromatik saja
 * (aksen biru) dan grid-nya cukup jadi permukaan, bukan jadi bintang.
 *
 * Geraknya CSS murni (garis digeser, bukan JS), jadi:
 *   - tanpa JavaScript pun gridnya tetap ada;
 *   - `prefers-reduced-motion` menghasilkan satu frame statis, karena blok
 *     reduced-motion di app/v9/v9.css mematikan animasi;
 *   - nilainya dekorasi, jadi `aria-hidden` dan tidak bisa diklik.
 */
export default function Footer() {
  return (
    // Footer ini yang jadi tujuan "Contact": address-nya ada di sini sebagai
    // wordmark besar, jadi band CTA yang terpisah dihapus.
    <footer className="v9-footer" id="contact">
      <div className="v9-footer__grid" aria-hidden="true">
        <div className="v9-footer__gridlines" />
      </div>

      <div className="v9-shell v9-footer__inner">
        <a className="v9-footer__wordmark" href={`mailto:${V9_FOOTER.email}`}>
          {V9_FOOTER.email}
        </a>

        <div className="v9-footer__rows">
          <nav className="v9-footer__links" aria-label="Footer sections">
            <a className="v9-link" href="#work">
              Work
            </a>
            <a className="v9-link" href="#praise">
              Praise
            </a>
            <a className="v9-link" href="#history">
              History
            </a>
          </nav>

          <div className="v9-footer__social">
            <a
              className="v9-icon-btn"
              href={V9_FOOTER.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <LinkedinLogoIcon size={18} weight="bold" aria-hidden="true" />
            </a>
            <a className="v9-icon-btn" href={`mailto:${V9_FOOTER.email}`} aria-label="Email">
              <EnvelopeSimpleIcon size={18} weight="bold" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
