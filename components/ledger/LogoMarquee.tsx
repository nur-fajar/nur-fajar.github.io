'use client';

import Image from 'next/image';
import { INSTITUTIONS } from '@/content/ledger';

/**
 * Marquee logo institusi.
 *
 * Ini SATU-SATUNYA marquee di seluruh situs, dan itu disengaja: aturan P4
 * mengizinkan marquee untuk logo, tidak pernah untuk data. Versi lama situs
 * memakai marquee untuk angka pencapaian — angka yang bergerak tidak bisa
 * dibaca sekilas dan tidak bisa di-screenshot, dua hal yang justru dilakukan
 * hiring manager.
 *
 * Set kedua adalah klon murni untuk menutup jahitan animasi, jadi ia
 * aria-hidden dan tidak bisa di-tab — screen reader dan keyboard hanya
 * bertemu satu daftar.
 */
export default function LogoMarquee() {
  return (
    <div className="marquee" role="group" aria-label="Institutions">
      <div className="marquee__track">
        <ul className="marquee__set">
          {INSTITUTIONS.map((institution) => (
            <li key={institution.name}>
              <Image
                src={institution.src}
                alt={institution.name}
                width={112}
                height={40}
                className="marquee__logo"
                loading="lazy"
              />
            </li>
          ))}
        </ul>
        <ul className="marquee__set" aria-hidden="true">
          {INSTITUTIONS.map((institution) => (
            <li key={`clone-${institution.name}`} tabIndex={-1}>
              <Image
                src={institution.src}
                alt=""
                width={112}
                height={40}
                className="marquee__logo"
                loading="lazy"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
