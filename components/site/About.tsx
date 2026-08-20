import Image from 'next/image';
import { BACKGROUND, CREDENTIALS } from '@/content/ledger';
import Reveal from './Reveal';

/**
 * About, disusun sebagai bento riwayat alih-alih paragraf.
 *
 * Enam kartu berukuran sama untuk enam babak: tempat kuliah, dua beasiswa yang
 * berbagi satu kartu, dua program kementerian, dua organisasi kampus.
 * Masing-masing membawa logonya sendiri, jadi pembaca yang mengenali salah
 * satunya langsung punya pijakan, dan yang tidak mengenalinya tetap dapat satu
 * baris konteks.
 *
 * Angka-angka yang dulu duduk di sini pindah ke bawah hero (lihat Stats.tsx),
 * di mana ia lebih berguna: itu hal pertama yang dicari orang setelah membaca
 * klaim di headline.
 */
export default function About() {
  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">About</p>
          <h2 className="section-title" id="about-title">
            Where this started.
          </h2>
          <p className="section-lede">
            Four years of study, two scholarships, two national programs, and two student
            organisations, before any of it became a job.
          </p>
        </Reveal>

        <ul className="bento">
          {BACKGROUND.map((card, index) => (
            <Reveal as="li" key={card.id} delay={index * 0.04} className="bento__item">
              <article className="bento__card">
                <span className="bento__logos">
                  {card.logos.map((logo) => (
                    <span className="bento__logo" key={logo.src}>
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        width={84}
                        height={30}
                        className="bento__img"
                        style={logo.scale ? { scale: String(logo.scale) } : undefined}
                        loading="lazy"
                      />
                    </span>
                  ))}
                </span>
                <p className="bento__kicker">{card.kicker}</p>
                <h3 className="bento__name">{card.name}</h3>
                <p className="bento__body">{card.body}</p>
              </article>
            </Reveal>
          ))}
        </ul>

        <Reveal>
          <div className="toolkit toolkit--tight">
            <h3 className="toolkit__label">Credentials</h3>
            <ul className="toolkit__chips">
              {CREDENTIALS.map((credential) => (
                <li className="chip chip--quiet" key={credential}>
                  {credential}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
