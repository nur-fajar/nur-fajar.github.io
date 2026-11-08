import { CONTACT, MAILTO } from '@/content/ledger';
import { V6_FOOTER_NOTE } from '@/content/v6-hats';
import HatStage from '@/components/v6/HatStage';

/**
 * v6: landing page gamifikasi. Semua isi interaktif di <HatStage/> (satu
 * client component); bagian server hanya bingkai: kepala, judul, footer.
 */
export default function V6Page() {
  return (
    <>
      <header className="v6-head">
        <p className="v6-head__coin" aria-hidden="true">
          ● ● ●
        </p>
        <h1 className="v6-name">Nur Fajar</h1>
        <p className="v6-tagline">One character. Three hats. All real jobs.</p>
      </header>

      <HatStage />

      <footer className="v6-foot">
        <p>{V6_FOOTER_NOTE}</p>
        <ul className="v6-foot__links">
          <li>
            <a href={`mailto:${CONTACT.email}`}>Email</a>
          </li>
          <li>
            <a href={CONTACT.linkedin} target="_blank" rel="noreferrer">
              LinkedIn ↗
            </a>
          </li>
          <li>
            <a href={CONTACT.cal} target="_blank" rel="noreferrer">
              Book a call ↗
            </a>
          </li>
          <li>
            <a href={MAILTO}>Hiring form</a>
          </li>
        </ul>
        <p className="v6-foot__stage">Staging build v6 · nurfajar.com</p>
      </footer>
    </>
  );
}
