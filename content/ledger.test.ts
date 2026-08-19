import { describe, expect, it } from 'vitest';
import {
  BUILT,
  CONTACT,
  HERO_STATS,
  LEADERSHIP,
  PROOF,
  SKILLS,
  SKILLS_FOOTNOTE,
  TECHNICAL_FOOTNOTE,
  TESTIMONIALS,
  WORK,
  WORK_HISTORY,
} from './ledger';

/**
 * Prinsip non-negosiabel dari spec, ditulis ulang sebagai tes.
 *
 * Aturan-aturan ini adalah jenis yang paling gampang bocor pelan-pelan lewat
 * satu edit copy yang kelihatannya tidak berbahaya: satu angka ditambah tanpa
 * metodenya, satu kata "AI" masuk ke hero, satu angka lama muncul lagi. Semua
 * itu adalah bug faktual, bukan selera — jadi tempatnya di suite tes, bukan di
 * checklist yang dibaca manusia sekali lalu dilupakan.
 */

describe('P2 — setiap angka punya denominator atau metode', () => {
  it('setiap sel stat di hero membawa baris metode', () => {
    for (const stat of HERO_STATS) {
      expect(stat.method.trim().length, `${stat.label} tidak punya metode`).toBeGreaterThan(0);
    }
  });

  it('setiap sel di grid Proof membawa baris metode', () => {
    for (const cell of PROOF) {
      expect(cell.method.trim().length, `${cell.label} tidak punya metode`).toBeGreaterThan(0);
    }
  });

  it('angka 1.250 jam selalu muncul bersama aritmetikanya', () => {
    // 3.000 prospek x 25 menit = 75.000 menit = 1.250 jam persis. Angka yang
    // bisa dihitung ulang pembaca tidak bisa dituduh mengarang.
    expect(TECHNICAL_FOOTNOTE).toContain('1,250');
    expect(TECHNICAL_FOOTNOTE).toMatch(/3,000\s*(x|×)\s*25 min/);
  });
});

describe('P3 — angka situs match dengan CV', () => {
  const allCopy = [
    ...HERO_STATS.map((stat) => `${stat.value} ${stat.method}`),
    ...PROOF.map((cell) => `${cell.value} ${cell.method}`),
    ...BUILT.flatMap((card) => card.metrics),
    ...WORK_HISTORY.map((role) => role.detail),
  ].join(' | ');

  it.each([
    ['350+', 'digelembungkan dari 300+'],
    ['1,000+', 'diganti 1,250 yang punya aritmetika'],
    ['600 qualified', 'metrik sales murni, pindah ke CV saja'],
    ['Kirkpatrick', 'CV tidak pernah menyebutnya'],
    ['90%+ satisfaction', 'satu skala saja: 9.0/10'],
  ])('angka lama %s tidak muncul lagi (%s)', (stale) => {
    expect(allCopy).not.toContain(stale);
  });

  it('ketiga jabatan berbayar memakai tanggal yang sama persis dengan CV', () => {
    expect(WORK_HISTORY.map((role) => `${role.start} ${role.end} ${role.title}`)).toEqual([
      '2025 JUL 2026 JUL Learning & Development Specialist',
      '2024 FEB 2025 JUN AI Training Specialist',
      '2023 FEB 2024 JAN Machine Learning Mentor',
    ]);
  });

  it('setiap peran membawa uraiannya dari CV', () => {
    for (const role of [...WORK_HISTORY, ...LEADERSHIP]) {
      expect(role.bullets.length, `${role.title} tidak punya uraian`).toBeGreaterThan(0);
    }
  });

  it('pengalaman organisasi dipisah dari riwayat kerja berbayar', () => {
    // CV memisahkan WORK EXPERIENCE dari LEADERSHIP & ORGANIZATIONAL. Situs
    // harus memisahkannya juga, kalau tidak sinyal seniority peran berbayar
    // ikut mengencer.
    expect(WORK_HISTORY).toHaveLength(3);
    expect(LEADERSHIP).toHaveLength(2);
    for (const role of LEADERSHIP) {
      expect(WORK_HISTORY).not.toContainEqual(role);
    }
  });
});

