import Link from 'next/link';
import { GitHubIcon, LinkedInIcon } from './icons';
import YearNow from './YearNow';

const SOCIAL_LINKS = [
  ['GitHub', 'https://github.com/nur-fajar', GitHubIcon],
  ['LinkedIn', 'https://www.linkedin.com/in/nurfajar/', LinkedInIcon],
] as const;

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-social">
        {SOCIAL_LINKS.map(([name, url, Icon]) => (
          <a key={name} href={url} aria-label={name} target="_blank" rel="noreferrer">
            <Icon />
          </a>
        ))}
      </div>
      <p className="footer-credit">
        Designed &amp; built by Nur Fajar · © <YearNow />
      </p>
      <p className="footer-easter-egg">
        <Link href="/playground">✨ a day in my life, scroll-parallax style</Link>
      </p>
    </footer>
  );
}
