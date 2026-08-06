export interface ProgramUnit {
  title: string;
  detail: string;
}

export interface Program {
  id: string;
  title: string;
  summary: string;
  audience: string;
  prerequisites: string;
  units: ProgramUnit[];
  outcome: string;
  href: string;
}

export const PROGRAMS: Program[] = [
  {
    id: 'PRG / 01 · BEGINNER · 2H',
    title: 'Chatbots for Education',
    summary:
      'Non-technical teachers ship a published, AI-integrated educational chatbot in 2 hours — design thinking first, template-based build second.',
    audience: 'School teachers · Lecturers',
    prerequisites: 'None',
    units: [
      {
        title: 'Problem Framing',
        detail: 'Educator pain points · AI chatbot benefits · real-world examples from prior cohorts',
      },
      {
        title: 'Design Thinking Workshop',
        detail: 'Simplified 4-step framework — Why / For whom / About what / How · design worksheet completion',
      },
      {
        title: 'Build & Deploy',
        detail: 'Template customization · content authoring · ChatGPT integration · publish and test',
      },
    ],
    outcome: 'Learner leaves with: Design Thinking worksheet · published educational chatbot with design rationale',
    href: 'https://ai4impact.org/learn/detail?v=chatbots-for-education-id',
  },
  {
    id: 'PRG / 02 · BEGINNER · 2H',
    title: 'Chatbots for Business',
    summary:
      'Business owners deploy a live, branded customer-service chatbot in under 15 minutes, then customize and harden it against hallucination.',
    audience: 'SMB owners · Managers',
    prerequisites: 'None',
    units: [
      {
        title: 'Business Case + First Launch',
        detail: 'ROI framing · chatbot vs. website FAQ · live chatbot in under 15 min',
      },
      {
        title: 'Customization & Brand',
        detail: 'Industry-specific FAQs · tone and persona · welcome flow design',
      },
      {
        title: 'AI Integration + Risk',
        detail: 'LLM API activation · hallucination & scope creep · responsible deployment',
      },
    ],
    outcome: 'Learner leaves with: branded business chatbot on a live URL · failure-mode diagnosis skills',
    href: 'https://ai4impact.org/learn/detail?v=chatbots-for-business-id',
  },
  {
    id: 'PRG / 03 · INTERMEDIATE · 4H',
    title: 'GenAI Foundations',
    summary:
      'Developers build structured mental models of LLMs — from NLP history to transformer mechanics — through a progressive lab series ending in a deployed hybrid app.',
    audience: 'Backend & full-stack engineers',
    prerequisites: 'Programming experience in at least one language',
    units: [
      {
        title: 'NLP History & LLM Origins',
        detail: 'Template matching · grammar parsing · why both failed · what LLMs actually solve',
      },
      {
        title: 'LLM Fundamentals',
        detail: 'Transformer architecture · tokenization · context window · inference mechanics',
      },
      {
        title: 'Lab Series: Build & Deploy',
        detail: 'Environment setup · progressive code builds · API integration · deployment and testing',
      },
    ],
    outcome:
      'Learner leaves with: deployed LLM application · API integration skills · a working mental model of LLM architecture',
    href: 'https://ai4impact.org/learn/detail?v=gen-ai-foundations-id',
  },
  {
    id: 'PRG / 04 · SPECIALIST · 12H',
    title: 'GenAI Product Manager',
    summary:
      'Mid-to-senior PMs learn to own AI decisions — rule-vs-GPT trade-offs, risk thresholds, and prompt design as product decisions — via a real chatbot pivot case study.',
    audience: 'Mid-to-senior PMs · Product leads',
    prerequisites: 'JTBD, product discovery, and roadmapping experience',
    units: [
      {
        title: 'PM Mindset & Product Context',
        detail: 'Decision ownership under AI uncertainty · gap analysis · Keep/Change/Remove · reuse vs. rebuild',
      },
      {
        title: 'User Definition & Product Identity',
        detail: 'Persona + JTBD for AI products · UI/UX as PM decisions · feature scope · MoSCoW prioritization',
      },
      {
        title: 'Product Strategy & AI Integration',
        detail:
          'Value proposition design · rule-based vs. GPT trade-off · prompt engineering as a PM decision · analytics-driven iteration',
      },
    ],
    outcome:
      'Learner leaves with: published chatbot plus a full PM decision log · product gap analysis · AI feature prioritization skills',
    href: 'https://ai4impact.org/learn/detail?v=gen-ai-product-manager-id',
  },
];
