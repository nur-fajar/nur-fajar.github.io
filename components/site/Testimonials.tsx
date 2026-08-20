import { Quotes } from '@phosphor-icons/react/dist/ssr';
import { CONTACT, TESTIMONIALS } from '@/content/ledger';
import Reveal from './Reveal';

/**
 * Referensi.
 *
 * Judulnya dulu "What the people who managed me said", padahal hanya satu
 * dari tiga yang manajernya. Yang salah bukan cuma judulnya: komposisinya
 * juga mengulang, karena dua dari tiga adalah mentee. Keduanya diperbaiki
 * sekaligus, dan hasilnya lebih kuat daripada sebelumnya. Tiga sudut pandang
 * berbeda (atasan, orang yang dibimbing, rekan setim) membiarkan pembaca
 * memeriksa klaim yang sama dari tiga arah; tiga suara yang mengaku sama cuma
 * mengulanginya tiga kali.
 *
 * Label hubungan di bawah tiap nama bukan sopan-santun, itu yang membuat
 * ketiganya terbaca sebagai tiga arah. Tanpa label, pembaca melihat tiga
 * orang memuji dan tidak punya cara tahu dari mana masing-masing melihat.
 */
export default function Testimonials() {
  return (
    <section className="section" id="references" aria-labelledby="refs-title">
      <div className="shell">
        <Reveal>
          {/* Judul terpanjang di halaman yang isinya satu daftar, dan daftar
              yang pecah di tengah ("From a manager, a" / "mentee, and a
              peer.") berhenti terbaca sebagai daftar. Modifier di bawah
              melonggarkan batas 20ch milik .section-title supaya ketiganya
              berdiri sebaris di desktop. */}
          {/* Di ponsel judul ini pecah jadi "From a manager, a / mentee, and
              a peer.", menggantung kata sandang sendirian di ujung baris.
              Pecah per orang: tiga baris untuk tiga sudut pandang, jadi
              bentuk judulnya mengulang isinya. */}
          <h2 className="section-title section-title--wide" id="refs-title">
            From a manager,
            <br className="br-md" />{' '}
            a mentee,
            <br className="br-md" />{' '}
            and a peer.
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
                  <span className="quote__relation">{testimonial.relation}</span>
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
