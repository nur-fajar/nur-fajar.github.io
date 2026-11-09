"use client";

import { useEffect, useMemo, useRef, useState, type ReactElement, type ReactNode } from "react";

/**
 * BackgroundShapes - latar pola geometri beranimasi, diadaptasi dari
 * komponen "background-shapes" @otatechie di 21st.dev (edisi 2026-11-09)
 * atas permintaan founder: menggantikan sel miring "background-boxes"
 * Aceternity sebagai latar homepage.
 *
 * Adaptasi di edisi ini (dan alasannya):
 *   - Bentuk awal tiap sel DETERMINISTIK dari seed = shapeId (bukan
 *     Math.random() saat render seperti aslinya). Aslinya me-render
 *     beda di server dan di browser (hydration mismatch), dan repo ini
 *     sudah pernah menolak pencampuran acak saat render di Boxes lama.
 *   - Warna tiap sel dipilih dari PALIT warna yang dikirim (bukan selalu
 *     colors[0] seperti aslinya), juga lewat seed yang sama - palitnya
 *     tri-warna aksen situs (biru/ungu/magenta) dari --g1/--g2/--g3.
 *   - Cell7 (kotak transparan) memakai warna palit + fillOpacity, bukan
 *     rgba(255,255,255,0.1) hardcode yang tak terlihat di kertas terang.
 *   - scale tidak lagi 0.2 hardcode: sekarang cellSize/100, supaya
 *     bentuknya mengisi sel pada ukuran cell berapa pun.
 *   - `prefers-reduced-motion: reduce` mematikan pergantian bentuk
 *     (bentuk awal tetap tampil) - aturan motion sistem situs ini.
 *
 * BackgroundShapesBleed (di bawah) mengukur wadahnya sendiri lewat
 * ResizeObserver supaya bisa dipakai sebagai latar full-bleed tanpa
 * menebak-tebak angka width/height.
 */

const Cell1 = ({ colors }: { colors: string[]; strokeWidth: number }) => (
  <circle cx="50" cy="50" r="9.44" fill={colors[0]} fillRule="evenodd" />
);

const Cell2 = ({ colors, strokeWidth }: { colors: string[]; strokeWidth: number }) => (
  <>
    <line x1="25" x2="75" y1="25" y2="25" stroke={colors[0]} strokeWidth={strokeWidth} />
    <line x1="25" x2="75" y1="50" y2="50" stroke={colors[0]} strokeWidth={strokeWidth} />
    <line x1="25" x2="75" y1="75" y2="75" stroke={colors[0]} strokeWidth={strokeWidth} />
  </>
);

const Cell3 = ({ colors, strokeWidth }: { colors: string[]; strokeWidth: number }) => (
  <>
    <line x1="25" x2="75" y1="25" y2="75" stroke={colors[0]} strokeWidth={strokeWidth} />
    <line x1="25" x2="75" y1="75" y2="25" stroke={colors[0]} strokeWidth={strokeWidth} />
  </>
);

const Cell4 = ({ colors, strokeWidth }: { colors: string[]; strokeWidth: number }) => (
  <rect
    width="50"
    height="50"
    x="25"
    y="25"
    fill="none"
    stroke={colors[0]}
    strokeWidth={strokeWidth}
  />
);

const Cell5 = ({ colors, strokeWidth }: { colors: string[]; strokeWidth: number }) => (
  <line x1="25" x2="75" y1="75" y2="25" fill="none" stroke={colors[0]} strokeWidth={strokeWidth} />
);

const Cell6 = () => null;

const Cell7 = ({ colors, strokeWidth }: { colors: string[]; strokeWidth: number }) => (
  <rect width="75" height="75" x="12.5" y="12.5" fill={colors[0]} fillOpacity={0.1} />
);

// PRNG berseed, sederhana - cukup untuk pola dekoratif yang harus stabil.
const seedPRNG = (seed: number) => {
  let seedValue = Math.abs(Math.floor(seed)) || 1;
  return () => {
    seedValue = (seedValue * 9301 + 49297) % 233280;
    return seedValue / 233280;
  };
};

// Hash string sederhana: seed dari shapeId supaya bentuk awal sel identik
// di render server maupun browser (tidak ada hydration mismatch).
const hashStr = (text: string) => {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
  return h;
};

interface ShapeConfig {
  shape: ({ colors, strokeWidth }: { colors: string[]; strokeWidth: number }) => ReactElement | null;
  weight: number;
}

const shapesConfig: ShapeConfig[] = [
  { shape: Cell1, weight: 1 },
  { shape: Cell2, weight: 1 },
  { shape: Cell3, weight: 1 },
  { shape: Cell4, weight: 1 },
  { shape: Cell5, weight: 1 },
  { shape: Cell6, weight: 5 },
  { shape: Cell7, weight: 3 },
];

