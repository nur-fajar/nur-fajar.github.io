import type { Metadata, Viewport } from 'next';

import { V9_META } from '@/content/v9';
import V9Layout from './v9/layout';
import V9Page from './v9/page';

/* Homepage = halaman /v9, edisi panggung 21st.dev (2026-11-08): foto
   kartun, headline besar dengan frasa berotasi, bio founder, dua kontak.
   Rute /v3, /v4, /v5, /v6, /v7, /v8 tetap hidup sebagai arsip dan
   menyajikan pohonnya masing-masing. Homepage lama (bento terang +
   aurora, komponen components/site/*) tidak dipakai lagi di route mana
   pun, tapi berkasnya tetap ada di riwayat git. */

/* absolute, bukan judul biasa: template root menambahkan ", Nur Fajar" di
   belakang setiap judul, dan di halaman yang judulnya sudah namanya
   sendiri itu keluar sebagai "Nur Fajar, Nur Fajar". */
export const metadata: Metadata = {
  title: { absolute: V9_META.title },
};

/* Sama seperti layout /v9: viewport-fit=cover supaya safe-area-inset-*
   terisi di ponsel ber-notch. */
export const viewport: Viewport = {
  viewportFit: 'cover',
};

export default function HomePage() {
  return (
    <V9Layout>
      <V9Page />
    </V9Layout>
  );
}
