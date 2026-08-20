import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google';
import MotionProvider from '@/components/site/MotionProvider';
import { CONTACT } from '@/content/ledger';
import './globals.css';

/* Dua keluarga saja. Keduanya di-self-host lewat next/font, di-download saat
   build dan disajikan dari origin yang sama, jadi `font-src 'self'` di CSP
   tetap cukup dan tidak ada request render-blocking ke fonts.googleapis.com. */

// Display: headline, judul section, angka besar.
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-display',
  display: 'swap',
});

// Body: paragraf, chip, label, tombol.
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

/**
 * Meta ini adalah teks yang muncul di preview LinkedIn dan WhatsApp, sering
 * jadi hal PERTAMA yang dibaca hiring manager, sebelum situsnya sendiri. Karena
 * itu ia harus 100% mencerminkan peran yang dilamar: L&D / Instructional Design
 * / Curriculum Development. Tidak ada kata "AI" di title, description, og, atau
 * twitter tags sama sekali (spec §10.1 + anti-checklist §16).
 *
 * "5 programs" dan "4 curriculum modules" secara eksplisit ditulis sebagai
 * "this past year" supaya tidak duduk bersebelahan dengan "300+ learners"
 * (yang mencakup 3 peran/3 tahun) seolah keduanya satu populasi yang sama.
 * Lihat catatan amandemen di kepala content/ledger.ts.
 */
export const metadata: Metadata = {
  metadataBase: new URL('https://nurfajar.com'),
  title: {
    default: 'Nur Fajar, L&D Specialist: Instructional Design & Curriculum Development',
    template: '%s, Nur Fajar',
  },
  description:
    'L&D Specialist. Programs owned end to end, from ideation to evaluation: 5 programs and 4 curriculum modules this past year, 300+ learners reached across 3 roles, 9.0/10 satisfaction.',
  alternates: { canonical: 'https://nurfajar.com' },
  openGraph: {
    type: 'profile',
    locale: 'en_US',
    url: 'https://nurfajar.com',
    title: 'Nur Fajar, L&D Specialist',
    description:
      'I own programs end to end, from ideation to evaluation: 5 programs and 4 curriculum modules this past year, 300+ learners reached across 3 roles.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nur Fajar, L&D Specialist',
    description:
      'I own programs end to end, from ideation to evaluation: 5 programs and 4 curriculum modules this past year, 300+ learners reached across 3 roles.',
  },
};

/* Situs kandidat ditemukan lewat NAMA PERAN, bukan nama orang: knowsAbout di
   bawah ini adalah daftar peran/kompetensi yang dicari hiring manager. */
const PERSON_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Nur Fajar',
  jobTitle: 'Learning & Development Specialist',
  email: CONTACT.email,
  url: 'https://nurfajar.com',
  sameAs: [CONTACT.linkedin],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Tangerang',
    addressCountry: 'ID',
  },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'Siliwangi University' },
  knowsAbout: [
    'Instructional Design',
    'Curriculum Development',
    'ADDIE',
    'Training Needs Analysis',
    'Facilitation',
    'Training Evaluation',
    'Train the Trainers',
    'Generative AI',
    'Prompt Engineering',
    'Python',
  ],
  seeks: { '@type': 'Demand', name: 'Learning & Development Specialist role' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jakarta.variable}`}
      /* Skrip anti-FOUC di bawah menulis `data-story-theme` ke elemen ini
         sebelum React hydrate: mismatch yang disengaja dan aman, karena
         atribut itu bukan sesuatu yang pernah dirender RootLayout sendiri. */
      suppressHydrationWarning
    >
      <head>
        {/* Framer Motion membakar state `initial` ke HTML server-rendered,
            elemen reveal terkirim sebagai opacity:0 sampai JS menjalankan
            animasinya. Kalau JS tidak pernah jalan, teksnya tidak akan pernah
            muncul. Aturan ini hanya ada ketika memang tidak ada JS. */}
        <noscript>
          <style>{'.motion-safe{opacity:1 !important;transform:none !important;filter:none !important;}'}</style>
        </noscript>
        {/* Anti-FOUC untuk toggle tema dark/light di /hire-me, yang memakai
            palet `.story-root` dari app/story.css. Harus jalan lewat blocking
            inline <script> di <head>, sebelum paint pertama: kalau ditunda ke
            useEffect, pengunjung yang sebelumnya memilih light akan sempat
            melihat kedipan tema dark.

            Daftar path-nya menyempit dari versi sebelumnya. Dulu `/` ikut
            terdaftar karena homepage-nya adalah scroll-story yang berbagi
            palet itu; homepage sekarang light-only dan tidak punya toggle,
            jadi menulis atribut tema di sana hanya akan menaruh state yang
            tidak pernah dibaca siapa pun. Varian ber-slash tetap didaftar
            karena static export (GitHub Pages) menyajikan halaman yang sama
            di `/hire-me/`. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=location.pathname;if(p!=='/hire-me'&&p!=='/hire-me/')return;var t=localStorage.getItem('story-theme')==='light'?'light':'dark';document.documentElement.setAttribute('data-story-theme',t);}catch(e){}})();`,
          }}
        />
        {/* JSON-LD statis, dibangun dari konstanta di repo ini, tidak ada
            input pengguna yang bisa masuk ke sini. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }}
        />
      </head>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
