import { PATH_PARAGRAPHS } from '@/content/ledger';
import LogoMarquee from './LogoMarquee';
import Reveal from './Reveal';

/**
 * SECTION 7 — Path. Turun dari posisi #2 ke #7.
 *
 * Prestasi kampus adalah konten prioritas terendah bagi pembaca yang sedang
 * memutuskan apakah akan mengundang seseorang wawancara, jadi ia tidak boleh
 * menempati ruang termahal di situs. Empat langkah scroll di versi lama
 * dipadatkan jadi dua paragraf.
 *
 * Logo strip institusi pindah ke sini dari hero, di mana ia dulu mengambil
 * perhatian dari stat.
 */
export default function Path() {
  return (
    <section className="section section--sunk" id="about" aria-labelledby="path-title">
      <div className="shell">
        <Reveal>
          <p className="kicker">Path</p>
          <h2 className="section-title" id="path-title">
            Where this started.
          </h2>

          <div className="path__prose">
            {PATH_PARAGRAPHS.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
        </Reveal>
      </div>

      <Reveal>
        <LogoMarquee />
      </Reveal>
    </section>
  );
}
