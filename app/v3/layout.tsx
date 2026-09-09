import { Fraunces, Inter } from 'next/font/google';
import Nav from '@/components/v3/Nav';
import ScrollProgress from '@/components/v3/ScrollProgress';
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

/* Layout ini sengaja TIDAK punya metadata sendiri.
   Root layout memasang template '%s, Nur Fajar', jadi judul apa pun yang
   ditulis di sini akan keluar sebagai "Nur Fajar, Nur Fajar". */

export default function V3Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`v3-root ${fraunces.variable} ${inter.variable}`}>
      <a className="skip-link" href="#v3-main">
        Skip to content
      </a>

      <ScrollProgress />
      <Nav />

      <main id="v3-main" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
