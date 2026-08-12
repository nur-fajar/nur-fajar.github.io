// lib/retro/panelData.ts
// Konten panel dihitung murni dari (cursor, done) — diekstrak dari IslandGame.tsx
// (final-review I9/I2) supaya bisa di-unit-test dengan table-driven test yang
// menjalankan seluruh (area, step) valid tanpa perlu me-render komponen React.
import { AREAS, CONTACT, ORG, PROJECTS, SKILLS, WORK, dataForArea } from './content';
import type { StepCursor } from './gameState';
import type { PanelData } from '@/components/retro/Panel';

const NEXT_HINT = '**SCROLL / CLICK** to continue · scroll up to go back';

export function buildPanelData(cursor: StepCursor, done: ReadonlySet<number>): PanelData {
  if (cursor.area === null) {
    if (done.size >= AREAS.length) {
      const email = CONTACT[0];
      return {
        eyebrow: 'DONE · 5/5 AREAS',
        title: "THE ISLAND'S FULLY EXPLORED.",
        body: [
          'Organizations, work, projects, skills, contact — all open now. One thing left: **word from you**.',
          `Click any area to replay it, or __${email.value}__ to start a real conversation.`,
        ],
        tags: [
          ['STATUS', 'OPEN TO WORK'],
          ['EMAIL', email.value],
        ],
        hint: 'Click an area on the map to replay it',
      };
    }
    return {
      eyebrow: `MAP · ${done.size}/5 AREAS DONE`,
      title: 'PICK AN AREA — OR KEEP SCROLLING',
      body: [
        'Five areas, five ways to play. Click one, or **keep scrolling** and I will take you to the next one myself.',
        'Everything can be opened any time, and scrolling up always takes you back one step.',
      ],
      tags: AREAS.map((a) => [a.sectionLabel, done.has(a.id) ? 'DONE' : 'OPEN'] as [string, string]),
      hint: NEXT_HINT,
    };
  }

  const area = AREAS[cursor.area];
  const data = dataForArea(area.key);

  if (cursor.step === 0) {
    return {
      eyebrow: `AREA ${area.id + 1}/5 · ${area.name} · GENRE: ${area.genre.toUpperCase()}`,
      title: area.sectionLabel,
      body: [area.intro],
      tags: [
        ['STEPS', String(area.steps)],
        ['ITEMS', `${data.length} ITEMS`],
      ],
      hint: NEXT_HINT,
    };
  }

  if (area.key === 'hire') {
    const contactStep = cursor.step;
    if (contactStep <= CONTACT.length) {
      const c = CONTACT[contactStep - 1];
      return {
        eyebrow: `BLOCK ${contactStep}/${CONTACT.length} LOCKING IN`,
        title: `${c.tag} — ${c.value}`,
        body: [c.blurb],
        link: { label: `Open ${c.tag.toLowerCase()}`, href: c.href },
        hint: NEXT_HINT,
      };
    }
    return {
      eyebrow: 'LINE CLEAR · DOUBLE',
      title: "THE ROW'S FULL. THE GAME ISN'T OVER.",
      body: [
        'Those four blocks are every way to reach me. The last two columns were already there: **open to work**.',
        "If you're looking for someone who can design the program __and__ build the tooling that runs it — send one line.",
      ],
      tags: [
        ['STATUS', 'OPEN TO WORK'],
        ['BASED', 'INDONESIA'],
      ],
      hint: '**SCROLL** to go back to the map',
    };
  }

  const itemIndex = Math.floor((cursor.step - 1) / 2);
  const phase = (cursor.step - 1) % 2;

  if (area.key === 'skill') {
    const s = SKILLS[itemIndex];
    if (phase === 0) {
      return {
        eyebrow: `PIECE ${itemIndex + 1}/4 · ${s.plainName}`,
        title: s.plainName.toUpperCase(),
        body: [s.blurb],
        hint: NEXT_HINT,
      };
    }
    return {
      eyebrow: `PIECE ${itemIndex + 1}/4 · PLACED`,
      title: s.plainName.toUpperCase(),
      body: [s.blurb],
      tags: s.items.map((item) => [item, ''] as [string, string]),
      hint: NEXT_HINT,
    };
  }

  const d = (area.key === 'proj' ? PROJECTS : area.key === 'org' ? ORG : WORK)[itemIndex];
  if (phase === 0) {
    return {
      eyebrow: `${area.sectionLabel} · ${itemIndex + 1}/${data.length}`,
      title: `TOWARD ${d.tag}`,
      body: ['One more step to open it up.'],
      hint: NEXT_HINT,
    };
  }
  return {
    eyebrow: `${area.sectionLabel} · ${itemIndex + 1}/${data.length} · ${d.sub}`,
    title: d.title,
    body: [d.problem, d.resolution],
    tags: d.stats,
    hint: NEXT_HINT,
  };
}
