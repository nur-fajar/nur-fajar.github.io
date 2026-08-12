import { PROGRAMS } from '@/content/programs';
import { FolderIcon, ExternalLinkIcon } from './icons';
import Reveal from './motion/Reveal';

// The one already told in full as a featured project (see Work.tsx).
const otherPrograms = PROGRAMS.filter((p) => p.title !== 'Chatbots for Business');

export default function OtherPrograms() {
  return (
    <section id="programs">
      <Reveal as="div">
        <h2 className="numbered-heading">
          <span className="num mono">06.</span> Other Programs I&apos;ve Designed
        </h2>
      </Reveal>

      <ul className="programs-grid">
        {otherPrograms.map((p, i) => (
          <Reveal as="li" key={p.id} className="program-card" index={i}>
            <div>
              <div className="program-top">
                <span className="folder">
                  <FolderIcon />
                </span>
                <a href={p.href} aria-label={`Open ${p.title}`} target="_blank" rel="noreferrer">
                  <ExternalLinkIcon />
                </a>
              </div>
              <p className="program-meta mono">{p.id}</p>
              <h3 className="program-title">{p.title}</h3>
              <p className="program-desc">{p.summary}</p>
            </div>
            <ul className="program-tags">
              <li>{p.audience}</li>
            </ul>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
