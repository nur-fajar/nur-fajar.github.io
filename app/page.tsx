import Nav from '@/components/ledger/Nav';
import Hero from '@/components/ledger/Hero';
import WhatIBuilt from '@/components/ledger/WhatIBuilt';
import SelectedWork from '@/components/ledger/SelectedWork';
import Experience from '@/components/ledger/Experience';
import Proof from '@/components/ledger/Proof';
import Skills from '@/components/ledger/Skills';
import Path from '@/components/ledger/Path';
import LookingFor from '@/components/ledger/LookingFor';
import Footer from '@/components/ledger/Footer';

/**
 * Urutan section di bawah ini adalah keputusan arsitektur, bukan preferensi.
 * Tiap posisi menjawab satu pertanyaan hiring manager, diurutkan berdasarkan
 * kapan pertanyaan itu muncul di kepala mereka:
 *
 *   Hero          siapa, peran apa, cari apa, bukti utama   (0–8 detik)
 *   What I built  kurikulum & program, 100% L&D             (8–45 detik)
 *   Selected work artefak nyata yang bisa diklik            (45 detik–2 menit)
 *   Experience    sudah berapa lama, di mana, progresi      (2–2,5 menit)
 *   Proof         angka + metode, testimoni, kredensial     (2,5–4 menit)
 *   Skills        peta kompetensi , setelah bukti, bukan sebelum
 *   Path          kredensial akademik, prioritas terendah
 *   Looking for   peran apa, setup apa, cara kontak         (aksi)
 */
export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#work">
        Skip to content
      </a>
      <Nav />
      <main>
        <Hero />
        <WhatIBuilt />
        <SelectedWork />
        <Experience />
        <Proof />
        <Skills />
        <Path />
        <LookingFor />
      </main>
      <Footer />
    </>
  );
}
