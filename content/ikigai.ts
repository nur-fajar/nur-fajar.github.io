import type { Accent } from './skills';

export interface IkigaiRole {
  id: string;
  label: string;
  accent: Accent;
  skills: string[];
}

// Hero Venn/orbit diagram (see components/IkigaiVenn.tsx) — six professional
// identities converging on one point (the center photo). Order here is the
// visual order too: index 0 sits at the top of the diagram and the rest
// follow clockwise, alternating warmth/signal so no two neighboring circles
// share a hue. Paired by theme going around — L&D+AI (content/technical),
// Program Manager+Leadership (org), Community+Social (audience-facing).
//
// L&D and AI / Automation Engineering skill lists are confirmed. The other
// four are placeholders inferred from the resume/experience content already
// on this site — flagged `// TODO: confirm` and awaiting the real list.
export const IKIGAI_ROLES: IkigaiRole[] = [
  {
    id: 'ld',
    label: 'L&D',
    accent: 'warmth',
    skills: ['Curriculum Development', 'Instructional Design', 'ADDIE Framework', 'Facilitation', "Bloom's Taxonomy", 'Learning Management System'],
  },
  {
    id: 'ai',
    label: 'AI / Automation Engineering',
    accent: 'signal',
    skills: ['CRM Automation', 'Prompt Engineering (Claude, Gemini, ChatGPT)', 'Workflow Automation (n8n)', 'Sentiment Analysis', 'Data Analysis'],
  },
  {
    id: 'program-manager',
    label: 'Program Manager',
    accent: 'warmth',
    // TODO: confirm — placeholder, not yet reviewed against the real skill set.
    skills: ['Program Planning & Execution', 'Stakeholder Management', 'Timeline & Resource Management', 'Program Evaluation', 'Cross-functional Coordination'],
  },
  {
    id: 'leadership',
    label: 'Leadership',
    accent: 'signal',
    // TODO: confirm — placeholder, not yet reviewed against the real skill set.
    skills: ['Team Management', 'Decision Making', 'Mentoring & Coaching', 'Strategic Planning', 'Conflict Resolution'],
  },
  {
    id: 'community-manager',
    label: 'Community Manager',
    accent: 'warmth',
    // TODO: confirm — placeholder, not yet reviewed against the real skill set.
    skills: ['Community Engagement & Growth', 'Content Moderation', 'Event Coordination', 'Member Support & Onboarding', 'Feedback Collection & Reporting'],
  },
  {
    id: 'social-media',
    label: 'Social Media Specialist',
    accent: 'signal',
    // TODO: confirm — placeholder, not yet reviewed against the real skill set.
    skills: ['Content Creation', 'Social Media Strategy', 'Video Production', 'Analytics & Reporting', 'Community Growth'],
  },
];
