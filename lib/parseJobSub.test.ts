import { describe, expect, it } from 'vitest';
import { splitSub } from './parseJobSub';

describe('splitSub', () => {
  it('splits company / location / range into company + range', () => {
    expect(splitSub('Terra Weather Pte. Ltd. · Singapore (Remote) · Jul 2025 – Jul 2026')).toEqual({
      company: 'Terra Weather Pte. Ltd.',
      range: 'Jul 2025 – Jul 2026',
    });
  });

  it('handles a two-part sub with no location segment', () => {
    expect(splitSub('Acme Corp · Feb 2024 – Jun 2025')).toEqual({
      company: 'Acme Corp',
      range: 'Feb 2024 – Jun 2025',
    });
  });
});
