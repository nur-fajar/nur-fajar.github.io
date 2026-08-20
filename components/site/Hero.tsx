import { existsSync } from 'node:fs';
import path from 'node:path';
import type { CSSProperties } from 'react';
import Image from 'next/image';
import { ArrowRight, CalendarBlank } from '@phosphor-icons/react/dist/ssr';
import { CONTACT, HERO } from '@/content/ledger';

/**
 * Hero.
 *
 * Entrance-nya CSS, bukan Framer Motion, dan itu keputusan yang dipikirkan.
 * Framer Motion membakar state `initial` ke HTML yang dirender server, jadi
 * setiap elemen terkirim sebagai opacity:0 dan baru terlihat setelah bundle
 * JS diunduh dan hydration selesai. Untuk section di bawah fold itu tidak
 * masalah. Untuk fold pertama, itu berarti pembaca di koneksi lambat menatap
 * halaman kosong di detik-detik yang paling menentukan.
 *
 * Susunannya menjawab tiga pertanyaan screening dalam urutan munculnya:
 *
 *   baris meta     di mana orangnya, kapan bisa mulai (satu baris, 13px)
 *   headline       klaim terbesar, empat kata, tidak berubah
 *   sub-headline   kalimat terkuat situs, naik dari dasar halaman
 *   baris dukung   angka-angkanya, prioritas visual diturunkan
 *   tombol         dua, bukan tiga
 *   baris bukti    undangan memverifikasi sendiri, menautkan ke #work
 *
 * Baris bukti itu yang mengubah hero dari klaim jadi tawaran: tiga kursusnya
 * benar-benar bisa dibuka orang asing, sekarang juga, tanpa minta izin.
 */

/**
 * Foto fasilitasi, kalau ada.
 *
 * Dicek saat build, bukan di-hardcode, jadi menaruh file-nya di
 * public/hero/ sudah cukup untuk memunculkannya, tanpa menyentuh komponen
 * ini. Kalau file-nya belum ada, hero jatuh ke satu kolom penuh alih-alih
 * menyisakan lubang kosong di kanan atau memajang placeholder abu-abu.
 *
 * Kriteria fotonya, urut dari yang paling kuat: sedang benar-benar
 * memfasilitasi (berdiri di depan layar, grid Zoom sesi Train the Trainers,
 * atau screenshot livestream YouTube). Bukan headshot studio, bukan stok.
 * Kalau tidak ada sama sekali, screenshot antarmuka salah satu kursus di
 * ai4impact lebih baik daripada wajah generik: artefak mengalahkan pose.
 */
const PHOTO_CANDIDATES = [
  '/hero/facilitating.jpg',
  '/hero/facilitating.jpeg',
  '/hero/facilitating.png',
  '/hero/facilitating.webp',
];

function findHeroPhoto(): string | null {
  for (const src of PHOTO_CANDIDATES) {
    if (existsSync(path.join(process.cwd(), 'public', src))) return src;
  }
  return null;
}

export default function Hero() {
  const rise = (index: number) => ({ '--i': index }) as CSSProperties;
  const photo = findHeroPhoto();

  return (
    <section className={photo ? 'hero hero--split' : 'hero'} id="top">
      <div className="shell hero__grid">
        <div className="hero__copy">
          {/* Tiga keraguan logistik, dihapus dalam satu baris kecil sebelum
              pembaca sempat merumuskannya jadi pertanyaan. */}
          <p className="hero__meta rise" style={rise(0)}>
            <span className="hero__meta-live">
              <span className="hero__dot" aria-hidden="true" />
              {HERO.meta[0]}
            </span>
            {HERO.meta.slice(1).map((item) => (
              <span className="hero__meta-item" key={item}>
                {item}
              </span>
            ))}
          </p>

          {/* Dua <br> permanen dan dua yang hanya hidup di bawah 560px.
              Di desktop headline jatuh dua baris seperti yang dirancang; di
              ponsel ia jatuh empat, tapi di batas frasa, bukan di tengahnya:

                I run                 Not just
                the whole cycle.      the training day.

              Yang dicegah adalah pemecahan yang dipilih browser sendiri
              ("I run the / whole cycle."), yang membelah span gradient jadi
              dua warna terpisah dan menggantung kata sandang di ujung baris. */}
          <h1 className="hero__title rise" style={rise(1)}>
            {HERO.titleLead}
            <br className="br-sm" />{' '}
            <span className="grad">{HERO.titleAccent}</span>
            <br />
            {HERO.titleRestLead}
            <br className="br-sm" />{' '}
            {HERO.titleRestTail}
          </h1>

          {/* Kalimat terkuat di seluruh situs. Ia dulu duduk di section
              Contact, di dasar halaman, tempat sebagian besar pembaca tidak
              pernah sampai. */}
          <p className="hero__sub rise" style={rise(2)}>
            {HERO.sub[0]}
            <br />
            {HERO.sub[1]}
          </p>

          {/* Isinya sama dengan lede lama. Yang berubah cuma ukurannya. */}
          <p className="hero__support rise" style={rise(3)}>
            {HERO.support}
          </p>

          <div className="hero__actions rise" style={rise(4)}>
            <a className="btn btn--primary" href="#work">
              Explore my work
              <ArrowRight size={18} weight="bold" aria-hidden="true" />
            </a>
            <a className="btn" href={CONTACT.cal} target="_blank" rel="noopener noreferrer">
              <CalendarBlank size={18} weight="bold" aria-hidden="true" />
              Book 15 min
            </a>
          </div>

          <p className="hero__proof rise" style={rise(5)}>
            <a className="hero__proof-link" href="#work">
              {HERO.proof}
              <ArrowRight size={15} weight="bold" aria-hidden="true" />
            </a>
          </p>
        </div>

        {photo ? (
          <div className="hero__figure rise" style={rise(2)}>
            <div className="hero__photo">
              <Image
                src={photo}
                alt="Nur Fajar facilitating a live training session"
                fill
                sizes="(max-width: 900px) 100vw, 420px"
                className="hero__img"
                priority
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
