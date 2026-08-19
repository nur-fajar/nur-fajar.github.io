import { BUILT } from '@/content/ledger';
import Reveal from './Reveal';

/**
 * SECTION 2 — What I built. Section paling mahal di situs, jadi isinya 100%
 * L&D/kurikulum.
 *
 * Satu daftar ledger vertikal, bukan dua kolom: situs ini tidak lagi
 * mempresentasikan dua identitas berdampingan, jadi tidak ada struktur
 * dua-kolom yang perlu di-collapse di layar sempit. Urutan kartunya
 * mencerminkan bobot — kurikulum > Train the Trainers > dashboard > marketing.
 *
 * Proyek 9-agent CRM sengaja tidak muncul di sini sama sekali. Ia punya
 * tempatnya sendiri sebagai satu baris kredensial di Proof.
 */
export default function WhatIBuilt() {
  return (
    <section className="section" id="work" aria-labelledby="work-title">
      <div className="shell">
        <Reveal>
          <p className="kicker">What I built</p>
          <h2 className="section-title" id="work-title">
            Programs, curriculum, and the people who now run them without me.
          </h2>
        </Reveal>

        <ol className="built">
          {BUILT.map((card, index) => (
            <Reveal
              key={card.id}
              as="li"
              /* Stagger kecil per kartu: reveal berurutan menegaskan urutan
                 baca, yang di section ini memang bermakna. */
              delay={index * 0.05}
              className={card.lead ? 'built__item built__item--lead' : 'built__item'}
            >
              <article className={card.compact ? 'ledger-card ledger-card--compact' : 'ledger-card'}>
                <h3 className="built__title">{card.title}</h3>
                <p className="built__body">{card.body}</p>
                <ul className="metrics">
                  {card.metrics.map((metric) => (
                    <li key={metric}>{metric}</li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
