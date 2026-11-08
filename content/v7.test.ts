import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';
import { CONTACT, TESTIMONIALS } from './ledger';
import { V5_ABOUT, V5_CASES, V5_FOUNDER_MAILTO } from './v5';
import {
  V7_BIO,
  V7_BIO_LINKS,
  V7_CHAPTERS,  V7_COLOPHON,
  V7_CONTACT,
  V7_HISTORY,
  V7_META_DESCRIPTION,
  V7_PRAISE,
  V7_PRAISE_VOICES,
  V7_SEO_SUMMARY,
  V7_STACK_LINE,
  V7_STARS_WORDS,
  V7_WORK,
  V7_WORK_ROWS,
} from './v7';

/**
 * Sapuan guard menyapu SEMUA string v7. Bio ikut di sini: ia juga harus bebas
 * em dash, ejaan British, dan kata sifat tanpa bukti.
 */
const V7_TEXT = [
  V7_SEO_SUMMARY,
  V7_META_DESCRIPTION,
  ...V7_BIO,
  V7_WORK.label,
  V7_PRAISE.label,
  V7_PRAISE.heading,
  V7_HISTORY.label,
  V7_HISTORY.heading,
  V7_STACK_LINE,
  V7_COLOPHON.build,
  V7_COLOPHON.credit,
  ...V7_CHAPTERS.flatMap((c) => [c.title, c.body]),
  ...V7_WORK_ROWS.flatMap((r) => [
    r.nav,
    r.kind,
    r.title,
    r.headline,
    r.context,
    ...r.build,
    ...r.metrics,
    ...r.links.map((l) => l.label),
    r.note ?? '',
  ]),
  ...V7_PRAISE_VOICES.map((v) => v.role),
  ...V7_CONTACT.rows.map((r) => `${r.label} ${r.value}`),
].join(' ');

/**
 * Register yang hanya boleh hidup di dalam bio. Semua section lain harus
 * kering: inilah yang mencegah bahasa "perkenalan generik" menyebar ke Work,
 * praise, history, atau colophon (masalah yang dibongkar di Sesi 30).
 */
const NON_BIO_TEXT = [
  V7_SEO_SUMMARY,
  V7_META_DESCRIPTION,
  V7_WORK.label,
  V7_PRAISE.label,
  V7_PRAISE.heading,
  V7_HISTORY.label,
  V7_HISTORY.heading,
  V7_STACK_LINE,
  V7_COLOPHON.build,
  V7_COLOPHON.credit,
  ...V7_CHAPTERS.flatMap((c) => [c.title, c.body]),
  ...V7_WORK_ROWS.flatMap((r) => [
    r.nav,
    r.kind,
    r.title,
    r.headline,
    r.context,
    ...r.build,
    ...r.metrics,
    ...r.links.map((l) => l.label),
    r.note ?? '',
  ]),
  ...V7_PRAISE_VOICES.map((v) => v.role),
  ...V7_CONTACT.rows.map((r) => `${r.label} ${r.value}`),
].join(' ');

