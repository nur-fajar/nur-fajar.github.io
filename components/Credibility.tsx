import { CREDIBILITY } from '@/content/credibility';
import Reveal from './motion/Reveal';
import SpotlightPanel from './motion/SpotlightPanel';

// The module design brief §4a asks for: not a small "Education" footer, but
// its own prominent block right after the hero, pairing the GPA with the
// leadership load carried at the same time, naming both scholarships, and
// giving the two Kampus Merdeka placements (Bangkit, Terra AI) numeral
// weight comparable to the hero stats.
export default function Credibility() {
  return (
    <section id="credibility" className="section">
      <Reveal as="div" className="cred-head">
        <h2 className="section-label">{CREDIBILITY.headline}</h2>
        <p className="cred-lede">{CREDIBILITY.lede}</p>
      </Reveal>

      <div className="cred-grid">
        <SpotlightPanel className="panel cred-card cred-card-main">
          <Reveal as="div" index={0}>
            <span className="cred-num">{CREDIBILITY.main.num}</span>
            <p className="cred-num-label">{CREDIBILITY.main.label}</p>
            <p>{CREDIBILITY.main.body}</p>
            <p>{CREDIBILITY.main.thesis}</p>
            <div className="cred-scholarships">
              {CREDIBILITY.main.scholarships.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          </Reveal>
        </SpotlightPanel>

        <SpotlightPanel className="panel cred-card">
          <Reveal as="div" index={1}>
            <span className="cred-num">{CREDIBILITY.bangkit.num}</span>
            <p className="cred-num-label">{CREDIBILITY.bangkit.label}</p>
            <p>{CREDIBILITY.bangkit.body}</p>
          </Reveal>
        </SpotlightPanel>

        <SpotlightPanel className="panel cred-card">
          <Reveal as="div" index={2}>
            <span className="cred-num">{CREDIBILITY.terra.num}</span>
            <p className="cred-num-label">{CREDIBILITY.terra.label}</p>
            <p>{CREDIBILITY.terra.body}</p>
          </Reveal>
        </SpotlightPanel>
      </div>

      <Reveal as="div" className="panel cred-foot">
        {CREDIBILITY.certifications.map((c) => (
          <p key={c}>{c}</p>
        ))}
      </Reveal>
    </section>
  );
}
