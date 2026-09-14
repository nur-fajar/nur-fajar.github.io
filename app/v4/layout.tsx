import type { Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import BlueprintLoader from '@/components/v3/BlueprintLoader';
import Nav from '@/components/v3/Nav';
import ScrollProgress from '@/components/v3/ScrollProgress';
import SmoothScroll from '@/components/v3/SmoothScroll';
import '../v3/v3.css';
import './v4.css';

/* Dua berkas CSS, urutannya tidak penting.
   v3.css dimuat karena v4 memakai ulang kelas-kelasnya; hampir semuanya
   berbasis kelas, jadi ia mengambil warna dari token mana pun yang diwarisi
   dari elemen root. v4.css memasang token itu di .v4-root. Tidak ada perang
   specificity karena .v3-root tidak pernah dipasang di halaman ini, jadi
   satu-satunya blok token yang aktif adalah milik v4.

   Seiring tiap section diganti versi v4-nya, ketergantungan ke v3.css
   menyusut. Ia dilepas kalau sudah tidak ada kelas .v3-* yang tersisa. */

/* Dua keluarga huruf, keduanya di-self-host lewat next/font supaya
   `font-src 'self'` di CSP tetap cukup dan tidak ada request render-blocking
   ke fonts.googleapis.com.

   Sama dengan v3, dan itu keputusan sadar: Fraunces 300 sudah pilihan yang
   benar untuk arah editorial ini. Serif kontras tinggi yang tipis di ukuran
   display terbaca editorial; huruf yang sama di bobot tebal terbaca seperti
   kepala koran. Menambah keluarga ketiga cuma menambah berat unduh tanpa
   menambah satu pun register yang belum bisa dicapai skala tipografi baru. */
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300'],
  style: ['normal', 'italic'],
  variable: '--font-v4-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-v4-body',
  display: 'swap',
});

/* viewport-fit=cover supaya safe-area-inset-* terisi di ponsel ber-notch;
   tanpa ini env() selalu nol dan bar fixed tetap tertutup notch. */
export const viewport: Viewport = {
  viewportFit: 'cover',
};

/* Layout ini sengaja TIDAK punya metadata sendiri.
   Root layout memasang template '%s, Nur Fajar', jadi judul apa pun di sini
   akan keluar sebagai "Nur Fajar, Nur Fajar". Judulnya diatur di page.tsx
   dengan `absolute`. */

export default function V4Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`v4-root ${fraunces.variable} ${inter.variable}`}>
      {/* Tanpa JS, blok <noscript> di root layout mengembalikan bilah tautan
          geser v3 (Nav di sini masih komponen v3) dan menyembunyikan tombol
          mati. Tidak ada <script> yang dirender komponen. */}
      <a className="skip-link" href="#v4-main">
        Skip to content
      </a>

      <ScrollProgress />
      <Nav />
      <SmoothScroll />
      <BlueprintLoader />

      <main id="v4-main" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
