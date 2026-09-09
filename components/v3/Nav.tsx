'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { V3_NAV } from '@/content/ledger';

/**
 * Pil melayang di tengah atas, empat item.
 *
 * Item aktif ditandai lewat aria-current, dan CSS yang mengecatnya membaca
 * atribut itu, bukan kelas terpisah. Satu sumber kebenaran, dan penanda
 * visualnya otomatis ikut terbaca screen reader alih-alih cuma terlihat.
 *
 * Path dibandingkan PERSIS untuk /v3 dan dengan awalan untuk sisanya. Kalau
 * keduanya diperlakukan sama, /v3 akan ikut menyala di setiap halaman
 * anaknya dan pil putihnya jadi dua. Slash penutup dilucuti dulu karena
 * static export menyajikan halaman yang sama di /v3/about/.
 */
export default function Nav() {
  const pathname = (usePathname() ?? '/v3').replace(/\/$/, '') || '/v3';

  return (
    <nav className="v3-nav" aria-label="Main">
      <div className="v3-nav__track">
        {V3_NAV.map((link) => {
          const active =
            link.href === '/v3' ? pathname === '/v3' : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              className="v3-nav__link"
              href={link.href}
              {...(active ? { 'aria-current': 'page' as const } : {})}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
