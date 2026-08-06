import { TRACKS } from '@/content/tracks';
import Reveal from './motion/Reveal';

export default function Tracks() {
  return (
    <section id="tracks" className="section">
      <Reveal as="div">
        <h2 className="section-label mono">TRACKS</h2>
      </Reveal>
      <div className="track-grid">
        {TRACKS.map((t, i) => (
          <Reveal as="article" className="track panel" key={t.id} index={i}>
            <p className="mono track-role">{t.role}</p>
            <h3>{t.title}</h3>
            <p>{t.body}</p>
            <ul className="tags mono">
              {t.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
