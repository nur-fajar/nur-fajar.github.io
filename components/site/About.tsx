import {
  ArrowsClockwise,
  HandArrowUp,
  ChartLineUp,
  Compass,
  Users,
  Stack,
  BookOpen,
  Star,
} from '@phosphor-icons/react/dist/ssr';
import {
  CREDENTIALS,
  MISSION_QUOTE,
  PRINCIPLES,
  PROOF,
  SKILLS,
  SKILLS_FOOTNOTE,
  TECHNICAL_FOOTNOTE,
} from '@/content/ledger';
import Reveal from './Reveal';

const PRINCIPLE_ICONS = [ArrowsClockwise, HandArrowUp, ChartLineUp, Compass];
const STAT_ICONS = [Users, Stack, BookOpen, Star];

/**
 * About: siapa ini, kenapa percaya, dan apa yang bisa diserahkan hari pertama.
 *
 * Empat stat tile di sini adalah tempat paling berisiko di seluruh situs untuk
 * kebohongan tidak sengaja: empat angka besar berjajar terbaca sebagai satu
 * populasi yang sama kecuali dikatakan sebaliknya. Karena itu setiap tile
 * membawa baris metodenya sendiri, dan baris itu bukan hiasan. "300+" berlaku
 * lintas tiga peran sejak 2023; "5" dan "4" hanya berlaku untuk satu tahun
 * sebagai L&D Specialist. Menghapus baris metode demi kerapian visual akan
 * mengembalikan persis kesalahan yang seluruh revisi ini dibuat untuk
 * memperbaiki.
 */
export default function About() {
  // Empat sel pertama dari PROOF; dua sisanya hidup di kartu Experience.
  const stats = PROOF.slice(0, 4);

  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">About</p>
          <h2 className="section-title" id="about-title">
            The whole cycle, not the highlight reel.
          </h2>
        </Reveal>

        <Reveal>
          <blockquote className="quote-card">
            <p>{MISSION_QUOTE}</p>
          </blockquote>
        </Reveal>

        <div className="principles">
          {PRINCIPLES.map((principle, index) => {
            const Icon = PRINCIPLE_ICONS[index] ?? Compass;
            return (
              <Reveal key={principle.id} delay={index * 0.05} className="principle">
                <div className="principle__head">
                  <span className="principle__icon" aria-hidden="true">
                    <Icon size={20} weight="bold" />
                  </span>
                  <h3 className="principle__title">{principle.title}</h3>
                </div>
                <p className="principle__body">{principle.body}</p>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <dl className="stats">
            {stats.map((cell, index) => {
              const Icon = STAT_ICONS[index] ?? Star;
              return (
                <div className="stat" key={cell.label}>
                  <span className="stat__icon" aria-hidden="true">
                    <Icon size={24} weight="duotone" />
                  </span>
                  {/* Istilah dibaca screen reader, definisi dilihat mata:
                      keduanya membawa isi yang sama, jadi label visual
                      aria-hidden supaya tidak diumumkan dua kali. */}
                  <dt className="sr-only">{cell.label}</dt>
                  <dd style={{ margin: 0 }}>
                    <span className="stat__value">{cell.value}</span>
                    <span className="stat__label" aria-hidden="true">
                      {cell.label}
                    </span>
                    <span className="stat__method">{cell.method}</span>
                  </dd>
                </div>
              );
            })}
          </dl>
        </Reveal>

        <Reveal>
          <div className="toolkit">
            {SKILLS.map((group) => (
              <div className="toolkit__group" key={group.label}>
                <h3 className="toolkit__label">{group.label}</h3>
                <ul className="toolkit__chips">
                  {group.items.map((item) => (
                    <li className="chip" key={item}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="toolkit__group">
              <h3 className="toolkit__label">Credentials</h3>
              <ul className="toolkit__chips">
                {CREDENTIALS.map((credential) => (
                  <li className="chip chip--quiet" key={credential}>
                    {credential}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <p className="footnote">{SKILLS_FOOTNOTE}</p>
          {/* Satu-satunya tempat proyek 9 agent muncul di seluruh situs.
              Tanpa card, tanpa angka besar, tanpa warna aksen: kredensial
              pendukung, bukan pencapaian utama. */}
          <p className="footnote">{TECHNICAL_FOOTNOTE}</p>
        </Reveal>
      </div>
    </section>
  );
}
