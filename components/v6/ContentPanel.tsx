import { V6_HATS, V6_NEUTRAL, V6_SYLLABUS, V6_UNICORN, type V6StageMode } from '@/content/v6-hats';

/**
 * ContentPanel: isi portofolio yang berganti mengikuti topi. Satu heading,
 * satu detail, grid angka (setiap angka bawa metodenya, dari ledger), lalu
 * blok spesifik per topi (silabus / tautan karya) dan tautan aksi.
 */
export default function ContentPanel({ mode }: { mode: V6StageMode }) {
  if (mode === 'unicorn') {
    return (
      <section className="v6-panel v6-panel--unicorn" aria-live="polite">
        <h2 className="v6-panel__heading">{V6_UNICORN.heading}</h2>
        <p className="v6-panel__message">{V6_UNICORN.message}</p>
        <a className="v6-cta v6-cta--rainbow" href={V6_UNICORN.cta.href}>
          {V6_UNICORN.cta.label} ↗
        </a>
      </section>
    );
  }

  if (mode === 'neutral') {
    return (
      <section className="v6-panel" aria-live="polite">
        <h2 className="v6-panel__heading">{V6_NEUTRAL.heading}</h2>
        <p>{V6_NEUTRAL.body}</p>
        <ul className="v6-chiprow">
          {V6_NEUTRAL.chips.map((chip) => (
            <li key={chip.label} className="v6-chip" style={{ ['--hat-accent' as string]: chip.accent }}>
              {chip.label}
            </li>
          ))}
        </ul>
      </section>
    );
  }

  const hat = V6_HATS.find((item) => item.id === mode)!;
  return (
    <section className="v6-panel" style={{ ['--hat-accent' as string]: hat.accent }} aria-live="polite">
      <p className="v6-panel__kicker">
        {hat.glyph} {hat.name}
      </p>
      <h2 className="v6-panel__heading">{hat.title}</h2>
      <p className="v6-panel__detail">{hat.detail}</p>

      <ul className="v6-stats">
        {hat.stats.map((stat) => (
          <li key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
            <small>{stat.method}</small>
          </li>
        ))}
      </ul>

      {mode === 'trainer' ? (
        <div className="v6-block">
          <h3>Sample syllabus</h3>
          <ul>
            {V6_SYLLABUS.map((module) => (
              <li key={module.title}>
                {module.title} <small>{module.meta}</small>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <ul className="v6-links">
        {hat.links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              {link.external ? '↗' : '→'} {link.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
