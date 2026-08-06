import Reveal from './motion/Reveal';

// Instructional design, shown rather than claimed — one module is bundled
// full: context, learner profile, Bloom-tagged objectives, session
// architecture, and the reasoning behind every design decision.
export default function DesignCaseStudy() {
  return (
    <section id="design" className="section">
      <Reveal as="div">
        <h2 className="section-label mono">INSTRUCTIONAL DESIGN / CASE STUDY</h2>
        <p className="section-lede">
          One course taken apart, so the design reasoning is visible rather than asserted.{' '}
          <strong>Chatbots for Business</strong> — 2 hours, 3 lessons, non-technical business owners, and a hard
          constraint: the session must end with a live published product, not a demo.
        </p>
      </Reveal>

      <Reveal as="div" className="panel case-block" index={0}>
        <h3 className="mono case-label">01 · DESIGN CONTEXT</h3>
        <dl className="case-dl">
          <dt>Problem</dt>
          <dd>
            SMBs lose potential customers to unanswered inquiries — particularly outside business hours — but have
            no technical team to build automated solutions.
          </dd>
          <dt>Gap</dt>
          <dd>
            Learners need to deploy a branded, functional AI chatbot. The barrier is not motivation, it is technical
            confidence.
          </dd>
          <dt>Constraint</dt>
          <dd>A 2-hour synchronous session that must end with a live, published product.</dd>
        </dl>
      </Reveal>

      <Reveal as="div" className="panel case-block" index={1}>
        <h3 className="mono case-label">02 · LEARNER PROFILE</h3>
        <dl className="case-dl">
          <dt>Prior knowledge</dt>
          <dd>No programming background. Comfortable with spreadsheets and basic web tools.</dd>
          <dt>Motivation</dt>
          <dd>ROI-driven. Wants to cut repetitive customer questions and improve response time without hiring.</dd>
          <dt>Fears</dt>
          <dd>
            Breaking something technical they cannot fix · investing time in a tool that will not work for their
            business · looking incompetent in front of customers.
          </dd>
          <dt>Design implication</dt>
          <dd>Confidence-building must precede complexity. Early success is a prerequisite for sustained engagement, not a bonus.</dd>
        </dl>
      </Reveal>

      <Reveal as="div" className="panel case-block" index={2}>
        <h3 className="mono case-label">
          03 · LEARNING OBJECTIVES <span className="case-sub">Bloom-tagged, backward designed from the artifact</span>
        </h3>
        <ul className="case-obj">
          <li>
            <span className="bloom mono">Understand</span> <strong>Articulate</strong> the business case for AI
            chatbots over static FAQ pages, including response time, availability, and cost trade-offs.
          </li>
          <li>
            <span className="bloom mono">Apply</span> <strong>Customize and deploy</strong> a branded business
            chatbot from a template inside a live session environment.
          </li>
          <li>
            <span className="bloom mono">Apply</span> <strong>Integrate</strong> an LLM API to handle open-ended
            customer queries that fall outside scripted flows.
          </li>
          <li>
            <span className="bloom mono">Evaluate</span> <strong>Identify and mitigate</strong> common chatbot
            failure modes: hallucination, scope creep, and brand inconsistency.
          </li>
        </ul>
      </Reveal>

      <Reveal as="div" className="panel case-block" index={3}>
        <h3 className="mono case-label">04 · SESSION ARCHITECTURE</h3>
        <ol className="case-lessons">
          <li>
            <p className="case-lesson-head">
              <strong>Lesson 1 — Business Case + First Launch</strong> <span className="mono">35 min</span>
            </p>
            <p className="case-goal mono">Goal: learner has a live chatbot before the lesson ends</p>
            <ul className="case-flow">
              <li>
                <span className="flow-kind mono">Hook</span> Dental clinic scenario — a customer inquiry arrives at
                11 PM on a Sunday. What happens next?
              </li>
              <li>
                <span className="flow-kind mono">Concept</span> Chatbot vs. website FAQ: availability, response
                quality, lead capture, cost per query.
              </li>
              <li>
                <span className="flow-kind mono">Activity</span> Live build: open template → rename business → set
                welcome message → publish. Target 12 minutes.
              </li>
              <li>
                <span className="flow-kind mono">Reflection</span> Share the live URL with a peer. First success
                checkpoint.
              </li>
            </ul>
            <p className="case-note">
              Design note — &quot;launch first, customize later&quot;: learners commit to the tool before they invest
              effort in it, which cuts the early dropout caused by abstract setup tasks.
            </p>
          </li>
          <li>
            <p className="case-lesson-head">
              <strong>Lesson 2 — Customization &amp; Brand Identity</strong> <span className="mono">30 min</span>
            </p>
            <p className="case-goal mono">Goal: the chatbot reflects the learner&apos;s real business context</p>
            <ul className="case-flow">
              <li>
                <span className="flow-kind mono">Concept</span> Brand elements in chatbot design: tone, persona, FAQ
                logic, welcome flow.
              </li>
              <li>
                <span className="flow-kind mono">Activity</span> Systematic customization — business name, at least
                5 industry-specific FAQs, interaction tone, visual identity.
              </li>
              <li>
                <span className="flow-kind mono">Check</span> Peer test: does this chatbot actually answer your real
                customer questions?
              </li>
            </ul>
            <p className="case-note">
              Design note — real business context removes abstraction. Learners are solving their own problem, not a
              hypothetical one.
            </p>
          </li>
          <li>
            <p className="case-lesson-head">
              <strong>Lesson 3 — AI Integration + Risk Management</strong> <span className="mono">35 min</span>
            </p>
            <p className="case-goal mono">Goal: LLM integrated, and the learner can name and handle failure modes</p>
            <ul className="case-flow">
              <li>
                <span className="flow-kind mono">Concept</span> Why LLMs: handling unpredictable questions that
                scripts cannot anticipate.
              </li>
              <li>
                <span className="flow-kind mono">Activity</span> Activate the LLM API in the existing chatbot → test
                with unexpected queries → observe behavior.
              </li>
              <li>
                <span className="flow-kind mono">Concept</span> Failure modes: hallucination (confidently wrong),
                scope creep (answering out-of-domain), brand drift.
              </li>
              <li>
                <span className="flow-kind mono">Activity</span> Diagnosis exercise — observe 3 chatbot behaviors,
                identify the failure type, apply the fix.
              </li>
            </ul>
            <p className="case-note">
              Design note — risk comes after the first success. Introducing failure modes before a learner has
              experienced value creates anxiety that blocks learning.
            </p>
          </li>
        </ol>
      </Reveal>

      <Reveal as="div" className="panel case-block" index={4}>
        <h3 className="mono case-label">05 · ASSESSMENT</h3>
        <p className="case-intro">
          Two instruments, both testing whether the learner can do the thing rather than recall it — and neither
          asking the learner to rate their own competence.
        </p>

        <ol className="ladder">
          <li className="rung">
            <p className="rung-when mono">During each lesson</p>
            <p className="rung-what">
              Formative — behaviour-verification quizzes <span className="bloom mono">Apply / Evaluate</span>
            </p>
            <p>
              Learners observe their own live chatbot, diagnose a described failure, then select and apply a fix.
              Tests application, not recall.
            </p>
          </li>

          <li className="rung">
            <p className="rung-when mono">End of session</p>
            <p className="rung-what">
              Summative — published artifact plus design rationale <span className="bloom mono">Create / Evaluate</span>
            </p>
            <p>
              A live URL and three sentences explaining one design decision the learner made, and why. The rationale
              is what prevents rote completion — it is possible to finish the build without understanding it, but
              not to justify it.
            </p>
          </li>
        </ol>
      </Reveal>
    </section>
  );
}
