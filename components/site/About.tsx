import Image from 'next/image';
import { BookOpen, Stack, Star, Users } from '@phosphor-icons/react/dist/ssr';
import { BACKGROUND, CREDENTIALS, PROOF } from '@/content/ledger';
import Reveal from './Reveal';

const STAT_ICONS = [Users, Stack, BookOpen, Star];

/**
 * About, disusun sebagai bento riwayat alih-alih paragraf.
 *
 * Tujuh kartu untuk tujuh institusi: tempat kuliah, dua beasiswa, dua program
 * kementerian, dua organisasi kampus. Masing-masing membawa logonya sendiri,
 * jadi pembaca yang mengenali salah satunya langsung punya pijakan, dan yang
 * tidak mengenalinya tetap dapat satu baris konteks.
 *
 * Empat stat tile di atasnya adalah tempat paling berisiko di seluruh situs
 * untuk kebohongan tidak sengaja: empat angka besar berjajar terbaca sebagai
 * satu populasi yang sama kecuali dikatakan sebaliknya. Karena itu setiap tile
 * membawa baris metodenya sendiri, dan baris itu bukan hiasan. "300+" berlaku
 * lintas tiga peran sejak 2023; "5" dan "4" hanya berlaku untuk satu tahun
 * sebagai L&D Specialist. Menghapusnya demi kerapian visual akan mengembalikan
 * persis kesalahan yang seluruh revisi ini dibuat untuk memperbaiki.
 */
export default function About() {
  const stats = PROOF.slice(0, 4);

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

        <ul className="bento">
          {BACKGROUND.map((card, index) => (
            <Reveal
              as="li"
              key={card.id}
              delay={index * 0.04}
              className={`bento__item bento__item--${card.span}`}
            >
              <article className="bento__card">
                <span className="bento__logo">
                  <Image
                    src={card.logo}
                    alt=""
                    width={96}
                    height={36}
                    className="bento__img"
                    style={card.scale ? { scale: String(card.scale) } : undefined}
                    loading="lazy"
                  />
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
