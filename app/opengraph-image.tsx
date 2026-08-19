import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';

/**
 * OG image, dibangun sebagai kode alih-alih di-export dari alat desain.
 *
 * Alasannya praktis: gambar ini harus tetap benar setiap kali angkanya
 * berubah. Kalau ia file PNG statis, ia akan jadi tempat pertama angka lama
 * bertahan hidup setelah situs dan CV sudah diperbarui — dan justru inilah
 * gambar yang muncul di preview LinkedIn dan WhatsApp, sering jadi hal pertama
 * yang dilihat hiring manager.
 *
 * Ia juga harus terbaca dua kali: di 1200x630 penuh, dan di thumbnail kecil
 * timeline LinkedIn. Karena itu isinya cuma nama, peran, tiga angka, dan satu
 * rule aksen — tidak ada yang lain yang bisa dikorbankan saat mengecil.
 */
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Nur Fajar — L&D Specialist. 300+ learners, 5 programs, 9.0/10 satisfaction.';

// Token diambil dari mode terang design system (globals.css). Dipakai apa
// adanya supaya preview link terlihat sebagai potongan dari situs yang sama.
const PAPER = '#F1F3EE';
const INK = '#16211D';
const INK_SOFT = '#5A6660';
const ACCENT = '#2C6A55';
const RULE = '#C9CFC4';

const STATS: Array<[string, string]> = [
  ['300+', 'learners'],
  ['5', 'programs'],
  ['9.0/10', 'satisfaction'],
];

export default async function OpengraphImage() {
  const photo = await readFile(path.join(process.cwd(), 'public', 'foto-profile-nf.jpg'));
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
            width={148}
            height={148}
            style={{ borderRadius: 8, objectFit: 'cover', border: `1px solid ${RULE}` }}
          />
        </div>

        {/* Satu rule aksen — elemen grafis tunggal di gambar ini. */}
        <div style={{ display: 'flex', height: 4, background: ACCENT, width: 180 }} />

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
