'use client';

import { m } from 'framer-motion';
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import type { V3Tile as V3TileData } from '@/content/ledger';

/**
 * Satu ubin bento.
 *
 * TIGA HAL YANG PERLU DIBACA SEBELUM MENGUBAH FILE INI.
 *
 * 1. Ubin ber-target selalu dirender sebagai <a> dengan href sungguhan.
 *    Bukan div ber-onClick. Karena itu, tanpa JavaScript sekalipun, mengklik
 *    ubin Projects tetap melompat ke section Work: itu perilaku bawaan
 *    anchor, bukan sesuatu yang perlu kita jalankan. Seret dan animasi masuk
 *    adalah lapisan tambahan di atas dasar yang sudah bekerja.
 *
 * 2. Span dikirim ke CSS sebagai custom property, bukan sebagai `grid-column`
 *    inline. Inline style menang atas stylesheet tanpa !important, dan versi
 *    pertama yang menulisnya inline membuat media query tidak sanggup
 *    menyempitkan apa pun: grid enam kolom berlubang, dan di satu kolom ubin
 *    ber-span 4 melar ke luar layar.
 *
 * 3. Klik ditekan setelah seret. Tanpa itu, melepas seretan di atas ubin
 *    Projects akan ikut melompat ke Work, dan pembaca yang cuma memindahkan
 *    kotak tiba-tiba terlempar ke tengah halaman.
 */
export default function Tile({
  tile,
  index,
  dragEnabled,
  onDragStart,
  onDragEnd,
  suppressClick,
  children,
}: {
  tile: V3TileData;
  index: number;
  dragEnabled: boolean;
  onDragStart: () => void;
  onDragEnd: (index: number, offset: number) => void;
  suppressClick: () => boolean;
  children: React.ReactNode;
}) {
  /* motion-safe WAJIB ada, bukan opsional.
     Framer Motion membakar `initial` ke HTML server-rendered, jadi keenam
     ubin terkirim sebagai opacity:0. Aturan <noscript> di app/layout.tsx
     memulihkan HANYA elemen berkelas motion-safe. Tanpa kelas ini, pengunjung
     tanpa JavaScript melihat hero yang kosong melompong, dan karena bento ini
     menggantikan hero, itu berarti layar pertama situs ini kosong. */
  const className = `v3-tile v3-tile--${tile.surface} motion-safe`;
  const style = {
    '--v3-span': tile.span,
    '--v3-rows': tile.rows,
  } as React.CSSProperties;

  /* Panah cuma muncul di ubin setinggi dua satuan, mengikuti mockup. Bukan
     selera: tombol 48px plus jarak 32px memakan 80px dari ubin setinggi
     165px, dan isinya yang rata tengah pasti tertimpa. Ubin satu satuan
     tetap sepenuhnya bisa diklik. */
  const arrow =
    tile.href && tile.rows > 1 ? (
      <span className="v3-tile__go" aria-hidden="true">
        <ArrowUpRight size={22} weight="bold" />
      </span>
    ) : null;

  const motionProps = {
    layout: true,
    initial: { opacity: 0, y: 24, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: {
      type: 'spring' as const,
      stiffness: 340,
      damping: 26,
      delay: index * 0.05,
    },
    ...(dragEnabled
      ? {
          drag: true as const,
          dragSnapToOrigin: true,
          dragElastic: 0.16,
          whileDrag: { zIndex: 20, scale: 1.03 },
          onDragStart,
          onDragEnd: (_: unknown, info: { offset: { x: number; y: number } }) =>
            onDragEnd(index, info.offset.x + info.offset.y),
        }
      : {}),
  };

  const body = (
    <>
      {children}
      {arrow}
    </>
  );

  if (!tile.href) {
    return (
      <m.div className={className} style={style} data-tile={tile.id} {...motionProps}>
        {body}
      </m.div>
    );
  }

  return (
    <m.a
      className={className}
      style={style}
      data-tile={tile.id}
      href={tile.href}
      aria-label={tile.label}
      onClick={(event) => {
        if (suppressClick()) event.preventDefault();
      }}
      {...(tile.external ? { target: '_blank', rel: 'noreferrer' } : {})}
      {...(tile.href.endsWith('.pdf') ? { download: '' } : {})}
      {...motionProps}
    >
      {body}
    </m.a>
  );
}
