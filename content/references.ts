export interface Reference {
  tag: string;
  quote: string;
  initial: string;
  name: string;
  role: string;
}

// 5 dari 11 rekomendasi, dipilih untuk sudut pandang yang berbeda-beda:
// manajer → praktisi L&D → mentee teknis → rekan satu tim → rekan lintas
// organisasi. Bukan 5 yang paling memuji, tapi 5 yang saling melengkapi.
export const REFERENCES: Reference[] = [
  {
    tag: 'Manager',
    quote:
      'I managed Nur Fajar directly at Terra Weather. He mentored more than 100 students and consistently earned outstanding satisfaction scores from them — 9.8 out of 10. What stood out to me most was his organizational skill and his initiative: he took it upon himself to build a chatbot that helped students track their own learning progress. I’d recommend him without hesitation.',
    initial: 'C',
    name: 'Christian Jonathan',
    role: 'Manager · Terra Weather',
  },
  {
    tag: 'L&D Practitioner',
    quote:
      'He led with real skill and deep knowledge, and he never let a mentee’s progress go unnoticed — he made a point of supporting us and recognizing every milestone along the way.',
    initial: 'K',
    name: 'Kevin Naufal Eryogia',
    role: 'Mentee, Bangkit 2023 · now People Team Coordinator, Mondelēz International',
  },
  {
    tag: 'Mentee',
    quote:
      'His technical depth came paired with real leadership and mentoring ability — he had a way of making complex ideas accessible no matter where you were starting from. That versatility would serve him well as a Project Manager, Program Manager, in HR, or in Learning & Development.',
    initial: 'A',
    name: 'Andrew Benedictus Jamesie',
    role: 'Mentee, Bangkit 2023 · now Senior Software Engineer, Accenture',
  },
  {
    tag: 'Teammate',
    quote:
      'He ran the team with real skill — communication stayed clear, tasks were managed effectively, and the whole group worked well together right through to a successful finish.',
    initial: 'D',
    name: 'Diki Hamdani',
    role: 'Capstone teammate · Bangkit Academy 2023',
  },
  {
    tag: 'Colleague',
    quote:
      'His communication was excellent — always clear and efficient. His management stood out too: organized, proactive, and positive, with everything delivered on time.',
    initial: 'D',
    name: 'Dicky Arya Pratama',
    role: 'Colleague, GDSC Indonesia · Senior Android Developer',
  },
];
