import {
  ArrowRight,
  CalendarBlank,
  DownloadSimple,
  EnvelopeSimple,
  HandWaving,
  LinkedinLogo,
} from '@phosphor-icons/react/dist/ssr';
import { CONTACT, LAST_UPDATED, LOOKING_FOR, MAILTO } from '@/content/ledger';
import Reveal from './Reveal';

/**
 * Kontak.
 *
 * Tanpa form. Situs referensi punya satu, tapi form berarti satu lagi hal yang
 * bisa gagal diam-diam (kiriman tidak sampai, dan tidak ada yang tahu), dan
 * dua jalur di bawah ini sudah membawa orang ke tempat yang sama dengan
 * gesekan yang sama rendahnya: kalender yang bisa langsung dipesan, dan email
 * dengan subject serta body sudah terisi.
 */
export default function Contact() {
  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="shell">
        <Reveal>
          <p className="eyebrow" style={{ justifyContent: 'center', width: '100%' }}>
            <HandWaving size={14} weight="fill" aria-hidden="true" />
            Contact
          </p>
          <h2 className="contact__title" id="contact-title">
            Got a team that needs to do something differently?
          </h2>
          <p className="contact__lede">
            Tell me what people should be able to do after the program, and I will tell you
            whether training is even the right answer.
          </p>
        </Reveal>

        <Reveal>
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
          <div className="contact__actions">
            <a
              className="btn btn--primary"
              href={CONTACT.cal}
              target="_blank"
              rel="noopener noreferrer"
            >
              <CalendarBlank size={18} weight="bold" />
              Book 15 min
              <ArrowRight size={16} weight="bold" />
            </a>
            {/* Subject dan body sudah terisi: gesekan menulis email pertama
                turun ke nyaris nol. */}
            <a className="btn" href={MAILTO}>
              <EnvelopeSimple size={18} weight="bold" />
              Email me
            </a>
            <a className="btn" href={CONTACT.cv} download={CONTACT.cvFilename}>
              <DownloadSimple size={18} weight="bold" />
              Download CV
            </a>
          </div>
        </Reveal>

        <Reveal>
          <div className="socials">
            <a
              className="social"
              href={CONTACT.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <LinkedinLogo size={22} weight="fill" />
            </a>
            <a className="social" href={MAILTO} aria-label="Email">
              <EnvelopeSimple size={22} weight="fill" />
            </a>
            <a
              className="social"
              href={CONTACT.cv}
              download={CONTACT.cvFilename}
              aria-label="Download CV"
            >
              <DownloadSimple size={22} weight="fill" />
            </a>
          </div>
        </Reveal>
      </div>

      <footer className="footer" style={{ marginTop: 'var(--s16)' }}>
        <div className="shell">
          <nav className="footer__links" aria-label="Footer">
            <a className="link" href="#about">
              About
            </a>
            <a className="link" href="#experience">
              Experience
            </a>
            <a className="link" href="#work">
              Work
            </a>
            <a
              className="link"
              href={CONTACT.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </nav>
          <p className="footer__colophon">
            Nur Fajar · {CONTACT.location}
            <br />
            Built with Next.js, Framer Motion, and a lot of Claude. Last updated{' '}
            {LAST_UPDATED}.
          </p>
        </div>
      </footer>
    </section>
  );
}
