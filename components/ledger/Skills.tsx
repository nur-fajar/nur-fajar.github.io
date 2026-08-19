import { SKILLS, SKILLS_FOOTNOTE } from '@/content/ledger';
import Reveal from './Reveal';

/**
 * SECTION 6 — Skills, dan ia duduk SETELAH bukti, bukan sebelum. Daftar
 * kompetensi sebelum ada bukti apa pun hanyalah tag soup.
 *
 * Semua grup netral, tanpa aksen warna: Skills bukan tempat untuk menegaskan
 * identitas track, jadi setiap chip mendapat treatment visual yang sama.
 *
 * Yang dihapus dari versi lama: empat nama vendor LLM sebagai empat
 * kompetensi terpisah (membuat daftar terlihat digelembungkan), serta grup
 * "AI & Automation" yang dulu berdiri sejajar dengan grup L&D — sekarang turun
 * jadi satu baris catatan di bawah rule, bukan kategori setara.
 */
export default function Skills() {
  return (
    <section className="section" aria-labelledby="skills-title">
      <div className="shell">
        <Reveal>
          <p className="kicker">Skills</p>
          <h2 className="section-title" id="skills-title">
            What I can be handed on day one.
          </h2>
        </Reveal>

        <div className="skills">
          {SKILLS.map((group, index) => (
            <Reveal key={group.label} delay={index * 0.05} className="skills__group">
              <h3 className="skills__label mono">{group.label}</h3>
              <ul className="skills__chips">
                {group.items.map((item) => (
                  <li key={item} className="skills__chip">
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <hr className="rule skills__divider" />
          <p className="footnote">{SKILLS_FOOTNOTE}</p>
        </Reveal>
      </div>
    </section>
  );
}
