'use client';

import { domMax, LazyMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { V3_HOME_TILES, type V3Tile as V3TileData } from '@/content/ledger';
import HeroDrift from './HeroDrift';
import Tile from './Tile';
import ConnectTile from './tiles/ConnectTile';
import CvTile from './tiles/CvTile';
import IntroTile from './tiles/IntroTile';
import LinkedInTile from './tiles/LinkedInTile';
import ProjectsTile from './tiles/ProjectsTile';
import ToolsTile from './tiles/ToolsTile';

const CONTENT: Record<string, React.ComponentType> = {
  intro: IntroTile,
  cv: CvTile,
  projects: ProjectsTile,
  tools: ToolsTile,
  linkedin: LinkedInTile,
  connect: ConnectTile,
};

/** Seret cuma nyala di layar cukup lebar DAN berkursor. Di layar sentuh,
 *  menyeret ubin bertabrakan dengan menggulir halaman, dan yang kalah
 *  selalu scroll — tablet 768px pun tidak luput, jadi lebar saja tidak
 *  cukup sebagai syarat. */
const DRAG_MIN_WIDTH = 641;

/** Jarak seret minimum sebelum dianggap niat menukar, bukan klik yang
 *  tangannya bergetar. */
const SWAP_THRESHOLD = 60;

/**
 * Grid bento yang menggantikan hero.
 *
 * Urutannya state, bukan konstanta, karena ubin bisa diseret untuk bertukar
 * tempat. Yang TIDAK ikut berubah adalah span tiap ubin: span menempel pada
 * ubinnya dan ikut pindah bersamanya.
 *
 * Penempatan diserahkan ke auto-placement CSS Grid, bukan ke koordinat baris
 * yang dipatok. Urutan DOM awal (intro, cv, projects, tools, linkedin,
 * connect) dengan span 6/2/4/6/2/6 kebetulan menghasilkan tepat tata letak
 * mockup-nya, dan menyerahkannya ke auto-placement berarti setelah ditukar
 * pun grid tetap terisi, alih-alih meninggalkan lubang di koordinat yang
 * ubinnya sudah pindah. Field `row` di ledger tetap ada karena ia yang
 * dibaca tes tiling: ia merekam tata letak yang DIMAKSUD, dan CSS
 * mereproduksinya.
 *
 * Urutan hasil seret sengaja tidak disimpan. Ia mainan, bukan preferensi,
 * dan menyimpannya berarti pengunjung yang iseng menyeret satu kali akan
 * melihat grid berantakan itu selamanya.
 */
export default function Bento() {
  const [tiles, setTiles] = useState<V3TileData[]>(V3_HOME_TILES);
  const [dragEnabled, setDragEnabled] = useState(false);
  const draggedRef = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);

  /* Seret baru dinyalakan setelah mount, dan itu disengaja: kalau `drag`
     dipasang saat render server, HTML yang terkirim membawa atribut yang
     berbeda dari hasil hydrate. Selain itu lebar viewport tidak diketahui di
     server, jadi keputusan "layar ini cukup lebar" memang tidak bisa diambil
     di sana. Syarat hover: di layar sentuh tidak ada kursor, dan seret ubin
     bertabrakan dengan scroll halaman — yang kalah selalu scroll. */
  useEffect(() => {
    const query = window.matchMedia(`(min-width: ${DRAG_MIN_WIDTH}px) and (hover: hover)`);
    const apply = () => setDragEnabled(query.matches);
    apply();
    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, []);

  function handleDragEnd(index: number, distance: number) {
    /* Bendera dibersihkan di frame berikutnya, bukan sekarang: event click
       menyusul setelah dragend, dan kalau benderanya sudah turun duluan,
       klik itu lolos dan halaman melompat. */
    window.setTimeout(() => {
      draggedRef.current = false;
    }, 0);

    if (Math.abs(distance) < SWAP_THRESHOLD) return;

    setTiles((current) => {
      const next = [...current];
      const target = distance > 0 ? Math.min(index + 1, next.length - 1) : Math.max(index - 1, 0);
      if (target === index) return current;
      const [moved] = next.splice(index, 1);
      next.splice(target, 0, moved);
      return next;
    });
  }

  /* LazyMotion kedua, bersarang di dalam MotionProvider, dan itu disengaja.
     MotionProvider memuat feature bundle `domAnimation`, yang komentarnya
     sendiri mencatat TIDAK menyertakan drag maupun layout animation karena
     keduanya paling mahal di library dan waktu itu tidak dipakai. Sekarang
     bento memakai keduanya. Menaikkan provider global ke domMax akan
     membebankan ongkos itu ke seluruh situs termasuk halaman yang tidak
     butuh; membungkus di sini membatasinya ke satu komponen. */
  return (
    <LazyMotion features={domMax}>
      <section className="v3-bento" id="top" aria-label="Nur Fajar" ref={sectionRef}>
      <HeroDrift triggerRef={sectionRef} />
      <div className="v3-shell">
        <div className="v3-grid">
          {tiles.map((tile, index) => {
            const Content = CONTENT[tile.id];
            return (
              <Tile
                key={tile.id}
                tile={tile}
                index={index}
                dragEnabled={dragEnabled}
                onDragStart={() => {
                  draggedRef.current = true;
                }}
                onDragEnd={handleDragEnd}
                suppressClick={() => draggedRef.current}
              >
                <Content />
              </Tile>
            );
          })}
        </div>

        {dragEnabled ? (
          <p className="v3-bento__hint" aria-hidden="true">
            Drag the tiles around. Click one to jump to that section.
          </p>
        ) : null}
        </div>
      </section>
    </LazyMotion>
  );
}
