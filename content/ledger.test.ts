import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import * as ledger from './ledger';
import {
  ADDIE_PHASES,
  ADDIE_SECTION,
  BACKGROUND,
  BUILT,
  CONTACT,
  CREDENTIALS,
  CRM_PROJECT,
  GALLERY_CATEGORY_LABEL,
  HERO,
  LEADERSHIP,
  LOOKING_FOR,
  MAILTO,
  PROJECTS,
  PROOF,
  SKILLS,
  TESTIMONIALS,
  V3_GALLERY_CATEGORY,
  V3_HOME_TILES,
  V3_NAV,
  V3_PROJECT_CATEGORIES,
  V3_ROLE_CHIPS,
  V3_TOOLS,
  V3_WEBSITES,
  WORK,
  WORK_GALLERY,
  WORK_HISTORY,
} from './ledger';

/**
 * Prinsip non-negosiabel dari spec, ditulis ulang sebagai tes.
 *
 * Aturan-aturan ini adalah jenis yang paling gampang bocor pelan-pelan lewat
 * satu edit copy yang kelihatannya tidak berbahaya: satu angka ditambah tanpa
 * metodenya, satu kata "AI" masuk ke hero, satu angka lama muncul lagi. Semua
 * itu adalah bug faktual, bukan selera, jadi tempatnya di suite tes, bukan di
 * checklist yang dibaca manusia sekali lalu dilupakan.
 */

describe('P2 , setiap angka punya denominator atau metode', () => {
  it('setiap sel di grid Proof membawa baris metode', () => {
    for (const cell of PROOF) {
      expect(cell.method.trim().length, `${cell.label} tidak punya metode`).toBeGreaterThan(0);
    }
  });

  it('"300+" membawa pecahannya, bukan cuma totalnya', () => {
    // Pembaca dulu harus menjumlahkan sendiri dari tiga tempat berbeda di
    // halaman, dan angka bulat yang tidak bisa dilacak asalnya justru yang
    // paling gampang dicurigai. Ketiga suku harus ada di baris method-nya.
    const learners = PROOF.find((cell) => cell.value === '300+');
    expect(learners?.method).toContain('50+');
    expect(learners?.method).toContain('100+');
    expect(learners?.method).toContain('150+');
  });

  it('klaim penghematan pipeline CRM bisa dihitung ulang pembaca', () => {
    // 300+ jam manual jadi ~11 jam runtime adalah pengurangan ~96%. Angka
    // yang menunjukkan aritmetikanya sendiri tidak bisa dituduh dikarang.
    const metrics = CRM_PROJECT.metrics.join(' ');
    expect(metrics).toMatch(/~11h runtime vs 300\+h manual/);
    expect(metrics).toContain('96%');
  });
});

describe('satu angka, satu periode, satu objek', () => {
  it('9.0/10 selalu membawa periodenya, di mana pun ia muncul', () => {
    // Angka ini pernah mengklaim dua periode kerja sekaligus: tahun AI
    // Training Specialist tempat ia lahir, DAN tahun L&D setahun sesudahnya
    // lewat kartu kurikulum. Sekarang setiap kemunculannya wajib menyebut
    // 2024-2025, dan tempat yang bukan miliknya tidak boleh menyebutnya.
    const everywhere = [
      ...PROOF.map((cell) => `${cell.value} ${cell.method}`),
      ...WORK_HISTORY.flatMap((role) => [role.detail, ...role.bullets]),
      ...BUILT.flatMap((card) => [card.body, ...card.metrics]),
    ];

    for (const line of everywhere) {
      if (!line.includes('9.0/10')) continue;
      expect(line, `"${line}" menyebut 9.0/10 tanpa periodenya`).toMatch(/2024\D{1,4}2025/);
    }
  });

  it('kartu kurikulum L&D tidak meminjam angka kepuasan dari tahun sebelumnya', () => {
    const curriculum = BUILT.find((card) => card.id === 'curriculum');
    expect(curriculum?.metrics.join(' ')).not.toContain('9.0/10');
  });

  it('"5 programs" dan "3 curriculum modules" dikunci ke tahun L&D, bukan ke 3 tahun', () => {
    const programs = PROOF.find((cell) => cell.label.startsWith('programs run'));
    const modules = PROOF.find((cell) => cell.label.startsWith('curriculum modules'));
    expect(programs?.method).toMatch(/Learning & Development Specialist/);
    expect(modules?.method).toMatch(/Learning & Development Specialist/);
  });

  it('"300+ learners" tetap dilabeli lintas 3 peran, tidak pernah dikunci ke satu tahun', () => {
    const learners = PROOF.find((cell) => cell.label === 'learners trained');
    expect(learners?.method).toContain('3 roles');
  });
});

