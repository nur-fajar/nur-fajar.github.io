import type { Metadata } from 'next';
import { Press_Start_2P } from 'next/font/google';
import './v6.css';

/* Font pixel self-host via next/font: jadi file origin sendiri, tetap lolos
   CSP `font-src 'self'` yang dipakai next.config.mjs. Dipakai kecil-kecil
   (judul, hint, chip) karena Press Start 2P melelahkan untuk paragraf. */
const pixelFont = Press_Start_2P({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-v6-pixel',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { absolute: 'Nur Fajar — Pixel Portfolio (v6)' },
  description:
    'Pick a hat: trainer, creative, or AI engineer. A gamified look at what Nur Fajar does, with real numbers behind every hat.',
  robots: { index: false, follow: false },
};

/**
 * v6: staging landing page gamifikasi "Character & Hat Switching".
 * Arsip noindex seperti v2-v5, tidak masuk sitemap, aman di-review
 * sebelum naik jadi halaman utama.
 */
export default function V6Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`v6-root ${pixelFont.variable}`}>
      <main className="v6-page">{children}</main>
    </div>
  );
}
