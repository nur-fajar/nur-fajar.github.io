'use client';

/**
 * Bar nav blur atas ala apple.com (permintaan founder, 2026-10-16).
 *
 * Satu-satunya client component di halaman /v7 — keputusan founder yang
 * menggantikan aturan "nol JavaScript" untuk bagian ini — kini kontraknya
 * dibuka penuh (2026-10-16); komponen client selanjutnya tetap wajib
 * tinggal di app/v7 atau components/v7. Sisanya tetap
 * server-rendered: komponen ini hanya membaca posisi scroll lewat satu
 * IntersectionObserver (lebih murah daripada scroll listener; tidak ada
 * state selain satu string id aktif).
 *
 * Perilaku:
 *   - Tersembunyi selama hero masih menutupi layar; muncul ketika tepi atas
 *     modul Work menyentuh dasar viewport (IO pada #work — hero kini sticky
 *     dan tidak pernah keluar layar, lihat .v7-hero di v7.css).
 *   - Scrollspy: section band tengah layar (±50%) jadi yang aktif —
 *     band tengah = proyek yang sedang dibaca.
 *   - Linknya anchor murni; pengguliran halus lewat CSS scroll-behavior
 *     (v7.css), jadi tanpa scrollIntoView manual di sini.
 */
import { useEffect, useState } from 'react';

export interface V7WorkNavItem {
  /** id proyek tanpa prefiks; sectionnya ber-id `w-<id>` di server page. */
  id: string;
  label: string;
}

export default function WorkNav({ items }: { items: readonly V7WorkNavItem[] }) {
  const [active, setActive] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (items.length === 0) return;
    const sections = items
      .map((item) => document.getElementById(`w-${item.id}`))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length !== items.length) return; // section hilang: jangan spy spasmodik
    const byId = new Map(sections.map((el) => [el.id, el.id.replace(/^w-/, '')]));

    const spy = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(byId.get(entry.target.id) ?? null);
        }
      },
      { rootMargin: '-50% 0px -50% 0px' }, // pita setengah tinggi di tengah layar
    );
    sections.forEach((section) => spy.observe(section));

    const hero = document.getElementById('work');
    let show = false;
    // STICKY COVER: hero kini sticky — ia tidak pernah keluar viewport,
    // hanya TERTUTUP modul Work. Sinyal "sudah lewat hero" yang benar adalah
    // tepi atas #work menyentuh dasar viewport; rootMargin -100% bawah
    // menyusutkan root jadi satu garis di tepi atas layar.
    const shutter = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          show = entry.isIntersecting; // #work menyentuh atas → bar tampil
          setVisible(show);
        }
      },
      { rootMargin: '0px 0px -100% 0px' },
    );
    if (hero) shutter.observe(hero);

    return () => {
      spy.disconnect();
      shutter.disconnect();
    };
  }, [items]);

  return (
    <nav
      className={`v7-navpill ${visible ? 'v7-navpill--on' : ''}`}
      aria-label="Jump to a project"
    >
      <div className="v7-navpill__row">
        {/* Identitas kiri ala bar apple.com: nama jadi pelabuhan kembali
            ke atas. href="#top" — id ada di header masthead. */}
        <a className="v7-navpill__brand" href="#top">
          Nur Fajar
        </a>
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#w-${item.id}`}
                aria-current={active === item.id ? 'true' : undefined}
                className={active === item.id ? 'v7-navpill__is-on' : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