const createWeightedSelector = (items: ShapeConfig[], seededRandom: () => number) => {
  const weightedArray: ShapeConfig[] = [];
  for (const item of items) {
    for (let i = 0; i < item.weight; i++) weightedArray.push(item);
  }
  return (): ShapeConfig =>
    weightedArray[Math.floor(seededRandom() * weightedArray.length)] ?? items[0]!;
};

interface ShapeProps {
  x: number;
  y: number;
  colors: string[];
  strokeWidth: number;
  scale: number;
  shapeId: string;
  minInterval?: number;
  maxInterval?: number;
}

const Shape = ({ x, y, colors, strokeWidth, scale, shapeId, minInterval = 0, maxInterval = 5000 }: ShapeProps) => {
  // Bentuk + warna awal dari seed shapeId: dua sisi render (server/browser)
  // memilih hal yang sama, dan pola awalnya identik tiap kunjungan.
  const [current, setCurrent] = useState(() => {
    const rand = seedPRNG(hashStr(shapeId));
    const pickShape = createWeightedSelector(shapesConfig, rand);
    return {
      shape: pickShape(),
      color: colors[Math.floor(rand() * colors.length) % colors.length] ?? colors[0]!,
    };
  });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const getRandomInterval = () => Math.random() * (maxInterval - minInterval) + minInterval;

    const updateShape = () => {
      const seededRandom = seedPRNG(Math.random() * 1000);
      const pickShape = createWeightedSelector(shapesConfig, seededRandom);
      setCurrent({
        shape: pickShape(),
        color: colors[Math.floor(seededRandom() * colors.length) % colors.length] ?? colors[0]!,
      });
    };

    let timeoutId = setTimeout(() => {
      updateShape();

      const setNextTimeout = () => {
        timeoutId = setTimeout(() => {
          updateShape();
          setNextTimeout();
        }, getRandomInterval());
      };

      setNextTimeout();
    }, getRandomInterval());

    return () => clearTimeout(timeoutId);
  }, [colors, minInterval, maxInterval]);

  const ShapeComponent = current.shape.shape;
  const cells = [{ colors: [current.color], strokeWidth }];

  return (
    <g transform={`translate(${x} ${y})`}>
      <g transform={`scale(${scale})`}>
        <ShapeComponent colors={cells[0]!.colors} strokeWidth={cells[0]!.strokeWidth} />
      </g>
    </g>
  );
};

interface BackgroundShapesProps {
  width?: number;
  height?: number;
  cellSize?: number;
  strokeWidth?: number;
  colors?: string[];
  className?: string;
  minInterval?: number;
  maxInterval?: number;
}

export const BackgroundShapes = ({
  width = 500,
  height = 500,
  cellSize = 40,
  strokeWidth = 10,
  colors = ["white"],
  className = "",
  minInterval = 1000,
  maxInterval = 5000,
}: BackgroundShapesProps) => {
  const borderSize = cellSize * 2;
  const scale = cellSize / 100;
  const colorsKey = colors.join("|");

  const shapes = useMemo<ReactNode[]>(() => {
    const list: ReactNode[] = [];
    for (let x = borderSize; x < width / 2; x += cellSize) {
      for (let y = borderSize; y < height - borderSize; y += cellSize) {
        const id = `${x}-${y}`;
        list.push(
          <Shape
            key={`left-${id}`}
            x={x}
            y={y}
            colors={colors}
            strokeWidth={strokeWidth}
            scale={scale}
            shapeId={`left-${id}`}
            minInterval={minInterval}
            maxInterval={maxInterval}
          />,
          <Shape
            key={`right-${id}`}
            x={width - cellSize - x}
            y={y}
            colors={colors}
            strokeWidth={strokeWidth}
            scale={scale}
            shapeId={`right-${id}`}
            minInterval={minInterval}
            maxInterval={maxInterval}
          />,
        );
      }
    }
    return list;
    // identity array colors bisa berubah tiap render; kunci join yang stabil.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, cellSize, strokeWidth, colorsKey, borderSize, minInterval, maxInterval]);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className}>
      {shapes}
    </svg>
  );
};

/** Latar full-bleed: mengukur wadahnya sendiri (width/height mengikuti
 *  ukuran sebenarnya) supaya cukup dipasang di div absolute inset-0. */
export const BackgroundShapesBleed = ({ className = "", ...rest }: { className?: string } & Omit<BackgroundShapesProps, "width" | "height">) => {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setSize((prev) =>
        Math.abs(prev.width - r.width) < 1 && Math.abs(prev.height - r.height) < 1
          ? prev
          : { width: Math.round(r.width), height: Math.round(r.height) },
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} aria-hidden="true">
      {size.width > 0 ? <BackgroundShapes width={size.width} height={size.height} {...rest} /> : null}
    </div>
  );
};

export default BackgroundShapes;
