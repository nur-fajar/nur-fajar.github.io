import { Fragment } from 'react';
import { DESIGN_CASE_STUDY } from '@/content/designCaseStudy';

// Full "Instructional Design / Case Study" content — used to be its own
// page section, now lives only inside the "Instructional design" skill
// popup.
export default function InstructionalDesignDetail() {
  const { intro, context, learnerProfile, objectives, sessionArchitecture, assessment } = DESIGN_CASE_STUDY;

  return (
    <div>
      <p className="skill-detail-intro">{intro}</p>

      <div className="skill-detail-card">
        <h4 className="mono case-label">{context.label}</h4>
        <dl className="case-dl">
          {context.items.map((it) => (
            <Fragment key={it.term}>
              <dt>{it.term}</dt>
              <dd>{it.desc}</dd>
            </Fragment>
          ))}
        </dl>
      </div>

      <div className="skill-detail-card">
        <h4 className="mono case-label">{learnerProfile.label}</h4>
        <dl className="case-dl">
          {learnerProfile.items.map((it) => (
            <Fragment key={it.term}>
              <dt>{it.term}</dt>
              <dd>{it.desc}</dd>
            </Fragment>
          ))}
        </dl>
      </div>

      <div className="skill-detail-card">
        <h4 className="mono case-label">
          {objectives.label} <span className="case-sub">{objectives.sub}</span>
        </h4>
        <ul className="case-obj">
          {objectives.items.map((o) => (
            <li key={o.verb}>
              <span className="bloom mono">{o.bloom}</span> <strong>{o.verb}</strong> {o.text}
            </li>
          ))}
        </ul>
      </div>

      <div className="skill-detail-card">
        <h4 className="mono case-label">{sessionArchitecture.label}</h4>
        <ol className="case-lessons">
          {sessionArchitecture.lessons.map((lesson) => (
            <li key={lesson.title}>
              <p className="case-lesson-head">
                <strong>{lesson.title}</strong> <span className="mono">{lesson.duration}</span>
              </p>
              <p className="case-goal mono">{lesson.goal}</p>
              <ul className="case-flow">
                {lesson.flow.map((f, i) => (
                  <li key={i}>
                    <span className="flow-kind mono">{f.kind}</span> {f.text}
                  </li>
                ))}
              </ul>
              <p className="case-note">{lesson.note}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="skill-detail-card">
        <h4 className="mono case-label">{assessment.label}</h4>
        <p className="case-intro">{assessment.intro}</p>
        <ol className="ladder">
          {assessment.rungs.map((r) => (
            <li className="rung" key={r.when}>
              <p className="rung-when mono">{r.when}</p>
              <p className="rung-what">
                {r.what} <span className="bloom mono">{r.bloom}</span>
              </p>
              <p>{r.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
