import Image from 'next/image';
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import { BACKGROUND, V3_ROLE_CHIPS, V3_SECTIONS } from '@/content/ledger';
import Section, { findSection } from '../Section';

/**
 * Tiga kartu latar belakang, masing-masing membawa logo lembaganya.
 *
 * Section ini duduk di posisi keenam, bukan kedua, dan itu keputusan yang
 * argumennya sudah ditulis di app/page.tsx: di urutan lama pembaca
 * menghabiskan perhatian pertamanya di riwayat kuliah dan organisasi kampus
 * sebelum sempat melihat satu pun artefak yang bisa dibuka sendiri.
 */
export default function About() {
  const section = findSection(V3_SECTIONS, 'about');

  return (
    <Section section={section}>
      <ul className="v3-chips v3-chips--roles">
        {V3_ROLE_CHIPS.map((chip) => (
          <li key={chip}>{chip}</li>
        ))}
      </ul>

      <ul className="v3-bg">
        {BACKGROUND.map((card) => (
          <li className="v3-card v3-bg__card" key={card.id}>
            <p className="v3-kind">{card.kicker}</p>
            <h3 className="v3-card__title">{card.name}</h3>

            <ul className="v3-bg__logos">
              {card.logos.map((logo) => (
                <li key={logo.src}>
                  {/* Logo lembaga dibuat abu dan baru berwarna saat kartunya
                      di-hover: di atas latar hitam, tujuh logo penuh warna
                      berjajar menarik perhatian lebih besar daripada bobot
                      informasinya. */}
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={72}
                    height={28}
                    style={logo.scale ? { transform: `scale(${logo.scale})` } : undefined}
                  />
                </li>
              ))}
            </ul>

            <p className="v3-card__body">{card.body}</p>

            {card.link ? (
              <a className="v3-bg__link" href={card.link.href} target="_blank" rel="noreferrer">
                {card.link.label}
                <ArrowUpRight size={13} weight="bold" aria-hidden="true" />
              </a>
            ) : null}
          </li>
        ))}
      </ul>
    </Section>
  );
}
