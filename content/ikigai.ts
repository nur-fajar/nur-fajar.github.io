import type { Accent } from './skills';

export interface IkigaiRole {
  id: string;
  label: string;
  accent: Accent;
  skills: string[];
}

// Hero radial diagram (see components/IkigaiVenn.tsx) — five professional
// identities arranged clockwise around a center photo, each overlapping its
// two neighbors. Order here IS the visual order (index 0 at the top,
// clockwise) and it's load-bearing, not aesthetic: IKIGAI_INTERSECTIONS[i]
// labels the overlap between IKIGAI_ROLES[i] and IKIGAI_ROLES[i+1], so
// reordering this array without updating that one breaks the pairing.
//
// All five skill lists below are final, confirmed by Nur Fajar — copied
// verbatim, not paraphrased or resized.
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
    skills: ['Program Planning & Coordination', 'Team Leadership', 'Cross-functional Stakeholder Management', 'Program Execution', 'Tools: Notion, Google Sheets'],
  },
  {
    id: 'community-manager',
    label: 'Community Manager',
    accent: 'signal',
    skills: ['Community Management', 'Follower/Audience Communication (untuk ai4impact dan Terra AI)'],
  },
  {
    id: 'social-media',
    label: 'Social Media Specialist',
    accent: 'warmth',
    skills: ['Content Production (Canva, CapCut, Premiere)'],
  },
];

// Labels the overlap lens between each role and the next one clockwise
// (index i <-> IKIGAI_ROLES[i] + IKIGAI_ROLES[(i + 1) % length]); the last
// entry wraps back to index 0. Final, confirmed wording — verbatim.
export const IKIGAI_INTERSECTIONS: string[] = [
  'AI-powered training design', // L&D + AI / Automation Engineering
  'Automation program delivery', // AI / Automation Engineering + Program Manager
  'Community program management', // Program Manager + Community Manager
  'Audience content engagement', // Community Manager + Social Media Specialist
  'Educational content creation', // Social Media Specialist + L&D
];
