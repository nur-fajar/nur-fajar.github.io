'use client';

import { Moon, Sun } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';

const KEY = 'v3-theme';

/**
 * Pengganti tema terang/gelap.
 *
 * Tema aslinya TIDAK ditentukan di sini. Skrip blocking di <head>
 * (app/layout.tsx) sudah menuliskan `data-v3-theme` ke <html> sebelum paint
 * pertama; komponen ini cuma membaca kembali apa yang sudah dipasang skrip
 * itu, lalu mengubahnya kalau ditekan. Kalau ia yang memutuskan tema di
 * useEffect, pengunjung yang memilih gelap akan melihat kedipan terang
 * setiap kali membuka halaman.
 *
 * Karena itu `mounted`: sebelum hydrate, komponen tidak tahu tema mana yang
 * dipilih skrip, dan menebaknya akan menghasilkan mismatch hydration. Yang
 * dirender di server adalah tombol berukuran sama tanpa ikon, jadi tidak ada
 * pergeseran tata letak saat ikonnya muncul.
 */
export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.getAttribute('data-v3-theme') === 'dark');
    setMounted(true);
  }, []);

  function toggle() {
    const next = dark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-v3-theme', next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* Mode penyamaran dan "blokir data situs" melempar di sini. Temanya
         tetap berganti untuk sesi ini; yang hilang cuma ingatannya. */
    }
    setDark(!dark);
  }

  return (
    <button
      type="button"
      className="v3-theme-toggle"
      onClick={toggle}
      aria-pressed={mounted ? dark : undefined}
      aria-label={mounted && dark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {mounted ? (
        dark ? (
          <Sun size={15} weight="bold" aria-hidden="true" />
        ) : (
          <Moon size={15} weight="bold" aria-hidden="true" />
        )
      ) : null}
    </button>
  );
}
