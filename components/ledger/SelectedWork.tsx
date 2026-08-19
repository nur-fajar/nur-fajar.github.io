import { WORK } from '@/content/ledger';
import Reveal from './Reveal';

/**
 * SECTION 3 — Selected work. Sebelumnya nol artefak, di situs yang menyasar
 * peran instructional design — padahal sample kerja adalah aset screening
 * standar untuk peran itu.
 *
 * Tiga dari empat kartu menautkan ke course yang live dan publik: hiring
 * manager bisa membuka materinya sendiri, bukan cuma percaya ringkasan.
 * Kartu keempat tidak punya tautan publik (data peserta privat) dan
 * mengatakannya terus terang, bukan berpura-pura punya.
 */
export default function SelectedWork() {
  return (
    <section className="section section--sunk" aria-labelledby="selected-title">
      <div className="shell">
        <Reveal>
          <p className="kicker">Selected work</p>
          <h2 className="section-title" id="selected-title">
            Things you can actually open.
          </h2>
          <p className="section-lede">Live courses, not descriptions of courses.</p>
        </Reveal>

        <ul className="worklist">
          {WORK.map((card, index) => {
            const body = (
              <>
                <p className="worklist__kind">{card.kind}</p>
                <h3 className="worklist__title">{card.title}</h3>
                <p className="worklist__body">{card.body}</p>
                {card.note ? <p className="worklist__note">{card.note}</p> : null}
                {card.href ? (
                  <span className="worklist__cta" aria-hidden="true">
                    Open the course →
                  </span>
                ) : null}
              </>
            );

            return (
              <Reveal as="li" key={card.id} delay={index * 0.05} className="worklist__item">
                {card.href ? (
                  <a
                    className="worklist__card worklist__card--link"
                    href={card.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {body}
                  </a>
                ) : (
                  <div className="worklist__card">{body}</div>
                )}
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
