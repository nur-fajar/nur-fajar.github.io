import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';

/**
 * OG image, dibangun sebagai kode alih-alih di-export dari alat desain.
 *
 * Alasannya praktis: gambar ini harus tetap benar setiap kali angkanya
 * berubah. Kalau ia file PNG statis, ia akan jadi tempat pertama angka lama
 * bertahan hidup setelah situs dan CV sudah diperbarui, dan justru inilah
 * gambar yang muncul di preview LinkedIn dan WhatsApp, sering jadi hal pertama
 * yang dilihat hiring manager.
 *
 * Ia juga harus terbaca dua kali: di 1200x630 penuh, dan di thumbnail kecil
 * timeline LinkedIn. Karena itu isinya cuma nama, peran, tiga angka, dan satu
 * rule aksen, tidak ada yang lain yang bisa dikorbankan saat mengecil.
 *
 * Ketiga angka sengaja dipilih supaya SEMUANYA berbagi cakupan yang sama
 * ("3 peran, 2023-2026") alih-alih mencampur angka lintas-peran (300+
 * learners) dengan angka satu-tahun (5 programs, 4 modules). Gambar sekecil
 * ini tidak punya ruang untuk method line yang memisahkan keduanya, jadi
 * cara paling aman adalah tidak pernah menaruh keduanya berdampingan di sini
 * sama sekali. Lihat catatan amandemen di kepala content/ledger.ts.
 */
/* Gambar ini sepenuhnya diturunkan dari konstanta di repo ini dan satu file di
   /public, jadi ia bisa dirender sekali saat build. Penanda ini juga yang
   membuat target kedua (static export ke GitHub Pages) tetap bisa di-build,
   tanpanya, `output: 'export'` menolak route ini. */
export const dynamic = 'force-static';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Nur Fajar, L&D Specialist. 300+ learners across 3 roles, 9.0/10 satisfaction.';

// Token diambil dari mode terang design system (globals.css). Dipakai apa
// adanya supaya preview link terlihat sebagai potongan dari situs yang sama.
const PAPER = '#F7F8FB';
const INK = '#0F1222';
const INK_SOFT = '#5B6178';
const ACCENT = '#9333EA';
const RULE = '#E6E9F2';
/* Gradient yang sama dengan tombol dan separuh headline di situs. Preview
   link adalah potongan pertama situs yang dilihat orang, jadi ia harus
   memakai keluarga warna yang sama, bukan palet lain yang kebetulan cocok. */
const GRADIENT = 'linear-gradient(100deg, #3080FF, #9333EA 55%, #F6339A)';

const STATS: Array<[string, string]> = [
  ['300+', 'learners trained'],
  ['3', 'roles, 2023 to 2026'],
  ['9.0/10', 'satisfaction'],
];

export default async function OpengraphImage() {
  const photo = await readFile(path.join(process.cwd(), 'public', 'foto-profile-nf-avatar.jpg'));
  const photoSrc = `data:image/jpeg;base64,${photo.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: PAPER,
          color: INK,
          padding: '72px 80px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                fontSize: 24,
                letterSpacing: 4,
                textTransform: 'uppercase',
                color: INK_SOFT,
              }}
            >
              Instructional Design · Curriculum Development
            </div>
            <div style={{ fontSize: 104, fontWeight: 700, letterSpacing: -3, marginTop: 18 }}>
              Nur Fajar
            </div>
            <div style={{ fontSize: 46, fontWeight: 600, color: ACCENT, marginTop: 4 }}>
              L&amp;D Specialist
            </div>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse merender di luar pipeline next/image */}
          <img
            src={photoSrc}
            alt=""
            width={128}
            height={128}
            style={{ borderRadius: 8, objectFit: 'cover', border: `1px solid ${RULE}` }}
          />
        </div>

        {/* Satu rule bergradient, elemen grafis tunggal di gambar ini. */}
        <div style={{ display: 'flex', height: 6, background: GRADIENT, width: 200, borderRadius: 999 }} />

        <div style={{ display: 'flex', gap: 72 }}>
          {STATS.map(([value, label]) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 68, fontWeight: 700, letterSpacing: -2 }}>{value}</div>
              <div style={{ fontSize: 26, color: INK_SOFT, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
