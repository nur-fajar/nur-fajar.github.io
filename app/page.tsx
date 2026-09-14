import type { Metadata, Viewport } from 'next';
import V5Layout from './v5/layout';
import V5Page from './v5/page';

/* Homepage = halaman /v5. Rute /v3 dan /v4 tetap hidup sebagai arsip
   (keduanya noindex) dan menyajikan pohonnya masing-masing. Homepage lama
   (bento terang + aurora, komponen di components/site/*) tidak dipakai lagi
   di route mana pun, tapi berkasnya tetap ada di riwayat git. */

/* absolute, bukan judul biasa: template root menambahkan ", Nur Fajar" di
   belakang setiap judul, dan di halaman yang judulnya sudah namanya sendiri
   itu keluar sebagai "Nur Fajar, Nur Fajar". */
export const metadata: Metadata = {
  title: { absolute: 'Nur Fajar — Your Team’s Utility Player' },
};

/* Sama seperti layout /v5: viewport-fit=cover supaya safe-area-inset-*
   terisi di ponsel ber-notch. */
export const viewport: Viewport = {
  viewportFit: 'cover',
};

export default function HomePage() {
  return (
    <V5Layout>
      <V5Page />
    </V5Layout>
  );
}
