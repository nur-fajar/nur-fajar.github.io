import { describe, expect, it } from 'vitest';
import { CRM_PROJECT, PROOF } from './ledger';
import {
  V5_ABOUT,
  V5_CASES,
  V5_CONTACT_CLOSE,
  V5_CONTACT_ROWS,
  V5_FOUNDER_MAILTO,
  V5_HERO,
  V5_MAIL_CAPTION,
  V5_NAV,
  V5_PILLARS,
  V5_PROOF,
  V5_PROOF_HIGHLIGHT,
  V5_SECTIONS,
  V5_TOOLS,
  V5_TOOLS_MORE,
} from './v5';

describe('v5 copy rules', () => {
  it('hero lead plus index prompt carry the positioning', () => {
    expect(V5_HERO.titleLead.trim()).not.toBe('');
    expect(V5_HERO.indexPrompt.trim()).not.toBe('');
  });

  it('hero sub is two lines max and states full-time intent', () => {
    expect(V5_HERO.sub.length).toBeLessThanOrEqual(2);
    expect(V5_HERO.availability).toMatch(/full-time/i);
  });

  it('hero ticker lists services without new numbers', () => {
    expect(V5_HERO.ticker.length).toBeGreaterThanOrEqual(4);
    for (const item of V5_HERO.ticker) {
      expect(item.trim()).not.toBe('');
    }
  });

  it('nav anchors all resolve to a section or top', () => {
    const ids = new Set(['top', ...V5_SECTIONS.map((s) => s.id)]);
    for (const link of V5_NAV) {
      expect(ids.has(link.href.slice(1))).toBe(true);
    }
  });

  it('founder mailto menawarkan peluang peran dengan signature berstruktur', () => {
    // Template homepage untuk peluang full-time: subject spesifik peran,
    // body prosa friksi-nol + signature 3 baris penuntun format.
    const mailto = decodeURIComponent(V5_FOUNDER_MAILTO);
    expect(mailto).toContain('subject=Opportunity to work at [company]');
    expect(mailto).toContain("I'm interested in your profile and skillset.");
    expect(mailto).toContain('Best regards,');
    expect(mailto).toContain('[Name]');
    expect(mailto).toContain('[Role], [Company]');
  });

  it('proof is a locked curation of two ledger cells, not a mirror', () => {
    // Tiga baris final: jangkauan (300+), kualitas (9.0/10), outcome (96%
    // less sebagai highlight). Sel L&D 2025 to 2026 (5, 3, 25+) sengaja tidak
    // ikut: ketiganya satu cerita yang sama dan tetap hidup di Work case +
    // Experience. Value dikunci harfiah supaya sisipan di PROOF tidak
    // diam-diam menggeser isi section.
    expect(V5_PROOF.map((c) => c.value)).toEqual(['300+', '9.0/10']);
    for (const cell of V5_PROOF) {
      const canon = PROOF.find((c) => c.value === cell.value);
      expect(canon, `${cell.value} tidak ada di ledger PROOF`).toBeDefined();
      expect(cell.label).toBe(canon!.label);
      expect(cell.method).toBe(canon!.method);
    }
  });

  it('highlight restates the CRM runtime figure, not a new number', () => {
    const runtime = CRM_PROJECT.metrics.find((m) => m.includes('runtime'));
    expect(runtime).toBeDefined();
    expect(V5_PROOF_HIGHLIGHT.method).toContain('11h');
    expect(V5_PROOF_HIGHLIGHT.method).toContain('300+h');
  });

  it('crm case reuses ledger metrics without new numbers', () => {
    const crm = V5_CASES.find((c) => c.id === 'crm-pipeline');
    expect(crm).toBeDefined();
    expect(crm!.metrics).toEqual([...CRM_PROJECT.metrics]);
  });

  it('web-builds case links the live CRM workspace, https only', () => {
    // Kartu web builds harus tetap menunjuk crm.nurfajar.com: tanpa tautan
    // ini, klaim "operations desk behind the AI build" jadi tanpa artefak.
    const links = V5_CASES.find((c) => c.id === 'web-builds')?.links ?? [];
    const crm = links.find((l) => l.href.includes('crm.nurfajar.com'));
    expect(crm).toBeDefined();
    expect(crm!.href).toMatch(/^https:\/\/crm\.nurfajar\.com\/$/);
  });

  it('no em-dash or banned causal bridge in v5 copy', () => {
    const haystack = [
      V5_HERO.sub.join(' '),
      ...V5_PILLARS.map((p) => `${p.title} ${p.body}`),
      ...V5_CASES.map((c) => `${c.context} ${c.build.join(' ')}`),
      ...V5_SECTIONS.map((s) => `${s.heading.join(' ')} ${s.lede}`),
      V5_CONTACT_CLOSE,
      V5_MAIL_CAPTION,
    ].join(' ');
    expect(haystack).not.toMatch(/—/);
    expect(haystack).not.toMatch(/which lets me|underneath|powering|that's why/i);
  });

  it('about timeline is four complete chapters, each with a unique span', () => {
    expect(V5_ABOUT.timeline).toHaveLength(4);
    const spans = V5_ABOUT.timeline.map((c) => c.span);
    expect(new Set(spans).size).toBe(spans.length);
    for (const chapter of V5_ABOUT.timeline) {
      expect(chapter.span.trim()).not.toBe('');
      expect(chapter.title.trim()).not.toBe('');
      expect(chapter.body.trim()).not.toBe('');
    }
  });

  it('tool strips split founder-five from the rest, paths valid', () => {
    expect(V5_TOOLS).toHaveLength(5);
    for (const tool of [...V5_TOOLS, ...V5_TOOLS_MORE]) {
      expect(tool.logo).toMatch(/^\/logos\/tools\/[a-z0-9]+\.png$/);
    }
    expect(V5_CONTACT_ROWS[0].value).toMatch(/Full-time/);
  });
});
