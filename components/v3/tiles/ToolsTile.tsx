'use client';

import { m, motionValue, useReducedMotion, type MotionValue } from 'framer-motion';
import { useEffect, useMemo, useRef } from 'react';
import ToolLogo from '../ToolLogo';
import { V3_TOOLS } from '@/content/ledger';

/* Posisi awal kesebelas chip ditulis tetap, bukan diacak. Penempatan acak
   akan berbeda antara render server dan client lalu memicu hydration
   mismatch, dan di build statis ia membeku pada satu susunan hasil undian
   saat build. Dari sinilah tiap chip mulai melayang; arah awalnya disebar
   merata lewat sudut emas di bawah.

   Sebarannya menutup seluruh bidang, dan beberapa chip sengaja diletakkan
   sampai menyentuh tepi: ubinnya overflow:hidden, jadi chip yang terpotong
   tepi terbaca sebagai bidang yang penuh, bukan sebagai kotak berisi
   benda-benda kecil di tengah.

   Pojok kiri bawah tetap kosong. Di sanalah tombol panah ubin duduk.

   Chip pertama TIDAK diletakkan di pojok. Chip yang terpotong satu sisi
   terbaca sebagai bidang yang meluas ke luar bingkai; chip yang terpotong
   dua sisi sekaligus di sudut terbaca sebagai potongan yang lupa
   dirapikan. */
