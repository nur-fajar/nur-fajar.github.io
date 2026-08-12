import { CREDIBILITY } from '@/content/credibility';
import Reveal from './motion/Reveal';
import StatCountUp from './motion/StatCountUp';

export default function TrackRecord() {
  return (
    <section id="track-record">
      <Reveal as="div">
        <h2 className="numbered-heading">
          <span className="num mono">03.</span> Track Record
        </h2>
      </Reveal>

      <Reveal as="p" className="track-lede" index={1}>
        {CREDIBILITY.lede}
      </Reveal>

      <div className="track-grid">
        <Reveal as="div" className="track-card" index={0}>
          <span className="track-num">
            <StatCountUp value={CREDIBILITY.main.num} />
          </span>
          <p className="track-label">{CREDIBILITY.main.label}</p>
          <p>{CREDIBILITY.main.body}</p>
          <p>{CREDIBILITY.main.thesis}</p>
        </Reveal>

        <Reveal as="div" className="track-card" index={1}>
          <span className="track-num">
            <StatCountUp value={CREDIBILITY.bangkit.num} />
          </span>
          <p className="track-label">{CREDIBILITY.bangkit.label}</p>
          <p>{CREDIBILITY.bangkit.body}</p>
        </Reveal>

        <Reveal as="div" className="track-card" index={2}>
          <span className="track-num">
            <StatCountUp value={CREDIBILITY.terra.num} />
          </span>
          <p className="track-label">{CREDIBILITY.terra.label}</p>
          <p>{CREDIBILITY.terra.body}</p>
        </Reveal>
      </div>

      <Reveal as="div" className="track-certs" index={3}>
        {CREDIBILITY.certifications.map((c) => (
          <p key={c}>{c}</p>
        ))}
      </Reveal>
    </section>
  );
}
