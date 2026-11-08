import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Archivo } from 'next/font/google';
import './mockups.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--m-sans',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--m-mono',
  display: 'swap',
});

const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--m-disp',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { absolute: 'v8 Style Atlas — 48 arah visual' },
  description: 'Peralatan eksplorasi: 48 mockup arah visual untuk folio Nur Fajar.',
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { viewportFit: 'cover' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`mroot ${inter.variable} ${mono.variable} ${archivo.variable}`}>{children}</div>
  );
}
