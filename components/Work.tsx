import { PIPELINE_MAP } from '@/content/pipeline';
import { PROGRAMS } from '@/content/programs';
import { ExternalLinkIcon } from './icons';
import Reveal from './motion/Reveal';

type FeaturedItem = {
  key: string;
  overline: string;
  title: string;
  paragraphs: string[];
  tags: string[];
  href?: string;
  nodes: { phase: string; name: string; gate?: boolean }[];
};

// "Featured Work, all of it" — the automation pipeline plus every program
// designed (content/programs.ts), each rendered the same way instead of
// splitting a couple out into a smaller "other projects" grid.
const items: FeaturedItem[] = [
  {
    key: 'pipeline',
    overline: 'Featured Project',
    title: 'B2B Outreach Automation Pipeline',
    paragraphs: [
      'A 9-agent Python pipeline built solo at Terra Weather: enriches CRM contacts, pulls company news, drafts personalized cold email plus a 3-step follow-up cadence, then classifies and drafts replies — all on GPT-4o-mini, escalating to GPT-4o only for reply classification, where misreading an opt-out is a compliance problem rather than a wasted call.',
      'Outbound send is the one step that never runs unattended — dispatch waits for a human-approved review window every evening. Everything else runs on its own.',
      '~3,000 leads processed · 600 qualified prospects surfaced · per-prospect prep time cut 83%.',
    ],
    tags: ['Python', 'GPT-4o-mini', 'GPT-4o', 'CRM Automation', 'Human-in-the-loop'],
    nodes: PIPELINE_MAP,
  },
  ...PROGRAMS.map((p): FeaturedItem => {
    const [, level, duration] = p.id.split(' · ');
    return {
      key: p.id,
      overline: 'Featured Program',
      title: p.title,
      paragraphs: [p.summary],
      tags: [level, duration, p.audience].filter(Boolean),
      href: p.href,
      nodes: p.units.map((u, i) => ({ phase: `Step ${i + 1}`, name: u.title })),
    };
  }),
];

export default function Work() {
  return (
    <section id="work">
      <Reveal as="div">
        <h2 className="numbered-heading">
          <span className="num mono">05.</span> Featured Work
        </h2>
      </Reveal>

      <div className="featured-list">
        {items.map((item, i) => (
          <Reveal as="div" key={item.key} className="featured-item" index={i}>
            <div className="f-content">
              <p className="f-overline mono">{item.overline}</p>
              <h3 className="f-title">{item.title}</h3>
              <div className="f-desc">
                {item.paragraphs.map((p, pi) => (
                  <p key={pi}>{p}</p>
                ))}
              </div>
              <ul className="f-tags mono">
                {item.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              {item.href && (
                <div className="f-links">
                  <a href={item.href} aria-label={`Open ${item.title}`} target="_blank" rel="noreferrer">
                    <ExternalLinkIcon />
                  </a>
                </div>
              )}
            </div>
            <div className="f-visual">
              <div className="node-diagram">
                {item.nodes.map((n) => (
                  <div key={n.phase + n.name} className={`p-node${n.gate ? ' is-gate' : ''}`}>
                    <span className="p-phase mono">{n.phase}</span>
                    <span className="p-name">{n.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
