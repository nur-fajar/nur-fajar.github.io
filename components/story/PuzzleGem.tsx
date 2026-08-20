'use client';

import { useCallback, useRef } from 'react';
import { motion, useAnimationControls, useMotionValue, useSpring, type Variants } from 'framer-motion';

/*
 * CATATAN PENTING SOAL ANIMASI DI SINI
 *
 * 1. Pemicu `whileInView` / `onViewportEnter` dipasang di elemen HTML
 *    pembungkusnya, BUKAN di elemen SVG. Keduanya bersandar pada
 *    IntersectionObserver, dan `<g>` SVG tidak punya kotak CSS — Chrome
 *    melaporkan rect 0×0 untuknya, sehingga observer tidak pernah bisa
 *    dipercaya menyatakan elemen itu terlihat.
 *
 *    Trigger-nya sengaja berdiri sendiri, tidak menumpang rantai stagger
 *    `.story-footer__inner`: kedua bentuk ini adalah jangkar visual section
 *    penutup, dan tidak boleh ikut tak terlihat kalau rantai itu meleset.
 *
 * 2. Transform entrance dan transform loop dipisah ke dua `<g>` bersarang, dan
 *    urutannya penting: yang dikendalikan di LUAR, loop di DALAM. Prop `animate`
 *    bernilai objek memutus perambatan varian ke bawah — kalau loop-nya ditaruh
 *    di luar, animasi masuk di dalamnya tidak akan pernah menerima perintahnya.
 */

const FLOAT = { duration: 5.5, repeat: Infinity, ease: 'easeInOut' as const };

/* ═══════════════════════════════════════════════════════════════════════════
   GEOMETRI JIGSAW

   Keping dibangun sisi per sisi, bukan ditulis sebagai satu string path.
   Alasannya: empat keping ini harus benar-benar SALING MENGUNCI. Begitu sisi
   yang bersentuhan digambar terpisah dengan tangan, satu angka meleset dan
   knob-nya tidak lagi duduk di soketnya.

   Di sini tiap sisi cuma punya satu nilai — rata, knob keluar, atau soket
   masuk — dan sisi dalam yang berpasangan selalu diberi nilai berlawanan. Jadi
   pasangannya benar menurut konstruksi, bukan menurut ketelitian.
   ═══════════════════════════════════════════════════════════════════════════ */

/** −1 soket masuk · 0 rata · +1 knob keluar. */
type Edge = -1 | 0 | 1;

/** Tinggi knob, sebagai pecahan panjang sisi. */
const KNOB = 0.22;

/**
 * Satu sisi keping, dari (x0,y0) ke (x1,y1).
 *
 * Sisi diputar −90° untuk mendapat normal luarnya, lalu titik-titik knob
 * ditulis dalam koordinat (u, v): u berjalan sepanjang sisi 0→1, v menjauh
 * tegak lurus. Dengan begitu satu resep knob yang sama dipakai keempat sisi
 * tanpa perlu empat versi yang dicerminkan.
 */
function edge(x0: number, y0: number, x1: number, y1: number, kind: Edge): string {
  if (kind === 0) return `L ${x1} ${y1}`;

  const dx = x1 - x0;
  const dy = y1 - y0;
  const nx = dy; // (dy, −dx) = sisi diputar −90° = normal luar
  const ny = -dx;

  const P = (u: number, v: number) =>
    `${(x0 + dx * u + nx * v * kind).toFixed(2)} ${(y0 + dy * u + ny * v * kind).toFixed(2)}`;

  // Leher menyempit di 0.4/0.6 lalu kepala membulat di 0.5 — itulah yang
  // membuat sesuatu terbaca sebagai keping puzzle dan bukan tonjolan biasa.
  return [
    `L ${P(0.4, 0)}`,
    `C ${P(0.35, KNOB * 0.36)} ${P(0.32, KNOB)} ${P(0.5, KNOB)}`,
    `C ${P(0.68, KNOB)} ${P(0.65, KNOB * 0.36)} ${P(0.6, 0)}`,
    `L ${P(1, 0)}`,
  ].join(' ');
}

