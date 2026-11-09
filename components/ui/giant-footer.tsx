import { V9_META } from '@/content/v9';

/**
 * Footer wordmark raksasa (opsi A, pilihan founder 2026-11-08): nama
 * founder satu baris garis luar, hover terisi ungu — dilawan kertas yang
 * sama dengan hero.
 *
 * Kata besarnya satu sumber: judul kanon "Nur Fajar, ..." diambil nama
 * depannya saja lalu dikapitalkan, jadi tidak ada string baru yang
 * diketik di sini. Bar meta (hak cipta, kontak) dilepas atas permintaan
 * founder 2026-11-08; footer hanya berisi wordmark.
 */
export function GiantFooter() {
  const name = V9_META.title.split(',')[0];
  return (
    <footer className="footer-giant" aria-label="Footer">
      <p className="footer-word" aria-hidden="true">
        {name.toUpperCase()}
      </p>
    </footer>
  );
}

export default GiantFooter;
