'use client';

import { m, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';
import ToolLogo from '../ToolLogo';
import { V3_TOOLS } from '@/content/ledger';

/* Posisi kesebelas chip ditulis tetap, bukan diacak. Penempatan acak akan
   berbeda antara render server dan client lalu memicu hydration mismatch,
   dan di build statis ia membeku pada satu susunan hasil undian saat build.

   Sebarannya menutup seluruh bidang, dan beberapa chip sengaja diletakkan
   sampai menyentuh tepi: ubinnya overflow:hidden, jadi chip yang terpotong
   tepi terbaca sebagai bidang yang penuh, bukan sebagai kotak berisi
   benda-benda kecil di tengah.

   Pojok kiri bawah tetap kosong. Di sanalah tombol panah ubin duduk. */
const SPOTS = [
  { top: '-3%', left: '-2%' },
  { top: '-1%', left: '24%' },
  { top: '-4%', left: '50%' },
  { top: '2%', left: '78%' },
  { top: '31%', left: '10%' },
  { top: '34%', left: '36%' },
  { top: '29%', left: '62%' },
  { top: '33%', left: '87%' },
  { top: '65%', left: '25%' },
  { top: '69%', left: '52%' },
  { top: '63%', left: '79%' },
];

/** Sejauh mana pengaruh kursor terasa, dalam piksel. */
const RADIUS = 190;

/** Seberapa jauh chip terdorong saat kursor tepat di atasnya. */
const PUSH = 46;

/* Titik tengah chip TIDAK dihitung dari konstanta ukuran.
   Ukuran chip fluid lewat clamp() di CSS, jadi angka tetap di sini akan
   meleset di setiap lebar layar kecuali satu. Titik tengahnya diukur sekali
   dari DOM, lalu diukur ulang hanya saat ubinnya berubah ukuran. Mengukur
   per frame akan memaksa layout sebelas kali tiap gerakan kursor. */

function Chip({
  index,
  tool,
  pointerX,
  pointerY,
  centersRef,
  still,
}: {
  index: number;
  tool: (typeof V3_TOOLS)[number];
  pointerX: ReturnType<typeof useMotionValue<number>>;
  pointerY: ReturnType<typeof useMotionValue<number>>;
  centersRef: React.RefObject<{ x: number; y: number }[]>;
  still: boolean;
}) {
  const spot = SPOTS[index];

  /* Dorongan dihitung di dalam useTransform, bukan di state React.
     Pointermove menyala puluhan kali per detik; kalau tiap gerakan memicu
     render ulang, sebelas chip ikut dirender ulang setiap kali. Motion value
     melewati React sepenuhnya dan menulis langsung ke transform. */
  const offset = useTransform<number, number[]>([pointerX, pointerY], ([px, py]) => {
    const centre = centersRef.current[index];
    if (!centre || px < 0) return [0, 0];

    const dx = centre.x - px;
    const dy = centre.y - py;
    const distance = Math.hypot(dx, dy);
    if (distance > RADIUS) return [0, 0];

    /* Jarak nol berarti kursor tepat di titik tengah chip, dan pembagian
       dengan nol di sana menghasilkan NaN yang membuat chipnya lenyap. */
    const safe = Math.max(distance, 1);
    const strength = ((RADIUS - distance) / RADIUS) * PUSH;
    return [(dx / safe) * strength, (dy / safe) * strength];
  });

  const x = useSpring(
    useTransform(offset, (value) => value[0]),
    { stiffness: 240, damping: 22, mass: 0.4 },
  );
  const y = useSpring(
    useTransform(offset, (value) => value[1]),
    { stiffness: 240, damping: 22, mass: 0.4 },
  );

  return (
    <m.span className="v3-tools__spot" style={still ? spot : { ...spot, x, y }}>
      <ToolLogo id={tool.id} name={tool.name} size={34} />
    </m.span>
  );
}

/**
 * Sebelas chip bulat memenuhi bidang kuning, dan menjauh dari kursor.
 *
 * Efek menjauhnya murni tambahan: tanpa JavaScript, tanpa pointer, dan di
 * bawah prefers-reduced-motion, chipnya tetap berada di posisinya dan ubin
 * ini tetap terbaca utuh. Yang hilang cuma gerakannya.
 *
 * aria-hidden karena pembungkus Tile sudah membawa aria-label ubin ini.
 * Tanpa itu, screen reader membacakan sebelas nama merek sebelum sampai ke
 * nama tautannya sendiri.
 */
export default function ToolsTile() {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const centersRef = useRef<{ x: number; y: number }[]>([]);
  const pointerX = useMotionValue(-1);
  const pointerY = useMotionValue(-1);
  const reduced = useReducedMotion();

  /* Titik tengah tiap chip diukur dari DOM, bukan dihitung dari persentase
     dan konstanta ukuran. Ubin ini berubah lebar di dua breakpoint dan
     ukuran chipnya fluid, jadi angka yang dihitung sekali di kepala file
     akan benar di satu lebar saja. ResizeObserver mengukur ulang tepat saat
     ukurannya berubah, bukan tiap frame. */
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;

    /* offsetLeft, bukan getBoundingClientRect: rect ikut membaca transform,
       jadi mengukur ulang saat sebuah chip sedang terdorong akan mencatat
       titik tengahnya di posisi dorongan itu, bukan posisi diamnya. Sekali
       itu terjadi, chip tersebut akan salah menghitung dorongan berikutnya
       selamanya. Kotak ini position:absolute, jadi ia offsetParent
       anak-anaknya dan offsetLeft sudah relatif terhadapnya. */
    const measure = () => {
      centersRef.current = [...box.children].map((node) => {
        const child = node as HTMLElement;
        return {
          x: child.offsetLeft + child.offsetWidth / 2,
          y: child.offsetTop + child.offsetHeight / 2,
        };
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={boxRef}
      className="v3-tools"
      aria-hidden="true"
      onPointerMove={(event) => {
        if (reduced) return;
        const rect = event.currentTarget.getBoundingClientRect();
        pointerX.set(event.clientX - rect.left);
        pointerY.set(event.clientY - rect.top);
      }}
      /* -1 adalah penanda "kursor tidak ada di sini", dan dibaca lagi di
         useTransform. Memakai null akan memaksa tipe motion value jadi
         nullable di sepanjang rantainya. */
      onPointerLeave={() => {
        pointerX.set(-1);
        pointerY.set(-1);
      }}
    >
      {V3_TOOLS.map((tool, index) => (
        <Chip
          key={tool.id}
          index={index}
          tool={tool}
          pointerX={pointerX}
          pointerY={pointerY}
          centersRef={centersRef}
          still={Boolean(reduced)}
        />
      ))}
    </div>
  );
}
