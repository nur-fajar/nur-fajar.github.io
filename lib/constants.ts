export const COLORS = {
  accent: '#E3A857',
  accent2: '#C0654A',
  bg: '#0B0A08',
  surface: '#16130F',
  border: '#2B251C',
  borderLight: '#3A3226',
  text: '#F3EEE4',
  muted: '#B7AFA0',
  subtle: '#7C7365',
} as const

export const ROLES = [
  { text: 'AI Systems Builder', color: COLORS.accent },
  { text: 'GenAI Trainer & Facilitator', color: COLORS.accent2 },
  { text: 'AI L&D Program Manager', color: COLORS.accent },
] as const

export const STATS = [
  { number: '350+', label: 'Learners Trained', color: COLORS.accent2 },
  { number: '3.94', label: 'GPA · Best Graduate', color: COLORS.accent },
  { number: '2', label: 'Google Certifications', color: COLORS.accent },
  { number: '#1', label: 'Faculty Best Graduate', color: COLORS.accent2 },
] as const

export const SKILLS = {
  engineering: [
    'Python',
    'GPT-4o-mini',
    'LLM Integration',
    'REST API',
    'CRM Automation',
    'Email Automation',
    'Prompt Engineering',
    'Data Enrichment',
    'HITL Pipelines',
    'Sentiment Analysis',
    'Ensemble Learning',
    'SMOTE',
  ],
  ld: [
    'GenAI Facilitation',
    'Instructional Design',
    'Train the Trainers',
    'Curriculum Development',
    'Corporate Training',
    'Cohort Management',
  ],
} as const

export const SDG_FOCUS = [
  'SDG 4 · Quality Education',
  'SDG 8 · Decent Work & Economic Growth',
  'SDG 9 · Industry, Innovation & Infrastructure',
] as const

export const EXPERIENCE = [
  {
    role: 'AI Learning & Development Program Manager',
    company: 'Terra Weather Pte. Ltd. · Terra AI Division',
    period: 'July 2025 – July 2026',
    type: 'Contract · Remote · Singapore',
    color: COLORS.accent,
    bullets: [
      'Built end-to-end B2B outreach automation pipeline using Python, GPT-4o-mini, and CRM REST APIs',
      'Designed cold email cadence with follow-up scheduling, OOO detection, and reply routing logic',
      'Developed multi-tier reply classification system with human-in-the-loop (HITL) escalation',
      'Facilitated GenAI training programs for 350+ learners across corporate cohorts',
      'Led Train the Trainers (TTT) program for GenAI PM curriculum',
      'Produced automated multi-sheet Excel CRM reports with AI enrichment and API sync-back',
    ],
  },
] as const

export const PROJECTS = [
  {
    title: 'B2B Outreach Automation',
    description:
      'End-to-end pipeline for automated B2B outreach — cold email cadence, follow-up scheduling, OOO handling, and CRM sync using Python and GPT-4o-mini.',
    tags: ['Python', 'GPT-4o-mini', 'CRM API', 'IMAP/SMTP'],
    color: COLORS.accent,
  },
  {
    title: 'Reply Classification System',
    description:
      'Multi-tier sentiment classification for inbound email replies with human-in-the-loop escalation routing for edge cases and ambiguous responses.',
    tags: ['NLP', 'Python', 'LLM', 'HITL'],
    color: COLORS.accent2,
  },
  {
    title: 'GenAI TTT Curriculum',
    description:
      'Designed and facilitated a Train the Trainers program for GenAI in product management — structured curriculum, activities, and assessment framework.',
    tags: ['Instructional Design', 'GenAI', 'TTT', 'Corporate L&D'],
    color: COLORS.accent,
  },
] as const

export const CERTIFICATIONS = [
  { name: 'TensorFlow Developer Certificate', issuer: 'Google', year: '2024' },
  { name: 'Google Data Analytics Certificate', issuer: 'Google', year: '2023' },
] as const

export const PUBLICATIONS = [
  {
    title:
      'Implementation of Ensemble Machine Learning Classifier and Synthetic Minority Oversampling Technique for Sentiment Analysis of Sustainable Development Goals in Indonesia',
    journal: 'JOIV: International Journal on Informatics Visualization',
    role: 'Undergraduate Thesis Research',
    tags: SDG_FOCUS,
  },
] as const

export const LINKS = {
  linkedin: 'https://www.linkedin.com/in/nurfajar/',
  github: 'https://github.com/nfajar',
  email: 'mailto:hi.nurfajar@gmail.com', // TODO: replace with real email
  cv: '/nf.pdf',
} as const
