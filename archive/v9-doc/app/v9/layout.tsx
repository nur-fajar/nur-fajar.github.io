import type { Viewport } from 'next';
import { Inter, DM_Mono } from 'next/font/google';
import './v9.css';

/**
 * v9 "Signal" — dunia terang, idiom komponen 21st.dev.
 *
 * Tipografi: Inter untuk seluruh suara halaman (display, body, label, chip),
 * DM Mono khusus data (indeks case, span waktu, baris stack). Keduanya
 * self-host lewat next/font, jadi `font-src 'self'` di CSP tetap cukup.
 *
 * Token warna, radius, dan gerak ada di app/v9/v9.css dan dicatat di
 * DESIGN.md. Halaman ini eksperimen: route terpisah, noindex, dan tidak
 * menyentuh globals.css milik halaman lain.
 */
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-v9-sans',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-v9-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  viewportFit: 'cover',
};

export default function V9Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`v9-root ${inter.variable} ${dmMono.variable}`}>
      <a className="skip-link" href="#v9-main">
        Skip to content
      </a>
      <main id="v9-main" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