describe('framing — situs berbicara satu identitas: L&D / ID / CD', () => {
  it('tidak ada kata AI di kesan pertama', () => {
    const firstImpression = HERO_STATS.map((stat) => `${stat.label} ${stat.method}`).join(' ');
    expect(firstImpression).not.toMatch(/\bAI\b/);
  });

  it('section "What I built" tidak memuat proyek AI', () => {
    const built = BUILT.map((card) => `${card.title} ${card.body} ${card.metrics.join(' ')}`).join(' ');
    expect(built).not.toMatch(/\b9[- ]agent\b/i);
    expect(built).not.toMatch(/\bCRM\b/);
  });

  it('kredensial 9-agent CRM muncul tepat sekali, sebagai footnote', () => {
    const everywhereElse = [
      ...BUILT.map((card) => `${card.title} ${card.body}`),
      ...WORK.map((card) => `${card.title} ${card.body}`),
      ...PROOF.map((cell) => `${cell.label} ${cell.method}`),
      ...SKILLS.flatMap((group) => group.items),
      // Uraian peran disalin dari CV, dan CV memang memuat bullet
      // "Beyond the L&D mandate" soal pipeline 9 agent. Bullet itu sengaja
      // TIDAK ikut disalin: ia sudah punya tempatnya di Proof, dan spec
      // hanya memberinya satu tempat di seluruh situs.
      ...[...WORK_HISTORY, ...LEADERSHIP].flatMap((role) => role.bullets),
    ].join(' ');

    expect(everywhereElse).not.toMatch(/9-agent/i);
    expect(TECHNICAL_FOOTNOTE).toMatch(/9-agent/i);
  });

  it('domain proyek AI diberi label sales ops, bukan training', () => {
    expect(TECHNICAL_FOOTNOTE).toContain('sales ops');
    expect(TECHNICAL_FOOTNOTE).toMatch(/not training, not curriculum/i);
  });

  it('Terra Weather disebut namanya, dengan hubungannya ke Terra AI', () => {
    // Tanpa ini pembaca menyimpulkan proyeknya dikerjakan di employer yang
    // sama dengan pekerjaan L&D-nya, yang bukan gambaran yang akurat.
    expect(TECHNICAL_FOOTNOTE).toContain('Terra Weather');
    expect(TECHNICAL_FOOTNOTE).toContain('parent company');
  });

  it('Skills tidak memuat nama vendor LLM sebagai kompetensi terpisah', () => {
    const items = SKILLS.flatMap((group) => group.items);
    for (const vendor of ['Claude', 'Gemini', 'GPT', 'Perplexity']) {
      expect(items).not.toContain(vendor);
    }
  });

  it('kompetensi teknis turun jadi catatan, bukan grup skill keempat', () => {
    expect(SKILLS).toHaveLength(3);
    expect(SKILLS_FOOTNOTE).toContain('Python');
  });
});

describe('artefak & kontak', () => {
  it('setiap kartu Selected Work punya tautan asli, atau menjelaskan kenapa tidak', () => {
    // Kartu tanpa tautan asli lebih baik dihapus daripada dipajang. Kalau ia
    // tetap ada, ia wajib mengatakan terus terang kenapa tidak bisa dibuka.
    for (const card of WORK) {
      if (!card.href) {
        expect(card.note, `${card.title} tanpa href dan tanpa penjelasan`).toBeTruthy();
      } else {
        expect(card.href).toMatch(/^https:\/\//);
      }
    }
  });

  it('nama file CV deskriptif, bukan nf.pdf', () => {
    expect(CONTACT.cv).toBe('/Nur-Fajar-LnD-Specialist-CV.pdf');
  });

  it('konflik 9.8 vs 9.0 diselesaikan dengan caption, bukan dibiarkan', () => {
    const nineEight = TESTIMONIALS.find((testimonial) => testimonial.quote.includes('9.8'));
    expect(nineEight?.caption).toBeTruthy();
  });

  it('hanya tiga testimoni — yang generik sudah dipangkas', () => {
    expect(TESTIMONIALS).toHaveLength(3);
  });
});
