'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { AWARDS, REFERENCE_CARDS, SOCIAL, WORK, type ShowcaseCard, type ShowcaseQuote } from './data';

function Card({ item }: { item: ShowcaseCard }) {
  return (
    <div className="story-card">
      <span className="story-card__tag">{item.tag}</span>
      <span className="story-card__title">{item.title}</span>
      <span className="story-card__sub">{item.sub}</span>
    </div>
  );
}

function QuoteCard({ item }: { item: ShowcaseQuote }) {
  return (
    <figure className="story-card story-card--quote">
      <blockquote>“{item.quote}”</blockquote>
      <figcaption>
        <span className="story-card__name">{item.name}</span>
        <span className="story-card__sub">{item.role}</span>
      </figcaption>
    </figure>
  );
}

function Row({
  label,
  dir,
  duration,
  reduce,
  children,
}: {
  label: string;
  dir: 'left' | 'right';
  duration: string;
  reduce: boolean | null;
  children: React.ReactNode;
}) {
  return (
    <div className="story-marquee-block">
      <p className="story-marquee__label">{label}</p>
      <div className="story-marquee">
        <div
          className="story-marquee__row"
          data-dir={dir}
          style={
            reduce
              ? { animation: 'none', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }
              : { ['--marquee-duration' as string]: duration }
          }
        >
          {children}
          {/* Salinan kedua semata-mata agar loop -50% menyambung mulus.
              Disembunyikan dari screen reader supaya tidak terbaca dua kali. */}
          {!reduce && (
            <div style={{ display: 'contents' }} aria-hidden="true">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Showcase. Tiap baris punya isi yang benar-benar berbeda dan cukup banyak
 * (11 / 13 / 6 kartu unik) — kalau isinya cuma tiga, separuh track marquee
 * lebih sempit dari layar dan barisnya langsung terbaca sebagai pengulangan.
 * Semua materinya nyata, diambil dari content/ yang sudah ada di repo.
 */
export default function StoryShowcase() {
  const reduce = useReducedMotion();

  return (
    <section className="story-section story-showcase" aria-labelledby="story-work-h">
      <motion.h2
        className="story-showcase__heading"
        id="story-work-h"
        initial={reduce ? false : { opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        The awards, certifications, projects and milestones — and the{' '}
        <em>people who&apos;d vouch for them.</em>
      </motion.h2>

      <Row label="Awards · Certifications" dir="left" duration="52s" reduce={reduce}>
        {AWARDS.map((item, k) => (
          <Card key={k} item={item} />
        ))}
      </Row>

      <Row label="Projects · Milestones" dir="right" duration="58s" reduce={reduce}>
        {WORK.map((item, k) => (
          <Card key={k} item={item} />
        ))}
      </Row>

      <Row label="References" dir="left" duration="64s" reduce={reduce}>
        {REFERENCE_CARDS.map((item, k) => (
          <QuoteCard key={k} item={item} />
        ))}
        <a
          className="story-card story-card--more"
          href={SOCIAL.linkedin}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="story-card__tag">6 more</span>
          <span className="story-card__title">All 11 recommendations</span>
          <span className="story-card__sub">Read them on LinkedIn →</span>
        </a>
      </Row>
    </section>
  );
}
