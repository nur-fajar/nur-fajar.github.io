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
  'Nur Fajar — versatile generalist for ambitious teams. Base in AI and learning: web and software support, AI agents and automations, programs and training, social and content.';

export const metadata: Metadata = {
  metadataBase: new URL('https://nurfajar.com'),
  title: {
    default: 'Nur Fajar — Generalist: AI, Web, Programs & Content | Full-Time, Remote GMT+7',
    template: '%s, Nur Fajar',
  },
  description: SUMMARY,
  alternates: { canonical: 'https://nurfajar.com' },
  openGraph: {
    type: 'profile',
    locale: 'en_US',
    url: 'https://nurfajar.com',
    title: 'Nur Fajar — Your Team’s Utility Player',
    description: SUMMARY,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nur Fajar — Your Team’s Utility Player',
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
    'Web Development',
    'Next.js',
    'AI Agents',
    'Workflow Automation',
    'Python',
    'Instructional Design',
    'Curriculum Development',
    'Training Needs Analysis',
    'Facilitation',
    'Social Media Content',
    'Generative AI',
    'Prompt Engineering',
  ],
  seeks: { '@type': 'Demand', name: 'Full-time AI generalist role' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jakarta.variable}`}
      /* `data-story-theme` ditulis `StoryThemeToggle` lewat layout effect
         sebelum paint (baca localStorage, default 'dark'): mismatch yang
         disengaja dan aman, karena atribut itu bukan sesuatu yang pernah
         dirender RootLayout sendiri. */
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
        {/* Fallback no-JS untuk chrome mobile v3/v5: keduanya default mode
            hamburger (JS diasumsikan jalan). Tanpa JS tombolnya mati dan
            tautannya tersembunyi, jadi blok ini mengembalikan bilah tautan
            geser. Tidak ada <script> yang dilibatkan sama sekali — React 19
            memperingatkan setiap <script> yang dirender komponen (termasuk
            next/script) karena tidak dieksekusi saat navigasi klien.
            !important karena urutan <style> ini vs stylesheet Next tidak
            dijamin. */}
        <noscript>
          <style>{`@media (max-width: 900px){.v3-nav{justify-content:flex-start !important;overflow-x:auto !important}.v3-nav__link{display:inline !important}.v3-nav__toggle{display:none !important}}@media (max-width: 980px){.v5-nav__links{display:flex !important;overflow-x:auto}.v5-nav__cta{display:inline-flex !important}.v5-nav__toggle{display:none !important}}`}</style>
        </noscript>
        {/* JSON-LD statis, dibangun dari konstanta di repo ini, tidak ada
            input pengguna yang bisa masuk ke sini. Bertipe
            application/ld+json (tidak dieksekusi), jadi tidak memicu
            peringatan skrip React. */}
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
