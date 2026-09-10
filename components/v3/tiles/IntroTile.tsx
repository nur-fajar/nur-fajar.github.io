'use client';

import { useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

/* Sapaan dalam 13 bahasa: enam bahasa resmi PBB (Inggris, Prancis,
   Spanyol, Rusia, Arab, China) plus Indonesia, Melayu, Thai, Jepang,
   Korea, dan Filipina. */
const GREETINGS = [
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
 * Baris pertama sapaan yang diketik, dihapus, dan diketik lagi dalam tiga
 * belas bahasa, selamanya. Baris kedua statis: "I'm Nur Fajar".
 *
 * Render awal selalu "hi!" penuh: tanpa JavaScript maupun di reduced-motion,
 * yang tampil adalah sapaan utuh — animasinya lapisan, bukan syarat. Kursor
 * kedip cuma dirender setelah efek jalan, jadi HTML server tidak membawa
 * kursor beku.
 *
 * Paragrafnya ber-aria-label ("hi! I'm Nur Fajar") dan isi visualnya
 * aria-hidden: screen reader mendengar satu kalimat utuh, bukan tiga belas
 * sapaan yang diketik huruf per huruf.
 */
export default function IntroTile() {
  const reduced = useReducedMotion();
  const [text, setText] = useState(GREETINGS[0] ?? 'hi!');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (reduced) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount-sync sekali: menandai mesin ketik hidup supaya kursor kedip dirender; HTML server sengaja tanpa kursor.
    setStarted(true);

    let phrase = 0;
    let chars = (GLYPHS[0] ?? []).length;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    /* Jeda awal menahan "hi!" utuh, jadi pengunjung sempat membaca sebelum
       mesin mulai menghapus. */
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
  }, [reduced]);

  return (
    <p className="v3-intro" aria-label="hi! I'm Nur Fajar">
      <span className="v3-intro__greet" aria-hidden="true">
        {text}
        {started && !reduced ? <span className="v3-intro__caret" /> : null}
      </span>
      <span className="v3-intro__name" aria-hidden="true">
        I&apos;m Nur Fajar
      </span>
    </p>
  );
}
