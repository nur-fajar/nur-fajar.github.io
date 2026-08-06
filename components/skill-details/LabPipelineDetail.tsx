import { AGENT_STEPS, MODEL_ROUTES } from '@/content/pipeline';

/** Renders `**text**` as bold — the only markup an agent-step body needs. */
function renderBold(text: string) {
  const parts = text.split(/\*\*([^*]+)\*\*/g);
  return parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part));
}

// Full "Lab / Pipeline Teardown" content — used to be its own route (/lab),
// now lives only inside the "AI agents" skill popup. The scroll-driven
// sticky map from the old page doesn't make sense inside a modal, so this
// is a plain ordered walk through the same nine agents instead.
export default function LabPipelineDetail() {
  return (
    <div>
      <p className="skill-detail-intro">
        The B2B outreach pipeline behind Track 01 (see Signals — Learning &amp; Development Specialist), taken apart
        agent by agent. Most of it runs unattended. Exactly one step does not, and that choice is the most important
        design decision in the system.
      </p>

      {AGENT_STEPS.map((step) => (
        <div className={`skill-detail-card${step.gate ? ' skill-detail-card-gate' : ''}`} key={step.id}>
          <p className="mono agent-id">{step.id}</p>
          <h4>{step.title}</h4>
          <p className="mono agent-file">{step.file}</p>
          {step.claim && <p className="agent-claim">{step.claim}</p>}
          {step.body.map((p, i) => (
            <p key={i}>{renderBold(p)}</p>
          ))}
          <dl className="agent-io mono">
            <dt>In</dt>
            <dd>{step.io.in}</dd>
            <dt>Out</dt>
            <dd>{step.io.out}</dd>
            <dt>Model</dt>
            <dd>{step.io.model}</dd>
          </dl>
          {step.note && <p className="agent-note">{step.note}</p>}
        </div>
      ))}

      <div className="skill-detail-card">
        <p className="mono skill-detail-label">MODEL ROUTING / WHERE THE EXPENSIVE MODEL GOES</p>
        <p className="skill-detail-intro">
          Eight of nine agents run on the cheap model. One does not. The split is not about capability, it is about
          what a wrong answer costs.
        </p>
        {MODEL_ROUTES.map((r) => (
          <div key={r.id} className={`skill-detail-subcard${r.hot ? ' skill-detail-subcard-hot' : ''}`}>
            <p className="mono route-id">{r.id}</p>
            <h4>{r.title}</h4>
            <p>{r.body}</p>
          </div>
        ))}
        <p className="skill-detail-footnote mono">
          Structured outputs enforced with JSON Schema throughout · DuckDuckGo Search and RSS for enrichment · all
          nine agents in Python.
        </p>
      </div>
    </div>
  );
}
