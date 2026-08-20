import { Quotes } from '@phosphor-icons/react/dist/ssr';
import { CONTACT, TESTIMONIALS } from '@/content/ledger';
import Reveal from './Reveal';

/**
 * Testimoni.
 *
 * Tiga saja, dan tidak satu pun mengutip angka rating. Percobaan sebelumnya
 * memakai kutipan "9.8 out of 10" lalu perlu caption penjelas supaya tidak
 * terbaca bentrok dengan 9.0/10 di About. Caption yang tugasnya menjelaskan
 * kontradiksi justru menanam keraguan yang ingin dicegahnya, jadi kutipannya
 * yang diganti, bukan captionnya yang ditambah.
 */
export default function Testimonials() {
  return (
    <section className="section" aria-labelledby="refs-title">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">References</p>
          <h2 className="section-title" id="refs-title">
            What the people who managed me said.
          </h2>
        </Reveal>

        <div className="quotes">
          {TESTIMONIALS.map((testimonial, index) => (
            <Reveal key={testimonial.name} delay={index * 0.05}>
              <figure className="quote">
                <span className="quote__mark" aria-hidden="true">
                  <Quotes size={26} weight="fill" />
                </span>
                <blockquote className="quote__body">
                  <p>{testimonial.quote}</p>
                </blockquote>
                <figcaption className="quote__by">
                  <span className="quote__name">{testimonial.name}</span>
                  <span className="quote__role">{testimonial.role}</span>
                </figcaption>
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
              All 11 recommendations on LinkedIn
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
