import { WORK_EXPERIENCE, ORGANIZATION_EXPERIENCE } from '@/content/signals';
import SignalList from './SignalList';
import SectionHeading from './SectionHeading';
import Reveal from './motion/Reveal';

export function WorkSignals() {
  return (
    <section id="signals" className="section">
      <Reveal as="div">
        <SectionHeading num="01" title="Experience" />
      </Reveal>
      <SignalList items={WORK_EXPERIENCE} />
    </section>
  );
}

export function OrganizationSignals() {
  return (
    <section id="organization" className="section">
      <Reveal as="div">
        <SectionHeading num="02" title="Organizations" />
        <p className="section-lede">
          Enablement work is facilitation work, and facilitation takes reps. These are the three that built them — a
          chapter founded from zero, a 2,000-person programme, and a village team of 16. Eight organisations in
          total; the rest are on LinkedIn.
        </p>
      </Reveal>
      <SignalList items={ORGANIZATION_EXPERIENCE} />
    </section>
  );
}
