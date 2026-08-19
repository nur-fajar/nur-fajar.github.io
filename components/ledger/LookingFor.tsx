import { CONTACT, LOOKING_FOR, MAILTO } from '@/content/ledger';
import Reveal from './Reveal';

/**
 * SECTION 8 — What I'm looking for + CTA.
 *
 * Baris `Not looking` adalah aturan kecil yang bekerja keras: ia membuktikan
 * kandidat ini punya arah, dan sekaligus menutup salah baca yang mungkin
 * muncul dari baris kredensial AI di Proof/Skills ("jadi dia sebenarnya mau
 * pindah ke engineering?").
 *
 * Dibuang dari versi lama: "See me as your last puzzle piece, or the diamond
 * that grows your company" — dua metafora bertumpuk dengan framing memohon.
 */
export default function LookingFor() {
  return (
    <section className="section" aria-labelledby="looking-title">
      <div className="shell">
        <Reveal>
          <p className="kicker">What I&rsquo;m looking for</p>
          <h2 className="section-title section-title--wide" id="looking-title">
            Most teams don&rsquo;t need another trainer. They need one person who can design
            it, run it, measure it — and hand it over.
          </h2>
        </Reveal>

        <Reveal>
          {/* Label mono di kiri, isi di kanan — bahasa baris ledger yang sama
              dengan Experience, dipakai ulang di sini karena isinya juga
              pasangan field/value. */}
          <dl className="lookup">
            {LOOKING_FOR.map(([label, value]) => (
              <div className="lookup__row" key={label}>
                <dt className="lookup__label">{label}</dt>
                <dd className="lookup__value">{value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal>
          <div className="looking__actions">
            <a
              className="btn btn--primary"
              href={CONTACT.cal}
              target="_blank"
              rel="noopener noreferrer"
            >
              Book 15 min
              <span aria-hidden="true">→</span>
            </a>
            {/* Subject dan body sudah terisi — gesekan menulis email pertama
                turun ke nyaris nol. */}
            <a className="btn" href={MAILTO}>
              Email me
            </a>
            <a className="btn" href={CONTACT.cv} download={CONTACT.cvFilename}>
              Download CV (PDF)
            </a>
          </div>

          <p className="looking__note">
            Fastest way to a real conversation: 15 minutes on a call, or an email telling me
            what your team is trying to get people to do differently.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
