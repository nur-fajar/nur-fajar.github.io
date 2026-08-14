/* ── Skill → proof lookup ────────────────────────────────────────────────
   Yang muncul saat satu baris skill di-hover (desktop) atau di-tap
   (mobile). Kalimatnya TIDAK ditulis manual di sini: tiap tag dicocokkan
   ke teks yang memang sudah ada di situs ini — program, pengalaman kerja
   & organisasi, langkah pipeline CRM, dan kredensial pendidikan — lalu
   judul + ringkasan entri yang cocok itu yang ditampilkan.

   Konsekuensinya disengaja: kalau tidak ada satu pun konten nyata yang
   menyebut sebuah skill, barisnya tampil polos tanpa proof, bukan dikasih
   kalimat karangan. Itu sebabnya ini bukan `Record<string, string>`.

   Diadaptasi dari lib/relatedProjects.ts di branch desain sebelumnya,
   dipangkas ke yang dibutuhkan /v2 saja: judul + ringkasan, tanpa href
   (halaman ini satu alur scroll, tidak ada anchor section untuk dituju)
   dan tanpa detail-view yang tidak ada di situs versi ini. */

import { PROGRAMS } from '@/content/programs';
import { WORK_EXPERIENCE, ORGANIZATION_EXPERIENCE } from '@/content/signals';
import { AGENT_STEPS } from '@/content/pipeline';
import { CREDIBILITY } from '@/content/credibility';

export interface SkillProof {
  title: string;
  blurb: string;
}

interface IndexEntry extends SkillProof {
  /** Semua teks entri ini, jadi bahan pencocokan kata. */
  text: string;
}

function buildIndex(): IndexEntry[] {
  const fromPrograms: IndexEntry[] = PROGRAMS.map((p) => ({
    title: p.title,
    blurb: p.summary,
    text: [p.title, p.summary, p.audience, p.prerequisites, p.outcome, ...p.units.map((u) => `${u.title} ${u.detail}`)].join(
      ' '
    ),
  }));

  const fromWork: IndexEntry[] = WORK_EXPERIENCE.map((s) => ({
    title: s.name,
    blurb: s.bullets[0],
    text: [s.name, s.sub, ...s.bullets].join(' '),
  }));

  const fromOrg: IndexEntry[] = ORGANIZATION_EXPERIENCE.map((s) => ({
    title: s.name,
    blurb: s.bullets[0],
    text: [s.name, s.sub, s.category ?? '', ...s.bullets].join(' '),
  }));

  const fromPipeline: IndexEntry[] = AGENT_STEPS.map((a) => ({
    title: `CRM pipeline — ${a.title}`,
    blurb: a.body[0],
    text: [a.id, a.title, ...a.body, a.io.in, a.io.out, a.io.model, a.claim ?? '', a.note ?? ''].join(' '),
  }));

  const fromEducation: IndexEntry[] = [
    {
      title: 'Siliwangi University — B.CS in Informatics',
      blurb: CREDIBILITY.main.body,
      text: [
        'Siliwangi University',
        CREDIBILITY.main.label,
        CREDIBILITY.main.body,
        CREDIBILITY.main.thesis,
        ...CREDIBILITY.main.scholarships,
      ].join(' '),
    },
    {
      title: 'Certifications',
      blurb: CREDIBILITY.certifications[0],
      text: CREDIBILITY.certifications.join(' '),
    },
  ];

  return [...fromPrograms, ...fromWork, ...fromOrg, ...fromPipeline, ...fromEducation];
}

const INDEX = buildIndex();

function normalize(s: string) {
  return s
    .toLowerCase()
    .replace(/\(.*?\)/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Cocokkan tunggal/jamak seadanya — "pipelines" tetap ketemu "pipeline".
function stem(word: string) {
  return word.length > 3 && word.endsWith('s') ? word.slice(0, -1) : word;
}

// Singkatan yang dipakai copy situs ini menggantikan kata panjangnya —
// misal kalimat thesis menulis "ensemble ML", bukan "ensemble learning".
const SYNONYMS: Record<string, string[]> = {
  learning: ['ml'],
};

function hasWord(haystack: string, word: string) {
  if (haystack.includes(word) || haystack.includes(stem(word))) return true;
  return (SYNONYMS[word] ?? []).some((syn) => haystack.includes(syn));
}

/** Proof pertama yang benar-benar menyebut semua kata penting di `tag`,
    atau null kalau tidak ada — baris skill-nya lalu tampil tanpa expand. */
export function getSkillProof(tag: string): SkillProof | null {
  const words = normalize(tag)
    .split(' ')
    .filter((w) => w.length > 2);
  if (!words.length) return null;

  for (const entry of INDEX) {
    const hay = normalize(entry.text);
    if (words.every((w) => hasWord(hay, w))) return { title: entry.title, blurb: entry.blurb };
  }
  return null;
}
