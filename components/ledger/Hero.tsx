import type { CSSProperties } from 'react';
import { CONTACT, END_TO_END_PHASES, HERO_STATS } from '@/content/ledger';

/**
 * Hero, semua pertanyaan screening dijawab tanpa scroll: siapa, peran apa,
 * cari apa, bukti utama, di mana, dan bagaimana menghubungi.
 *
 * Section ini sengaja TIDAK memakai Framer Motion, dan itu keputusan yang
 * dipikirkan, bukan kelalaian. Framer Motion membakar state `initial`-nya ke
 * HTML yang dirender server, artinya setiap elemen terkirim sebagai
 * `opacity: 0` dan baru terlihat setelah bundle JS diunduh, di-parse, dan
 * hydration selesai. Untuk section di bawah fold itu tidak masalah, pembaca
 * belum sampai ke sana. Untuk fold pertama, itu berarti hiring manager di
 * koneksi lambat menatap halaman kosong di detik-detik yang paling menentukan,
 * dan fold pertama adalah satu-satunya bagian situs yang dijamin dilihat semua
 * orang.
 *
 * Entrance-nya karena itu dijalankan CSS: ia mulai di paint pertama, tidak
 * menunggu JS apa pun, dan tetap benar kalau bundle-nya gagal dimuat sama
 * sekali. Stagger-nya lewat --rise-i (lihat .hero__rise di sections.css).
 * Framer Motion tetap mengerjakan seluruh reveal-on-scroll di bawah fold, di
 * mana biayanya tidak jatuh di jalur kritis.
 *
 * Lede dengan sengaja HANYA mengklaim "end to end" untuk tahun sebagai L&D
 * Specialist (2025-2026). Dua peran sebelumnya (mentoring di Bangkit, training
 * di Terra AI) tidak disebut di sini sama sekali, supaya tidak ada satu
 * kalimat pun yang bisa dibaca seolah 3 tahun/300+ learner semuanya dikelola
 * end to end oleh Fajar sendirian. Sejarah lengkapnya ada di Experience,
 * dengan jabatan dan tanggal eksplisit.
 *
 * Dua hal lain yang sengaja tidak ada:
 *   1. Kata "Scroll". Affordance scroll paling universal adalah konten yang
 *      terpotong, jadi section berikutnya dibiarkan mengintip di bawah fold.
 *   2. Angka apa pun dari proyek AI. Keempat sel stat adalah metrik
 *      L&D/kurikulum murni, kesan pertama harus 100% menjawab peran yang
 *      dilamar, bukan memancing "jadi dia mau kerja apa?".
 */
export default function Hero() {
  // Urutan masuknya elemen = urutan bacanya. Indeks dipakai CSS sebagai
  // pengali animation-delay.
  const rise = (index: number) => ({ '--rise-i': index }) as CSSProperties;

  return (
    <section className="hero" id="top">
      <div className="shell">
        <p className="kicker hero__kicker hero__rise" style={rise(0)}>
          L&amp;D Specialist · Instructional Design · Curriculum Development
        </p>

        <h1 className="hero__title hero__rise" style={rise(1)}>
          I run the whole cycle.<br />
          Not just the training day.
        </h1>

        <p className="hero__lede hero__rise" style={rise(2)}>
          As L&D Specialist, I own programs the whole way: {END_TO_END_PHASES}. This past
          year, that meant 5 programs and 4 curriculum modules I built from scratch.
        </p>

        {/* Stat strip: empat sel dipisah rule vertikal hairline, bahasa ledger.
            Angkanya STATIS. Angka yang bergerak tidak bisa dibaca sekilas dan
            tidak bisa di-screenshot, dan hiring manager melakukan keduanya. */}
        <dl className="statstrip hero__rise" style={rise(3)}>
          {HERO_STATS.map((stat) => (
            <div key={stat.label} className="statstrip__cell">
              {/* Istilahnya dibaca screen reader, definisinya dilihat mata,
                  keduanya membawa isi yang sama, jadi label visualnya
                  aria-hidden supaya tidak diumumkan dua kali. */}
              <dt className="sr-only">{stat.label}</dt>
              <dd className="statstrip__cellbody">
                <span className="statstrip__value">{stat.value}</span>
                <span className="statstrip__label" aria-hidden="true">
                  {stat.label}
                </span>
                <span className="statstrip__method">{stat.method}</span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="hero__actions hero__rise" style={rise(4)}>
          <a
            className="btn btn--primary"
            href={CONTACT.cal}
            target="_blank"
            rel="noopener noreferrer"
          >
            Book 15 min
            <span aria-hidden="true">→</span>
          </a>
          <a className="btn" href={CONTACT.cv} download={CONTACT.cvFilename}>
            Download CV (PDF)
          </a>
        </div>

        <p className="hero__meta hero__rise" style={rise(5)}>
          {CONTACT.location} ({CONTACT.timezone}) · Open to work · Full-time, remote or
          hybrid
        </p>
      </div>
    </section>
  );
}
