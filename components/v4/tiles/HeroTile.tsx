'use client';

import { useReducedMotion } from 'framer-motion';
import { useGreeting } from '@/components/greeting';
import { HERO } from '@/content/ledger';

/**
 * Ubin pembuka v4.
 *
 * Ini perubahan berdampak terbesar di seluruh v4, dan hampir semuanya cuma
 * soal apa yang dirender, bukan soal kulit.
 *
 * Di /v3, ubin terbesar di layar pertama (6 dari 12 kolom) dipakai untuk
 * menyapa dalam tiga belas bahasa. Pengunjung melihat sebuah sapaan, sebuah
 * nama, empat kata kategori, dan logo yang memantul. Tidak ada peran, tidak
 * ada angka, tidak ada posisi. Sementara itu kalimat terkuat yang pernah
 * ditulis untuk situs ini sudah duduk di content/ledger.ts, sudah lolos
 * tujuh belas tes, dan tidak dirender di route mana pun:
 *
 *   "I run the whole cycle. Not just the training day."
 *   "Tell me what people should be able to do after the program.
 *    I'll tell you whether training is even the right answer."
 *
 * Kalimat kedua itu menawarkan penilaian, bukan jasa, dan menyiratkan
 * kesediaan bilang "training bukan jawabannya" kepada orang yang sedang mau
 * membeli training. Itu satu-satunya kalimat di situs ini yang langsung
 * bekerja untuk pembaca yang datang sebagai calon klien.
 *
 * Sapaan tiga belas bahasanya TIDAK dibuang. Ia turun satu register jadi
 * baris kecil di atas headline. Ia tetap ramah, ia berhenti jadi headline.
 *
 * Headline-nya <h1>, dan itu memperbaiki cacat yang terbawa sejak v3:
 * halaman lama sama sekali tidak punya <h1>. Ubin bento cuma
 * <section aria-label> dengan <p aria-label> di dalamnya, dan ketujuh judul
 * section semuanya <h2>, jadi dokumennya menggantung tanpa akar.
 */
export default function HeroTile() {
  const reduced = useReducedMotion();
  const { text, started } = useGreeting(!reduced);

  return (
    <div className="v4-hero">
      {/* Sapaan dianggap dekorasi oleh pembaca layar: ia aria-hidden, dan
          kalimat yang dibacakan adalah headline di bawahnya. Tiga belas
          sapaan yang diketik huruf per huruf bukan informasi. */}
      <p className="v4-hero__greet" aria-hidden="true">
        {text}
        {started && !reduced ? <span className="v4-hero__caret" /> : null}
      </p>

      {/* Empat potongan, bukan dua, dan itu sudah jadi keputusan di ledger:
          titik pecah barisnya ditentukan di data supaya tidak diserahkan ke
          browser. Di layar sempit browser memecahnya di tengah frasa
          ("I run the / whole cycle.") dan menggantung kata sandang di ujung
          baris. Keempat potongan di bawah memecahnya di batas frasa.

          Tiap potongan satu blok, di setiap lebar. Empat baris tipe display
          dengan line-height 0.92 membaca sebagai satu bidang padat, dan itu
          memang bentuk yang dicari arah editorial ini. */}
      <h1 className="v4-hero__title">
        <span>{HERO.titleLead}</span>
        {/* Satu-satunya bagian yang dimiringkan: ini klaimnya. Miring, bukan
            berwarna, karena kuning tidak boleh membawa huruf dan merah
            sudah dipakai sebagai satu tusukan di tempat lain. */}
        <em>{HERO.titleAccent}</em>
        <span>{HERO.titleRestLead}</span>
        <span>{HERO.titleRestTail}</span>
      </h1>

      <p className="v4-hero__sub">
        {HERO.sub.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </p>

      {/* Tiga keraguan logistik dihapus dalam satu baris kecil. Ia di dasar
          ubin karena memang informasi terakhir yang dibutuhkan, bukan yang
          pertama. */}
      <ul className="v4-hero__meta">
        {HERO.meta.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
