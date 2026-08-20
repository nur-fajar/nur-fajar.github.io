import { describe, expect, it } from 'vitest';
import { LEADERSHIP, ORGS, WORK_HISTORY } from '@/content/ledger';
import { formatMonth, formatRange } from './dates';

describe('format tanggal', () => {
  it('menerjemahkan format CV jadi format tampilan', () => {
    expect(formatMonth('2024 FEB')).toBe('Feb 2024');
    expect(formatMonth('2026 JUL')).toBe('Jul 2026');
  });

  it('memakai en dash untuk rentang, bukan hyphen', () => {
    expect(formatRange('2024 FEB', '2026 JUL')).toBe('Feb 2024 – Jul 2026');
    expect(formatRange('2024 FEB', '2026 JUL')).not.toContain(' - ');
  });

  it('mengembalikan input yang tidak dikenali apa adanya, bukan string kosong', () => {
    expect(formatMonth('Present')).toBe('Present');
    expect(formatMonth('')).toBe('');
  });

  it('setiap tanggal di ledger bisa diformat, tidak ada yang lolos apa adanya', () => {
    // Ini yang menangkap format ketiga kalau suatu hari ada yang menambahkan
    // peran baru dengan gaya penulisan tanggal yang lain.
    const raw = [
      ...WORK_HISTORY.flatMap((role) => [role.start, role.end]),
      ...LEADERSHIP.flatMap((role) => [role.start, role.end]),
      ...ORGS.flatMap((org) => [org.start, org.end]),
    ];

    for (const value of raw) {
      expect(formatMonth(value), `${value} tidak dikenali formatnya`).not.toBe(value);
    }
  });
});
