import Link from 'next/link';
import { LogoMark } from './icons';

// Numbers here match each section's own numbered-heading exactly (see
// About/Experience/TrackRecord/Skills/Work/Testimonials) — previously the
// nav counted its own link position instead, so "03. Skills" in the nav
// pointed at a section headed "04. Skills" on the page.
const NAV_LINKS = [
  ['#about', '01', 'About'],
  ['#experience', '02', 'Experience'],
  ['#track-record', '03', 'Track Record'],
  ['#skills', '04', 'Skills'],
  ['#work', '05', 'Work'],
  ['#testimonials', '06', 'Praise'],
] as const;

export default function Nav() {
  return (
    <header className="nav">
      <Link className="logo" href="#top">
        <LogoMark className="logo-mark" />
        Nur Fajar
      </Link>
      <nav className="nav-links">
        {NAV_LINKS.map(([href, num, label]) => (
          <a key={href} href={href}>
            <span className="idx mono">{num}.</span>
            {label}
          </a>
        ))}
        <a href="#contact">Contact</a>
        <a className="btn btn-small nav-resume" href="/nf.pdf" download="Nur-Fajar-CV-AI-LnD-2026.pdf" target="_blank" rel="noopener">
          Resume
        </a>
      </nav>
    </header>
  );
}
