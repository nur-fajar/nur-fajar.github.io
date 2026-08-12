import Link from 'next/link';
import { LogoMark } from './icons';

const NAV_LINKS = [
  ['#about', 'About'],
  ['#experience', 'Experience'],
  ['#skills', 'Skills'],
  ['#work', 'Work'],
  ['#contact', 'Contact'],
] as const;

export default function Nav() {
  return (
    <header className="nav">
      <Link className="logo" href="#top">
        <LogoMark className="logo-mark" />
        Nur Fajar
      </Link>
      <nav className="nav-links">
        {NAV_LINKS.map(([href, label], i) => (
          <a key={href} href={href}>
            <span className="idx mono">0{i + 1}.</span>
            {label}
          </a>
        ))}
        <a className="btn btn-small nav-resume" href="/nf.pdf" download="Nur-Fajar-CV-AI-LnD-2026.pdf" target="_blank" rel="noopener">
          Resume
        </a>
      </nav>
    </header>
  );
}
