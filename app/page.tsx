import type { Metadata, Viewport } from 'next';
import V3Layout from './v3/layout';
import V3Page from './v3/page';

/* Homepage = halaman /v3. Homepage lama (bento terang + aurora, komponen di
   components/site/*) tidak dipakai lagi di route mana pun, tapi berkasnya
   tetap ada di riwayat git kalau suatu saat perlu dilihat. Rute /v3 tetap
   hidup dan menyajikan pohon yang sama persis. */

/* absolute, bukan judul biasa: template root menambahkan ", Nur Fajar" di
   belakang setiap judul, dan di halaman yang judulnya sudah namanya sendiri
   itu keluar sebagai "Nur Fajar, Nur Fajar". */
export const metadata: Metadata = {
  title: { absolute: 'Nur Fajar, Learning & Development Specialist' },
};

/* Sama seperti layout /v3: viewport-fit=cover supaya safe-area-inset-*
   terisi di ponsel ber-notch. */
export const viewport: Viewport = {
  viewportFit: 'cover',
};

export default function HomePage() {
  return (
    <V3Layout>
      <V3Page />
    </V3Layout>
  );
}
