import { describe, expect, it } from 'vitest';
import { AREAS, CONTACT, ORG, PROJECTS, SKILLS, WORK, dataForArea } from './content';
import { totalSteps } from './gameState';

describe('content data', () => {
  it('gives every area a non-empty name, intro and matching itemCount', () => {
    for (const area of AREAS) {
      expect(area.name.length).toBeGreaterThan(0);
      expect(area.intro.length).toBeGreaterThan(0);
      expect(area.steps).toBeGreaterThan(0);
    }
  });

  it('keeps AREAS, ORG, WORK, PROJECTS, SKILLS, CONTACT counts consistent', () => {
    expect(AREAS.find((a) => a.key === 'org')?.itemCount).toBe(ORG.length);
    expect(AREAS.find((a) => a.key === 'work')?.itemCount).toBe(WORK.length);
    expect(AREAS.find((a) => a.key === 'proj')?.itemCount).toBe(PROJECTS.length);
    expect(AREAS.find((a) => a.key === 'skill')?.itemCount).toBe(SKILLS.length);
    expect(AREAS.find((a) => a.key === 'hire')?.itemCount).toBe(CONTACT.length);
  });

  it('computes a positive, finite total step count', () => {
    expect(totalSteps(AREAS)).toBeGreaterThan(0);
    expect(Number.isFinite(totalSteps(AREAS))).toBe(true);
  });

  it('dataForArea resolves each area key to its matching dataset', () => {
    expect(dataForArea('org')).toBe(ORG);
    expect(dataForArea('work')).toBe(WORK);
    expect(dataForArea('proj')).toBe(PROJECTS);
    expect(dataForArea('skill')).toBe(SKILLS);
    expect(dataForArea('hire')).toBe(CONTACT);
  });

  it('every contact method has a non-placeholder href', () => {
    for (const c of CONTACT) {
      expect(c.href).not.toContain('•');
      expect(c.href.length).toBeGreaterThan(0);
    }
  });
});
