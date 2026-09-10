'use client';

import { useRef } from 'react';
import { CONTACT } from '@/content/ledger';
import Magnetic from '../Magnetic';

/** Geser maksimum yang masih dihitung ketukan, bukan seretan, dalam piksel. */
const TAP_SLOP = 8;

/**
 * Judul + janji balas di kiri, amplop berisi tiga kartu di kanan: biru
 * "Inbox", kuning "Reach Out", putih "Hi!". Terjemahan referensi ke palet
 * trikolor halaman ini (kuning/merah/biru), bukan ungu-oranye referensinya.
 *
 * Yang bisa diklik CUMA amplopnya: ia anchor sendiri ke #contact (flag
 * innerLink di ledger), seluruh permukaan ubin di luarnya pegangan seret.
 * Karena anchor ini hidup di dalam isi (bukan dirender Tile), penangkal
 * klik-setelah-seretnya dibawa sendiri: posisi pointer saat ditekan
 * dibandingkan dengan saat dilepas, bergeser lebih dari TAP_SLOP berarti
 * seret dan kliknya dibatalkan. Keyboard (Enter) tidak punya posisi tekan
 * sehingga selalu lolos.
 *
 * Amplopnya dua lapis SVG dengan kartu HTML di tengahnya: panel belakang
 * (kertas gelap + lipatan segitiga yang terbuka) → kartu → kantong depan
 * (gradasi kertas, jahitan V, bayangan bukaan di bibir atas). SVG dipilih
 * karena jahitan diagonal dan gradasi tidak bisa mengikuti ukuran fluida
 * kalau digambar dengan CSS: viewBox diskala vektor, selalu tajam.
 * Putihnya konstan di dua tema — amplop adalah benda putih di atas
 * permukaan apa pun, seperti di referensi.
 *
 * Kartu-kartunya melayang sendiri-sendiri lewat keyframes (durasi dan fase
 * beda): gerak idle, bukan hover, jadi pengguna sentuh dapat yang sama.
 * Tanpa JavaScript maupun di reduced-motion komposisinya tetap utuh dan
 * diam. Label aksesibel anchor ("Jump to Contact") sama dengan label ubin
 * di ledger; isi dekoratifnya aria-hidden.
 */
export default function ConnectTile() {
  const down = useRef<{ x: number; y: number } | null>(null);

  return (
    <Magnetic strength={0.2}>
      <span className="v3-connect__inner">
        <span className="v3-connect__copy">
          <p className="v3-connect">Let&apos;s Connect!</p>
          <p className="v3-connect__reply">{CONTACT.responseTime}</p>
        </span>
        <a
          className="v3-mail"
          href="#contact"
          aria-label="Jump to Contact"
          onPointerDown={(event) => {
            down.current = { x: event.clientX, y: event.clientY };
          }}
          onClick={(event) => {
            const start = down.current;
            down.current = null;
            if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > TAP_SLOP) {
              event.preventDefault();
            }
          }}
        >
          <span className="v3-mail__decor" aria-hidden="true">
            <svg className="v3-mail__back" viewBox="0 0 200 82" preserveAspectRatio="none">
              <rect x="0" y="0" width="200" height="82" rx="12" fill="#e4e4df" />
              <rect x="0" y="0" width="200" height="16" fill="#ffffff" opacity="0.55" />
              <polygon points="58,80 142,80 100,10" fill="#f1f1ec" stroke="#d5d5cf" strokeWidth="1.2" />
              <line x1="100" y1="10" x2="100" y2="80" stroke="#d5d5cf" strokeWidth="1" opacity="0.7" />
              <ellipse cx="100" cy="74" rx="72" ry="7" fill="#000000" opacity="0.1" />
            </svg>
            <span className="v3-mail__card v3-mail__card--inbox">Inbox</span>
            <span className="v3-mail__card v3-mail__card--reach">Reach Out</span>
            <span className="v3-mail__card v3-mail__card--hi">Hi!</span>
            <svg className="v3-mail__front" viewBox="0 0 200 78" preserveAspectRatio="none">
              <defs>
                <linearGradient id="v3-paper" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#ffffff" />
                  <stop offset="1" stopColor="#f0f0ec" />
                </linearGradient>
                <linearGradient id="v3-edge" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#000000" stopOpacity="0.08" />
                  <stop offset="0.18" stopColor="#000000" stopOpacity="0" />
                  <stop offset="0.82" stopColor="#000000" stopOpacity="0" />
                  <stop offset="1" stopColor="#000000" stopOpacity="0.08" />
                </linearGradient>
                <linearGradient id="v3-slot" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#000000" stopOpacity="0.12" />
                  <stop offset="1" stopColor="#000000" stopOpacity="0" />
                </linearGradient>
              </defs>
              <rect x="0.5" y="0.5" width="199" height="77" rx="12" fill="url(#v3-paper)" />
              <rect x="0.5" y="0.5" width="199" height="77" rx="12" fill="url(#v3-edge)" />
              <path
                d="M5 7 L100 71 M195 7 L100 71"
                fill="none"
                stroke="#d7d7d1"
                strokeWidth="1.2"
                opacity="0.9"
              />
              <rect x="0.5" y="0.5" width="199" height="16" fill="url(#v3-slot)" />
              <rect
                x="0.5"
                y="0.5"
                width="199"
                height="77"
                rx="12"
                fill="none"
                stroke="var(--v3-line)"
                strokeWidth="0.8"
              />
            </svg>
          </span>
        </a>
      </span>
    </Magnetic>
  );
}
