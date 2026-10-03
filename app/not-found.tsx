import type { Metadata } from 'next';
import Link from 'next/link';
import { Fraunces, Inter } from 'next/font/google';
import PuzzleField from '@/components/v5/PuzzleField';
import './v5/v5.css';
import './not-found.css';

/**
 * 404 global. Sederhana: kode, pesan, dan jalan pulang. Dirender di dalam
 * root layout, tapi memakai font + token v5 supaya tetap satu bahasa dengan
 * situs. Next otomatis menyuntik <meta name="robots" content="noindex">.
 */

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300'],
  style: ['normal', 'italic'],
  variable: '--font-v5-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-v5-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { absolute: '404 · Page not found · Nur Fajar' },
  description: 'The page you are looking for may have moved or no longer exists.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className={`v5-root nf404 ${fraunces.variable} ${inter.variable}`}>
      <PuzzleField />
      <main className="nf404__main" id="top">
        <div className="nf404__box">
          <p className="nf404__code">404</p>
          <h1 className="nf404__title">Page not found</h1>
          <p className="nf404__text">
            The page you are looking for may have moved, or the link is broken.
          </p>
          <Link className="v5-btn nf404__cta" href="/">
            Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
