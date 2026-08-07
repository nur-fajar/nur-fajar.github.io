import { EDUCATION } from '@/content/education';
import Reveal from './motion/Reveal';
import SectionHeading from './SectionHeading';

export default function Education() {
  return (
    <section id="education" className="section">
      <Reveal as="div">
        <SectionHeading num="05" title="Education & Credentials" />
      </Reveal>
      <div className="edu-grid">
        <Reveal as="div" className="panel edu" index={0}>
          <p className="mono program-id">{EDUCATION.school.id}</p>
          <h3>{EDUCATION.school.name}</h3>
          <p className="sig-sub">{EDUCATION.school.sub}</p>
          <p>{EDUCATION.school.body}</p>
        </Reveal>
        <Reveal as="div" className="panel edu" index={1}>
          <p className="mono program-id">{EDUCATION.certifications.id}</p>
          <h3>{EDUCATION.certifications.name}</h3>
          <p>
            {EDUCATION.certifications.body.split('\n').map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
