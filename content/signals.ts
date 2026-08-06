export interface Signal {
  id: string;
  name: string;
  sub: string;
  fill: number; // 0 if not shown (organizational experience entries)
  bullets: string[];
  open?: boolean;
  category?: string;
}

export const WORK_EXPERIENCE: Signal[] = [
  {
    id: 'EXP / 01',
    name: 'Learning & Development Specialist',
    sub: 'Terra Weather Pte. Ltd. · Singapore (Remote) · Jul 2025 – Jul 2026',
    fill: 5,
    open: true,
    bullets: [
      'Developed 4 GenAI training modules spanning business, education, and product management tracks — foundational to production-ready level.',
      'Led 5 learning programs end-to-end, reaching 200+ participants across webinars and workshops; upskilled 6 university lecturers via Train the Trainers.',
      'Co-engineered a B2B outreach automation pipeline in Python with LLM APIs, in a 3-person build with the CEO and a software engineer; ran live Jun–Jul 2026 — ~3,000 leads processed, 600 qualified prospects surfaced.',
      'Deployed 9 specialized AI agents across the CRM pipeline with human-in-the-loop approval before sending.',
      'Cut per-prospect email prep from ~30 min to under 5 (−83%) — at ~3,000 leads, a manual-equivalent workload of ~1,250 hours that never had to be staffed.',
      'Produced 4 alumni testimonial videos from 30 outreach contacts and 8 interviews, supporting learner acquisition.',
    ],
  },
  {
    id: 'EXP / 02',
    name: 'AI Training Specialist',
    sub: 'Terra AI · Singapore (Remote) · Feb 2024 – Jun 2025',
    fill: 4,
    open: true,
    bullets: [
      'Trained 100+ students and professionals on generative AI, prompt engineering, and chatbot development — customized curriculum for startups through multinationals.',
      'Sustained a 9.0/10 mean learner satisfaction score (Kirkpatrick L1) across all cohorts via structured feedback loops and real-time curriculum iteration.',
      'Ran a 20% instruction / 80% practice delivery framework with project-based assessments and learner progress dashboards.',
    ],
  },
  {
    id: 'EXP / 03',
    name: 'Machine Learning Mentor',
    sub: 'Bangkit Academy · Ministry of Education program · Feb 2023 – Jan 2024',
    fill: 4,
    open: true,
    bullets: [
      'Mentored 50+ students from 25+ universities across Indonesia; cohort graduation rate above 90%.',
      'Conducted 40+ weekly sessions covering technical skills, soft skills, and engagement activities.',
      'Liaised between participants and the Bangkit team, coordinating with 20+ industry and academic experts.',
    ],
  },
];

export const ORGANIZATION_EXPERIENCE: Signal[] = [
  {
    id: 'ORG / 01',
    category: 'Tech Community',
    name: 'Chapter Lead',
    sub: 'Google Developer Student Clubs (GDSC) Unsil · Aug 2021 – Jul 2022',
    fill: 0,
    open: true,
    bullets: [
      'Founded and led the first-generation GDSC chapter at Universitas Siliwangi, recruiting 100 new members across cohorts in the first year.',
      'Planned and ran a full annual program slate — Android Study Jam, Flutter Festival, a hackathon, and a Career Talk Series — mostly in collaboration with other GDSC chapters across Indonesia.',
      '__Output:__ 100 new members recruited in year one; event series averaged 50+ attendees per session.',
    ],
  },
  {
    id: 'ORG / 02',
    category: 'Programme Delivery at Scale',
    name: 'Lead Organizer, Kuliah Dhuha 2021',
    sub: 'LDK KISI · Mentoring Division · 2021',
    fill: 0,
    bullets: [
      'Lead organizer of a large-scale programme welcoming new students through an Islamic mentoring lens, directing a cross-divisional team of about 50 people.',
      '__Output:__ 2,000+ attendees online; organizing team of ~50 across divisions.',
    ],
  },
  {
    id: 'ORG / 03',
    category: 'Community Leadership',
    name: 'Village Coordinator (Kordes)',
    sub: 'KKN · Purwaharja Village, Banjar City · Feb–Mar 2021',
    fill: 0,
    bullets: [
      'Led a cross-disciplinary community service group of 16 students for one month, designing and executing 10 work programmes — including a Google Workspace workshop for local schools and village staff, and tutoring for school-age children.',
      '__Output:__ 10 programmes completed; ~30 workshop participants, ~40 tutoring participants, ~200 total direct beneficiaries.',
    ],
  },
];
