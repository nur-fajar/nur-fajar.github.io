import type { Metadata } from 'next';
import Hero from '@/components/v3/Hero';

/* absolute, bukan judul biasa: template root menambahkan ", Nur Fajar" di
   belakang setiap judul, dan di halaman yang judulnya sudah namanya sendiri
   itu keluar sebagai "Nur Fajar, Nur Fajar". */
export const metadata: Metadata = {
  title: { absolute: 'Nur Fajar, Learning & Development Specialist' },
};

/**
 * Satu halaman, delapan section.
 *
 * Urutannya mengikuti argumen yang sudah ditulis di app/page.tsx, bukan
 * urutan referensinya: Work sebelum Experience, dan About di posisi keenam.
 * Alasannya soal isi, bukan soal kulit, jadi ia tidak ikut berubah saat
 * kulitnya diganti. Section-nya menyusul satu per satu; sekarang baru hero.
 */
export default function V3Page() {
  return <Hero />;
}
