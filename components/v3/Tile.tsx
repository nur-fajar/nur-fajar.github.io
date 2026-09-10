'use client';

import { m } from 'framer-motion';
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import type { V3Tile as V3TileData } from '@/content/ledger';

/**
 * Satu ubin bento.
 *
 * TIGA HAL YANG PERLU DIBACA SEBELUM MENGUBAH FILE INI.
 *
 * 1. Ubin ber-target SELALU punya <a> dengan href sungguhan, bukan div
 *    ber-onClick. Bedanya di mana anchor itu duduk: ubin biasa SELURUHNYA
 *    jadi anchor; ubin ber-cta (projects, tools) dirender sebagai div dan
 *    cuma tombol kapsulnya yang jadi anchor; ubin ber-innerLink (connect)
 *    juga div dan komponen isinya yang menyediakan anchor sendiri
 *    (amplopnya). Alasannya bentrok mainan: ubin-ubin itu bisa diseret
 *    untuk bertukar tempat, dan seluruh permukaan yang sekaligus pintu
 *    sekaligus pegangan membuat setiap lepas-seret ambigu. Tanpa JavaScript
 *    sekalipun ketiga pola tetap melompat: itu perilaku bawaan anchor,
 *    bukan sesuatu yang perlu kita jalankan.
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
     165px, dan isinya yang rata tengah pasti tertimpa.
     Dua peran: di ubin-anchor biasa ia dekorasi (aria-hidden, ubinnya yang
     bersuara); di ubin ber-cta ia TOMBOLNYA SENDIRI (anchor sungguhan,
     labelnya terbaca screen reader supaya nama aksesibelnya sama dengan
     teks kapsul yang terlihat). */
  const arrow =
    tile.href && tile.rows > 1 && !tile.cta ? (
      <span className="v3-tile__go" aria-hidden="true">
        <ArrowUpRight size={22} weight="bold" />
      </span>
    ) : null;

  const ctaButton =
    tile.href && tile.cta ? (
      <a
        className="v3-tile__go"
        href={tile.href}
        onClick={(event) => {
          if (suppressClick()) event.preventDefault();
        }}
      >
        <span className="v3-tile__go-label">{tile.cta}</span>
        <ArrowUpRight size={22} weight="bold" aria-hidden="true" />
      </a>
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

  /* Ubin ber-cta / ber-innerLink bukan anchor: href-nya dibawa tombol
     kapsul (cta) atau anchor di dalam isi (innerLink). Seluruh permukaan
     sisanya pegangan seret. */
  if (!tile.href || tile.cta || tile.innerLink) {
    return (
      <m.div className={className} style={style} data-tile={tile.id} {...motionProps}>
        {children}
        {arrow}
        {ctaButton}
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
      {children}
      {arrow}
    </m.a>
  );
}
