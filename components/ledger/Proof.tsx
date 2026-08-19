import { CONTACT, CREDENTIALS, PROOF, TECHNICAL_FOOTNOTE, TESTIMONIALS } from '@/content/ledger';
import Reveal from './Reveal';

/**
 * SECTION 5 — Proof.
 *
 * Setiap sel angka membawa baris metode di bawahnya. "1,250 hours" sendirian
 * adalah klaim; "1,250 hours — 3,000 prospects × 25 min saved each" adalah
 * aritmetika yang bisa dicek pembaca dalam dua detik. Angka yang bisa dihitung
 * ulang pembaca tidak bisa dituduh mengarang.
 *
 * Tidak ada marquee di sini, dan tidak ada count-up. Ini semua data, dan data
 * tidak bergerak (P4).
 */
export default function Proof() {
  return (
    <section className="section section--sunk" id="proof" aria-labelledby="proof-title">
      <div className="shell">
        <Reveal>
          <p className="kicker">Proof</p>
          <h2 className="section-title" id="proof-title">
            Numbers, with how they were counted.
          </h2>
        </Reveal>

        {/* 5a — grid angka statis */}
        <Reveal>
          <dl className="proofgrid">
            {PROOF.map((cell) => (
              <div className="proofgrid__cell" key={cell.label}>
                <dt className="sr-only">{cell.label}</dt>
                <dd className="proofgrid__cellbody">
                  <span className="proofgrid__value">{cell.value}</span>
                  <span className="proofgrid__label" aria-hidden="true">
                    {cell.label}
                  </span>
                  <span className="proofgrid__method">{cell.method}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* 5b — tiga testimoni. Dua testimoni generik dari situs lama dibuang:
            pujian yang bisa ditempel ke siapa pun menurunkan bobot rata-rata
            tiga yang spesifik ini. */}
        <div className="quotes">
          {TESTIMONIALS.map((testimonial, index) => (
            <Reveal key={testimonial.name} delay={index * 0.05} className="quotes__item">
              <figure className="quote">
                <blockquote className="quote__body">
                  <p>“{testimonial.quote}”</p>
                </blockquote>
                <figcaption className="quote__by">
                  <span className="quote__name">{testimonial.name}</span>
                  <span className="quote__role">{testimonial.role}</span>
                </figcaption>
                {/* Menyelesaikan konflik 9.8 vs 9.0 di halaman yang sama, dan
                    sekaligus memperlihatkan bahwa perbedaan instrumen
                    pengukuran memang diperhatikan. */}
                {testimonial.caption ? (
                  <p className="quote__caption">{testimonial.caption}</p>
                ) : null}
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="quotes__more">
            <a
              className="link"
              href={CONTACT.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              All 11 recommendations on LinkedIn →
            </a>
          </p>
        </Reveal>

        {/* 5c — credentials, compact */}
        <Reveal>
          <div className="credentials">
            <h3 className="kicker">Credentials</h3>
            <ul className="credentials__list">
              {CREDENTIALS.map((credential) => (
                <li key={credential} className="credentials__chip">
                  {credential}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* 5d — kredensial teknis pendukung.

            Sengaja dibuat terlihat sekunder: tanpa card, tanpa border, tanpa
            warna aksen, tanpa angka besar mono seperti grid di atas. Kalau
            hiring manager tertarik pada detailnya, itulah gunanya interview —
            situs hanya perlu membuktikan proyek ini ada dan nyata, bukan
            menjualnya. */}
        <Reveal>
          <p className="footnote">{TECHNICAL_FOOTNOTE}</p>
        </Reveal>
      </div>
    </section>
  );
}