describe('P3 , angka situs match dengan CV', () => {
  const allCopy = [
    ...PROOF.map((cell) => `${cell.value} ${cell.method}`),
    ...BUILT.flatMap((card) => card.metrics),
    ...WORK_HISTORY.map((role) => role.detail),
  ].join(' | ');

  it.each([
    ['350+', 'digelembungkan dari 300+'],
    ['1,000+', 'diganti aritmetika 300+ jam ke 11 jam'],
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
    // Empat sel pertama PROOF adalah band angka tepat di bawah hero. Nama
    // peran "AI Training Specialist" ada lengkap di Experience; ia tidak
    // perlu ikut ke layar pertama, tempat situs ini berbicara L&D.
    const firstImpression = [
      HERO.support,
      HERO.sub.join(' '),
      HERO.proof,
      ...PROOF.slice(0, 4).map((cell) => `${cell.label} ${cell.method}`),
    ].join(' ');
    expect(firstImpression).not.toMatch(/\bAI\b/);
  });

  it('section "What I built" tidak memuat proyek AI', () => {
    const built = BUILT.map((card) => `${card.title} ${card.body} ${card.metrics.join(' ')}`).join(' ');
    expect(built).not.toMatch(/\b9[- ]agent\b/i);
    expect(built).not.toMatch(/\bCRM\b/);
  });

  it('pipeline CRM muncul tepat sekali, sebagai kartu berlabel di luar mandat L&D', () => {
    // Ia dulu dua paragraf disclaimer berturut-turut di kaki Experience. Dua
    // kali menyangkal satu hal yang sama membaca seperti orang yang tahu ia
    // sedang menaruh sesuatu di tempat yang salah. Sekarang tepat satu kartu,
    // dan labelnya yang melakukan pekerjaan pemisahan.
    const everywhereElse = [
      ...BUILT.map((card) => `${card.title} ${card.body}`),
      ...WORK.map((card) => `${card.title} ${card.body}`),
      ...PROOF.map((cell) => `${cell.label} ${cell.method}`),
      ...SKILLS.flatMap((group) => group.items),
      ...[...WORK_HISTORY, ...LEADERSHIP].flatMap((role) => role.bullets),
    ].join(' ');

    expect(everywhereElse).not.toMatch(/9-agent/i);
    expect(CRM_PROJECT.title).toMatch(/9-agent/i);
    expect(PROJECTS.filter((card) => /9-agent/i.test(card.title))).toHaveLength(1);
  });

  it('kartu CRM menyebut tiga komponen L&D yang absen, bukan meminta maaf', () => {
    // "No learners, no curriculum, no evaluation" menyebut tiga komponen
    // secara spesifik, jadi pembaca L&D langsung paham batasnya. Versi lama
    // ("Not training, not curriculum") menyebut dua dan salah satunya
    // kategori, bukan komponen.
    expect(CRM_PROJECT.body).toContain('No learners, no curriculum, no evaluation');
    // Domainnya disebut, dan disebut sebagai sales ops, bukan sebagai
    // training: itu yang menempatkan proyek ini di luar mandat L&D secara
    // faktual, bukan cuma lewat label kartunya.
    expect(CRM_PROJECT.body).toMatch(/sales/i);
    expect(CRM_PROJECT.kind).toBe('Outside the Learning & Development mandate');
  });

  it('Terra Weather disebut namanya, dengan hubungannya ke Terra AI', () => {
    // Tanpa ini pembaca menyimpulkan proyeknya dikerjakan di employer yang
    // sama dengan pekerjaan L&D-nya, yang bukan gambaran yang akurat.
    const card = `${CRM_PROJECT.title} ${CRM_PROJECT.body}`;
    expect(card).toContain('Terra Weather');
    expect(card).toContain('Learning & Development Specialist');
  });

  it('tidak ada kata penghubung sebab-akibat antara L&D dan AI', () => {
    // Ini yang menjatuhkan skor versi lama: satu "which lets me" atau
    // "that's why" mengubah dua fakta paralel jadi klaim sintesis yang tidak
    // pernah dibuktikan. Penghubungnya harus paralel, bukan kausal.
    const bridges = /\b(which lets me|that'?s why|underneath it all|powering my)\b/i;
    for (const [key, value] of Object.entries(ledger)) {
      expect(JSON.stringify(value), `${key} memakai jembatan sebab-akibat`).not.toMatch(bridges);
    }
  });

  it('tidak ada kalimat yang menyebut L&D dan AI dalam satu napas', () => {
    // Kalimat "I don't just use AI. I have taught 100+ professionals..." sempat
    // ada dan sudah dihapus. Faktanya tidak hilang: 100+ ada di bullet AI
    // Training Specialist, 6 lecturer ada di kartu Train the Trainers, dan
    // ketiga kursusnya berdiri sebagai kartu yang bisa diklik di Work.
    for (const [key, value] of Object.entries(ledger)) {
      expect(JSON.stringify(value), `${key} menyebut L&D dan AI sebaris`).not.toMatch(
        /don'?t just use AI/i,
      );
    }
    // Ketiga kursus yang berdiri sebagai bukti memang punya tautan publik.
    expect(WORK.filter((card) => card.href)).toHaveLength(3);
  });

  it('Skills tidak memuat nama vendor LLM sebagai kompetensi terpisah', () => {
    const items = SKILLS.flatMap((group) => group.items);
    for (const vendor of ['Claude', 'Gemini', 'GPT', 'Perplexity']) {
      expect(items).not.toContain(vendor);
    }
  });

  it('tidak ada kata sifat yang tidak bisa dibuktikan, di mana pun', () => {
    // Aturan permanen dari audit §2: setiap kata sifat di situs harus bisa
    // dibuktikan angka atau artefak. Kata-kata di bawah tidak pernah bisa,
    // dan justru kata-kata itu yang paling gampang menyelinap masuk saat
    // seseorang ingin terdengar luwes atau bersemangat.
    for (const [key, value] of Object.entries(ledger)) {
      expect(JSON.stringify(value), `${key} memakai kata sifat tanpa bukti`).not.toMatch(
        /(versatile|adaptable|transferable|dynamic|passionate|results-driven|self-motivated)/i,
      );
    }
  });

  it('daftar kompetensi hidup di satu tempat saja', () => {
    // Kartu Terra AI dan Bangkit dulu masing-masing membawa tag list sendiri
    // yang mengulang blok Skills hampir chip per chip, jadi pembaca melewati
    // daftar yang nyaris identik tiga kali sebelum sampai ke Work.
    expect(SKILLS).toHaveLength(3);
    for (const org of ledger.ORGS) {
      expect(org, `${org.org} masih membawa tag list sendiri`).not.toHaveProperty('chips');
    }
  });
});

describe('hero , tiga pertanyaan screening dijawab di layar pertama', () => {
  it('baris meta menutup lokasi, kesiapan mulai, dan bentuk kerja', () => {
    const meta = HERO.meta.join(' · ');
    expect(meta).toMatch(/Indonesia/);
    expect(meta).toMatch(/GMT\+7/);
    expect(meta).toMatch(/Remote or hybrid/);
    expect(meta).toMatch(/Available now/);
  });

  it('kalimat terkuat situs duduk di hero, bukan di dasar halaman', () => {
    // Ia dulu ada di section Contact, tempat sebagian besar pembaca tidak
    // pernah sampai.
    expect(HERO.sub.join(' ')).toContain('whether training is even the right answer');
  });

  it('baris bukti mengundang verifikasi, bukan mengulang klaim', () => {
    expect(HERO.proof).toMatch(/live and public/);
    expect(HERO.proof).toMatch(/see what's inside/);
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

  it('setiap kredensial di strip utama bisa diverifikasi sendiri', () => {
    // Kredensial tanpa tautan cuma klaim yang diketik rapi. Yang belum punya
    // tautan boleh tetap dipajang, tapi ia turun dari strip utama alih-alih
    // berpura-pura bisa dibuka.
    const primary = CREDENTIALS.filter((credential) => credential.track === 'ld');
    expect(primary.length).toBeGreaterThanOrEqual(3);
    for (const credential of primary) {
      expect(credential.href, `${credential.name} tanpa tautan verifikasi`).toMatch(/^https:\/\//);
    }
  });

  it('kredensial paling relevan ke peran target ada di strip utama', () => {
    const primary = CREDENTIALS.filter((c) => c.track === 'ld')
      .map((c) => c.name)
      .join(' ');
    expect(primary).toMatch(/HRCI/);
    expect(primary).toMatch(/HRD/);
    expect(primary).toMatch(/Learning and Development/);
  });

  it('publikasi JOIV duduk di latar pendidikan, bukan di kredensial profesional', () => {
    const education = BACKGROUND.find((card) => card.id === 'education');
    expect(education?.link?.href).toMatch(/10\.62527\/joiv/);
    expect(CREDENTIALS.map((c) => c.name).join(' ')).not.toMatch(/JOIV/);
  });

  it('nama file CV deskriptif, bukan nf.pdf', () => {
    // Tanpa nama role di file-nya, sengaja , CV yang sama dipakai lintas
    // lamaran tanpa kelihatan ditujukan untuk satu posisi spesifik.
    expect(CONTACT.cv).toBe('/Nur-Fajar-Resume.pdf');
  });

  it('mailto membawa kerangka isian, bukan cuma sapaan', () => {
    // Body lama cuma "Hi Fajar," yang menyerahkan seluruh pekerjaan menyusun
    // email ke pengirim. Setiap gesekan yang dihapus dari sisi mereka
    // menaikkan tingkat balasan.
    const body = decodeURIComponent(MAILTO);
    for (const field of ['Role:', 'Team size:', 'Setup (remote/hybrid):', 'What we need someone to fix:']) {
      expect(body, `mailto tidak punya baris "${field}"`).toContain(field);
    }
  });

  it('ekspektasi balasan ditulis, bukan diasumsikan', () => {
    expect(CONTACT.responseTime).toMatch(/24 hours/);
    expect(CONTACT.responseTime).toMatch(/GMT\+7/);
  });
});

describe('referensi , tiga sudut pandang, bukan tiga pujian', () => {
  it('hanya tiga testimoni , yang generik sudah dipangkas', () => {
    expect(TESTIMONIALS).toHaveLength(3);
  });

  it('ketiganya melihat dari arah yang berbeda', () => {
    // Judul section berjanji "a manager, a mentee, and a peer". Versi lama
    // berjanji hal serupa padahal dua dari tiga sama-sama mentee.
    const relations = TESTIMONIALS.map((t) => t.relation.toLowerCase());
    expect(relations.some((r) => r.includes('manager'))).toBe(true);
    expect(relations.some((r) => r.includes('mentee'))).toBe(true);
    expect(relations.some((r) => r.includes('peer'))).toBe(true);
    expect(new Set(relations).size).toBe(3);
  });

  it('tidak ada testimoni yang mengutip angka rating, supaya tidak bentrok dengan 9.0', () => {
    for (const testimonial of TESTIMONIALS) {
      expect(testimonial.quote, `${testimonial.name} mengutip angka rating`).not.toMatch(
        /\d(\.\d)?\s*(out of|\/)\s*10/i,
      );
    }
  });

  it('kutipan manajer tidak menyebut artefak yang situs sebut dengan nama lain', () => {
    // Rekomendasi aslinya menyebut "a chatbot to help students track
    // progress"; situs ini menyebut artefak yang sama sebagai dashboard
    // Sheets/Notion. Keduanya jujur, tapi berdampingan keduanya saling
    // melemahkan.
    const manager = TESTIMONIALS.find((t) => t.relation.toLowerCase().includes('manager'));
    expect(manager?.quote).not.toMatch(/chatbot/i);
  });
});

describe('CTA , hierarki, bukan tiga tombol setara', () => {
  it('daftar jabatan yang dicari dipangkas jadi empat', () => {
    // Enam judul jabatan berjajar membaca sebagai kandidat yang belum
    // memilih. Sisanya turun ke satu baris catatan.
    const roles = LOOKING_FOR.find((row) => row.label === 'Roles')?.value ?? '';
    expect(roles.split('·')).toHaveLength(4);
    expect(roles).toContain('Learning & Development Specialist');
    expect(roles).toContain('Instructional Designer');
    expect(roles).toContain('Learning Program Manager');
    expect(roles).toContain('Curriculum Developer');
  });

  it('peran hybrid disebut sebagai catatan, bukan sebagai jabatan keempat', () => {
    const roles = LOOKING_FOR.find((row) => row.label === 'Roles');
    expect(roles?.note).toMatch(/AI enablement/);
  });

  it('baris Setup menjawab onsite dan relokasi, dua penggugur paling awal', () => {
    const setup = LOOKING_FOR.find((row) => row.label === 'Setup');
    expect(setup?.reveal?.label).toMatch(/onsite in Indonesia/i);
    expect(setup?.note).toMatch(/relocate/i);
    // Daftar kotanya hidup di data, bukan cuma di CSS: kalau ia hanya muncul
    // lewat hover ia tidak akan pernah sampai ke pengguna ponsel.
    expect(setup?.reveal?.items).toEqual(['Tangerang', 'Jakarta', 'Bandung', 'Bali', 'Surabaya']);
  });
});

describe('WORK_GALLERY , bento marketing & event content', () => {
  it('setiap id unik, dipakai sebagai key React dan nama file thumbnail', () => {
    const ids = WORK_GALLERY.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('href selalu menuju post Instagram asli, bukan link generik', () => {
    for (const item of WORK_GALLERY) {
      expect(item.href, `${item.id} href tidak menuju instagram.com/p/`).toMatch(
        /^https:\/\/www\.instagram\.com\/p\/[^/]+\/$/,
      );
      expect(item.href, `${item.id} href tidak cocok dengan id-nya sendiri`).toContain(`/p/${item.id}/`);
    }
  });

  it('thumbnail selalu /work-gallery/<id>.jpg dan file-nya benar ada di public/', () => {
    for (const item of WORK_GALLERY) {
      expect(item.thumbnail).toBe(`/work-gallery/${item.id}.jpg`);
      const onDisk = path.join(process.cwd(), 'public', item.thumbnail);
      expect(existsSync(onDisk), `${item.thumbnail} tidak ada di public/work-gallery/`).toBe(true);
    }
  });

  it('setiap kategori item punya label tampilan yang terdaftar', () => {
    for (const item of WORK_GALLERY) {
      expect(GALLERY_CATEGORY_LABEL[item.category], `${item.id} pakai kategori tanpa label`).toBeTruthy();
    }
  });
});

describe('ejaan & tipografi', () => {
  it('tidak ada em dash di mana pun dalam konten yang di-export', () => {
    // Scan mekanis, bukan review manual: sekali satu edit copy menyelipkan
    // em dash lagi, tes ini yang menangkapnya, bukan mata seseorang.
    for (const [key, value] of Object.entries(ledger)) {
      expect(JSON.stringify(value), `${key} mengandung em dash`).not.toMatch(/—/);
    }
  });

  it('ejaan US konsisten, tidak campur dengan ejaan British', () => {
    // "organisations" dan "organizations" pernah hidup berdampingan di
    // halaman yang sama. Situs yang menjual perhatian ke detail instruksional
    // tidak boleh salah eja kata yang sama dua cara.
    for (const [key, value] of Object.entries(ledger)) {
      const text = JSON.stringify(value);
      expect(text, `${key} memakai ejaan British`).not.toMatch(
        /\b(organisation|organisations|programme|programmes|customise|customised)\b/i,
      );
    }
  });

  it('nama disiplinnya ditulis satu cara saja: Learning & Development', () => {
    // CREDENTIALS dikecualikan, dan pengecualiannya bukan celah: nama
    // sertifikat adalah nama diri milik penerbitnya. Sertifikat LinkedIn itu
    // memang bernama "Generative AI for Learning and Development", dan
    // menulis ulang nama sertifikat orang lain demi konsistensi gaya sendiri
    // membuat kredensialnya lebih sulit dicocokkan dengan halaman
    // verifikasinya, yang justru merugikan.
    for (const [key, value] of Object.entries(ledger)) {
      if (key === 'CREDENTIALS') continue;
      expect(JSON.stringify(value), `${key} memakai "Learning and Development"`).not.toMatch(
        /Learning and Development/,
      );
    }
  });
});

describe('amandemen Agustus 2026, koreksi fakta dari Fajar', () => {
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

  /* ═══ Inside One Program ══════════════════════════════════════════════════
     Grid bento lima kartu diganti accordion lima fase. Yang berubah adalah
     bentuk penyajiannya; yang TIDAK boleh berubah adalah faktanya, jadi
     invarian faktual dari versi bento dipindah utuh ke bawah ini alih-alih
     ikut terhapus bersama komponennya. Tes yang dihapus bersama komponen yang
     digantikannya adalah cara paling rapi untuk kehilangan koreksi yang dulu
     mahal didapat. */

  it('ADDIE berhenti di lima fase, halaman verifikasi sertifikat tidak ikut', () => {
    // Kotak keenam untuk credentialing pernah dipertimbangkan dan ditolak:
    // sertifikat itu bukti kelulusan, bukan bukti evaluasi, dan enam fase
    // membuat model lima fase terbaca sebagai model enam fase.
    expect(ADDIE_PHASES.map((phase) => phase.letter).join('')).toBe('ADDIE');
    expect(ADDIE_PHASES.map((phase) => phase.index)).toEqual(['01', '02', '03', '04', '05']);
  });

  it('setiap fase membawa isi, tidak ada accordion yang terbuka ke ruang kosong', () => {
    // Accordion yang terbuka lalu tidak menunjukkan apa pun lebih buruk
    // daripada accordion yang tidak ada: pembaca sudah membayar satu klik.
    for (const phase of ADDIE_PHASES) {
      expect(phase.blocks.length, `${phase.phase} tanpa blok isi`).toBeGreaterThanOrEqual(3);
      expect(phase.headline.trim().length, `${phase.phase} tanpa headline`).toBeGreaterThan(0);
      expect(phase.question.trim().length, `${phase.phase} tanpa pertanyaan`).toBeGreaterThan(0);
    }
  });

  it('headline tiap fase tetap satu kalimat pembuka, bukan paragraf', () => {
    // Ia baris pertama isi panel, tepat di bawah nama fase, dan tugasnya
    // mengatakan apa isi fase ini dalam sekali baca sebelum pembaca memutuskan
    // menggulir. Di atas 110 karakter ia berhenti jadi pembuka dan mulai jadi
    // paragraf yang kebetulan dicetak tebal.
    for (const phase of ADDIE_PHASES) {
      expect(phase.headline.length, `headline ${phase.phase} terlalu panjang`).toBeLessThanOrEqual(
        110,
      );
    }
  });

  it('kepala section dikunci kata per kata', () => {
    // Kalimat yang dikunci di sini adalah kalimat yang paling gampang bergeser
    // diam-diam lewat satu edit yang niatnya cuma merapikan.
    //
    // Judul dan eyebrow tidak boleh memakai kata yang sama: versi sebelumnya
    // beryebrow "Inside one program" di atas judul "One program, opened up
    // phase by phase", jadi tiga kata yang sama dicetak dua kali berjarak
    // delapan piksel. Judul lama juga menjelaskan ANTARMUKA-nya, bukan isinya,
    // dan tidak ada judul lain di situs ini yang melakukan itu.
    expect(ADDIE_SECTION.eyebrow).toBe('Behind the work');
    expect(ADDIE_SECTION.title).toBe('How one program actually got made.');
    expect(ADDIE_SECTION.lede).toBe(
      'Train the Trainers: GenAI Product Manager. University lecturers, four live sessions, ' +
        'and a five week independent build. Below is the working method behind it, from the needs ' +
        'assessment that started it to the evaluation data that closed it.',
    );

    const shared = ADDIE_SECTION.eyebrow
      .toLowerCase()
      .split(' ')
      .filter((word) => ADDIE_SECTION.title.toLowerCase().includes(word) && word.length > 3);
    expect(shared, 'eyebrow dan judul memakai kata yang sama').toEqual([]);
  });

  it('setiap fase menyebut dokumen sumbernya sendiri', () => {
    // Panel yang menampilkan tabel gap tanpa mengatakan tabel itu diringkas
    // dari mana adalah klaim, bukan kutipan. Chip sumber yang mengubahnya jadi
    // kutipan, dan fase tanpa chip diam-diam kembali jadi klaim.
    for (const phase of ADDIE_PHASES) {
      expect(phase.sources.length, `${phase.phase} tanpa dokumen sumber`).toBeGreaterThan(0);
      for (const source of phase.sources) {
        expect(source.trim().length, `${phase.phase} punya sumber kosong`).toBeGreaterThan(0);
      }
    }
  });

  it('kedelapan dokumen sumber terpakai, tidak ada yang hilang diam-diam', () => {
    // Spec menghitung delapan file, dan aturan penggabungannya menentukan
    // dokumen mana masuk ke fase mana. Kalau satu nama hilang saat konten
    // dirapikan, yang hilang bukan cuma atribusinya: hilang juga bukti bahwa
    // fase itu punya dasar dokumen sama sekali.
    const named = ADDIE_PHASES.flatMap((phase) => phase.sources).join(' | ');
    for (const doc of [
      'Learning Needs Assessment',
      'Learning Objectives',
      'Curriculum Map',
      'Training Calendar',
      'Storyboard',
      'Facilitator Guide',
      'Assessment Strategy & Rubric',
      'Impact & Evaluation Summary',
    ]) {
      expect(named, `dokumen "${doc}" tidak disebut di fase mana pun`).toContain(doc);
    }
  });

  it('Implementation menyebut empat sesi live, bukan delapan', () => {
    // Draft awal menghitung delapan karena konsultasi ikut dihitung sebagai
    // sesi. Konsultasi berjalan lentur lewat chat dan Zoom di sela sesi, bukan
    // sebagai slot terjadwal, jadi menghitungnya menggandakan angka yang
    // sebenarnya.
    const implementation = ADDIE_PHASES.find((phase) => phase.id === 'implementation');
    const text = JSON.stringify(implementation);
    expect(text).toMatch(/Four live sessions/);
    expect(text).toMatch(/11 to 20 May 2026/);
    expect(text).not.toMatch(/eight (live )?sessions/i);
  });

  it('peserta disebut campuran teknis dan non-teknis, bukan non-teknis saja', () => {
    // Menyebut dosen-dosen itu "non-technical" saja membuat programnya terdengar
    // lebih mudah dari yang sebenarnya, dan itu salah ke arah yang merugikan
    // orang yang menulisnya.
    const analysis = ADDIE_PHASES.find((phase) => phase.id === 'analysis');
    expect(analysis?.headline).toMatch(/University lecturers/);
    expect(analysis?.headline).toMatch(/mixed technical and non-technical/);
  });

  it('jumlah peserta tidak disebut di mana pun, di seluruh situs', () => {
    // Keputusan Fajar, dan ia berlaku ke SELURUH ledger, bukan cuma ke section
    // ADDIE: berapa dosen yang ikut, berapa yang mengembalikan form, dan
    // berapa chatbot yang terbit tidak ditulis di mana pun. Angka kecil
    // membuat program terbaca kecil, dan yang dinilai di sini metodenya, bukan
    // ukuran kohortnya.
    //
    // Scan-nya jalan di atas seluruh ledger karena angka ini dulu tersebar di
    // lima tempat sekaligus: kartu What I built, kartu Selected Work, bullet
    // riwayat kerja, satu sel PROOF, dan enam kalimat di fase Evaluation.
    // Aturan yang tempat bocornya sebanyak itu tidak bisa dijaga dengan
    // ingatan.
    const counts: [RegExp, string][] = [
      [/\b(six|6)\s+(university\s+)?lecturers?\b/i, 'jumlah dosen'],
      [/\b(four|4)\s+of\s+(six|6)\b/i, 'pecahan responden'],
      [/\b(four|4)\s+chatbots?\b/i, 'jumlah chatbot terbit'],
      [/\b(two|2)\s+participants?\s+(asked|said)\b/i, 'jumlah peserta yang berkomentar'],
      [/\b(three|3)\s+of\s+the\s+(four|4)\b/i, 'pecahan chatbot'],
    ];

    for (const [key, value] of Object.entries(ledger)) {
      const text = JSON.stringify(value);
      for (const [pattern, what] of counts) {
        expect(text, `${key} menyebut ${what}`).not.toMatch(pattern);
      }
    }
  });

  it('tanggal di stepper Design sama persis dengan Training Calendar', () => {
    // Empat tanggal ini adalah satu-satunya kontribusi Training Calendar ke
    // section ini. Kalau salah satu bergeser, ia bergeser diam-diam: tidak ada
    // yang menghafal tanggal sesi orang lain.
    const design = ADDIE_PHASES.find((phase) => phase.id === 'design');
    const stepper = design?.blocks.find((block) => block.kind === 'stepper');
    expect(stepper, 'Design kehilangan stepper-nya').toBeDefined();
    if (stepper?.kind !== 'stepper') throw new Error('stepper block hilang');
    expect(stepper.steps.map((step) => step.date)).toEqual([
      '11 May 2026',
      '13 May 2026',
      '18 May 2026',
      '20 May 2026',
      '21 May to 30 June 2026',
    ]);
  });

  it('piramida Bloom lengkap enam level, dari Create turun ke Remember', () => {
    const design = ADDIE_PHASES.find((phase) => phase.id === 'design');
    const bloom = design?.blocks.find((block) => block.kind === 'bloom');
    if (bloom?.kind !== 'bloom') throw new Error('blok bloom hilang');
    expect(bloom.levels.map((level) => level.level)).toEqual([
      'Create',
      'Evaluate',
      'Analyze',
      'Apply',
      'Understand',
      'Remember',
    ]);
  });

  it('bar skor menulis skalanya, dan tidak mengklaim cakupan yang tidak dimilikinya', () => {
    // Baris metode di bawah bar sudah dihapus atas permintaan Fajar, jadi
    // prinsip P2 tidak lagi bisa dijaga di sini dalam bentuk aslinya. Yang
    // masih bisa dijaga, dan tetap dijaga, ada dua.
    //
    // Pertama, skalanya ditulis. "4.5" sendirian bisa berarti dari 5 atau dari
    // 10, dan pembaca yang harus menebak skalanya akan menebak yang paling
    // murah bagi penulisnya.
    //
    // Kedua, dan ini yang menggantikan denominator: angkanya boleh berhenti
    // MENYANGKAL cakupan penuh, tapi tidak boleh MENGKLAIM-nya. Selama tidak
    // ada kalimat "seluruh peserta" di sekitar bar, angka parsial yang berdiri
    // tanpa keterangan tetap cuma kurang tepat; begitu klaim itu masuk, ia
    // berubah jadi salah.
    const evaluation = ADDIE_PHASES.find((phase) => phase.id === 'evaluation');
    const scores = evaluation?.blocks.find((block) => block.kind === 'scores');
    if (scores?.kind !== 'scores') throw new Error('blok scores hilang');
    expect(scores.of).toBe(5);
    for (const item of scores.items) {
      expect(item.value, `${item.label} di luar skala`).toBeLessThanOrEqual(scores.of);
    }

    const text = JSON.stringify(evaluation);
    for (const overclaim of [
      /\ball participants\b/i,
      /\bevery participant\b/i,
      /\bthe whole cohort (rated|scored|said)\b/i,
    ]) {
      expect(text, `fase Evaluation mengklaim cakupan penuh: ${overclaim}`).not.toMatch(overclaim);
    }
  });

  it('fase Evaluation menyebut apa yang masih perlu diperbaiki', () => {
    // Bagian yang paling gampang dihapus saat merapikan, dan bagian yang
    // paling membedakan laporan dampak dari brosur.
    const evaluation = ADDIE_PHASES.find((phase) => phase.id === 'evaluation');
    const notes = evaluation?.blocks.filter((block) => block.kind === 'note') ?? [];
    expect(notes.some((note) => note.kind === 'note' && /still needs fixing/i.test(note.title))).toBe(
      true,
    );
  });

  it('tidak ada nama peserta, username, atau link chatbot individual', () => {
    // Aturan penyamaran dari spec, ditulis sebagai scan mekanis. Nama-nama di
    // bawah ini ada di dokumen sumber dan tidak boleh pernah sampai ke HTML,
    // dan URL chatbot dilarang karena memuat username asli peserta di path-nya.
    const text = JSON.stringify(ADDIE_PHASES);
    for (const name of ['Annisa', 'Fauzi', 'Nining', 'Anita', 'Majid', 'Prawitasari', 'Suri']) {
      expect(text, `nama peserta "${name}" bocor ke section`).not.toContain(name);
    }
    expect(text, 'link chatbot individual masih ada').not.toMatch(/app\.smojo\.org/i);
    expect(text, 'nama universitas peserta masih disebut').not.toMatch(/\bUPB\b/);
  });

  it('kutipan peserta dianonimkan tapi tetap punya atribusi', () => {
    // Kutipan tanpa atribusi apa pun terbaca sebagai kutipan yang dikarang.
    // "Participant A" cukup untuk membedakan dua suara tanpa menunjuk siapa pun.
    const evaluation = ADDIE_PHASES.find((phase) => phase.id === 'evaluation');
    const quotes = evaluation?.blocks.find((block) => block.kind === 'quotes');
    if (quotes?.kind !== 'quotes') throw new Error('blok quotes hilang');
    expect(quotes.items.length).toBeGreaterThan(0);
    for (const quote of quotes.items) {
      expect(quote.by, `atribusi "${quote.by}" bukan label anonim`).toMatch(/^Participant [A-Z]$/);
    }
  });

  it('nama pimpinan dan perusahaan penyelenggara tidak disebut di section ini', () => {
    // Dokumen sumber menyebut "diskusi strategis dengan CEO"; di sini ia jadi
    // "the program team". Yang dinilai adalah metodenya, bukan siapa yang ikut
    // rapat.
    const text = JSON.stringify(ADDIE_PHASES);
    expect(text).not.toMatch(/\bCEO\b/);
    expect(text).toMatch(/strategy discussion with the program team/);
  });

  it('satu-satunya tautan keluar menunjuk ke halaman yang benar-benar hidup', () => {
    // Fase Development berdiri di atas satu klaim: materinya bisa dibuka
    // sendiri oleh pembaca. Klaim itu jatuh seluruhnya kalau tautannya bukan
    // https dan bukan ke domain kursusnya.
    const development = ADDIE_PHASES.find((phase) => phase.id === 'development');
    const card = development?.blocks.find((block) => block.kind === 'linkCard');
    if (card?.kind !== 'linkCard') throw new Error('blok linkCard hilang');
    expect(card.href).toMatch(/^https:\/\/ai4impact\.org\//);
    expect(card.domain).toBe('ai4impact.org');
  });

  it('label "Retrospective documentation" hidup di data, bukan di JSX', () => {
    // Ia adalah batas klaim, bukan dekorasi. Batas klaim yang diketik langsung
    // ke komponen tidak pernah ikut discan aturan copy mana pun.
    expect(ADDIE_SECTION.badge).toBe('Retrospective documentation');
  });

  it('latar belakang dipadatkan jadi tiga kartu, tanpa kehilangan satu lembaga pun', () => {
    expect(BACKGROUND).toHaveLength(3);
    const institutions = BACKGROUND.flatMap((card) => card.logos.map((logo) => logo.alt));
    for (const name of [
      'Universitas Siliwangi',
      'Bank BRI',
      'Bank Indonesia',
      'Bangkit Academy',
      'Terra AI',
      'Google Developer Student Clubs',
      'Generasi Baru Indonesia',
    ]) {
      expect(institutions, `${name} hilang saat kartu digabung`).toContain(name);
    }
  });
});

describe('v3 , bento home screen', () => {
  it('setiap baris grid tertutup penuh 12 kolom, tidak lebih tidak kurang', () => {
    // Kegagalannya murni visual: satu span yang bergeser melipat grid jadi
    // baris keempat dan tidak ada satu pun baris kode yang terlihat salah.
    for (const row of [1, 2, 3]) {
      const occupying = V3_HOME_TILES.filter(
        (tile) => tile.row <= row && row < tile.row + tile.rows,
      );
      const total = occupying.reduce((sum, tile) => sum + tile.span, 0);
      expect(total, `baris ${row} berisi ${total} kolom`).toBe(12);
    }
  });

  it('grid berhenti di tiga baris', () => {
    const last = Math.max(...V3_HOME_TILES.map((tile) => tile.row + tile.rows - 1));
    expect(last).toBe(3);
  });

  it('setiap ubin-pintu internal menunjuk route yang benar-benar ada', () => {
    // Pola yang sama dipakai tes artefak di atas: keberadaan file diperiksa
    // di disk, bukan dipercaya dari string.
    const internal = V3_HOME_TILES.filter((tile) => tile.href?.startsWith('/v3'));
    expect(internal.length).toBeGreaterThan(0);
    for (const tile of internal) {
      const page = path.join(process.cwd(), 'app', tile.href!.slice(1), 'page.tsx');
      expect(existsSync(page), `${tile.href} tidak punya page.tsx`).toBe(true);
    }
  });

  it('nav dan halaman project memakai kata yang sama, jadi keduanya tidak bisa berpisah diam-diam', () => {
    const tile = V3_HOME_TILES.find((candidate) => candidate.id === 'projects');
    expect(tile?.href).toBe('/v3/project');
    expect(V3_PROJECT_CATEGORIES.map((category) => category.label)).toEqual([
      'DESIGN',
      'VIDEO',
      'COURSE',
      'WEBSITE',
    ]);
    expect(V3_NAV.map((link) => link.href)).toContain('/v3/project');
  });

  it('tidak ada satu pun item galeri yang hilang saat dilipat ke halaman project', () => {
    for (const item of WORK_GALLERY) {
      const target = V3_GALLERY_CATEGORY[item.category];
      expect(target, `${item.id} tidak punya kategori tujuan`).toBeTruthy();
      expect(V3_PROJECT_CATEGORIES.map((category) => category.id)).toContain(target);
    }
  });

  it('SKILLS tetap bersih dari nama vendor LLM meski V3_TOOLS memuat tiga', () => {
    // V3_TOOLS memang memajang Claude, OpenAI, dan Gemini, dan itu boleh:
    // kartunya berlabel Tools. Pernah memakai produk sebuah vendor bukan
    // kompetensi, jadi SKILLS tidak boleh ikut kebobolan.
    const skills = SKILLS.flatMap((group) => group.items).join(' ');
    for (const vendor of ['Claude', 'Gemini', 'OpenAI', 'GPT']) {
      expect(skills).not.toContain(vendor);
    }
    expect(V3_TOOLS.map((tool) => tool.name)).toContain('Claude');
  });

  it('setiap situs di kategori Website punya tautan yang bisa dibuka', () => {
    expect(V3_WEBSITES.length).toBeGreaterThan(0);
    for (const site of V3_WEBSITES) {
      expect(site.href, `${site.id} tidak punya href`).toMatch(/^https:\/\//);
    }
  });

  it('chip peran menulis disiplinnya dengan ampersand, bukan "and"', () => {
    // Aturan yang sama dengan sapuan di atas, tapi ditegaskan di sini karena
    // chip inilah yang paling sering diketik ulang tangan saat menyusun
    // kartu bio.
    expect(V3_ROLE_CHIPS[0]).toBe('Learning & Development');
  });
});
