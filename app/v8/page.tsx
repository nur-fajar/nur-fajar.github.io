import type { Metadata } from 'next';
import {
  CONTACT,
  V5_FOUNDER_MAILTO,
  V7_BIO,
  V7_BIO_LINKS,
  V7_COLOPHON,
  V7_META_DESCRIPTION,
  V7_PRAISE_VOICES,
} from '@/content/v7';
import Motion from '@/components/v8/Motion';
import Nav from '@/components/v8/Nav';

export const metadata: Metadata = {
  title: { absolute: 'Nur Fajar, AI specialist who builds apps and communities' },
  description: V7_META_DESCRIPTION,
  robots: { index: false, follow: false },
};

function BioParagraph({ text }: { text: string }) {
  const marks = V7_BIO_LINKS.map((link) => ({ ...link, at: text.indexOf(link.phrase) }))
    .filter((m) => m.at >= 0)
    .sort((a, b) => a.at - b.at);
  if (!marks.length) return <p>{text}</p>;
  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  for (const { phrase, href, logo, size, at } of marks) {
    if (at < cursor) continue;
    if (at > cursor) nodes.push(text.slice(cursor, at));
    const label = text.slice(at, at + phrase.length);
    const isHttp = href.startsWith('http');
    nodes.push(
      <a
        key={`${at}-${phrase}`}
        href={href}
        className={logo ? 'v8-bio__brand' : undefined}
        {...(isHttp ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        {logo ? (
          <img src={logo} alt="" style={{ height: size ? `${size}em` : '1em' }} />
        ) : null}
        {label}
      </a>,
    );
    cursor = at + phrase.length;
  }
  if (cursor < text.length) nodes.push(text.slice(cursor));
  return <p>{nodes}</p>;
}

const NAV_ITEMS = [
  { id: 'work', label: 'Work' },
  { id: 'praise', label: 'Praise' },
  { id: 'contact', label: 'Contact' },
] as const;

/**
 * Kartu Selected work, kurasi ala mockup 52-carbon: enam kartu dalam grid
 * empat kolom. Teks kartu adalah kurasi dari fakta kanon v5/v7 (angka dan
 * klaim yang sama, kalimat lebih pendek), dengan link dari kanan case.
 */
const CARDS: {
  no: string;
  tone: 'blue' | 'gray' | 'green';
  title: string;
  desc: string;
  stat: string;
  links: { label: string; href: string }[];
}[] = [
  {
    no: '01',
    tone: 'blue',
    title: 'CRM pipeline',
    desc: '9 specialized Python + LLM agents with human-in-the-loop approval.',
    stat: '~11h runtime vs 300+h manual (96% less)',
    links: [{ label: 'Learn more', href: 'https://crm.nurfajar.com/' }],
  },
  {
    no: '02',
    tone: 'blue',
    title: 'Chatbot curriculum engine',
    desc: 'One engine on Smojo, adapted for business, education, and product managers.',
    stat: '5 programs · 150+ participants',
    links: [],
  },
  {
    no: '03',
    tone: 'gray',
    title: 'Web builds',
    desc: 'Brand concept sites and this folio on Next.js + TypeScript + Vercel.',
    stat: '3 sites live',
    links: [
      { label: 'Learn more', href: 'https://nurfajar.com' },
      { label: 'Case study', href: 'https://nadi-wellbeing.vercel.app/' },
    ],
  },
  {
    no: '04',
    tone: 'green',
    title: 'Remember & Nyunda',
    desc: 'A desktop assistant for tab overload, and a Sundanese learning app.',
    stat: '100% local · offline-first',
    links: [],
  },
  {
    no: '05',
    tone: 'gray',
    title: 'Alumni videos',
    desc: '4 short films and 24 published posts documenting community stories.',
    stat: '24 published posts',
    links: [{ label: 'Learn more', href: 'https://www.instagram.com/ai4impact.id/' }],
  },
  {
    no: '06',
    tone: 'gray',
    title: 'Community programs',
    desc: 'Owned end to end, from curriculum to delivery and measurement.',
    stat: 'Human-in-the-loop',
    links: [],
  },
];

export default function V8Page() {
  return (
    <>
      <Motion />
      <div className="v8-cursor" aria-hidden="true" />
      <Nav email={CONTACT.email} />

      <header className="v8-hero" id="top">
        <h1 className="v8-hero__h" data-split>
          AI specialist who builds apps and communities.
        </h1>
        <div className="v8-hero__bio" data-reveal>
          {V7_BIO.map((paragraph) => (
            <BioParagraph key={paragraph} text={paragraph} />
          ))}
        </div>
        <div className="v8-hero__cta" data-reveal>
          <a className="v8-btn v8-btn--primary" href={V5_FOUNDER_MAILTO}>
            Get in touch
          </a>
          <a className="v8-btn v8-btn--dark" href="#work">
            View work
          </a>
          <a className="v8-btn v8-btn--tertiary" href={CONTACT.cv} download={CONTACT.cvFilename}>
            Resume
          </a>
        </div>
      </header>

      <main className="v8-sheet">
        <section className="v8-sec" id="work" aria-labelledby="work-h">
          <h2 className="v8-sec__h" id="work-h" data-split>
            Project
          </h2>
          <p className="v8-sec__sub" data-reveal>
            Proof, shipped and measured.
          </p>
          <div className="v8-wgrid" data-reveal>
            {CARDS.map((card) => (
              <article key={card.no} className="v8-card">
                <span className={`v8-card__no v8-chip--${card.tone}`}>{card.no}</span>
                <h3 className="v8-card__title">{card.title}</h3>
                <p className="v8-card__desc">{card.desc}</p>
                <p className="v8-card__stat">{card.stat}</p>
                {card.links.length ? (
                  <p className="v8-card__links">
                    {card.links.map((link) => (
                      <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                        {link.label}
                      </a>
                    ))}
                  </p>
                ) : null}
              </article>
            ))}
            <div className="v8-wgrid__filler" aria-hidden="true" />
          </div>
        </section>

        <section className="v8-sec v8-praise" id="praise" aria-labelledby="praise-h">
          <h2 className="v8-sec__h" id="praise-h" data-split>
            In their words
          </h2>
          <div className="v8-quotes">
            {V7_PRAISE_VOICES.map((t) => (
              <figure key={t.name} className="v8-quote" data-reveal>
                <blockquote>“{t.quote}”</blockquote>
                <figcaption>
                  {t.name} · {t.relation}
                  {t.role ? ` · ${t.role}` : ''}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="v8-contact" id="contact" aria-labelledby="contact-h">
          <h2 className="v8-contact__mail" id="contact-h" data-split>
            <a href={V5_FOUNDER_MAILTO}>{CONTACT.email}</a>
          </h2>
          <p className="v8-contact__sub" data-reveal>
            Available immediately · remote or hybrid, onsite Indonesia, open to
            relocate · replies within 24 hours.
          </p>
        </section>
      </main>

      <footer className="v8-footer">
        <p>© 2026 Nur Fajar</p>
        <p>{V7_COLOPHON.build}</p>
      </footer>
    </>
  );
}
