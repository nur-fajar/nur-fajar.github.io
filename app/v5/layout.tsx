import type { Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import SmoothScroll from '@/components/v3/SmoothScroll';
import Cursor from '@/components/v5/Cursor';
import HireDock from '@/components/v5/HireDock';
import Nav from '@/components/v5/Nav';
import ScrollProgress from '@/components/v5/ScrollProgress';
import V5Loader from '@/components/v5/V5Loader';
import './v5.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300'],
  style: ['normal', 'italic'],
  variable: '--font-v5-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '800'],
  variable: '--font-v5-body',
  display: 'swap',
});

export const viewport: Viewport = {
  viewportFit: 'cover',
};

export default function V5Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`v5-root ${fraunces.variable} ${inter.variable}`}>
      {/* Tanpa JS, blok <noscript> di root layout mengembalikan barisan
          tautan dan menyembunyikan tombol hamburger yang mati. */}
      <a className="skip-link" href="#v5-main">
        Skip to content
      </a>
      <ScrollProgress />
      <Cursor />
      <Nav />
      <SmoothScroll />
      <V5Loader />
      <main id="v5-main" tabIndex={-1}>
        {children}
      </main>
      <HireDock />
    </div>
  );
}
