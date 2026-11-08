import type { Viewport } from 'next';
import { IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import './v8.css';

/**
 * v8 �?" IBM Carbon theme.
 *
 * Tipografi Carbon: IBM Plex Sans (display + body) dan IBM Plex Mono (data).
 * Self-host lewat next/font. Warna/token Carbon didefinisikan di v8.css.
 */
const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-v8-sans',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-v8-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  viewportFit: 'cover',
};

export default function V8Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`v8-root ${plexSans.variable} ${plexMono.variable}`}>
      <a className="skip-link" href="#v8-main">
        Skip to content
      </a>
      <main id="v8-main" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}