/* ── Ikigai hero diagram — content ────────────────────────────────────────
   The classic 4-circle ikigai construction: four big circles arranged 2x2
   (top-left / top-right / bottom-right / bottom-left), each overlapping its
   two grid-neighbors *and* all four meeting at one shared point in the
   middle — not a 5th/6th circle, not a radial/orbit layout. Geometry lives
   in IkigaiDiagram.tsx; this file is just the four roles, their skill
   lists, and the four neighbor-overlap captions, in the exact wording
   confirmed for the hero (do not rephrase/add/remove without checking).

   `corner` drives placement (see CORNER_POS in IkigaiDiagram.tsx). Each
   role's circle color is a CSS custom property keyed by `id`
   (--ikigai-ld/ai/pm/community in globals.css) — all four mixed from just
   the page's two accents (--accent/--accent-2), so every role reads as its
   own tint without introducing a color outside that palette. */

export type IkigaiCorner = 'tl' | 'tr' | 'br' | 'bl';

export interface IkigaiRole {
  id: string;
  /** Short label, pre-broken into the lines it renders as inside the circle. */
  labelLines: string[];
  /** Full name, used for the detail panel heading and aria-label. */
  fullName: string;
  corner: IkigaiCorner;
  skills: string[];
}

// Clockwise order — L&D → AI/Automation Engineering → Program Manager →
// Community & Social Media → back to L&D — matches the four neighbor
// overlaps below one-for-one.
export const IKIGAI_ROLES: IkigaiRole[] = [
  {
    id: 'ld',
    labelLines: ['L&D'],
    fullName: 'L&D (Learning & Development)',
    corner: 'tl',
    skills: [
      'Curriculum Development',
      'Instructional Design',
      'ADDIE Framework',
      'Facilitation',
      "Bloom's Taxonomy",
      'Learning Management System',
    ],
  },
  {
    id: 'ai',
    labelLines: ['AI / Automation', 'Engineering'],
    fullName: 'AI / Automation Engineering',
    corner: 'tr',
    skills: [
      'CRM Automation',
      'Prompt Engineering (Claude, Gemini, ChatGPT)',
      'Workflow Automation (n8n)',
      'Sentiment Analysis',
      'Data Analysis',
    ],
  },
  {
    id: 'pm',
    labelLines: ['Program', 'Manager'],
    fullName: 'Program Manager',
    corner: 'br',
    skills: [
      'Program Planning & Coordination',
      'Team Leadership',
      'Cross-functional Stakeholder Management',
      'Program Execution',
      'Tools: Notion, Google Sheets',
    ],
  },
  {
    id: 'community',
    labelLines: ['Community &', 'Social Media'],
    fullName: 'Community & Social Media',
    corner: 'bl',
    skills: [
      'Community Management',
      'Follower/Audience Communication (untuk ai4impact dan Terra AI)',
      'Content Production (Canva, CapCut, Premiere)',
    ],
  },
];

export interface IkigaiOverlap {
  id: string;
  /** ids of the two neighboring roles this overlap sits between. */
  between: [string, string];
  /** Caption, pre-broken into display lines. */
  lines: string[];
}

export const IKIGAI_OVERLAPS: IkigaiOverlap[] = [
  { id: 'ld-ai', between: ['ld', 'ai'], lines: ['AI-powered', 'training design'] },
  { id: 'ai-pm', between: ['ai', 'pm'], lines: ['Automation', 'program delivery'] },
  { id: 'pm-community', between: ['pm', 'community'], lines: ['Community program', 'management'] },
  { id: 'community-ld', between: ['community', 'ld'], lines: ['Educational content', 'creation'] },
];
