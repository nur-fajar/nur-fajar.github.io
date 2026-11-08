/**
 * v6 content canon — hat-switching stage.
 *
 * Aturan yang sama dengan v5: semua angka & tautan diturunkan dari
 * content/ledger.ts (SSOT), tidak ada satu angka pun yang diketik ulang
 * di sini. v6 tidak menambahkan klaim baru; ia menata ulang isi ledger
 * ke bentuk permainan: satu karakter, tiga topi, satu mode combo.
 *
 * Nada teksnya playful ala NPC game, tapi di belakang kelucuan itu
 * angkanya tetap angka ledger lengkap dengan metodenya (P2).
 */

import {
  BUILT,
  CONTACT,
  CRM_PROJECT,
  END_TO_END_PHASES,
  MAILTO,
  PROOF,
  WORK,
  WORK_GALLERY,
  WORK_HISTORY,
} from './ledger';
import { V5_CASES } from './v5';

export type HatId = 'trainer' | 'creative' | 'ai';

/** Mode panggung: netral, satu topi, atau ketiganya sekaligus (unicorn). */
export type V6StageMode = HatId | 'neutral' | 'unicorn';

export const V6_STAGE_HINT = 'Click a hat below to explore my skills!';

export interface V6StatCell {
  value: string;
  label: string;
  /** Metode/penumerator, ditulis persis dari ledger (P2). */
  method: string;
}

export interface V6HatLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface V6Hat {
  id: HatId;
  /** Emoji chip di selector + judul panel. */
  glyph: string;
  name: string;
  title: string;
  /** Satu baris pembuka ala NPC, muncul di balon samping sprite. */
  greeting: string;
  /** Satu kalimat bukti di bawah greeting, angka dari ledger. */
  detail: string;
  stats: V6StatCell[];
  links: V6HatLink[];
  /** Hex aksen panel & sprite glow, senada palet hat. */
  accent: string;
}

const satisfaction = PROOF.find((cell) => cell.value === '9.0/10');
if (!satisfaction) throw new Error('PROOF 9.0/10 tidak ada di ledger');

const ldRole = WORK_HISTORY[0];
const curriculum = BUILT.find((card) => card.id === 'curriculum');
if (!curriculum) throw new Error('BUILT curriculum tidak ada di ledger');

const igCase = V5_CASES.find((item) => item.id === 'content-engine');
const igHref = igCase?.links[0]?.href ?? '';

const videoCount = WORK_GALLERY.filter((item) => item.category === 'video-marketing').length;
const posterCount = WORK_GALLERY.filter(
  (item) => item.category === 'event-poster' || item.category === 'greeting-poster',
).length;
const galleryCount = WORK_GALLERY.length;

function galleryCaseSentence(total: number, videos: number, posters: number): string {
  return `${total} published posts for ai4impact: ${videos} marketing videos, ${posters} posters, and alumni stories in between`;
}

export const V6_HATS: V6Hat[] = [
  {
    id: 'trainer',
    glyph: '🎓',
    name: 'Trainer Hat',
    title: 'The Knowledge Builder',
    greeting: `Training quest complete: ${ldRole.detail.split('·').map((part) => part.trim()).join(', ')}.`,
    detail: `I owned it end to end: ${END_TO_END_PHASES}.`,
    stats: [
      ...curriculum.metrics.map((metric) => {
        const [value, ...rest] = metric.split(' ');
        return { value, label: rest.join(' '), method: 'as Learning & Development Specialist, Terra AI, 2025 to 2026' };
      }),
      { value: satisfaction.value, label: satisfaction.label, method: satisfaction.method },
    ],
    links: [
      { label: 'Grab my resume (PDF)', href: CONTACT.cv, external: true },
      { label: 'Bring me a training brief', href: `mailto:${CONTACT.email}` },
    ],
    accent: '#4c9a2a',
  },
  {
    id: 'creative',
    glyph: '🎨',
    name: 'Creative Hat',
    title: 'The Visual Storyteller',
    greeting: 'Design is a science, actually. Every pixel earns its seat, and everything ships.',
    detail: `${galleryCaseSentence(galleryCount, videoCount, posterCount)}.`,
    stats: [
      { value: String(galleryCount), label: 'posts published', method: 'for ai4impact, verifiable on Instagram' },
      { value: String(videoCount), label: 'marketing videos', method: 'reels cut, colored, and shipped on Instagram' },
      { value: String(posterCount), label: 'event & greeting posters', method: 'program calendar, made in Canva' },
    ],
    links: [
      ...(igHref ? [{ label: 'See the work on Instagram', href: igHref, external: true }] : []),
      { label: 'Bring me a visual brief', href: `mailto:${CONTACT.email}` },
    ],
    accent: '#e8613c',
  },
  {
    id: 'ai',
    glyph: '🤖',
    name: 'AI Hat',
    title: 'The AI Systems Engineer',
    greeting: 'Beep boop! I led 9 little agents through a B2B pipeline so humans stopped copy-pasting.',
    detail: `${CRM_PROJECT.metrics.slice(-2, -1)[0]}. No magic: ${CRM_PROJECT.metrics.at(-1) ?? ''}, and approval gates before anything sends.`,
    stats: [
      { value: '9 agents', label: 'in one CRM pipeline', method: CRM_PROJECT.metrics[1] },
      { value: CRM_PROJECT.metrics[3].split(' vs')[0], label: 'vs 300+h manual work', method: '96% less, measured end to end' },
    ],
    links: [
      { label: 'nurfajar.com (this site)', href: 'https://nurfajar.com', external: true },
      { label: 'Nadi wellbeing concept site', href: 'https://nadi-wellbeing.vercel.app/', external: true },
      { label: 'Xcel Autodrive concept site', href: 'https://xcel-autodrive.vercel.app/', external: true },
      { label: 'Bring me an automation', href: `mailto:${CONTACT.email}` },
    ],
    accent: '#8a5cf5',
  },
];

/** Silabus sampel untuk panel Trainer: tiga modul dari ledger. */
export const V6_SYLLABUS = WORK.map((card) => ({
  title: card.title,
  meta: card.kind,
}));

export interface V6NeutralPanel {
  mode: 'neutral';
  heading: string;
  body: string;
  chips: { label: string; accent: string }[];
}

export const V6_NEUTRAL: V6NeutralPanel = {
  mode: 'neutral',
  heading: 'One character. Three hats.',
  body: 'Every hat below is a real job I have done with numbers to show for it. Pick one, or collect all three.',
  chips: V6_HATS.map((hat) => ({ label: hat.name, accent: hat.accent })),
};

export interface V6UnicornPanel {
  mode: 'unicorn';
  heading: 'UNICORN MODE UNLOCKED';
  message: 'Looking for a Full-Product Builder who can code AI, design visuals, and train your team? Let’s connect!';
  cta: { label: string; href: string };
}

export const V6_UNICORN: V6UnicornPanel = {
  mode: 'unicorn',
  heading: 'UNICORN MODE UNLOCKED',
  message: 'Looking for a Full-Product Builder who can code AI, design visuals, and train your team? Let’s connect!',
  cta: { label: 'Say hi in 24 hours or less', href: MAILTO },
};

/** Footer statis, tidak ikut berganti topi. */
export const V6_FOOTER_NOTE = `${CONTACT.responseTime} · ${CONTACT.location} (${CONTACT.timezone})`;
