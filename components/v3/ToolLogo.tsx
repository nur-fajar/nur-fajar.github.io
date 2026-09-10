import Image from 'next/image';

/**
 * Logo dipakai sebagai <img>, bukan di-inline, supaya sebelas blok path SVG
 * tidak ikut masuk ke HTML setiap halaman yang memuatnya.
 *
 * Nama berkas mengikuti id tool persis, jadi tidak ada tabel pemetaan yang
 * bisa basi, dan sebuah tes gagal kalau ada tool tanpa berkas logonya.
 *
 * ASAL BERKASNYA DUA, dan bedanya perlu dicatat.
 *
 * Delapan diambil dari Simple Icons (simpleicons.org), berlisensi CC0, jadi
 * bentuknya persis mark resmi masing-masing merek. Tiga sisanya, Canva,
 * CapCut, dan OpenAI, TIDAK ada di sana: ketiganya termasuk merek yang
 * meminta ikonnya dihapus dari koleksi itu. Yang terpasang untuk ketiganya
 * adalah gambaran ulang, mirip tapi bukan aset resmi.
 *
 * Kesebelasnya diseragamkan monokrom satu warna merek, viewBox 24x24, tanpa
 * gradasi dan tanpa kotak latar. Keseragaman itu yang membuat sebelas chip
 * berjajar terbaca sebagai satu deret, bukan sebagai tempelan.
 */
export default function ToolLogo({ id, name, size = 32 }: { id: string; name: string; size?: number }) {
  return (
    <span className="v3-tool-chip">
      <Image src={`/logos/tools/${id}.svg`} alt={name} width={size} height={size} />
    </span>
  );
}
