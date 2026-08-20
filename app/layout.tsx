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
 * jadi hal PERTAMA yang dibaca hiring manager, sebelum situsnya sendiri.
 *
 * Dua hal diperbaiki di sini.
 *
 * Yang pertama, ketiga description (meta, og, twitter) dulu sedikit berbeda
 * satu sama lain. Tidak ada alasan untuk itu: satu halaman punya satu
 * ringkasan, dan tiga versi yang hampir sama cuma tiga tempat berbeda untuk
 * basi diam-diam. Sekarang ketiganya satu konstanta.
 *
 * Yang kedua, title-nya. Versi lama berbunyi "Instructional Design &
 * Curriculum Development" dan nol sinyal lain, jadi pencarian yang menyebut
 * peran L&D tidak punya pijakan. Urutannya sekarang: nama, jabatan, lalu dua
 * kompetensi inti, yang mana ketiganya muat di potongan 60 karakter pertama
 * yang benar-benar ditampilkan hasil pencarian.
 */
const SUMMARY =
  'Nur Fajar — Learning & Development Specialist. Programs owned end to end: ideation, design, delivery, ' +
  'evaluation. 5 programs, 3 curriculum modules, 300+ learners.';

export const metadata: Metadata = {
  metadataBase: new URL('https://nurfajar.com'),
  title: {
    default: 'Nur Fajar — Learning & Development Specialist | Instructional Design, Curriculum Development',
    template: '%s, Nur Fajar',
  },
  description: SUMMARY,
  alternates: { canonical: 'https://nurfajar.com' },
  openGraph: {
    type: 'profile',
    locale: 'en_US',
    url: 'https://nurfajar.com',
    title: 'Nur Fajar — Learning & Development Specialist',
    description: SUMMARY,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nur Fajar — Learning & Development Specialist',
    description: SUMMARY,
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
