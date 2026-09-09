import Reveal from '@/components/site/Reveal';
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
        {/* Reveal dipakai ulang dari components/site. Ia sudah menangani
            prefers-reduced-motion dan sudah membawa kelas .motion-safe, yang
            aturan <noscript> di root layout paksa jadi opacity penuh. Itu
            lantainya: tanpa JavaScript, section ini tetap terbaca lengkap.
            Referensinya tidak punya lantai itu, dan menggulirnya menghasilkan
            layar hitam kosong berkali-kali. */}
        <Reveal>
          <p className="v3-eyebrow">{section.eyebrow}</p>

          <h2 className="v3-display v3-section__title" id={titleId}>
            <span>{section.heading[0]}</span>
            <span>
              <em>{section.heading[1]}</em>
            </span>
          </h2>

          <p className="v3-lede">{section.lede}</p>
        </Reveal>

        {/* amount={0}, bukan 0.25 yang jadi default Reveal.
            Default itu menunggu seperempat elemen terlihat sebelum memicu,
            dan itu masuk akal untuk blok seukuran kartu. Isi section Work
            tingginya beberapa ribu piksel, jadi seperempatnya TIDAK PERNAH
            muat di layar sekaligus dan ambangnya tidak pernah tercapai:
            seluruh section berdiri kosong selamanya. Nol berarti memicu
            begitu satu piksel pun masuk. */}
        <Reveal delay={0.08} amount={0}>
          {children}
        </Reveal>
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
