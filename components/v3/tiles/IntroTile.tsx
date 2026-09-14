'use client';

import { useReducedMotion } from 'framer-motion';
import { useGreeting } from '@/components/greeting';

/**
 * Baris pertama sapaan yang diketik, dihapus, dan diketik lagi dalam tiga
 * belas bahasa, selamanya. Baris kedua statis: "I'm Nur Fajar".
 *
 * Mesin ketiknya hidup di components/greeting.ts karena /v4 memakainya juga,
 * di ukuran yang jauh lebih kecil. Yang dibagi cuma mesinnya; ukuran dan
 * markup-nya tetap urusan masing-masing.
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
  const { text, started } = useGreeting(!reduced);

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
