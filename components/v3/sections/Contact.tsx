import { ArrowRight, CalendarBlank, EnvelopeSimple, LinkedinLogo } from '@phosphor-icons/react/dist/ssr';
import { CONTACT, LAST_UPDATED, LOOKING_FOR, MAILTO, V3_SECTIONS } from '@/content/ledger';
import Magnetic from '../Magnetic';
import Section, { findSection } from '../Section';

/**
 * Tiga baris jawaban screening (baris Roles disembunyikan di sini — datanya
 * tetap di ledger untuk homepage lama dan tes CTA), lalu dua tombol, lalu
 * satu baris yang menurunkan biaya psikologis mengirim email dingin.
 *
 * Daftar kota di baris Setup disembunyikan di balik satu frasa TAPI tidak
 * disembunyikan dari siapa pun: pemicunya tabbable, kotanya muncul saat
 * :focus-visible maupun hover, dan teksnya tetap ada di pohon aksesibilitas
 * sepanjang waktu. Konten yang cuma muncul saat hover tidak pernah sampai ke
 * pengguna ponsel maupun pengguna keyboard. Pola ini disalin dari
 * components/site/Contact.tsx, bukan ditemukan ulang.
 */
export default function Contact() {
  const section = findSection(V3_SECTIONS, 'contact');

  return (
    <Section section={section}>
      <dl className="v3-lookup">
        {LOOKING_FOR.filter((row) => row.label !== 'Roles').map((row) => (
          <div className="v3-lookup__row" key={row.label}>
            <dt className="v3-lookup__label">{row.label}</dt>
            <dd className="v3-lookup__value">
              {row.value}
              {row.reveal ? (
                <>
                  {' · '}
                  <span className="v3-reveal" tabIndex={0}>
                    {row.reveal.label}
                    <span className="v3-reveal__bubble">{row.reveal.items.join(' · ')}</span>
                  </span>
                </>
              ) : null}
              {row.note ? <span className="v3-lookup__hint">{row.note}</span> : null}
            </dd>
          </div>
        ))}
      </dl>

      <div className="v3-contact__actions">
        <Magnetic strength={0.25}>
          <a className="v3-btn" href={CONTACT.cal} target="_blank" rel="noopener noreferrer">
            <CalendarBlank size={17} weight="bold" aria-hidden="true" />
            Book 15 min
            <span className="v3-btn__go" aria-hidden="true">
              <ArrowRight size={16} weight="bold" />
            </span>
          </a>
        </Magnetic>

        {/* Subject dan kerangka body sudah terisi, jadi hiring manager tinggal
            mengetik di belakang titik dua. */}
        <a className="v3-link-caps" href={MAILTO}>
          <EnvelopeSimple size={13} weight="bold" aria-hidden="true" />
          Email me
        </a>

        <a className="v3-link-caps" href={CONTACT.linkedin} target="_blank" rel="noreferrer">
          <LinkedinLogo size={13} weight="bold" aria-hidden="true" />
          LinkedIn
        </a>

        <a className="v3-link-caps" href={CONTACT.cv} download={CONTACT.cvFilename}>
          Download CV
        </a>
      </div>

      <p className="v3-contact__reply">{CONTACT.responseTime}</p>
      <p className="v3-contact__stamp">Last updated {LAST_UPDATED}</p>
    </Section>
  );
}
