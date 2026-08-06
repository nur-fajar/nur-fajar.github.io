import { PROGRAMS } from '@/content/programs';

// Full "Programs / Curriculum Designed" content — used to be its own page
// section, now lives only inside the "Curriculum development" skill popup.
export default function CurriculumDetail() {
  return (
    <div>
      <p className="skill-detail-intro">
        Four published LMS courses, 20 hours of contact time, on <strong>ai4impact</strong> — Terra AI&apos;s own
        learning platform for teaching the software built in-house. Every course is backward designed from a
        published artifact: the learner does not leave with notes, they leave with something running.
      </p>

      {PROGRAMS.map((p) => (
        <div className="skill-detail-card" key={p.id}>
          <p className="mono program-id">{p.id}</p>
          <h4>{p.title}</h4>
          <p>{p.summary}</p>
          <dl className="prg-meta mono">
            <dt>Audience</dt>
            <dd>{p.audience}</dd>
            <dt>Prerequisites</dt>
            <dd>{p.prerequisites}</dd>
          </dl>
          <details className="prg-outline">
            <summary className="mono">Unit breakdown</summary>
            <ol className="prg-units">
              {p.units.map((u) => (
                <li key={u.title}>
                  <strong>{u.title}</strong>
                  <span>{u.detail}</span>
                </li>
              ))}
            </ol>
            <p className="prg-outcome mono">{p.outcome}</p>
          </details>
          <a className="prg-link mono" href={p.href} target="_blank" rel="noopener">
            Open on ai4impact ↗
          </a>
        </div>
      ))}

      <p className="skill-detail-footnote mono">
        Design frameworks applied across the set: backward design and Bloom&apos;s taxonomy in all four · design
        thinking in both chatbot courses · JTBD and MoSCoW in the PM track · problem-based learning in Foundations.
      </p>
    </div>
  );
}
