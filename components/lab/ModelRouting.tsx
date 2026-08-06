import { MODEL_ROUTES } from '@/content/pipeline';
import Reveal from '../motion/Reveal';

export default function ModelRouting() {
  return (
    <section className="lab-section" id="routing">
      <Reveal as="div">
        <h2 className="section-label mono">MODEL ROUTING / WHERE THE EXPENSIVE MODEL GOES</h2>
        <p className="section-lede">
          Eight of nine agents run on the cheap model. One does not. The split is not about capability, it is about
          what a wrong answer costs.
        </p>
      </Reveal>
      <div className="route-grid">
        {MODEL_ROUTES.map((r, i) => (
          <Reveal as="div" className={`panel route${r.hot ? ' route-hot' : ''}`} key={r.id} index={i}>
            <p className="mono route-id">{r.id}</p>
            <h3>{r.title}</h3>
            <p>{r.body}</p>
          </Reveal>
        ))}
      </div>
      <p className="quote-note mono">
        Structured outputs enforced with JSON Schema throughout · DuckDuckGo Search and RSS for enrichment · all nine
        agents in Python.
      </p>
    </section>
  );
}
