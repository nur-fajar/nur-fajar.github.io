import { Archivo, Inter, Kaushan_Script } from 'next/font/google';
import Nav from '@/components/v3/Nav';
import './v3.css';

/* Tiga keluarga, semuanya di-self-host lewat next/font supaya
   `font-src 'self'` di CSP tetap cukup dan tidak ada request
   render-blocking ke fonts.googleapis.com. Pola yang sama sudah dipakai
   app/layout.tsx untuk dua keluarga situs lama. */

/* Display. Italic-nya italic sungguhan, bukan miring bikinan browser: di
   ukuran sebesar "PROJECTS" oblique sintetis terlihat meleot. */
const archivo = Archivo({
  subsets: ['latin'],
  weight: ['800'],
  style: ['italic'],
  variable: '--font-v3-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-v3-body',
  display: 'swap',
});

/* Dipakai persis di dua tempat: ubin "Let's Connect!" di home dan kepala
   /v3/contact. Tidak di tempat lain. */
const kaushan = Kaushan_Script({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-v3-script',
  display: 'swap',
});

/* Layout ini sengaja TIDAK punya metadata sendiri.
   Root layout memasang template '%s, Nur Fajar', jadi judul apa pun yang
   ditulis di sini akan keluar sebagai "Nur Fajar, Nur Fajar". Judul
   diputuskan tiap halaman: yang di bawah root mendapat template itu
   (menjadi "Project, Nur Fajar"), sementara home memakai title.absolute. */

export default function V3Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`v3-root ${archivo.variable} ${inter.variable} ${kaushan.variable}`}>
      {/* Targetnya #v3-main, bukan konten pertama: skip link tugasnya
          melompati navigasi, bukan melompati isi. */}
      <a className="skip-link" href="#v3-main">
        Skip to content
      </a>

      <Nav />

      <main id="v3-main" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
