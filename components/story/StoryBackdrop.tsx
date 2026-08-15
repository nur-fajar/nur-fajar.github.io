import StoryStarfield from './StoryStarfield';

/**
 * Latar rasi bintang. Kanvasnya memakai koordinat RA/Dec asli dari 89 figur
 * IAU (`constellations.ts`), jadi posisi, bentuk, dan ukuran relatif tiap rasi
 * benar — bukan partikel acak.
 *
 * Komponen ini beserta `sky-geometry.ts` dan `constellations.ts` dulunya hidup
 * di `components/`, `lib/`, dan `content/` untuk skin situs yang lama, lalu
 * ikut terhapus waktu situsnya dirancang ulang. Di sini semuanya di-vendor ke
 * dalam `components/story/` supaya halaman ini berdiri sendiri, alih-alih
 * menghidupkan kembali file di direktori bersama yang sudah sengaja dibuang.
 *
 * Kanvasnya setinggi dokumen dan `position: absolute`, jadi ia harus berada di
 * dalam `.story-scroller` — lapisan yang tergulung dan punya background ink —
 * bukan di dalam footer yang fixed.
 */
export default function StoryBackdrop() {
  return (
    <>
      <StoryStarfield />
      {/* Vignette tipis supaya teks di tengah tetap punya kontras walau ada
          garis rasi yang kebetulan lewat di belakangnya. */}
      <div className="story-vignette" aria-hidden="true" />
    </>
  );
}
