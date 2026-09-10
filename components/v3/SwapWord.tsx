'use client';

import { useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

/** Kolam huruf acak. Kapital semua: tautan nav tampil uppercase. */
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Kata yang huruf-hurufnya teracak glitch saat hover/fokus lalu pulih
 * berurutan dari kiri, ala random-letter-swap. Tiap dua frame ~34ms
 * mengunci satu huruf lagi; total setengah detik untuk kata terpanjang nav.
 *
 * Teks server selalu kata utuhnya (tanpa JS maupun di reduced-motion tidak
 * ada yang berubah), dan nama aksesibel tidak pernah disentuh: yang
 * ditulis ulang cuma isi visual span dalam tautan. Keluar sebelum selesai
 * menjentik langsung ke kata utuh supaya tidak ada tautan yang tertinggal
 * sebagai sandi.
 */
export default function SwapWord({ text }: { text: string }) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(text);
  const frame = useRef(0);
  const timer = useRef<number | null>(null);

  const stop = (restore: boolean) => {
    if (timer.current !== null) {
      window.clearInterval(timer.current);
      timer.current = null;
    }
    frame.current = 0;
    if (restore) setDisplay(text);
  };

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearInterval(timer.current);
    },
    [],
  );

  if (reduced) return <>{text}</>;

  const start = () => {
    stop(false);
    timer.current = window.setInterval(() => {
      frame.current += 1;
      const locked = Math.floor(frame.current / 2);
      if (locked >= text.length) {
        stop(false);
        setDisplay(text);
        return;
      }
      setDisplay(
        text
          .split('')
          .map((char, i) =>
            i < locked || char === ' '
              ? char
              : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
          )
          .join(''),
      );
    }, 34);
  };

  return (
    <span onMouseEnter={start} onFocus={start} onMouseLeave={() => stop(true)} onBlur={() => stop(true)}>
      {display}
    </span>
  );
}
