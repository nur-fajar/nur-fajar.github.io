import Image from 'next/image';
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import { BACKGROUND } from '@/content/ledger';
import Reveal from './Reveal';

/**
 * Latar belakang, sebagai bento riwayat alih-alih paragraf.
 *
 * Dua hal berubah, dan keduanya menurunkan bobotnya dengan sengaja.
 *
 * Yang pertama, posisinya. Section ini turun dari posisi kedua ke posisi
 * keenam. Di urutan lama, pembaca menghabiskan perhatian pertamanya di
 * kuliah dan organisasi kampus sebelum sempat melihat satu pun artefak yang
 * bisa dibuka. Urutan baru memutar itu: apa yang bisa kamu buka sendiri
 * lebih dulu, dari mana asalnya belakangan.
 *
 * Yang kedua, jumlahnya. Enam kartu untuk seseorang dengan empat tahun
 * pengalaman profesional adalah terlalu banyak: bagian paling tidak penting
 * di halaman memakan ruang paling banyak. Tiga kartu sekarang mengelompokkan
 * babak yang memang satu jenis, dan tidak satu fakta pun hilang; yang hilang
 * cuma pengulangannya.
 *
 * Judulnya juga turun nada. "Where this started." adalah heading paling
 * puitis di situs untuk konten paling tidak penting, dan itu janji yang tidak
 * ditepati isinya. "Before it was a job." lebih pendek, lebih jujur soal
 * statusnya sebagai latar, dan secara implisit memberi tahu pembaca yang
 * sedang buru-buru bahwa bagian ini boleh dilewati.
 */
export default function About() {
  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="shell">
        <Reveal>
          <h2 className="section-title" id="about-title">
            Before it was a job.
          </h2>
          <p className="section-lede">
            Four years of study, two scholarships, two national programs, and two student
            organizations, before any of it became a job.
          </p>
        </Reveal>

        <ul className="bento">
          {BACKGROUND.map((card, index) => (
            <Reveal as="li" key={card.id} delay={index * 0.05} className="bento__item">
              <article className="bento__card">
                <span className="bento__logos">
                  {card.logos.map((logo) => (
                    <span className="bento__logo" key={logo.src}>
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        /* Ukuran render sebenarnya, bukan 256px yang dulu
                           diminta untuk kotak selebar 84px. Logo institusi
                           adalah gambar paling banyak di halaman ini, dan
                           mengunduh tiga kali lipat piksel yang dipakai
                           membayar bandwidth untuk ketajaman yang tidak
                           pernah terlihat. */
                        width={84}
                        height={30}
                        sizes="84px"
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
                {/* Publikasi JOIV duduk di kartu pendidikan, tempat ia memang
                    terjadi, bukan di daftar kredensial profesional. Ia hasil
                    riset sarjana, dan menaruhnya di antara sertifikasi HR
                    membuat keduanya terbaca sebagai jenis bukti yang sama. */}
                {card.link ? (
                  <a
                    className="bento__link"
                    href={card.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {card.link.label}
                    <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
                  </a>
                ) : null}
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
