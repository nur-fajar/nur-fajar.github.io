'use client';

import { V3_NAV } from '@/content/ledger';

/**
 * Nav melayang di tengah atas: huruf kapital kecil berspasi lebar, di dalam
 * kotak bergaris rambut yang menempel ke tepi atas layar.
 *
 * Tautannya anchor dalam halaman, bukan route, jadi ia tidak butuh
 * usePathname dan sebenarnya tidak butuh jadi client component. Direktif
 * 'use client' tetap ada karena penanda section aktif menyusul di langkah
 * motion, dan memindahkannya nanti berarti menyentuh file ini dua kali.
 */
export default function Nav() {
  return (
    <nav className="v3-nav" aria-label="Main">
      {V3_NAV.map((link) => (
        <a className="v3-nav__link" key={link.href} href={link.href}>
          {link.label}
        </a>
      ))}
    </nav>
  );
}
