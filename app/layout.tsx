import type { Metadata } from 'next';
import { Bricolage_Grotesque, IBM_Plex_Mono, Instrument_Sans } from 'next/font/google';
import MotionProvider from '@/components/ledger/MotionProvider';
import { CONTACT } from '@/content/ledger';
import './globals.css';

/* Tiga keluarga, sesuai batas performance budget (spec §11). Semuanya
   di-self-host lewat next/font — di-download saat build dan disajikan dari
   origin yang sama, jadi `font-src 'self'` di CSP tetap cukup dan tidak ada
   request render-blocking ke fonts.googleapis.com. */

// Display — variable, jadi weight-nya tidak di-pin di sini.
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

// Body.
const instrument = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

// Data & utility — label, kicker, tanggal, semua angka di Proof.
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

/**
 * Meta ini adalah teks yang muncul di preview LinkedIn dan WhatsApp — sering
 * jadi hal PERTAMA yang dibaca hiring manager, sebelum situsnya sendiri. Karena
 * itu ia harus 100% mencerminkan peran yang dilamar: L&D / Instructional Design
 * / Curriculum Development. Tidak ada kata "AI" di title, description, og, atau
 * twitter tags sama sekali (spec §10.1 + anti-checklist §16).
 */
export const metadata: Metadata = {
  metadataBase: new URL('https://nurfajar.com'),
  title: {
    default: 'Nur Fajar — L&D Specialist · Instructional Design & Curriculum Development',
    template: '%s — Nur Fajar',
  },
  description:
    'L&D Specialist. End-to-end program design, delivery, and evaluation — 5 programs, 300+ learners, 9.0/10 satisfaction, curriculum now taught by trainers I trained.',
  alternates: { canonical: 'https://nurfajar.com' },
  openGraph: {
    type: 'profile',
    locale: 'en_US',
    url: 'https://nurfajar.com',
    title: 'Nur Fajar — L&D Specialist',
    description:
      'I run learning programs end to end — design, delivery, evaluation. 300+ learners trained, 5 programs, a curriculum now taught by others.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nur Fajar — L&D Specialist',
    description:
      'I run learning programs end to end — design, delivery, evaluation. 300+ learners trained, 5 programs, a curriculum now taught by others.',
  },
};

/* Situs kandidat ditemukan lewat NAMA PERAN, bukan nama orang — knowsAbout di
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
      className={`${bricolage.variable} ${instrument.variable} ${plexMono.variable}`}
    >
      <head>
        {/* Framer Motion membakar state `initial` ke HTML server-rendered —
            elemen reveal terkirim sebagai opacity:0 sampai JS menjalankan
            animasinya. Kalau JS tidak pernah jalan, teksnya tidak akan pernah
            muncul. Aturan ini hanya ada ketika memang tidak ada JS. */}
        <noscript>
          <style>{'.motion-safe{opacity:1 !important;transform:none !important;}'}</style>
        </noscript>
        {/* JSON-LD statis, dibangun dari konstanta di repo ini — tidak ada
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
