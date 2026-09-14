'use client';

import { useLayoutEffect, useSyncExternalStore } from 'react';
import { SunIcon, MoonIcon } from './icons';

export type StoryTheme = 'dark' | 'light';
const STORAGE_KEY = 'story-theme';

/* useLayoutEffect di server tidak jalan (dan React memperingatkan kalau
   dipanggil di sana), jadi alias ini: layout effect di klien, effect biasa
   di server. Tidak ada <script> blocking yang dirender komponen — React 19
   memperingatkan setiap <script> semacam itu. */
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : () => {};

function readTheme(): StoryTheme {
  return document.documentElement.getAttribute('data-story-theme') === 'light' ? 'light' : 'dark';
}

function applyTheme(theme: StoryTheme) {
  document.documentElement.setAttribute('data-story-theme', theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Private browsing / storage disabled — tema tetap berubah untuk sesi
    // ini, cuma tidak diingat lintas kunjungan. Bukan kegagalan yang perlu
    // dilaporkan ke pengguna.
  }
}

/* `data-story-theme` di `<html>` adalah satu-satunya sumber kebenaran tema —
   diinisialisasi di bawah dari localStorage lewat layout effect (sebelum
   paint, jadi tanpa kedip), lalu ditulis ulang di sini tiap toggle diklik.
   `StoryStarfield` mendengarkan atribut yang sama lewat MutationObserver-nya
   sendiri, jadi kanvas dan tombol ini selalu sinkron tanpa saling tahu. */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-story-theme'] });
  return () => observer.disconnect();
}

/**
 * Toggle dark/light untuk scroll-story homepage — satu-satunya halaman yang
 * punya tema (lihat komentar token warna di `story.css`). Ditaruh di
 * `StoryNav`, persis di kanan tombol Resume.
 *
 * `useSyncExternalStore`, BUKAN `useState` + `useEffect`: tema ini state
 * eksternal (atribut DOM yang ditulis skrip anti-FOUC sebelum React sempat
 * jalan), dan itu persis kasus yang direkomendasikan React untuk hook ini —
 * `getServerSnapshot` mengembalikan `null` karena server tidak tahu isi
 * localStorage klien, jadi SSR + render pertama sebelum hydrate SELALU
 * merender placeholder kosong seukuran tombol asli. Kalau langsung menebak
 * 'dark' di sana, pengunjung yang sebelumnya memilih light akan melihat
 * kedipan ikon bulan→matahari sesaat setelah hydrate — placeholder
 * menghindari itu sekaligus menghindari mismatch hydration (server dan
 * render-pertama-klien harus menghasilkan markup yang sama persis).
 */
export default function StoryThemeToggle() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => null);

  /* Pilihan tersimpan diterapkan sebelum paint pertama: pengunjung yang
     sebelumnya memilih light tidak sempat melihat kedipan tema dark. */
  useIsomorphicLayoutEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        document.documentElement.setAttribute('data-story-theme', stored);
      }
    } catch {
      // Private browsing / storage disabled — default dark untuk sesi ini.
    }
  }, []);

  if (!theme) {
    return <span className="story-theme-toggle--placeholder" aria-hidden="true" />;
  }

  const toggle = () => applyTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <button
      type="button"
      className="story-theme-toggle"
      data-theme={theme}
      onClick={toggle}
      role="switch"
      aria-checked={theme === 'light'}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <span className="story-theme-toggle__thumb" aria-hidden="true" />
      <SunIcon size={13} className="story-theme-toggle__icon story-theme-toggle__icon--sun" />
      <MoonIcon size={13} className="story-theme-toggle__icon story-theme-toggle__icon--moon" />
    </button>
  );
}
