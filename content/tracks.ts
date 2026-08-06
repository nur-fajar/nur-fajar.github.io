export interface Track {
  id: string;
  role: string;
  title: string;
  body: string;
  tags: string[];
}

export const TRACKS: Track[] = [
  {
    id: 'ai-systems',
    role: 'Track 01 / AI SYSTEMS',
    title: 'AI engineering & automation',
    body: 'Co-engineered — in a 3-person build with the CEO and a software engineer — an end-to-end B2B outreach automation pipeline in Python: 9 specialized AI agents across the CRM covering lead qualification, company research, cold email drafting, follow-ups, and inbox monitoring, with human-in-the-loop approval before anything sends. Live Jun–Jul 2026: ~3,000 leads processed and 600 qualified prospects surfaced, at under 5 minutes of prep per prospect instead of ~30. By hand that volume is roughly 1,250 hours of work — which is why it was automated rather than staffed.',
    tags: ['Python', 'LLM APIs', 'AI agents', 'CRM automation', 'HITL'],
  },
  {
    id: 'learning-development',
    role: 'Track 02 / LEARNING & DEVELOPMENT',
    title: 'GenAI curriculum & delivery',
    body: 'Designed 4 GenAI training modules — business, education, developer, and product management tracks — and led 5 programs end-to-end, from learner analysis and backward design to live delivery and Kirkpatrick-style evaluation. Training and mentoring since 2023 — 350+ learners cumulative across public, corporate, and institutional cohorts, at a 9.0/10 mean satisfaction score (Kirkpatrick L1), plus a Train the Trainers initiative that upskilled 6 university lecturers.',
    tags: ['Instructional design', 'ADDIE', 'Backward design', 'Facilitation', 'TTT'],
  },
];
