import type { Viewport } from 'next';
import { Inter, DM_Mono } from 'next/font/google';
import './v7.css';

/**
 * v7, dunia Apple (redesign 2026-10-16, reverse-engineering apple.com):
 * keluarga Inter untuk SELURUH suara halaman (display, body, label, chip)
 * — satu keluarga, seperti apple.com yang tidak pernah mencampur wajah
 * kedua ke teks berjalan. Bobot memuat 400/500/600/700; display berjalan
 * di 600 semibold. Semuanya self-host lewat next/font supaya
 * `font-src 'self'` di CSP cukup (pola komentar layout root yang sama).
 * Roboto khusus chip bio dipensiunkan bersama dunia kertas; DM Mono
 * tersisa khusus data (metrik, span tanggal, stackline).
 */
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-v7-sans',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-v7-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  viewportFit: 'cover',
};

export default function V7Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`v7-root ${inter.variable} ${dmMono.variable}`}>
      <a className="skip-link" href="#v7-main">
        Skip to content
      </a>
      <main id="v7-main" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
