// v2-only content. Facts here are drawn from content/credibility.ts and
// content/signals.ts but re-cut into the chip/logo shape "The Path" needs —
// intentionally not merged back into those shared files, since the root
// page renders the same underlying facts in prose, not as chips.

export interface InstitutionLogo {
  name: string;
  /** Public path to an official SVG mark, monochrome / single-path so it
      can be recolored with `currentColor`. Omitted where no official asset
      could be sourced in this environment — those chips render a plain
      text wordmark instead of a re-drawn logo. */
  src?: string;
}

export interface PathChip {
  id: string;
  logo?: InstitutionLogo;
  name: string;
  stat: string;
}

// Kalimat 1's anchor sentence carries its own small attribution row — the
// university plus the two scholarships that funded it.
export const ANCHOR_CREDENTIALS: InstitutionLogo[] = [
  { name: 'Universitas Siliwangi' },
  { name: 'BRI' },
  { name: 'Bank Indonesia' },
];

// Kalimat 2, broken into one chip per entity.
export const PATH_CHIPS: PathChip[] = [
  { id: 'gdsc', logo: { name: 'GDSC' }, name: 'Google Developer Student Clubs', stat: 'Founder, first campus chapter' },
  { id: 'dhuha', name: 'Kuliah Dhuha', stat: '2,000+ attendees · 30+ committee' },
  { id: 'kkn', name: 'Village service program', stat: '16-person team' },
];

// Kalimat 3's closing attribution — same wordmark treatment as the chips
// above, sized down to sit inline with the narrative paragraph.
export const PATH_TRAIL: InstitutionLogo[] = [{ name: 'Bangkit Academy' }, { name: 'Terra AI' }];

export interface AiTool {
  name: string;
  logo?: InstitutionLogo;
}

// Underlying models behind "LLM APIs" / "AI agents" in the Skills grid —
// shown as a small logo row, not a duplicate of the skill tags themselves.
export const AI_TOOLS: AiTool[] = [
  { name: 'Claude', logo: { name: 'Anthropic', src: '/logos/anthropic.svg' } },
  { name: 'ChatGPT', logo: { name: 'OpenAI' } },
  { name: 'Gemini', logo: { name: 'Google', src: '/logos/gemini.svg' } },
];
