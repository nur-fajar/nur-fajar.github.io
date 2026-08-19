import { describe, expect, it } from 'vitest';
import * as ledger from './ledger';
import {
  BUILT,
  CONTACT,
  HERO_STATS,
  LEADERSHIP,
  LOOKING_FOR,
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
 * itu adalah bug faktual, bukan selera , jadi tempatnya di suite tes, bukan di
 * checklist yang dibaca manusia sekali lalu dilupakan.
 */

describe('P2 , setiap angka punya denominator atau metode', () => {
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

describe('P3 , angka situs match dengan CV', () => {
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

describe('framing , situs berbicara satu identitas: L&D / ID / CD', () => {
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

  it('tidak ada testimoni yang mengutip angka rating, supaya tidak bentrok dengan 9.0 di Proof', () => {
    // Percobaan pertama memakai kutipan "9.8 out of 10" dan menambahkan
    // caption penjelas supaya tidak terbaca konflik dengan 9.0 di sebelahnya.
    // Caption defensif begitu justru menanam keraguan yang tidak perlu ada.
    // Perbaikannya bukan menjelaskan angkanya, tapi tidak mengutip angka sama
    // sekali, testimoni ada untuk anekdot spesifik, bukan untuk statistik
    // kedua.
    for (const testimonial of TESTIMONIALS) {
      expect(testimonial.quote, `${testimonial.name} mengutip angka rating`).not.toMatch(/\d(\.\d)?\s*(out of|\/)\s*10/i);
    }
  });

  it('hanya tiga testimoni , yang generik sudah dipangkas', () => {
    expect(TESTIMONIALS).toHaveLength(3);
  });
});

describe('amandemen Agustus 2026, koreksi fakta dari Fajar', () => {
  it('tidak ada em dash di mana pun dalam konten yang di-export', () => {
    // Scan mekanis, bukan review manual: sekali satu edit copy menyelipkan
    // em dash lagi, tes ini yang menangkapnya, bukan mata seseorang.
    for (const [key, value] of Object.entries(ledger)) {
      const text = JSON.stringify(value);
      expect(text, `${key} mengandung em dash`).not.toMatch(/—/);
    }
  });

  it('What I Built cuma 2 kartu: dashboard dan marketing sudah dihapus, bukan disembunyikan', () => {
    expect(BUILT.map((card) => card.id)).toEqual(['curriculum', 'train-the-trainers']);
  });

  it('Selected Work cuma 3 kartu: dashboard-artifact sudah dihapus', () => {
    expect(WORK.map((card) => card.id)).toEqual(['chatbot-business', 'chatbot-education', 'gen-ai-pm']);
  });

  it('Train the Trainers tidak mengklaim lecturer sudah mengajar', () => {
    // Training baru selesai Juni 2026; lecturer belum membawa kurikulumnya
    // ke mahasiswa mereka sendiri. Klaim "now deliver ... without me" adalah
    // klaim hasil yang belum terjadi, bukan klaim kompetensi yang sudah ada.
    const ttt = BUILT.find((card) => card.id === 'train-the-trainers');
    expect(ttt?.body).not.toMatch(/now deliver/i);
    expect(ttt?.body).not.toMatch(/without me/i);
  });

  it('"5 programs" dan "4 curriculum modules" dikunci ke tahun L&D, bukan ke 3 tahun', () => {
    const programsStat = HERO_STATS.find((stat) => stat.value === '5');
    const modulesStat = HERO_STATS.find((stat) => stat.value === '4');
    expect(programsStat?.method).toMatch(/L&D Specialist/);
    expect(modulesStat?.method).toMatch(/L&D Specialist/);

    const programsCell = PROOF.find((cell) => cell.label.startsWith('programs run'));
    const modulesCell = PROOF.find((cell) => cell.label.startsWith('curriculum modules'));
    expect(programsCell?.method).toMatch(/L&D Specialist/);
    expect(modulesCell?.method).toMatch(/L&D Specialist/);
  });

  it('"300+ learners" tetap dilabeli lintas 3 peran, tidak pernah dikunci ke satu tahun', () => {
    const learnersStat = HERO_STATS.find((stat) => stat.label === 'learners trained');
    const learnersCell = PROOF.find((cell) => cell.label === 'learners trained');
    expect(learnersStat?.method).toContain('3 roles');
    expect(learnersCell?.method).toContain('3 roles');
  });

  it('Curriculum Developer ada di daftar peran yang dicari', () => {
    const rolesRow = LOOKING_FOR.find(([label]) => label === 'Roles');
    expect(rolesRow?.[1]).toContain('Curriculum Developer');
  });
});
