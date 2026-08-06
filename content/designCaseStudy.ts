// Instructional design case study — "Chatbots for Business" taken apart.
// Used to live as its own page section (<DesignCaseStudy>); now it only
// surfaces inside the "Instructional design" skill popup, so the copy lives
// here as data instead of JSX.

export interface DlItem {
  term: string;
  desc: string;
}

export interface Objective {
  bloom: string;
  verb: string;
  text: string;
}

export interface FlowItem {
  kind: string;
  text: string;
}

export interface Lesson {
  title: string;
  duration: string;
  goal: string;
  flow: FlowItem[];
  note: string;
}

export interface Rung {
  when: string;
  what: string;
  bloom: string;
  text: string;
}

export const DESIGN_CASE_STUDY = {
  intro:
    'One course taken apart, so the design reasoning is visible rather than asserted. Chatbots for Business — 2 hours, 3 lessons, non-technical business owners, and a hard constraint: the session must end with a live published product, not a demo.',

  context: {
    label: '01 · DESIGN CONTEXT',
    items: [
      {
        term: 'Problem',
        desc: 'SMBs lose potential customers to unanswered inquiries — particularly outside business hours — but have no technical team to build automated solutions.',
      },
      {
        term: 'Gap',
        desc: 'Learners need to deploy a branded, functional AI chatbot. The barrier is not motivation, it is technical confidence.',
      },
      { term: 'Constraint', desc: 'A 2-hour synchronous session that must end with a live, published product.' },
    ] as DlItem[],
  },

  learnerProfile: {
    label: '02 · LEARNER PROFILE',
    items: [
      { term: 'Prior knowledge', desc: 'No programming background. Comfortable with spreadsheets and basic web tools.' },
      {
        term: 'Motivation',
        desc: 'ROI-driven. Wants to cut repetitive customer questions and improve response time without hiring.',
      },
      {
        term: 'Fears',
        desc: 'Breaking something technical they cannot fix · investing time in a tool that will not work for their business · looking incompetent in front of customers.',
      },
      {
        term: 'Design implication',
        desc: 'Confidence-building must precede complexity. Early success is a prerequisite for sustained engagement, not a bonus.',
      },
    ] as DlItem[],
  },

  objectives: {
    label: '03 · LEARNING OBJECTIVES',
    sub: 'Bloom-tagged, backward designed from the artifact',
    items: [
      {
        bloom: 'Understand',
        verb: 'Articulate',
        text: 'the business case for AI chatbots over static FAQ pages, including response time, availability, and cost trade-offs.',
      },
      {
        bloom: 'Apply',
        verb: 'Customize and deploy',
        text: 'a branded business chatbot from a template inside a live session environment.',
      },
      {
        bloom: 'Apply',
        verb: 'Integrate',
        text: 'an LLM API to handle open-ended customer queries that fall outside scripted flows.',
      },
      {
        bloom: 'Evaluate',
        verb: 'Identify and mitigate',
        text: 'common chatbot failure modes: hallucination, scope creep, and brand inconsistency.',
      },
    ] as Objective[],
  },

  sessionArchitecture: {
    label: '04 · SESSION ARCHITECTURE',
    lessons: [
      {
        title: 'Lesson 1 — Business Case + First Launch',
        duration: '35 min',
        goal: 'Goal: learner has a live chatbot before the lesson ends',
        flow: [
          { kind: 'Hook', text: 'Dental clinic scenario — a customer inquiry arrives at 11 PM on a Sunday. What happens next?' },
          {
            kind: 'Concept',
            text: 'Chatbot vs. website FAQ: availability, response quality, lead capture, cost per query.',
          },
          {
            kind: 'Activity',
            text: 'Live build: open template → rename business → set welcome message → publish. Target 12 minutes.',
          },
          { kind: 'Reflection', text: 'Share the live URL with a peer. First success checkpoint.' },
        ],
        note: 'Design note — "launch first, customize later": learners commit to the tool before they invest effort in it, which cuts the early dropout caused by abstract setup tasks.',
      },
      {
        title: 'Lesson 2 — Customization & Brand Identity',
        duration: '30 min',
        goal: "Goal: the chatbot reflects the learner's real business context",
        flow: [
          { kind: 'Concept', text: 'Brand elements in chatbot design: tone, persona, FAQ logic, welcome flow.' },
          {
            kind: 'Activity',
            text: 'Systematic customization — business name, at least 5 industry-specific FAQs, interaction tone, visual identity.',
          },
          { kind: 'Check', text: 'Peer test: does this chatbot actually answer your real customer questions?' },
        ],
        note: 'Design note — real business context removes abstraction. Learners are solving their own problem, not a hypothetical one.',
      },
      {
        title: 'Lesson 3 — AI Integration + Risk Management',
        duration: '35 min',
        goal: 'Goal: LLM integrated, and the learner can name and handle failure modes',
        flow: [
          { kind: 'Concept', text: 'Why LLMs: handling unpredictable questions that scripts cannot anticipate.' },
          {
            kind: 'Activity',
            text: 'Activate the LLM API in the existing chatbot → test with unexpected queries → observe behavior.',
          },
          {
            kind: 'Concept',
            text: 'Failure modes: hallucination (confidently wrong), scope creep (answering out-of-domain), brand drift.',
          },
          {
            kind: 'Activity',
            text: 'Diagnosis exercise — observe 3 chatbot behaviors, identify the failure type, apply the fix.',
          },
        ],
        note: 'Design note — risk comes after the first success. Introducing failure modes before a learner has experienced value creates anxiety that blocks learning.',
      },
    ] as Lesson[],
  },

  assessment: {
    label: '05 · ASSESSMENT',
    intro:
      'Two instruments, both testing whether the learner can do the thing rather than recall it — and neither asking the learner to rate their own competence.',
    rungs: [
      {
        when: 'During each lesson',
        what: 'Formative — behaviour-verification quizzes',
        bloom: 'Apply / Evaluate',
        text: 'Learners observe their own live chatbot, diagnose a described failure, then select and apply a fix. Tests application, not recall.',
      },
      {
        when: 'End of session',
        what: 'Summative — published artifact plus design rationale',
        bloom: 'Create / Evaluate',
        text: 'A live URL and three sentences explaining one design decision the learner made, and why. The rationale is what prevents rote completion — it is possible to finish the build without understanding it, but not to justify it.',
      },
    ] as Rung[],
  },
};