function piecePath(x: number, y: number, s: number, e: { t: Edge; r: Edge; b: Edge; l: Edge }) {
  return [
    `M ${x} ${y}`,
    edge(x, y, x + s, y, e.t),
    edge(x + s, y, x + s, y + s, e.r),
    edge(x + s, y + s, x, y + s, e.b),
    edge(x, y + s, x, y, e.l),
    'Z',
  ].join(' ');
}

const S = 46; // sisi satu keping
const OX = 6; // sudut kiri-atas blok 2×2
const OY = 10;

/* Susunan 2×2. Sisi DALAM wajib berpasangan −1 / +1 supaya menguncinya benar.
   Sisi LUAR tidak punya pasangan, jadi bebas — dan sengaja tidak dibuat rata:
   empat keping bersisi luar rata cuma menghasilkan persegi yang terbagi empat,
   yang terbaca sebagai ubin, bukan puzzle. Knob dan soket di tepi luarlah yang
   membuat siluetnya langsung dikenali.

   Slot kanan-atas adalah milik keping keempat. */
const TL = piecePath(OX, OY, S, { t: 1, r: 1, b: 1, l: -1 });
const BL = piecePath(OX, OY + S, S, { t: -1, r: 1, b: -1, l: 1 });
const BR = piecePath(OX + S, OY + S, S, { t: -1, r: -1, b: 1, l: -1 });
const HERO = piecePath(OX + S, OY, S, { t: -1, r: 1, b: 1, l: -1 });

/* Blok 2×2 duduk di (6,10)–(98,102); knob luar menambah 10 satuan ke tiap arah.
   Ruang lega di atas viewBox murni untuk jalur masuk keping keempat: elemen
   `<svg>` memotong apa pun di luar viewBox-nya, dan tanpa ruang itu kepingnya
   terpenggal saat melayang. */
const VIEW_BOX = '-8 -22 140 140';
const VB_W = 140;
const VB_H = 140;

/** Keadaan keping keempat: terpasang, lepas sedikit, dan belum datang. */
const SEATED = { x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 };
const SEAT_IN = { ...SEATED, transition: { type: 'spring' as const, stiffness: 150, damping: 14 } };
const AWAY = { x: 18, y: -20, rotate: -15, opacity: 0, scale: 0.88 };

/*
 * Putar ulang saat hover: lepas, lalu kunci lagi — SATU animasi keyframe, bukan
 * dua `await controls.start()` berurutan yang dijaga flag `busy`.
 *
 * Versi berurutan itu punya cara gagal yang buruk: kalau promise pertama tidak
 * pernah selesai, flag-nya terkunci menyala dan hover mati PERMANEN tanpa
 * error apa pun — persis yang terjadi waktu ini diuji. Satu keyframe tidak
 * punya state untuk tersangkut; hover beruntun cukup memulainya dari awal.
 *
 * Nilai −2 di dekat ujung adalah lewatan kecil melampaui posisi duduknya, yang
 * memberi kesan mengunci; tanpa itu kepingnya cuma meluncur pelan ke tempat.
 */
const REPLAY = {
  x: [0, 18, -2, 0],
  y: [0, -18, 2, 0],
  rotate: [0, -13, 1.5, 0],
  scale: [1, 0.94, 1.015, 1],
  transition: { duration: 1.05, times: [0, 0.38, 0.72, 1], ease: [0.16, 1, 0.3, 1] as const },
};

const joinedVariants: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

/**
 * Empat keping: tiga sudah menyatu dan digambar sebagai garis saja, satu lagi —
 * yang bergaya logam teal penuh — melayang masuk dan mengunci ke slot yang
 * tersisa.
 *
 * Perbedaan bahan itu yang memikul artinya. Tiga keping bergaris adalah keadaan
 * yang sudah ada; keping keempat satu-satunya benda padat di sana, dan ia yang
 * melengkapi. Kalau keempatnya digambar sama, gambarnya cuma jadi puzzle, bukan
 * kalimat "See me as your last puzzle piece".
 */
