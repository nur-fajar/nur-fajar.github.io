import { ReadCvLogo } from '@phosphor-icons/react/dist/ssr';

/**
 * Bobot fill, bukan duotone.
 *
 * Duotone menggambar separuh bentuknya dengan opacity rendah, dan di ubin
 * putih hasilnya terbaca sebagai ikon abu yang pudar, bukan sebagai mark.
 *
 * Label di bawahnya ada karena ubin ini 172x165 piksel dan sebelumnya cuma
 * berisi satu glif di tengah. Ia juga menjawab pertanyaan yang tidak dijawab
 * ikon mana pun: yang diunduh ini berkas apa.
 */
export default function CvTile() {
  return (
    <span className="v3-glyph" aria-hidden="true">
      <ReadCvLogo size={56} weight="fill" />
      <span className="v3-glyph__label">Resume, PDF</span>
    </span>
  );
}
