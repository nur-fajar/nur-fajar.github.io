import type { Metadata } from 'next';
import Hero from '@/components/v4/Hero';
import About from '@/components/v3/sections/About';
import Achievements from '@/components/v3/sections/Achievements';
import Contact from '@/components/v3/sections/Contact';
import Experience from '@/components/v3/sections/Experience';
import Technologies from '@/components/v3/sections/Technologies';
import Work from '@/components/v3/sections/Work';

/* absolute, bukan judul biasa: template root menambahkan ", Nur Fajar" di
   belakang setiap judul, dan di halaman yang judulnya sudah namanya sendiri
   itu keluar sebagai "Nur Fajar, Nur Fajar". */
export const metadata: Metadata = {
  title: { absolute: 'Nur Fajar, Learning & Development Specialist' },
  /* /v4 masih draf dan berbagi isi dengan /. Dua URL yang melayani konten
     sama adalah duplikat di mata mesin telusur, jadi halaman ini menolak
     diindeks sampai ia menggantikan homepage. */
  robots: { index: false, follow: false },
};

/**
 * Langkah 1: rangka.
 *
 * Halaman ini sengaja masih merender ketujuh section v3 apa adanya, lewat
 * token v4. Gunanya satu: memberi dasar pembanding yang jujur. Setiap
 * langkah berikutnya mengganti satu section, dan bedanya bisa dilihat
 * berdampingan dengan / yang tidak disentuh.
 *
 * Urutannya akan berubah di langkah-langkah berikutnya: section `proof`
 * masuk di antara Bento dan Work, dan section `method` (ADDIE) masuk di
 * antara Work dan Experience. Keduanya belum ada komponennya.
 */
export default function V4Page() {
  return (
    <>
      <Hero />
      <Work />
      <Experience />
      <Technologies />
      <Achievements />
      <About />
      <Contact />
    </>
  );
}
