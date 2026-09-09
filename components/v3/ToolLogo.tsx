import Image from 'next/image';

/**
 * Logo dipakai sebagai <img>, bukan di-inline, supaya sembilan blok path SVG
 * tidak ikut masuk ke HTML setiap halaman yang memuat ubin Tools.
 *
 * Nama file mengikuti id tool persis, jadi tidak ada tabel pemetaan yang
 * harus dijaga: menukar sebuah logo dengan aset resmi dari brand kit-nya
 * cukup dengan menimpa file di public/logos/tools/, tanpa menyentuh kode.
 *
 * Kesembilan file yang ada sekarang adalah gambaran ulang, bukan aset resmi.
 */
export default function ToolLogo({ id, name, size = 32 }: { id: string; name: string; size?: number }) {
  return (
    <span className="v3-tool-chip">
      <Image src={`/logos/tools/${id}.svg`} alt={name} width={size} height={size} />
    </span>
  );
}
