'use client';

import { useEffect, useState } from 'react';

/* Sapaan dalam 13 bahasa: enam bahasa resmi PBB (Inggris, Prancis,
   Spanyol, Rusia, Arab, China) plus Indonesia, Melayu, Thai, Jepang,
   Korea, dan Filipina. */
export const GREETINGS = [
  'hi!',
  'Hello!',
  'Halo!',
  'Hai!',
  'Bonjour!',
  '¡Hola!',
  'Привет!',
  'مرحبا!',
  '你好！',
  'こんにちは！',
  '안녕하세요!',
  'สวัสดี!',
  'Kumusta!',
];

/* Diketik per grafem, bukan per code unit: Thai (สวัสดี) dan aksara lain
   punya tanda gabung yang terpisah kalau dipotong per char — menghitung
   hurufnya rusak di tengah animasi. Segmenter ada di semua browser modern
   dan Node, jadi pemotongan server dan client selalu sama. */
const segmenter = new Intl.Segmenter();
const GLYPHS = GREETINGS.map((greeting) =>
  Array.from(segmenter.segment(greeting), ({ segment }) => segment),
);

/**
 * Mesin ketik yang berputar melewati ketiga belas sapaan, selamanya.
 *
 * Dipakai dua tempat dengan ukuran yang sangat berbeda: di /v3 ia headline
 * ubin pembuka, di /v4 ia baris kecil di atas headline. Yang dibagi cuma
 * mesinnya; ukuran dan markup-nya urusan pemanggil.
 *
 * Nilai awal selalu sapaan pertama dalam keadaan utuh, jadi HTML server dan
 * hasil hydrate identik, dan tanpa JavaScript maupun di reduced-motion yang
 * tampil adalah sapaan lengkap. Animasinya lapisan, bukan syarat.
 *
 * `started` menandai mesin sudah hidup. Pemanggil memakainya untuk menahan
 * kursor kedip sampai efeknya jalan, supaya HTML server tidak membawa kursor
 * yang beku di tempat.
 */
export function useGreeting(enabled: boolean): { text: string; started: boolean } {
  const [text, setText] = useState(GREETINGS[0] ?? 'hi!');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount-sync sekali: menandai mesin ketik hidup supaya kursor kedip dirender; HTML server sengaja tanpa kursor.
    setStarted(true);

    let phrase = 0;
    let chars = (GLYPHS[0] ?? []).length;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    /* Jeda awal menahan sapaan pertama tetap utuh, jadi pengunjung sempat
       membacanya sebelum mesin mulai menghapus. */
    const tick = () => {
      const current = GLYPHS[phrase] ?? [];
      if (!deleting) {
        if (chars < current.length) {
          chars += 1;
          setText(current.slice(0, chars).join(''));
          timer = setTimeout(tick, 65 + Math.random() * 70);
        } else {
          deleting = true;
          timer = setTimeout(tick, 1600);
        }
      } else if (chars > 0) {
        chars -= 1;
        setText(current.slice(0, chars).join(''));
        timer = setTimeout(tick, 32);
      } else {
        deleting = false;
        phrase = (phrase + 1) % GLYPHS.length;
        timer = setTimeout(tick, 380);
      }
    };
    timer = setTimeout(tick, 1600);

    return () => clearTimeout(timer);
  }, [enabled]);

  return { text, started };
}