describe('v7 copy rules', () => {
  it('tanpa em dash, ejaan British, atau "Learning and Development"', () => {
    expect(V7_TEXT).not.toMatch(/—/);
    expect(V7_TEXT).not.toMatch(/colour|organis|favour|centre|realis/i);
    expect(V7_TEXT).not.toMatch(/Learning and Development/);
  });

  it('tanpa jembatan kausal L&D ke AI', () => {
    expect(V7_TEXT).not.toMatch(/\b(which lets me|that'?s why|underneath it all|powering my)\b/i);
  });

  it('tanpa kata sifat tanpa bukti', () => {
    expect(V7_TEXT).not.toMatch(
      /(versatile|adaptable|transferable|dynamic|passionate|results-driven|self-motivated)/i,
    );
  });

  it('tanpa metafora puzzle dan tanpa "utility player" yang ambigu', () => {
    expect(V7_TEXT).not.toMatch(/missing piece|puzzle|that makes it click|utility player/i);
  });

  it('register perkenalan hanya boleh hidup di dalam bio', () => {
    // Bio sengaja memakai bahasa ini; section lain tidak. Kalau salah satu
    // frasa muncul di luar bio, itu tanda register personal mulai menyebar.
    expect(NON_BIO_TEXT).not.toMatch(
      /intersection of|work smarter|the whole process|turning complex ideas|the space between|makes life a little easier/i,
    );
  });

  it('tanpa kalimat meta yang mengumumkan integritas halaman', () => {
    // Enam kalimat ini dihapus di revisi 2026-10-15. Ia menjelaskan bahwa
    // halaman bisa dipercaya alih-alih membuktikannya.
    expect(NON_BIO_TEXT).not.toMatch(
      /carries its method|every number|every claim|quoted verbatim|verifiable|guarded by tests|drawn from one ledger/i,
    );
  });
});

describe('v7 bio pembuka', () => {
  it('tetap verbatim dan tidak diam-diam membengkak', () => {
    // 2026-10-15: founder menyetujui pemangkasan tiga kalimat meta dan
    // menulis ulang paragraf penutup; totalnya kini ~153 kata. Band di bawah
    // adalah pagar barunya — bukan sisa band lama 225-240.
    const words = V7_BIO.join(' ').split(/\s+/).filter(Boolean);
    expect(words.length).toBeGreaterThan(140);
    expect(words.length).toBeLessThan(170);
  });

  it('menyebut nama perusahaannya, bukan keterangan samar', () => {
    expect(V7_BIO.join(' ')).toContain('Terra AI');
  });

  it('tetap lima paragraf', () => {
    expect(V7_BIO).toHaveLength(5);
  });

  it('tautan bio menempel di frasa yang benar-benar ada di teks', () => {
    // Bio verbatim: link boleh ditambahkan, tapi hanya di atas frasa yang
    // sudah tertulis. Guard ini gagal kalau frasa di V7_BIO_LINKS salah ketik
    // atau teks bio berubah sampai frasanya hilang.
    const bio = V7_BIO.join(' ');
    for (const link of V7_BIO_LINKS) {
      expect(bio, `"${link.phrase}" tidak ada di V7_BIO`).toContain(link.phrase);
      expect(link.href).toMatch(/^(https:|mailto:)/);
      // Logo bio wajib berkas nyata di public/, bukan path yang mati diam.
      if (link.logo) {
        expect(existsSync(path.join(process.cwd(), 'public', link.logo)), link.logo).toBe(true);
      }
    }
  });
});

describe('v7 mode malam (no-KS: toggle CSS murni)', () => {
  it('kata pemicu ada di bio; toggle dan overlay ada di halaman', () => {
    const bio = V7_BIO.join(' ');
    for (const word of V7_STARS_WORDS) {
      expect(bio, `"${word}" tidak ada di bio`).toContain(word);
    }
    const page = readFileSync(path.join(process.cwd(), 'app/v7/page.tsx'), 'utf8');
    expect(page).toContain('v7-stars-toggle');
    expect(page).toContain('v7-stars-word');
    expect(page).toContain('v7-night');
    expect(page).toContain('id="v7-stars"');
  });

  it('client component berada di bawah app/v7 atau components/v7 (kontrak dibuka 2026-10-16)', () => {
    // REVISI 2026-10-16 (lanjutan): founder MEMBUKA kontrak JavaScript v7 —
    // "Buka penuh": library motion (framer-motion dll.) dan client component
    // tambahan kini sah. Yang tetap dijaga bukan JUMLAH client component,
    // melainkan TEMPATNYA: semua kode client v7 hidup di app/v7 atau
    // components/v7, supaya halaman v3–v6 dan halaman lain tidak terseret
    // dependensi milik staging.
    const v7Dirs = ['app/v7', 'components/v7'].filter((dir) =>
      existsSync(path.join(process.cwd(), dir)),
    );
    const files = v7Dirs.flatMap((dir) => {
      const walk = (d: string): string[] =>
        readdirSync(d).flatMap((entry) => {
          const full = path.join(d, entry);
          return statSync(full).isDirectory() ? walk(full) : [full];
        });
      return walk(path.join(process.cwd(), dir)).filter((f) => /\.tsx?$/.test(f));
    });
    const clients = files
      .filter((f) => readFileSync(f, 'utf8').includes("'use client'"))
      .map((f) => f.replace(/\\/g, '/'));
    for (const client of clients) {
      expect(client).toMatch(/\/(app\/v7|components\/v7)\//);
    }
  });
});

describe('v7 tidak lagi memajang figur di layar pertama', () => {
  it('kotak Key figures hilang dari kanon dan dari halaman', () => {
    // 2026-10-15 (lanjutan Sesi 32): seluruh kotak dihapus. Guard ini menjaga
    // supaya ia tidak diam-diam kembali lewat jalur lain.
    const canon = readFileSync(path.join(process.cwd(), 'content/v7.ts'), 'utf8');
    const page = readFileSync(path.join(process.cwd(), 'app/v7/page.tsx'), 'utf8');
    expect(canon).not.toContain('V7_FIGURES');
    expect(page).not.toContain('V7_FIGURES');
    expect(page).not.toContain('v7-fig');
  });

  it('satu-satunya angka 96% hidup di faktaku headline case 01', () => {
    // Revisi 2026-10-16: kurasi agresif case 01 membuat fakta terkuat jadi
    // headline; metriknya tidak diulang di baris bawah.
    const crm = V7_WORK_ROWS.find((r) => r.id === 'crm-pipeline');
    expect(crm).toBeDefined();
    expect(crm!.headline).toContain('96% less');
    expect(crm!.metrics).toHaveLength(0);
  });
});

describe('v7 work showcase', () => {
  it('enam blok, urut 01 sampai 06', () => {
    expect(V7_WORK_ROWS).toHaveLength(6);
    expect(V7_WORK_ROWS.map((r) => r.index)).toEqual(['01', '02', '03', '04', '05', '06']);
    expect(V7_WORK_ROWS.map((r) => r.id)).toEqual(V5_CASES.map((c) => c.id));
  });

  it('fakta blok showcase berasal dari canon case itu sendiri', () => {
    // Baris tertutup boleh memilih fakta dari mana saja di canon case itu
    // (termasuk yang tidak ikut tampil di panel), tapi tidak boleh menciptakan
    // fakta baru. Dan fakta itu tidak boleh mengulang konteks panelnya.
    const canon = new Map(
      V5_CASES.map((c) => [c.id, [...c.metrics, ...c.build, c.title, c.kind].join(' ').toLowerCase()]),
    );
    for (const row of V7_WORK_ROWS) {
      const source = canon.get(row.id) ?? '';
      for (const part of row.headline.split(' · ')) {
        expect(source, `${row.id}: "${part}" bukan fakta case ini`).toContain(part.toLowerCase());
        expect(row.context.toLowerCase()).not.toContain(part.toLowerCase());
      }
    }
  });

  it('bullet build 0 sampai 3; baris tanpa konteks tak menyisakan teks setelah galeri', () => {
    // 2026-10-16: kurasi agresif case 01 membiarkan build kosong — galeri
    // screenshot yang bercerita. Kini konteksnya juga diambil (permintaan
    // founder: "jangan ada tulisan di bawah gambar") → baris dengan konteks
    // kosong wajib menjadi penutup: tak ada build/metrik/note yang menyusul
    // gambar terakhir. Headline (di atas galeri) tetap wajib ada per row.
    for (const row of V7_WORK_ROWS) {
      expect(row.build.length).toBeLessThanOrEqual(3);
      if (row.context.trim() === '') {
        expect(row.build).toHaveLength(0);
        expect(row.metrics).toHaveLength(0);
        expect(row.note).toBeUndefined();
      }
    }
  });

  it('klaim jumlah agen tidak dimajangkan di v7', () => {
    // 2026-10-16 (permintaan founder): case CRM di v7 tidak lagi menyebut
    // "9-agent". Ledger tetap SSOT-nya; halaman ini hanya menunjuk kanonnya.
    for (const row of V7_WORK_ROWS) {
      const text = [row.title, row.context, ...row.build, ...row.metrics].join(' ');
      expect(text).not.toMatch(/9[- ]agent/i);
    }
  });

  it('metrik "In development" tidak diulang di case yang kind-nya sudah bilang itu', () => {
    for (const row of V7_WORK_ROWS.filter((r) => r.kind.includes('In development'))) {
      expect(row.metrics).toHaveLength(0);
    }
  });

  it('tiga artefak yang dulu dipajang di blok capability tetap hidup sebagai link', () => {
    // Blok capability dihapus; kalau link-link ini hilang, klaimnya kehilangan
    // artefak dan penghapusan itu jadi kerugian, bukan pemangkasan.
    const hrefs = V7_WORK_ROWS.flatMap((r) => r.links.map((l) => l.href));
    expect(hrefs.some((h) => h.includes('nadi-wellbeing'))).toBe(true);
    expect(hrefs).toContain('https://crm.nurfajar.com/');
    expect(hrefs.some((h) => h.includes('instagram.com/ai4impact.id'))).toBe(true);
    for (const href of hrefs) {
      expect(href).toMatch(/^https:\/\//);
    }
  });
});

describe('v7 memakai kembali kanon tanpa menyalin', () => {
  it('praise = testimoni ledger verbatim, tepat enam', () => {
    expect(V7_PRAISE_VOICES).toHaveLength(6);
    expect(V7_PRAISE.heading).toBe('In their words.');
    for (const voice of V7_PRAISE_VOICES) {
      const canon = TESTIMONIALS.find((t) => t.name === voice.name);
      expect(canon, `${voice.name} tidak ada di ledger`).toBeDefined();
      expect(voice.quote).toBe(canon!.quote);
      expect(voice.relation).toBe(canon!.relation);
    }
  });

  it('role praise hanya dipangkas dari ledger, bukan ditambah', () => {
    // Trim-nya wajib ekor dari role ledger: "Managed him directly." dibuang
    // karena relation baris di atasnya sudah mengatakan hal yang sama.
    for (const voice of V7_PRAISE_VOICES) {
      const canon = TESTIMONIALS.find((t) => t.name === voice.name)!;
      expect(canon.role.endsWith(voice.role), `${voice.name}: role bukan ekor ledger`).toBe(true);
      expect(voice.role).not.toMatch(/managed him directly/i);
    }
  });

  it('history empat babak, dan 9.0/10 masih bisa dilacak di halaman', () => {
    expect(V7_HISTORY.heading).toContain('2018');
    expect(V7_CHAPTERS).toHaveLength(4);
    const last = V7_CHAPTERS[V7_CHAPTERS.length - 1].body;
    expect(last).toContain('9.0/10');
    expect(V7_CHAPTERS.some((c) => c.body.includes('150+'))).toBe(true);
  });

  it('stack line hanya nama tool ledger, tanpa logo', () => {
    expect(V7_STACK_LINE).toMatch(/Working stack:/);
    expect(V7_STACK_LINE.length).toBeLessThan(200);
  });

  it('section yang lede-nya dihapus tidak menyisakan field lede', () => {
    expect(Object.keys(V7_WORK)).toEqual(['label']);
    expect(Object.keys(V7_PRAISE)).toEqual(['label', 'heading']);
    expect(Object.keys(V7_HISTORY)).toEqual(['label', 'heading']);
  });

  it('colophon tinggal dua baris', () => {
    expect(Object.keys(V7_COLOPHON)).toEqual(['build', 'credit']);
  });
});

describe('v7 contact dan rail', () => {
  it('mailto founder tetap template terguard', () => {
    const mailto = decodeURIComponent(V5_FOUNDER_MAILTO);
    expect(mailto).toContain(CONTACT.email);
    expect(mailto).toContain('[Name]');
  });

  it('klaim full-time dan availability tetap tampil di contact rows', () => {
    expect(V7_CONTACT.rows.map((r) => r.value).join(' ')).toMatch(/Full-time/);
    expect(V7_CONTACT.rows.map((r) => r.label)).toContain('Available');
  });

  it('tanpa rail, tapi id section tetap dirender supaya deep link hidup', () => {
    // Rail dihapus 2026-10-15. Id section sengaja dipertahankan: tautan
    // langsung ke #work (atau share link ke satu section) masih harus mendarat
    // di tempatnya.
    const page = readFileSync(path.join(process.cwd(), 'app/v7/page.tsx'), 'utf8');
    for (const id of ['top', 'work', 'praise', 'history', 'contact']) {
      expect(page).toContain(`id="${id}"`);
    }
    expect(page).not.toContain('v7-rail');
    expect(page).not.toContain('V7_STOPS');
    const layout = readFileSync(path.join(process.cwd(), 'app/v7/layout.tsx'), 'utf8');
    expect(layout).toContain('id="v7-main"');
  });
});

describe('v7 halaman tetap dokumen: satu client component (WorkNav), sisanya HTML', () => {
  const v7Dirs = ['app/v7', 'components/v7'].filter((dir) =>
    existsSync(path.join(process.cwd(), dir)),
  );

  function walk(dir: string): string[] {
    return readdirSync(dir).flatMap((entry) => {
      const full = path.join(dir, entry);
      if (statSync(full).isDirectory()) return walk(full);
      return /\.(ts|tsx)$/.test(entry) ? [full] : [];
    });
  }

  it('client component v7 tidak menyeberang keluar folder v7', () => {
    // 2026-10-16 (lanjutan): kontrak JS dibuka penuh — jumlah client
    // component bebas; yang dijaga adalah LINGKUPNYA (app/v7 atau
    // components/v7 saja). Duplikasi guard atas dengan sudut pandang lain.
    const clients = v7Dirs
      .flatMap((dir) => walk(path.join(process.cwd(), dir)))
      .filter((file) => readFileSync(file, 'utf8').includes("'use client'"))
      .map((file) => file.replace(/\\/g, '/'));
    for (const client of clients) {
      expect(client).toMatch(/\/(app\/v7|components\/v7)\//);
    }
  });

  it('work dirender sebagai showcase (bukan lagi accordion)', () => {
    // 2026-10-16: accordion <details> diganti enam showcase ala
    // austinvalleskey.com; pil nav scrollspy menyambung ke tiap blok.
    const page = readFileSync(path.join(process.cwd(), 'app/v7/page.tsx'), 'utf8');
    expect(page).toContain('v7-show');
    expect(page).toContain('V7_WORK_ROWS');
    expect(page).toContain('<WorkNav');
    // JSX-nya template literal `w-${row.id}`; source-nya pola itu, bukan id jadi.
    expect(page).toContain('w-${row.id}');
    expect(page).not.toContain('v7-work__row');
    expect(page).not.toContain('v7-cap');
    expect(page).not.toContain('v7-fig');
    expect(page).not.toContain('v7-quickcontact');
  });
});
