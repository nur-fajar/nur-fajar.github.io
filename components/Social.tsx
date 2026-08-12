import { GitHubIcon, LinkedInIcon } from './icons';

const SOCIAL_LINKS = [
  ['GitHub', 'https://github.com/nur-fajar', GitHubIcon],
  ['LinkedIn', 'https://www.linkedin.com/in/nurfajar/', LinkedInIcon],
] as const;

export default function Social() {
  return (
    <aside className="side side-social" aria-label="Social links">
      <ul>
        {SOCIAL_LINKS.map(([name, url, Icon]) => (
          <li key={name}>
            <a href={url} aria-label={name} target="_blank" rel="noreferrer">
              <Icon />
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
