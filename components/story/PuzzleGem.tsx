'use client';

import { motion, type Variants } from 'framer-motion';

/*
 * CATATAN PENTING SOAL ANIMASI DI SINI
 *
 * 1. `whileInView` dipasang di <span> pembungkusnya, BUKAN di elemen SVG.
 *    `whileInView` bersandar pada IntersectionObserver, dan `<g>` SVG tidak
 *    punya kotak CSS — Chrome melaporkan rect 0×0 untuknya, sehingga observer
 *    tidak pernah bisa dipercaya menyatakan elemen itu terlihat. Span-nya
 *    elemen HTML biasa dengan kotak nyata, lalu label variannya dirambatkan
 *    turun ke <g> di dalam SVG.
 *
 *    Trigger-nya sengaja berdiri sendiri, tidak menumpang rantai stagger
 *    `.story-footer__inner`: kedua bentuk ini adalah jangkar visual section
 *    penutup, dan tidak boleh ikut tak terlihat kalau rantai itu meleset.
 *
 * 2. Transform entrance dan transform loop dipisah ke dua `<g>` bersarang, dan
 *    urutannya penting: varian di LUAR, loop di DALAM. Prop `animate` bernilai
 *    objek memutus perambatan varian ke bawah — kalau loop-nya ditaruh di luar,
 *    animasi masuk di dalamnya tidak akan pernah menerima label variannya.
 */

const FLOAT = { duration: 5.5, repeat: Infinity, ease: 'easeInOut' as const };

const pieceVariants: Variants = {
  hidden: { x: 26, y: -20, rotate: -14, opacity: 0, scale: 0.86 },
  show: {
    x: 9,
    y: 9,
    rotate: 0,
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 150, damping: 14 },
  },
};

/**
 * Puzzle piece bergaya logam emas: gradien badan, bevel dalam, sorotan tepi,
 * dan bayangan jatuh. Di belakangnya ada "soket" putus-putus, jadi bacaannya
 * jelas: ini kepingan TERAKHIR yang tinggal pas. Kepingannya melayang masuk,
 * klik ke tempatnya, lalu terus mengambang halus.
 */
export function PuzzlePiece({ size = 162, reduce }: { size?: number; reduce?: boolean | null }) {
  // Knob di atas & kanan, soket di bawah & kiri — bentuk jigsaw yang langsung
  // terbaca walau hanya satu keping.
  const d =
    'M 22 22 H 44 c 0 -11 17 -11 17 0 H 82 V 44 c 11 0 11 17 0 17 V 82 H 61 c 0 11 -17 11 -17 0 H 22 V 61 c -11 0 -11 -17 0 -17 Z';

  return (
    <motion.span
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className="story-gem"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 104 104" width={size} height={size} aria-hidden="true">
        <defs>
          <linearGradient id="pz-body" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F7D089" />
            <stop offset="42%" stopColor="#E8A33D" />
            <stop offset="100%" stopColor="#A66B1F" />
          </linearGradient>
          <linearGradient id="pz-sheen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFF6E2" stopOpacity="0.85" />
            <stop offset="45%" stopColor="#FFF6E2" stopOpacity="0" />
          </linearGradient>
          <filter id="pz-shadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="6" stdDeviation="7" floodColor="#000" floodOpacity="0.55" />
          </filter>
        </defs>

        {/* Soket: tempat kepingan ini seharusnya duduk. */}
        <path
          d={d}
          fill="none"
          stroke="#8A6A34"
          strokeWidth="1.6"
          strokeDasharray="5 5"
          opacity="0.65"
          transform="translate(9 9)"
        />

        <motion.g variants={pieceVariants}>
          <motion.g
            filter="url(#pz-shadow)"
            animate={reduce ? undefined : { y: [0, -3.5, 0], rotate: [0, -1.1, 0] }}
            transition={FLOAT}
            style={{ transformOrigin: '52px 52px' }}
          >
            <path d={d} fill="url(#pz-body)" />
            {/* Bevel dalam — garis terang di dalam tepi bikin permukaannya
                terbaca punya ketebalan, bukan siluet datar. */}
            <path d={d} fill="none" stroke="#FFE7B8" strokeWidth="1.4" opacity="0.55" />
            <path d={d} fill="url(#pz-sheen)" />
          </motion.g>
        </motion.g>
      </svg>
    </motion.span>
  );
}

const gemVariants: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * Berlian potongan brilian tampak depan: mahkota, girdle, pavilion, dengan
 * facet-facet yang tiap bidangnya punya nilai terang berbeda — itulah yang
 * membuat batu terbaca sebagai benda berkilau, bukan segitiga. Ditambah
 * sapuan cahaya yang bergerak melintasi batu dan dua kilau kecil.
 */
export function Diamond({ size = 168, reduce }: { size?: number; reduce?: boolean | null }) {
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

  return (
    <motion.span
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className="story-gem"
      style={{ width: size, height: size }}
    >
      {/* SVG-nya biasa; yang membawa varian adalah <g> di dalamnya — struktur
          yang sama persis dengan PuzzlePiece di atas. */}
      <svg viewBox="0 0 120 124" width={size} height={size} aria-hidden="true">
        <defs>
          <linearGradient id="dm-base" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor="#FFE2A8" />
            <stop offset="55%" stopColor="#E8A33D" />
            <stop offset="100%" stopColor="#8A5A18" />
          </linearGradient>
          <clipPath id="dm-clip">
            <polygon points={outline} />
          </clipPath>
          <linearGradient id="dm-sweep" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="50%" stopColor="#FFFDF5" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <filter id="dm-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#E8A33D" floodOpacity="0.45" />
          </filter>
        </defs>

        <motion.g variants={gemVariants} style={{ transformOrigin: '60px 62px' }}>
          <g filter="url(#dm-glow)">
            <polygon points={outline} fill="url(#dm-base)" />

            <g clipPath="url(#dm-clip)">
              {[...crown, ...pavilion].map((f, i) => (
                <polygon
                  key={i}
                  points={poly(f.pts)}
                  fill="#FFF1D2"
                  opacity={f.o * 0.34}
                  stroke="#FFEFCC"
                  strokeWidth="0.5"
                  strokeOpacity="0.45"
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

            <polygon points={outline} fill="none" stroke="#FFE7B8" strokeWidth="1.3" opacity="0.8" />
            <polyline
              points={`${girdle[0][0]},${G} ${girdle[6][0]},${G}`}
              stroke="#FFF3DA"
              strokeWidth="1.1"
              opacity="0.7"
            />
            <polyline
              points={`${table[0][0]},${T} ${table[4][0]},${T}`}
              stroke="#FFF3DA"
              strokeWidth="1.1"
              opacity="0.85"
            />
          </g>

          {!reduce && (
            <>
              <Sparkle x={36} y={30} delay={0} />
              <Sparkle x={86} y={60} delay={1.3} />
            </>
          )}
        </motion.g>
      </svg>
    </motion.span>
  );
}

function Sparkle({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.g
      transform={`translate(${x} ${y})`}
      animate={{ opacity: [0, 1, 0], scale: [0.4, 1, 0.4] }}
      transition={{
        duration: 1.8,
        repeat: Infinity,
        repeatDelay: 2.2,
        delay,
        ease: 'easeInOut',
      }}
      style={{ transformOrigin: `${x}px ${y}px` }}
    >
      <path d="M0 -7 L1.5 -1.5 L7 0 L1.5 1.5 L0 7 L-1.5 1.5 L-7 0 L-1.5 -1.5 Z" fill="#FFF6E2" />
    </motion.g>
  );
}
