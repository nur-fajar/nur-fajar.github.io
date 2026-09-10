import Image from 'next/image';

/**
 * Logo dipakai sebagai <img>, bukan di-inline, supaya sebelas berkas tidak
 * ikut masuk ke HTML setiap halaman yang memuatnya.
 *
 * Nama berkas mengikuti id tool persis, jadi tidak ada tabel pemetaan yang
 * bisa basi, dan sebuah tes gagal kalau ada tool tanpa berkasnya.
 *
 * Sumbernya berkas resmi yang dikirim Fajar, bukan hasil pencarian gambar
 * dan bukan gambaran ulang. Empat di antaranya datang sebagai lockup lebar
 * berisi mark plus wordmark (Miro, CapCut, Vercel, n8n); yang dipakai di
 * sini cuma mark-nya, dipotong lewat deteksi celah kolom kosong antara mark
 * dan teks. Kesebelasnya lalu diseragamkan: 256x256, latar transparan,
 * dipangkas rapat lalu diberi napas 16px di tiap sisi supaya sebelas chip
 * berjajar terbaca sebagai satu deret, bukan sebagai tempelan.
 */
export default function ToolLogo({ id, name, size = 32 }: { id: string; name: string; size?: number }) {
  return (
    <span className="v3-tool-chip">
      <Image src={`/logos/tools/${id}.png`} alt={name} width={size} height={size} />
    </span>
  );
}
