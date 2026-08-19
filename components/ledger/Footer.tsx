import { CONTACT, LAST_UPDATED, MAILTO } from '@/content/ledger';

/**
 * Footer.
 *
 * `Last updated` adalah sinyal kecil bernilai tinggi: situs kandidat yang
 * bertanggal terbaru membaca sebagai orang yang aktif mencari, bukan arsip
 * lama yang ditinggalkan.
 */
export default function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer__inner">
        <p className="footer__who">
          Nur Fajar · {CONTACT.location}
        </p>

        <nav className="footer__links" aria-label="Contact">
          <a
            className="link"
            href={CONTACT.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a className="link" href={MAILTO}>
            Email
          </a>
          <a className="link" href={CONTACT.cv} download={CONTACT.cvFilename}>
            CV (PDF)
          </a>
        </nav>

        <p className="footer__colophon">
          Built with Next.js, Framer Motion, and a lot of Claude.
          <br />
          Last updated {LAST_UPDATED}.
        </p>
      </div>
    </footer>
  );
}
