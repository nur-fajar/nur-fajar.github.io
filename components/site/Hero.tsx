import type { CSSProperties } from 'react';
import { ArrowRight, CalendarBlank } from '@phosphor-icons/react/dist/ssr';
import { CONTACT } from '@/content/ledger';

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
 * Headline sengaja pendek (empat kata) supaya muat dua baris pada ukuran
 * display penuh. Klaim yang butuh kualifikasi ("5 program, tahun ini, sebagai
 * L&D Specialist") tinggal di lede, di mana ada ruang untuk menyebut
 * cakupannya dengan jujur.
 */
export default function Hero() {
  const rise = (index: number) => ({ '--i': index }) as CSSProperties;

  return (
    <section className="hero" id="top">
      <div className="shell">
        <p className="hero__badge rise" style={rise(0)}>
          <span className="hero__dot" aria-hidden="true" />
          Open to work
        </p>

        <h1 className="hero__title rise" style={rise(1)}>
          I run <span className="grad">the whole cycle.</span>
          <br />
          Not just the training day.
        </h1>

        <p className="hero__lede rise" style={rise(2)}>
          As L&amp;D Specialist I own programs the whole way:{' '}
          <strong>ideation, design, development, marketing, delivery, and evaluation</strong>.
          This past year that meant <strong>5 programs and 4 curriculum modules</strong> built
          from scratch.
        </p>

        <div className="hero__actions rise" style={rise(3)}>
          <a className="btn btn--primary" href="#work">
            Explore my work
            <ArrowRight size={18} weight="bold" />
          </a>
          <a
            className="btn"
            href={CONTACT.cal}
            target="_blank"
            rel="noopener noreferrer"
          >
            <CalendarBlank size={18} weight="bold" />
            Book 15 min
          </a>
        </div>
      </div>
    </section>
  );
}
