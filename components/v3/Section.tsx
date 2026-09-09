import type { V3Section } from '@/content/ledger';

/**
 * Furnitur yang dipakai ketujuh section: eyebrow, judul dua baris dengan
 * baris kedua miring, lalu lede.
 *
 * Satu komponen untuk tujuh section, bukan tujuh salinan. Kalau furniturnya
 * disalin per section, satu perubahan jarak akan berlaku di enam tempat dan
 * lupa di satu, dan yang satu itu yang ketahuan belakangan.
 *
 * `id` dipasang di elemen section, dan itu yang ditunjuk nav. Sebuah tes
 * memastikan setiap href di V3_NAV punya section dengan id yang sama, jadi
 * tautan mati bukan sesuatu yang perlu diperiksa dengan mata.
 */
export default function Section({
  section,
  children,
}: {
  section: V3Section;
  children: React.ReactNode;
}) {
  const titleId = `${section.id}-title`;

  return (
    <section className="v3-section" id={section.id} aria-labelledby={titleId}>
      <div className="v3-shell">
        <p className="v3-eyebrow">{section.eyebrow}</p>

        <h2 className="v3-display v3-section__title" id={titleId}>
          <span>{section.heading[0]}</span>
          <span>
            <em>{section.heading[1]}</em>
          </span>
        </h2>

        <p className="v3-lede">{section.lede}</p>

        {children}
      </div>
    </section>
  );
}

/** Cari definisi satu section dari ledger. Dipanggil per section supaya
 *  halaman tidak perlu meneruskan objeknya turun lewat props. */
export function findSection(sections: readonly V3Section[], id: string): V3Section {
  const section = sections.find((candidate) => candidate.id === id);
  if (!section) throw new Error(`Section "${id}" tidak ada di V3_SECTIONS`);
  return section;
}