const SPOTS = [
  { top: '5%', left: '2%' },
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

/** Jangkauan tolak kursor, dalam piksel. */
const RADIUS = 190;

/** Percepatan tolak maksimum saat kursor tepat di atas chip, px/s². */
const PUSH = 1500;

/** Batas laju supaya sentilan kursor tidak liar, px/s. */
const MAX_SPEED = 280;

/* ponytail: tumbukan O(n²) berpasangan tiap frame (55 pasang untuk 11 chip).
   Untuk ratusan benda pakai spatial hash; di sini n tetap 11 dan biayanya
   tidak terukur, jadi grid partisi cuma menambah kode. */
const COUNT = V3_TOOLS.length;

function Chip({
  index,
  tool,
  x,
  y,
}: {
  index: number;
  tool: (typeof V3_TOOLS)[number];
  x: MotionValue<number>;
  y: MotionValue<number>;
}) {
  return (
    <span className="v3-toolfield__spot" style={SPOTS[index]}>
      <m.span className="v3-toolfield__push" style={{ x, y }}>
        <ToolLogo id={tool.id} name={tool.name} size={40} />
      </m.span>
    </span>
  );
}

/**
 * Sebelas chip bulat memenuhi bidang kuning dan MELAYANG BEBAS: tiap chip
 * punya posisi dan kecepatan sendiri, memantul lenting sesama chip dan
 * dinding ubin, dan tersentil menjauh saat kursor mendekat.
 *
 * Satu rAF loop menulis langsung ke motion value tiap chip, jadi tidak ada
 * satu pun render ulang React per frame. Jari-jari dan batas ubin diukur
 * dari DOM (ukuran chip fluid lewat clamp(), jadi angka tetap akan meleset
 * di semua lebar kecuali satu) dan diukur ulang saat ubin berubah ukuran.
 *
 * Tanpa JavaScript, tanpa pointer, dan di prefers-reduced-motion, chipnya
 * diam di posisinya dan ubin tetap terbaca utuh. Yang hilang cuma geraknya.
 *
 * aria-hidden karena pembungkus Tile sudah membawa aria-label ubin ini.
 * Tanpa itu, screen reader membacakan sebelas nama merek sebelum sampai ke
 * nama tautannya sendiri.
 */
export default function ToolsTile() {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  /* Offset tiap chip dari titik awalnya. useMemo, bukan state: nilainya
     ditulis loop fisika puluhan kali per detik dan tidak boleh me-render
     ulang siapa pun. */
  const offsets = useMemo(
    () => V3_TOOLS.map(() => ({ x: motionValue(0), y: motionValue(0) })),
    [],
  );

  const sim = useRef({
    pos: [] as { x: number; y: number }[],
    vel: [] as { x: number; y: number }[],
    rad: [] as number[],
    home: [] as { x: number; y: number }[],
    bounds: { w: 0, h: 0 },
    cursor: { x: -1, y: -1 },
    ready: false,
  });

  /* Ukur batas, jari-jari, dan titik awal dari DOM. OffsetLeft/offsetTop,
     bukan getBoundingClientRect: rect ikut membaca transform, jadi mengukur
     ulang saat sebuah chip sedang bergeser akan mencatat titik awalnya di
     posisi geser itu, bukan posisi diamnya. Kotak ini position:absolute,
     jadi ia offsetParent anak-anaknya dan offsetLeft sudah relatif
     terhadapnya. */
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const S = sim.current;

    const measure = () => {
      const w = box.clientWidth;
      const h = box.clientHeight;
      S.bounds = { w, h };
      S.rad = [...box.children].map((node) => (node as HTMLElement).offsetWidth / 2);
      S.home = [...box.children].map((node) => {
        const child = node as HTMLElement;
        return {
          x: child.offsetLeft + child.offsetWidth / 2,
          y: child.offsetTop + child.offsetHeight / 2,
        };
      });
      if (!S.ready && w > 0) {
        S.ready = true;
        S.pos = S.home.map((point) => ({ ...point }));
        /* Arah awal disebar merata (sudut emas) dan laju dibuat beda-beda:
           deterministik dari index, jadi server dan client selalu sama dan
           tidak ada dua chip yang melaju sejajar selamanya. */
        S.vel = S.home.map((_, i) => {
          const angle = i * 2.39996;
          const speed = 36 + ((i * 13) % 24);
          return { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed };
        });
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduced) return;
    const S = sim.current;
    let raf = 0;
    let last = performance.now();

    const step = (now: number) => {
      /* Tab yang lama tersembunyi: rAF berhenti, dan tanpa clamp bingkai
         pertama setelah kembali akan melontarkan semua chip. */
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const { w, h } = S.bounds;

      if (S.ready && w > 0) {
        for (let i = 0; i < COUNT; i++) {
          const p = S.pos[i];
          const v = S.vel[i];
          const r = S.rad[i] || 0;

          /* Kursor menolak, bukan menarik: percepatan menjauhi titik kursor
             yang melemah sampai nol di tepi jangkauan. */
          if (S.cursor.x >= 0) {
            const dx = p.x - S.cursor.x;
            const dy = p.y - S.cursor.y;
            const d = Math.hypot(dx, dy);
            if (d < RADIUS && d > 1) {
              const force = ((RADIUS - d) / RADIUS) * PUSH;
              v.x += (dx / d) * force * dt;
              v.y += (dy / d) * force * dt;
            }
          }

          /* Kemudi jelajah: laju ditarik pelan ke targetnya sendiri supaya
             tumbukan tidak lama-lama menidurkan atau menggelisahkan gerak. */
          const cruise = 36 + ((i * 13) % 24);
          const speed = Math.hypot(v.x, v.y);
          if (speed > 0.01) {
            const next = speed + (cruise - speed) * Math.min(1, 2 * dt);
            const capped = Math.min(next, MAX_SPEED);
            v.x = (v.x / speed) * capped;
            v.y = (v.y / speed) * capped;
          }

          p.x += v.x * dt;
          p.y += v.y * dt;

          /* Dinding: pantul penuh dan jepit posisi supaya tidak ada chip
             yang terjepit di luar batas setelah resize. */
          if (p.x < r) {
            p.x = r;
            v.x = Math.abs(v.x);
          } else if (p.x > w - r) {
            p.x = w - r;
            v.x = -Math.abs(v.x);
          }
          if (p.y < r) {
            p.y = r;
            v.y = Math.abs(v.y);
          } else if (p.y > h - r) {
            p.y = h - r;
            v.y = -Math.abs(v.y);
          }
        }

        /* Tumbukan lenting bermassa sama: komponen kecepatan sepanjang garis
           tengah dipertukarkan, sisanya diteruskan; tumpang-tindih dibagi
           dua supaya tidak lengket. */
        for (let i = 0; i < COUNT; i++) {
          for (let j = i + 1; j < COUNT; j++) {
            const a = S.pos[i];
            const b = S.pos[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const min = (S.rad[i] || 0) + (S.rad[j] || 0);
            const d = Math.hypot(dx, dy);
            if (d <= 0 || d >= min) continue;
            const nx = dx / d;
            const ny = dy / d;
            const overlap = (min - d) / 2;
            a.x -= nx * overlap;
            a.y -= ny * overlap;
            b.x += nx * overlap;
            b.y += ny * overlap;
            const va = S.vel[i];
            const vb = S.vel[j];
            const rel = (vb.x - va.x) * nx + (vb.y - va.y) * ny;
            if (rel >= 0) continue;
            const impulse = -rel;
            va.x -= impulse * nx;
            va.y -= impulse * ny;
            vb.x += impulse * nx;
            vb.y += impulse * ny;
          }
        }

        for (let i = 0; i < COUNT; i++) {
          offsets[i].x.set(S.pos[i].x - S.home[i].x);
          offsets[i].y.set(S.pos[i].y - S.home[i].y);
        }
      }

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reduced, offsets]);

  /* Tanpa gerak (reduced-motion): chip statis di titik awalnya. Tanpa JS:
     HTML server memang hanya berisi ini. */
  if (reduced) {
    return (
      <div className="v3-toolfield" aria-hidden="true">
        {V3_TOOLS.map((tool, index) => (
          <span className="v3-toolfield__spot" style={SPOTS[index]} key={tool.id}>
            <ToolLogo id={tool.id} name={tool.name} size={40} />
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={boxRef}
      className="v3-toolfield"
      aria-hidden="true"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        sim.current.cursor = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        };
      }}
      /* -1 adalah penanda "kursor tidak ada di sini". Memakai null akan
         memaksa tipe nullable di sepanjang rantai baca. */
      onPointerLeave={() => {
        sim.current.cursor = { x: -1, y: -1 };
      }}
    >
      {V3_TOOLS.map((tool, index) => (
        <Chip key={tool.id} index={index} tool={tool} x={offsets[index].x} y={offsets[index].y} />
      ))}
    </div>
  );
}
