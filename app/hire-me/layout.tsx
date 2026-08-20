import { Fraunces, IBM_Plex_Mono, Public_Sans, Space_Grotesk } from 'next/font/google';

/**
 * Layout khusus /hire-me.
 *
 * Halaman ini memakai design system lamanya sendiri (app/story.css +
 * app/hire-me/hire-me.css), yang bergantung pada empat keluarga huruf yang
 * TIDAK dipakai situs utama. Dulu keempatnya dideklarasikan di root layout,
 * sehingga setiap pengunjung homepage ikut mengunduh Fraunces dan kawan-kawan
 * untuk halaman yang mungkin tidak pernah mereka buka.
 *
 * Dipindah ke sini, variabelnya hanya hidup di dalam pohon /hire-me. Homepage
 * kembali ke dua keluarga saja, dan halaman ini tetap tampil persis seperti
 * sebelumnya.
 */

const publicSans = Public_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-public-sans',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-mono',
  display: 'swap',
});

/* `weight` Fraunces sengaja tidak didaftar: ia variable font, dan menyebut
   weight satu per satu gagal di-resolve Turbopack saat build. */
const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const storySans = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-story-sans',
  display: 'swap',
});

export default function HireMeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${publicSans.variable} ${plexMono.variable} ${fraunces.variable} ${storySans.variable}`}
    >
      {children}
    </div>
  );
}
