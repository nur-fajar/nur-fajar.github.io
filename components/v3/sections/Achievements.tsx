import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import { CREDENTIALS, TESTIMONIALS, V3_SECTIONS } from '@/content/ledger';
import { REFERENCES } from '@/content/references';
import Section, { findSection } from '../Section';

/**
 * Tiga jenis bukti pihak ketiga, dipisah karena sifat buktinya berbeda.
 *
 * Sertifikat bisa dibuka dan dicek satu per satu, jadi seluruh barisnya jadi
 * tautan. Testimoni dan referensi tidak bisa diklik, jadi yang menggantikan
 * verifikasi adalah menyebut siapa yang bicara dan dari sudut pandang mana:
 * manajer, praktisi, mentee, rekan tim, rekan lintas organisasi. Lima suara
 * yang saling melengkapi lebih meyakinkan daripada lima yang memuji hal yang
 * sama.
 */
export default function Achievements() {
  const section = findSection(V3_SECTIONS, 'achievements');

  return (
    <Section section={section}>
      <h3 className="v3-subhead">Certificates</h3>
      <ul className="v3-creds">
        {CREDENTIALS.map((credential) => (
          <li key={credential.name}>
            <a className="v3-cred" href={credential.href} target="_blank" rel="noreferrer">
              <span className="v3-cred__name">{credential.name}</span>
              <span className="v3-cred__meta">
                {credential.issuer}
                {credential.year ? ` · ${credential.year}` : ''}
                <ArrowUpRight size={13} weight="bold" aria-hidden="true" />
              </span>
            </a>
          </li>
        ))}
      </ul>

      <h3 className="v3-subhead">In their words</h3>
      <ul className="v3-quotes">
        {TESTIMONIALS.map((item) => (
          <li className="v3-card v3-quote" key={item.name}>
            <blockquote className="v3-quote__text">{item.quote}</blockquote>
            <p className="v3-quote__who">
              {item.name}
              <span className="v3-quote__role">
                {item.relation} <span aria-hidden="true">·</span> {item.role}
              </span>
            </p>
          </li>
        ))}
      </ul>

      <h3 className="v3-subhead">References</h3>
      <ul className="v3-quotes v3-quotes--two">
        {REFERENCES.map((reference) => (
          <li className="v3-card v3-quote" key={reference.name}>
            <p className="v3-kind">{reference.tag}</p>
            <blockquote className="v3-quote__text">{reference.quote}</blockquote>
            <p className="v3-quote__who">
              {reference.name}
              <span className="v3-quote__role">{reference.role}</span>
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
