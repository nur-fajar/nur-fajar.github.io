import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Fraunces, Inter } from 'next/font/google';
import { CONTACT } from '@/content/ledger';
import { V5_NAV } from '@/content/v5';
import './v5/v5.css';
import './not-found.css';

/**
 * 404 global. Dirender di dalam root layout (fonts --font-display/--font-body
 * + globals.css), tapi isinya memakai sistem v5 supaya konsisten dengan
 * homepage: token --v5-* hidup di .v5-root dan font serif/body di-load ulang
 * di sini (v5.css hanya ikut bundle saat rute v5 dibuka, jadi 404 butuh
 * import-nya sendiri).
 *
 * Next otomatis menyuntik <meta name="robots" content="noindex"> untuk
 * respons 404; metadata di bawah menetapkan judul yang sebenarnya.
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
  title: { absolute: '404 — Page not found, Nur Fajar' },
  description:
    'That page is not here. Head back to the homepage, or jump straight to selected work and how to get in touch.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className={`v5-root nf404 ${fraunces.variable} ${inter.variable}`}>
      <main className="v5-shell nf404__inner" id="top">
        <div className="nf404__top">
          <Link className="nf404__brand" href="/" aria-label="Nur Fajar, back to home">
            <Image src="/foto-profile-nf-avatar.jpg" alt="" width={32} height={32} sizes="32px" />
            <span>Nur Fajar</span>
          </Link>
          <span className="nf404__tag" aria-hidden="true">
            Error 404
          </span>
        </div>

        <div className="nf404__body">
          <h1 className="v5-display nf404__title">
            This page <em>wandered off.</em>
          </h1>
          <p className="v5-lede nf404__lede">
            The link may be broken, or the page moved. Nothing is lost — head back to the
            homepage, or go straight to the work.
          </p>
          <div className="nf404__actions">
            <Link className="v5-btn v5-btn--big" href="/">
              Back to home
            </Link>
            <Link className="v5-hero__secondary" href="/#work">
              See selected work
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <nav className="nf404__links" aria-label="Site sections">
          {V5_NAV.map((link) => (
            <Link key={link.href} href={`/${link.href}`}>
              {link.label}
            </Link>
          ))}
          <a href={CONTACT.cv}>Resume</a>
        </nav>
      </main>
    </div>
  );
}
