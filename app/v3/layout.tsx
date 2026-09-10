import type { Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import BlueprintLoader from '@/components/v3/BlueprintLoader';
import Nav from '@/components/v3/Nav';
import ScrollProgress from '@/components/v3/ScrollProgress';
import SmoothScroll from '@/components/v3/SmoothScroll';
import './v3.css';

/* Dua keluarga, keduanya di-self-host lewat next/font supaya
   `font-src 'self'` di CSP tetap cukup dan tidak ada request
   render-blocking ke fonts.googleapis.com. */

/* Fraunces dimuat di bobot 300 saja, tegak dan miring. Bobotnya yang
   menentukan karakter halaman ini: serif kontras tinggi yang tipis di ukuran
   display terbaca editorial, dan huruf yang sama di bobot tebal terbaca
   seperti kepala koran. Italic-nya italic sungguhan, bukan miring bikinan
   browser, dan di ukuran hero bedanya kelihatan jelas. */
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300'],
  style: ['normal', 'italic'],
  variable: '--font-v3-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-v3-body',
  display: 'swap',
});

/* viewport-fit=cover supaya safe-area-inset-* terisi di ponsel ber-notch;
   tanpa ini env() di atas selalu nol dan bar fixed tetap tertutup notch. */
export const viewport: Viewport = {
  viewportFit: 'cover',
};

/* Layout ini sengaja TIDAK punya metadata sendiri.
   Root layout memasang template '%s, Nur Fajar', jadi judul apa pun yang
   ditulis di sini akan keluar sebagai "Nur Fajar, Nur Fajar". */

export default function V3Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`v3-root ${fraunces.variable} ${inter.variable}`}>
      {/* Penanda "JS jalan" sebelum paint pertama. CSS memakainya untuk
          memilih chrome mobile: dengan JS, barisan tautan diganti tombol
          hamburger; tanpa JS, barisan tautan geser tetap tampil dan tidak
          ada tombol mati. Satu statement, tanpa dependensi, tanpa baca
          apa pun — tidak ada yang bisa gagal di sini. */}
      <script dangerouslySetInnerHTML={{ __html: "document.documentElement.setAttribute('data-v3-js','')" }} />
      <a className="skip-link" href="#v3-main">
        Skip to content
      </a>

      <ScrollProgress />
      <Nav />
      <SmoothScroll />
      <BlueprintLoader />

      <main id="v3-main" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
