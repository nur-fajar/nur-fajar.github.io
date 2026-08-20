import { existsSync } from 'node:fs';
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
 * yang dilihat hiring manager. Ia hero kedua, bukan hiasan.
 *
 * Tiga hal diperbaiki dari versi sebelumnya:
 *
 * 1. Ada wajah, dan ukurannya cukup untuk dikenali di thumbnail timeline,
 *    bukan 128px di pojok. Kartu yang menampilkan orang berhenti terbaca
 *    sebagai kartu perusahaan.
 * 2. Ada satu klausa AI. Alt lama berbunyi "300+ learners across 3 roles,
 *    9.0/10 satisfaction" dan sama sekali tidak menyebutnya, padahal materi
 *    ajarnya sendiri memang AI dan tiga kursusnya publik.
 * 3. Setiap angka membawa cakupannya sendiri. Tiga angka berjajar tanpa
 *    label terbaca sebagai satu populasi yang sama, persis kesalahan yang
 *    seluruh revisi konten ini dibuat untuk memperbaiki. Di ukuran penuh
 *    label kecilnya terbaca; di thumbnail ia mengabur dan yang tersisa cuma
 *    angkanya, yang memang tidak menyesatkan sendirian.
 */
/* Gambar ini sepenuhnya diturunkan dari konstanta di repo ini dan satu file di
   /public, jadi ia bisa dirender sekali saat build. Penanda ini juga yang
   membuat target kedua (static export ke GitHub Pages) tetap bisa di-build:
   tanpanya, `output: 'export'` menolak route ini. */
export const dynamic = 'force-static';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt =
  'Nur Fajar, L&D Specialist. Teaches generative AI, three courses public. ' +
  '300+ learners across 3 roles, 5 programs run end to end, 9.0/10 satisfaction.';

// Token diambil dari mode terang design system (globals.css). Dipakai apa
// adanya supaya preview link terlihat sebagai potongan dari situs yang sama.
const PAPER = '#F7F8FB';
const INK = '#0F1222';
const INK_SOFT = '#4A5066';
const INK_FAINT = '#686E86';
const ACCENT = '#9333EA';
const RULE = '#E6E9F2';
/* Gradient yang sama dengan tombol dan separuh headline di situs. Preview
   link adalah potongan pertama situs yang dilihat orang, jadi ia harus
   memakai keluarga warna yang sama, bukan palet lain yang kebetulan cocok. */
const GRADIENT = 'linear-gradient(100deg, #2A6FE6, #9333EA 55%, #D81B7C)';

/** Tiap angka membawa cakupannya. Tanpa itu ketiganya terbaca sebagai satu
 *  populasi, dan "5 programs" (satu tahun) akan menempel ke "300+ learners"
 *  (tiga peran) seolah keduanya menghitung hal yang sama. */
const STATS: Array<[string, string]> = [
  ['300+', 'learners, 3 roles'],
  ['5', 'programs end to end, 2025 to 2026'],
  ['9.0/10', 'satisfaction, 2024 to 2025'],
];

/** Foto fasilitasi kalau ada, avatar kalau belum. Urutan yang sama dengan
 *  hero: artefak orang yang sedang bekerja mengalahkan potret. */
const PHOTOS = [
  'hero/facilitating.jpg',
  'hero/facilitating.jpeg',
  'hero/facilitating.png',
  'foto-profile-nf-avatar.jpg',
];

export default async function OpengraphImage() {
  const publicDir = path.join(process.cwd(), 'public');
  const chosen = PHOTOS.find((file) => existsSync(path.join(publicDir, file)))!;
  const photo = await readFile(path.join(publicDir, chosen));
  const mime = chosen.endsWith('.png') ? 'image/png' : 'image/jpeg';
  const photoSrc = `data:${mime};base64,${photo.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: PAPER,
          color: INK,
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '68px 0 68px 76px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 22, letterSpacing: 4, textTransform: 'uppercase', color: INK_FAINT }}>
              Instructional Design · Curriculum Development
            </div>
            <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -3, marginTop: 14 }}>
              Nur Fajar
            </div>
            <div style={{ fontSize: 44, fontWeight: 600, color: ACCENT, marginTop: 2 }}>
              L&amp;D Specialist
            </div>
            {/* Satu rule bergradient, elemen grafis tunggal di gambar ini. */}
            <div
              style={{
                display: 'flex',
                height: 6,
                width: 180,
                marginTop: 26,
                borderRadius: 999,
                background: GRADIENT,
              }}
            />
            <div style={{ fontSize: 27, color: INK_SOFT, marginTop: 24, maxWidth: 620 }}>
              I teach generative AI. Three of those courses are public.
            </div>
          </div>

          <div style={{ display: 'flex', gap: 56 }}>
            {STATS.map(([value, label]) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 60, fontWeight: 700, letterSpacing: -2 }}>{value}</div>
                <div style={{ fontSize: 21, color: INK_FAINT, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse merender di luar pipeline next/image */}
        <img
          src={photoSrc}
          alt=""
          width={430}
          height={630}
          style={{ objectFit: 'cover', borderLeft: `1px solid ${RULE}` }}
        />
      </div>
    ),
    size,
  );
}
