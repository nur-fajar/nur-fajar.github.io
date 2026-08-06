export interface SkillGroup {
  id: string;
  label: string;
  items: string[];
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'SKL / 01',
    label: 'AI ENGINEERING',
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
    id: 'SKL / 02',
    label: 'LEARNING & DEVELOPMENT',
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
    id: 'SKL / 03',
    label: 'PRODUCT & PROGRAM',
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
    id: 'SKL / 04',
    label: 'TOOLS',
    items: ['Google Workspace', 'Notion', 'Miro', 'Discord', 'Smojo', 'Apollo.io', 'Adobe Premiere Pro'],
  },
];