export function PuzzleCluster({ size = 196, reduce }: { size?: number; reduce?: boolean | null }) {
  const controls = useAnimationControls();
  const seated = useRef(false);

  const onEnter = useCallback(() => {
    if (reduce || seated.current) return;
    seated.current = true;
    controls.start(SEAT_IN);
  }, [controls, reduce]);

  const replay = useCallback(() => {
    if (reduce || !seated.current) return;
    controls.start(REPLAY);
  }, [controls, reduce]);

  return (
    <motion.span
      className="story-gem"
      style={{ width: size, height: (size * VB_H) / VB_W }}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      onViewportEnter={onEnter}
      onHoverStart={replay}
    >
      <svg viewBox={VIEW_BOX} width={size} height={(size * VB_H) / VB_W} aria-hidden="true">
        <defs>
          <linearGradient id="pz-body" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#A8F0E4" />
            <stop offset="42%" stopColor="#2DD4BF" />
            <stop offset="100%" stopColor="#0F6B62" />
          </linearGradient>
          <linearGradient id="pz-sheen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E8FFFA" stopOpacity="0.85" />
            <stop offset="45%" stopColor="#E8FFFA" stopOpacity="0" />
          </linearGradient>
          <filter id="pz-shadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="6" stdDeviation="7" floodColor="#000" floodOpacity="0.55" />
          </filter>
        </defs>

        {/* Tiga keping yang sudah menyatu.
            Isiannya tidak boleh sepenuhnya kosong. Knob keping kiri-atas
            menjorok MASUK ke soket keping teal, jadi kalau isiannya sehitam
            latar, tonjolan itu terbaca sebagai lubang yang dilubangkan pada
            keping teal — bukan sebagai keping tetangga yang duduk di dalamnya.
            Isian hangat tipis plus garis yang lebih terang mengembalikan
            bacaannya. */}
        <motion.g variants={joinedVariants} style={{ transformOrigin: '52px 56px' }}>
          {[TL, BL, BR].map((d) => (
            <path
              key={d}
              d={d}
              fill="rgba(45, 212, 191, 0.13)"
              stroke="#2E8F82"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
          ))}
        </motion.g>

        {/* Slot yang menunggu — garis putus-putus, jadi bacaannya jelas: ada
            satu tempat yang belum terisi. */}
        <path
          d={HERO}
          fill="none"
          stroke="#0D9488"
          strokeWidth="1.4"
          strokeDasharray="5 5"
          opacity="0.5"
        />

        <motion.g initial={reduce ? SEATED : AWAY} animate={reduce ? undefined : controls}>
          <motion.g
            filter="url(#pz-shadow)"
            animate={reduce ? undefined : { y: [0, -3, 0], rotate: [0, -0.9, 0] }}
            transition={FLOAT}
            style={{ transformOrigin: '75px 33px' }}
          >
            <path d={HERO} fill="url(#pz-body)" />
            {/* Bevel dalam — garis terang di dalam tepi bikin permukaannya
                terbaca punya ketebalan, bukan siluet datar. */}
            <path d={HERO} fill="none" stroke="#CFF7EE" strokeWidth="1.4" opacity="0.55" />
            <path d={HERO} fill="url(#pz-sheen)" />
          </motion.g>
        </motion.g>
      </svg>
    </motion.span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   BERLIAN
   ═══════════════════════════════════════════════════════════════════════════ */

const gemVariants: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

/** Bintang empat sudut, ukurannya bebas. */
const star = (s: number) =>
  `M0 ${-s} L${s * 0.21} ${-s * 0.21} L${s} 0 L${s * 0.21} ${s * 0.21} ` +
  `L0 ${s} L${-s * 0.21} ${s * 0.21} L${-s} 0 L${-s * 0.21} ${-s * 0.21} Z`;

/* Kilau di LUAR batu. Ukuran, jeda, dan lamanya sengaja tidak ada yang sama:
   begitu ritmenya seragam, kerlipnya terbaca sebagai lampu indikator yang
   berkedip, bukan cahaya yang tertangkap batu. */
const SPARKS = [
  { x: -2, y: 30, s: 7, d: 0, dur: 2.2 },
  { x: 118, y: 44, s: 6, d: 1.7, dur: 2.6 },
  { x: 16, y: 100, s: 5, d: 0.9, dur: 1.9 },
  { x: 106, y: 104, s: 7.5, d: 2.6, dur: 2.4 },
  { x: 62, y: -6, s: 6, d: 3.4, dur: 2.1 },
  { x: 50, y: 128, s: 4.5, d: 1.2, dur: 2.8 },
];

/**
 * Berlian potongan brilian tampak depan: mahkota, girdle, pavilion, dengan
 * facet-facet yang tiap bidangnya punya nilai terang berbeda — itulah yang
 * membuat batu terbaca sebagai benda berkilau, bukan segitiga.
 *
 * KENAPA BERAYUN, BUKAN BERPUTAR PENUH
 *   Batunya bentuk datar. Diputar 360° pada sumbu vertikal, di 90° ia menipis
 *   jadi garis lalu muncul kembali sebagai bayangan cerminnya — yang terbaca
 *   adalah kartu membalik, bukan batu berputar. Ayunan ±32° membuat facet-nya
 *   bergantian menghadap cahaya dan siluetnya tidak pernah runtuh.
 */
export function Diamond({ size = 208, reduce }: { size?: number; reduce?: boolean | null }) {
  const T = 13; // garis meja (table)
  const G = 46; // girdle
  const CULET: [number, number] = [60, 112];

  const table: [number, number][] = [
    [36, T],
    [48, T],
    [60, T],
    [72, T],
    [84, T],
  ];
  const girdle: [number, number][] = [
    [8, G],
    [28, G],
    [46, G],
    [60, G],
    [74, G],
    [92, G],
    [112, G],
  ];

  // Mahkota: kite & star facet berselang-seling antara meja dan girdle.
  const crown: { pts: [number, number][]; o: number }[] = [
    { pts: [table[0], girdle[0], girdle[1]], o: 0.9 },
    { pts: [table[0], girdle[1], girdle[2]], o: 0.55 },
    { pts: [table[0], girdle[2], table[1]], o: 0.75 },
    { pts: [table[1], girdle[2], girdle[3]], o: 0.4 },
    { pts: [table[1], girdle[3], table[2]], o: 0.62 },
    { pts: [table[2], girdle[3], girdle[4]], o: 0.5 },
    { pts: [table[2], girdle[4], table[3]], o: 0.78 },
    { pts: [table[3], girdle[4], girdle[5]], o: 0.45 },
    { pts: [table[3], girdle[5], table[4]], o: 0.68 },
    { pts: [table[4], girdle[5], girdle[6]], o: 0.92 },
  ];

  // Pavilion: facet panjang yang mengerucut ke culet.
  const pavilion: { pts: [number, number][]; o: number }[] = [
    { pts: [girdle[0], girdle[1], CULET], o: 0.85 },
    { pts: [girdle[1], girdle[2], CULET], o: 0.5 },
    { pts: [girdle[2], girdle[3], CULET], o: 0.7 },
    { pts: [girdle[3], girdle[4], CULET], o: 0.42 },
    { pts: [girdle[4], girdle[5], CULET], o: 0.66 },
    { pts: [girdle[5], girdle[6], CULET], o: 0.88 },
  ];

  const outline = `${girdle[0][0]},${G} ${table[0][0]},${T} ${table[4][0]},${T} ${girdle[6][0]},${G} ${CULET[0]},${CULET[1]}`;
  const poly = (p: [number, number][]) => p.map(([x, y]) => `${x},${y}`).join(' ');

  // Tilt hover. Nilai mentahnya diberi pegas, bukan transisi durasi tetap:
  // kursor mengirim puluhan nilai per detik, dan hanya pegas yang bisa berganti
  // target di tengah jalan tanpa tersendat.
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const spring = { stiffness: 170, damping: 16, mass: 0.4 };
  const tiltX = useSpring(rawX, spring);
  const tiltY = useSpring(rawY, spring);

  // Sentuhan sengaja diabaikan. Di layar sentuh tidak ada "kursor pergi", jadi
  // satu sapuan jari saat menggulung akan meninggalkan batunya miring selamanya.
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    rawX.set(-((e.clientY - r.top) / r.height - 0.5) * 26);
    rawY.set(((e.clientX - r.left) / r.width - 0.5) * 30);
  };
  // `onHoverEnd` milik framer, bukan `onPointerLeave` React: yang belakangan
  // disintesis dari pasangan pointerout/pointerover dan terbukti tidak selalu
  // terpicu di sini — akibatnya batu tertinggal miring setelah kursor pergi.
  const onLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const VB = 152;
  const H = (size * 156) / VB;

  return (
    <motion.div
      className="story-gem story-gem--3d"
      style={{ width: size, height: H }}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={gemVariants}
      onPointerMove={onMove}
      onHoverEnd={onLeave}
    >
      <motion.div className="story-gem__tilt" style={{ rotateX: tiltX, rotateY: tiltY }}>
        <motion.div
          className="story-gem__spin"
          animate={reduce ? undefined : { rotateY: [-32, 32, -32] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg viewBox="-16 -14 152 156" width={size} height={H} aria-hidden="true">
            <defs>
              <linearGradient id="dm-base" x1="0" y1="0" x2="0.3" y2="1">
                <stop offset="0%" stopColor="#B9F3EA" />
                <stop offset="55%" stopColor="#2DD4BF" />
                <stop offset="100%" stopColor="#0C5A52" />
              </linearGradient>
              <clipPath id="dm-clip">
                <polygon points={outline} />
              </clipPath>
              <linearGradient id="dm-sweep" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                <stop offset="50%" stopColor="#F2FFFC" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>
              <filter id="dm-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#2DD4BF" floodOpacity="0.45" />
              </filter>
            </defs>

            <g filter="url(#dm-glow)">
              <polygon points={outline} fill="url(#dm-base)" />

              <g clipPath="url(#dm-clip)">
                {/* Facet terang DAN facet gelap. Melapisi semuanya dengan putih
                    beropasitas berbeda cuma menghasilkan gradasi lembut; yang
                    membuat batu terbaca berkilau adalah bidang terang yang
                    bersebelahan langsung dengan bidang gelap. */}
                {[...crown, ...pavilion].map((f, i) => (
                  <polygon
                    key={i}
                    points={poly(f.pts)}
                    fill={f.o >= 0.6 ? '#E8FFFA' : '#0B3A35'}
                    opacity={f.o >= 0.6 ? f.o * 0.5 : (1 - f.o) * 0.42}
                    stroke="#D3FBF3"
                    strokeWidth="0.5"
                    strokeOpacity="0.5"
                  />
                ))}

                {/* Sapuan cahaya melintasi batu — inilah yang bikin ia terbaca
                    sebagai permukaan mengkilap, bukan poligon berwarna. */}
                {!reduce && (
                  <motion.rect
                    x="-70"
                    y="-10"
                    width="46"
                    height="150"
                    fill="url(#dm-sweep)"
                    transform="rotate(14 60 62)"
                    animate={{ x: [-70, 150] }}
                    transition={{
                      duration: 3.4,
                      repeat: Infinity,
                      repeatDelay: 2.6,
                      ease: 'easeInOut',
                    }}
                  />
                )}
              </g>

              <polygon points={outline} fill="none" stroke="#CFF7EE" strokeWidth="1.3" opacity="0.8" />
              <polyline
                points={`${girdle[0][0]},${G} ${girdle[6][0]},${G}`}
                stroke="#E3FFF9"
                strokeWidth="1.1"
                opacity="0.7"
              />
              <polyline
                points={`${table[0][0]},${T} ${table[4][0]},${T}`}
                stroke="#E3FFF9"
                strokeWidth="1.1"
                opacity="0.85"
              />
            </g>

            {!reduce && (
              <>
                {SPARKS.map((s) => (
                  <Sparkle key={`${s.x}-${s.y}`} {...s} />
                ))}
                {/* Dua glint di permukaan batunya sendiri. */}
                <Sparkle x={38} y={30} s={5} d={0.4} dur={1.8} />
                <Sparkle x={84} y={62} s={4} d={2.1} dur={1.6} />
              </>
            )}
          </svg>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function Sparkle({ x, y, s, d, dur }: { x: number; y: number; s: number; d: number; dur: number }) {
  return (
    <motion.g
      transform={`translate(${x} ${y})`}
      animate={{ opacity: [0, 1, 0], scale: [0.3, 1, 0.3] }}
      transition={{ duration: dur, repeat: Infinity, repeatDelay: 0.6 + d * 0.35, delay: d, ease: 'easeInOut' }}
      style={{ transformOrigin: `${x}px ${y}px` }}
    >
      <circle r={s * 1.5} fill="#CFF7EE" opacity="0.12" />
      <path d={star(s)} fill="#E8FFFA" />
    </motion.g>
  );
}
