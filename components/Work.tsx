import { PIPELINE_MAP } from '@/content/pipeline';
import { DESIGN_CASE_STUDY } from '@/content/designCaseStudy';
import { PROGRAMS } from '@/content/programs';
import { ExternalLinkIcon } from './icons';
import Reveal from './motion/Reveal';

const chatbotsForBusiness = PROGRAMS.find((p) => p.title === 'Chatbots for Business');

export default function Work() {
  return (
    <section id="work">
      <Reveal as="div">
        <h2 className="numbered-heading">
          <span className="num mono">05.</span> Featured Work
        </h2>
      </Reveal>

      <div className="featured-list">
        <Reveal as="div" className="featured-item">
          <div className="f-content">
            <p className="f-overline mono">Featured Project</p>
            <h3 className="f-title">B2B Outreach Automation Pipeline</h3>
            <div className="f-desc">
              <p>
                A 9-agent Python pipeline built solo at Terra Weather: enriches CRM contacts, pulls company news,
                drafts personalized cold email plus a 3-step follow-up cadence, then classifies and drafts replies —
                all on GPT-4o-mini, escalating to GPT-4o only for reply classification, where misreading an opt-out
                is a compliance problem rather than a wasted call.
              </p>
              <p>
                Outbound send is the one step that never runs unattended — dispatch waits for a human-approved
                review window every evening. Everything else runs on its own.
              </p>
              <p>~3,000 leads processed · 600 qualified prospects surfaced · per-prospect prep time cut 83%.</p>
            </div>
            <ul className="f-tags mono">
              <li>Python</li>
              <li>GPT-4o-mini</li>
              <li>GPT-4o</li>
              <li>CRM Automation</li>
              <li>Human-in-the-loop</li>
            </ul>
          </div>
          <div className="f-visual">
            <div className="node-diagram">
              {PIPELINE_MAP.map((n) => (
                <div key={n.phase + n.name} className={`p-node${n.gate ? ' is-gate' : ''}`}>
                  <span className="p-phase mono">{n.phase}</span>
                  <span className="p-name">{n.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal as="div" className="featured-item" index={1}>
          <div className="f-content">
            <p className="f-overline mono">Featured Project</p>
            <h3 className="f-title">Chatbots for Business — Course Design</h3>
            <div className="f-desc">
              <p>{DESIGN_CASE_STUDY.intro}</p>
            </div>
            <ul className="f-tags mono">
              <li>Instructional Design</li>
              <li>ADDIE</li>
              <li>Bloom&apos;s Taxonomy</li>
              <li>LLM API Integration</li>
              <li>Assessment Design</li>
            </ul>
            {chatbotsForBusiness && (
              <div className="f-links">
                <a href={chatbotsForBusiness.href} aria-label="Open course" target="_blank" rel="noreferrer">
                  <ExternalLinkIcon />
                </a>
              </div>
            )}
          </div>
          <div className="f-visual">
            <div className="node-diagram">
              {DESIGN_CASE_STUDY.sessionArchitecture.lessons.map((l) => (
                <div key={l.title} className="p-node">
                  <span className="p-phase mono">{l.duration}</span>
                  <span className="p-name">{l.title.replace(/^Lesson \d+ — /, '')}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
