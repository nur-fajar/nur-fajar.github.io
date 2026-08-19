'use client';

import Image from 'next/image';
import { INSTITUTIONS } from '@/content/ledger';

/**
 * Marquee logo institusi.
 *
 * Ini SATU-SATUNYA marquee di seluruh situs, dan itu disengaja: aturan P4
 * mengizinkan marquee untuk logo, tidak pernah untuk data. Versi lama situs
 * memakai marquee untuk angka pencapaian , angka yang bergerak tidak bisa
 * dibaca sekilas dan tidak bisa di-screenshot, dua hal yang justru dilakukan
 * hiring manager.
 *
 * Set kedua adalah klon murni untuk menutup jahitan animasi, jadi ia
 * aria-hidden dan tidak bisa di-tab , screen reader dan keyboard hanya
 * bertemu satu daftar.
 */
/* width/height di bawah adalah ukuran KOTAKNYA (lihat .marquee__logo), bukan
   rasio asli tiap file. Itu disengaja , kotaknya memang seragam dan
   `object-fit: contain` yang mengurus rasio masing-masing logo di dalamnya.
   Keduanya harus tetap sama persis dengan CSS-nya: kalau meleset, Next
   menyimpulkan CSS mengubah satu dimensi saja dan memperingatkan soal rasio
   yang rusak di setiap page load. */
export default function LogoMarquee() {
  return (
    <div className="marquee" role="group" aria-label="Institutions">
      <div className="marquee__track">
        <ul className="marquee__set">
          {INSTITUTIONS.map((institution) => (
            <li key={institution.name} className="marquee__card">
              <Image
                src={institution.src}
                alt={institution.name}
                width={120}
                height={52}
                className="marquee__logo"
                style={institution.scale ? { scale: String(institution.scale) } : undefined}
                loading="lazy"
              />
            </li>
          ))}
        </ul>
        <ul className="marquee__set" aria-hidden="true">
          {INSTITUTIONS.map((institution) => (
            <li key={`clone-${institution.name}`} className="marquee__card" tabIndex={-1}>
              <Image
                src={institution.src}
                alt=""
                width={120}
                height={52}
                className="marquee__logo"
                style={institution.scale ? { scale: String(institution.scale) } : undefined}
                loading="lazy"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
