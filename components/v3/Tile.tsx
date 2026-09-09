import Link from 'next/link';
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import type { V3Tile as V3TileData } from '@/content/ledger';

/**
 * Satu ubin bento.
 *
 * Ubin yang punya href dirender sebagai anchor dan mendapat tombol panah;
 * yang tidak punya dirender sebagai div dan tidak pernah dapat panah.
 * Perbedaan itu bukan dekorasi: ia memberi tahu pembaca mana yang bisa
 * dibuka tanpa perlu satu kalimat pun untuk menjelaskannya. Pola yang sama
 * sudah dipakai kartu Work di situs lama.
 *
 * Span-nya datang dari V3_HOME_TILES di ledger, karena di sanalah tes
 * tiling-nya membaca. Satu sumber, bukan dua yang harus dijaga sinkron.
 *
 * Tapi angkanya diserahkan ke CSS sebagai CUSTOM PROPERTY, bukan sebagai
 * `grid-column` inline. Bedanya menentukan: inline style menang atas aturan
 * stylesheet mana pun tanpa !important, jadi versi pertama yang menulis
 * `gridColumn` langsung membuat media query di 980px dan 640px tidak bisa
 * menyempitkan apa pun. Grid enam kolom jadi berlubang, dan di satu kolom
 * ubin ber-span 4 melar ke luar layar.
 *
 * data-tile ada supaya breakpoint sempit bisa memberi perlakuan per ubin
 * (CV dan LinkedIn berdampingan, Tools tetap persegi) tanpa bergantung pada
 * nth-child, yang akan diam-diam salah begitu urutan ubin berubah.
 */
export default function Tile({
  tile,
  children,
}: {
  tile: V3TileData;
  children: React.ReactNode;
}) {
  const className = `v3-tile v3-tile--${tile.surface}`;
  const style = {
    '--v3-span': tile.span,
    '--v3-rows': tile.rows,
  } as React.CSSProperties;

  /* Panah cuma muncul di ubin setinggi dua satuan, persis seperti di mockup.
     Alasannya bukan selera: tombol 48px plus jarak 32px memakan 80px dari
     ubin setinggi 165px, dan isinya yang rata tengah pasti tertimpa. Ubin
     satu satuan tetap sepenuhnya bisa diklik, dan hover-nya tetap mengangkat,
     jadi yang hilang cuma ikonnya, bukan keterbukaannya. */
  const arrow =
    tile.rows > 1 ? (
      <span className="v3-tile__go" aria-hidden="true">
        <ArrowUpRight size={22} weight="bold" />
      </span>
    ) : null;

  if (!tile.href) {
    return (
      <div className={className} style={style} data-tile={tile.id}>
        {children}
      </div>
    );
  }

  /* PDF dan tautan keluar tidak lewat next/link: keduanya meninggalkan
     aplikasi, dan router yang mencoba mem-prefetch-nya cuma menambah
     request yang tidak akan pernah terpakai. */
  if (tile.external || tile.href.endsWith('.pdf')) {
    return (
      <a
        className={className}
        style={style}
        data-tile={tile.id}
        href={tile.href}
        aria-label={tile.label}
        {...(tile.external ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        {children}
        {arrow}
      </a>
    );
  }

  return (
    <Link className={className} style={style} data-tile={tile.id} href={tile.href} aria-label={tile.label}>
      {children}
      {arrow}
    </Link>
  );
}
