'use client';

import { m, useReducedMotion } from 'framer-motion';

/**
 * Judul section masuk lewat mask reveal: tiap baris lahir dari balik
 * overflow:hidden, baris miringnya menyusul 90ms kemudian.
 *
 * Mask-nya span biasa, jadi tanpa JavaScript baris-baris ini tetap utuh;
 * yang dianimasikan hanya transform baris dalamnya, dan kelas motion-safe
 * di dalamnya dipaksa kembali oleh aturan <noscript> di root layout.
 *
 * padding-bottom 0.12em di mask bukan dekorasi: italic Fraunces di ukuran
 * display punya descender (g, y, p) yang terpotong kalau mask-nya pas di
 * baseline. Mask diberi ruang napas, lalu margin negatif menarik balik
 * supaya ritme vertikalnya tidak berubah.
 */
export default function MaskedLines({
  id,
  lines,
}: {
  id: string;
  lines: readonly [string, string];
}) {
  const reduced = useReducedMotion();

  /* Baris kosong (milik Work) dibuang: judulnya sebaris, bukan dua baris
     dengan baris hantu. */
  const shown = lines.filter((line) => line !== '');

  if (reduced) {
    return (
      <h2 className="v3-display v3-section__title" id={id}>
        {shown.map((line, index) => (
          <span key={line}>{index === shown.length - 1 && shown.length > 1 ? <em>{line}</em> : line}</span>
        ))}
      </h2>
    );
  }

  return (
    <h2 className="v3-display v3-section__title" id={id}>
      {shown.map((line, index) => (
        /* Yang diamati mask-nya, BUKAN baris di dalamnya.
           IntersectionObserver memotong kotak target dengan klip milik
           leluhur, dan baris ini justru dimulai di luar klip induknya sendiri:
           digeser 112% ke bawah, di balik overflow:hidden. Yang tersisa untuk
           dihitung cuma 0.12em padding descender, rasionya 0.0104, sementara
           amount 0.4 meminta 0.4. Ambangnya tidak pernah tercapai di posisi
           scroll mana pun, jadi judulnya tidak pernah muncul.

           Mask-nya sendiri tidak diklip siapa pun, jadi rasionya normal.
           Barisnya ikut lewat variants: framer meneruskan label varian dari
           induk motion ke anak motion yang punya `variants` sendiri. */
        <m.span
          className="v3-mask"
          key={line}
          initial="tersembunyi"
          whileInView="masuk"
          viewport={{ once: true, amount: 0.4 }}
        >
          <m.span
            className="v3-mask__line motion-safe"
            variants={{ tersembunyi: { y: '112%' }, masuk: { y: '0%' } }}
            transition={{
              duration: 0.75,
              delay: index * 0.09,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {index === shown.length - 1 && shown.length > 1 ? <em>{line}</em> : line}
          </m.span>
        </m.span>
      ))}
    </h2>
  );
}
