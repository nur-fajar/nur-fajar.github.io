export type Accent = 'warmth' | 'signal';

export interface SkillItem {
  name: string;
  /** Per-item accent override — used for the one item (Apollo.io) that
      belongs in an otherwise-warmth group but is really part of the
      automation pipeline. Falls back to the group's own accent. */
  accent?: Accent;
}

export interface SkillGroup {
  id: string;
  label: string;
  accent: Accent;
  /** Column span out of 12 — sized to item count (design brief §3, layout),
      not forced into equal boxes. */
  span: number;
  items: (string | SkillItem)[];
}

// Ordered for the L&D audience this version is built for (design brief §4b):
// L&D leads, Content Production is new and explicit, Product & Program
// stays L&D-adjacent, AI Engineering & Automation moves last — still fully
// present, correctly weighted as the differentiator rather than the
// headline, tagged `signal` (teal) instead of the page's default `warmth`.
export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: '01',
    label: 'Learning & Development',
    accent: 'warmth',
    span: 8,
    items: [
      'Instructional design',
      'Curriculum development',
      'ADDIE',
      'Backward design',
      "Bloom's taxonomy",
      'Kirkpatrick L1',
      'Train the Trainers',
      'Facilitation',
      'Cohort-based learning',
      'Learner analytics',
      'LMS management',
      'Assessment design',
    ],
  },
  {
    id: '02',
    label: 'Content Production',
    accent: 'warmth',
    span: 4,
    items: [
      'Video editing (Adobe Premiere Pro)',
      'Poster & visual design (CorelDraw)',
      'Testimonial & alumni video production',
      'Curriculum visual assets',
    ],
  },
  {
    id: '03',
    label: 'Product & Program',
    accent: 'warmth',
    span: 5,
    items: [
      'Program management',
      'Design thinking',
      'Jobs-to-be-Done',
      'MoSCoW prioritization',
      'Stakeholder mapping',
      'Community building',
    ],
  },
  {
    id: '04',
    label: 'AI Engineering & Automation',
    accent: 'signal',
    span: 7,
    items: [
      'Python',
      'LLM APIs (GPT-4o-mini)',
      'Prompt engineering',
      'AI agents',
      'CRM automation',
      'Email automation',
      'HITL pipelines',
      'Data enrichment',
      'TensorFlow',
      'Sentiment analysis',
      'Ensemble learning',
      'SMOTE',
    ],
  },
  {
    id: '05',
    label: 'Tools',
    accent: 'warmth',
    span: 12,
    items: [
      'Google Workspace',
      'Notion',
      'Miro',
      'Discord',
      'Smojo',
      'Adobe Premiere Pro',
      { name: 'Apollo.io', accent: 'signal' },
    ],
  },
];
