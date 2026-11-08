import type { Metadata } from 'next';
import { V9_HERO, V9_META, V9_NAV } from '@/content/v9';
import Bio from '@/components/v9/Bio';
import Footer from '@/components/v9/Footer';
import Hero from '@/components/v9/Hero';
import History from '@/components/v9/History';
import Motion from '@/components/v9/Motion';
import Nav from '@/components/v9/Nav';
import Praise from '@/components/v9/Praise';
import WorkBento from '@/components/v9/WorkBento';

/**
 * /v9 — "Signal", eksperimen dengan idiom komponen 21st.dev.
 *
 * Route ini noindex dan tidak pernah menjadi homepage: ia ada untuk menguji
 * satu pertanyaan, yaitu apakah halaman yang seluruhnya dibangun dari pola
 * komponen 21st yang paling banyak diunduh masih bisa bicara dengan jujur.
 * Kontennya tetap kanon ledger, tidak ada satu pun angka atau klaim baru.
 *
 * Layout /v9 sudah menyediakan <main id="v9-main">, jadi di sini tidak ada
 * <main> kedua.
 */
export const metadata: Metadata = {
  title: { absolute: V9_META.title },
  description: V9_META.description,
  robots: { index: false, follow: false },
};

export default function V9Page() {
  return (
    <>
      <Motion />
      <Nav items={V9_NAV} mailto={V9_HERO.mailto} cv={V9_HERO.cv} />
      <Hero />
      <Bio />
      <WorkBento />
      <Praise />
      <History />
      <Footer />
    </>
  );
}
