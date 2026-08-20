'use client';

import Image from 'next/image';
import { List, X, LinkedinLogo } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import { CONTACT } from '@/content/ledger';

/**
 * Urutannya mengikuti urutan section di halaman persis, dan urutan itu sendiri
 * adalah argumen: apa yang bisa kamu buka sendiri, lalu apa yang saya kerjakan,
 * lalu dari mana asalnya. About turun ke posisi ketiga karena di halaman ia
 * juga turun.
 */
const LINKS = [
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'about', label: 'About' },
];

/** Diamati untuk indikator posisi, tapi tidak semuanya dapat tautan sendiri di
 *  navbar: Credentials dan References duduk di antara Work dan About, dan
 *  menambahkannya berarti navbar enam item yang pecah dua baris di laptop.
 *  Menandai tautan terdekat di atasnya lebih jujur daripada tidak menandai
 *  apa pun saat pembaca berada di sana. */
const TRACKED = [
  { id: 'work', mark: 'work' },
  { id: 'skills', mark: 'experience' },
  { id: 'credentials', mark: 'experience' },
  { id: 'references', mark: 'experience' },
  { id: 'experience', mark: 'experience' },
  { id: 'about', mark: 'about' },
  { id: 'contact', mark: 'contact' },
];

/**
 * Island navigasi yang mengambang.
 *
 * Ia hadir dari page load, bukan on-scroll: tombol ajakan bicara adalah satu
 * hal yang paling ingin diambil pembaca, dan menyembunyikannya sampai orang
 * scroll berarti menyembunyikannya dari sebagian orang selamanya.
 *
 * Indikator section aktif bukan dekorasi. Halaman ini satu scroll panjang
 * tanpa batas halaman, dan tanpa penanda posisi pembaca tidak punya cara tahu
 * seberapa jauh ia sudah berjalan atau berapa banyak yang tersisa. Harganya
 * satu IntersectionObserver.
 */
export default function Nav() {
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver, bukan listener scroll: listener scroll jalan tiap
  // frame dan tidak punya batching.
  useEffect(() => {
    const marks = new Map<Element, string>();
    for (const { id, mark } of TRACKED) {
      const el = document.getElementById(id);
      if (el) marks.set(el, mark);
    }
    if (marks.size === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(marks.get(visible.target) ?? null);
      },
      { rootMargin: '-25% 0px -65% 0px', threshold: 0 },
    );

    for (const el of marks.keys()) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    const onClick = (event: MouseEvent) => {
      if (sheetRef.current && !sheetRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  return (
    <header className="nav">
      <div className="nav__inner">
        <a className="nav__identity" href="#top">
          {/* alt sengaja kosong, dan itu justru yang benar di sini: nama
              "Nur Fajar." sudah berdiri sebagai teks tepat di sebelahnya, di
              dalam tautan yang sama. Mengisi alt dengan nama yang sama membuat
              screen reader mengumumkannya dua kali berturut-turut. Alt kosong
              pada gambar yang teksnya sudah ada di sebelahnya adalah pola yang
              dianjurkan WCAG, bukan alt yang terlupa diisi. */}
          <Image
            src="/foto-profile-nf-avatar.jpg"
            alt=""
            width={34}
            height={34}
            className="nav__avatar"
            priority
          />
          <span className="nav__name">Nur Fajar.</span>
        </a>

        {/* Diposisikan absolut, bukan lewat flex, supaya titik tengahnya
            benar-benar titik tengah navbar. Kalau ia ikut arus flex, lebarnya
            digeser oleh nama di kiri dan tombol di kanan yang tidak pernah
            sama panjang, jadi ia hanya akan tampak di tengah secara kebetulan. */}
        <nav className="nav__links" aria-label="Sections">
          {LINKS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className="nav__link"
              aria-current={active === id ? 'true' : undefined}
            >
              {label}
              <span className="nav__link-mark" aria-hidden="true" />
            </a>
          ))}
        </nav>

        <div className="nav__spacer" />

        <a
          className="nav__icon"
          href={CONTACT.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <LinkedinLogo size={20} weight="bold" aria-hidden="true" />
        </a>

        {/* Dulu "Book 15 min", yang menawarkan satu jalur saja. Contact
            membawa pembaca ke tempat ketiga jalurnya berdiri berdampingan
            (kalender, email terisi, CV), dan kalender tetap jadi tombol
            primernya di sana. */}
        <a
          className="btn btn--primary btn--sm nav__cta"
          href="#contact"
          aria-current={active === 'contact' ? 'true' : undefined}
        >
          Contact
        </a>

        <button
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="nav-sheet"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          {open ? (
            <X size={22} weight="bold" aria-hidden="true" />
          ) : (
            <List size={22} weight="bold" aria-hidden="true" />
          )}
        </button>
      </div>

      {open && (
        <div className="nav__sheet" id="nav-sheet" ref={sheetRef}>
          {LINKS.map(({ id, label }) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
          <a href="#contact" onClick={() => setOpen(false)}>
            Contact
          </a>
        </div>
      )}
    </header>
  );
}
