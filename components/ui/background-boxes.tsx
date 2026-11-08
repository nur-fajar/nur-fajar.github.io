"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Boxes - latar sel-sel miring ala komponen "background-boxes"
 * (Aceternity/21st.dev), edisi light 2026-11-08 untuk homepage ini.
 *
 * Bedanya dengan aslinya (karena aslinya lahir di latar slate-900 gelap):
 *   - garis sel pakai slate-200 (terang), ikon plus pakai slate-300;
 *   - hover tetap mewarnai sel dengan panifikasi pastel-300, yang di
 *     kertas putih terbaca sebagai cipratan warna halus;
 *   - jumlah sel dipangkas dari 150x100 (15.000 div, terlalu berat untuk
 *     SSR) menjadi 90x90: sel 80x40px pada scale 0.9 membuat temboknya
 *     7.200x3.600px (efektif 3.240x1.620px), cukup sampai viewport
 *     2560x1440. Yang mengharuskan tembok sebesar itu adalah dua geseran
 *     skew: skewX(-48deg) memindahkan sel horizontal 1,111 x setengah
 *     tinggi tembok (1.800px), dan skewY(14deg) memindahkannya vertikal
 *     0,249 x setengah lebar (806px) - sudut-sudut layar di luar
 *     lempeng geseran itu yang tadinya tampak putih polos.
 *
 * Sel-selnya tidak membawa acak saat render: warna hover ditugaskan
 * deterministik ke tiap sel (aslinya memilih Math.random() saat render,
 * dan itu ditolak eslint react-hooks/purity). Hover tetap bidang yang
 * menyalakan warna, jadi efeknya sama.
 */
export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  const rows = new Array(90).fill(1);
  const cols = new Array(90).fill(1);

  const colors = [
    "rgb(125 211 252)", // sky-300
    "rgb(249 168 212)", // pink-300
    "rgb(134 239 172)", // green-300
    "rgb(253 224 71)", // yellow-300
    "rgb(252 165 165)", // red-300
    "rgb(216 180 254)", // purple-300
    "rgb(147 197 253)", // blue-300
    "rgb(165 180 252)", // indigo-300
    "rgb(196 181 253)", // violet-300
  ];

  const cellColor = (i: number, j: number) =>
    colors[(i * 5 + j * 7) % colors.length];

  return (
    <div
      style={{
        // Geometry miring aslinya (skew/scale), tembok ditempatkan di
        // tengah section. Temboknya 90x90 sel x 80x40px = 7.200x3.600px
        // sebelum transform (efektif +/-3.240 x +/-1.620px setelah scale
        // 0.9) - cukup menutup sudut-sudut hasil geseran skew (1.680px x,
        // 806px y) sampai viewport 2560x1440, tanpa zona putih polos.
        transform: `skewX(-48deg) skewY(14deg) scale(0.9) rotate(0deg) translateZ(0)`,
      }}
      className={cn(
        // Kotaknya HARUS segaris ukuran tembok (w-max + tinggi kolomikal):
        // kalau pakai w-full h-full, isi tembok yang melimpah keluar kotak
        // itu berakar di tepina kotak - transformasi skew/scale lalu
        // berputar sekitar titik yang salah dan jalannya segitiga putih di
        // pojok. Dengan ukuran sendiri (90 sel x 80px = 7.200px lebar,
        // 90 sel x 40px = 3.600px tinggi), origin transformasi tepat di
        // tengah tembok dan math coverage-nya (efektif +/-3.240 x 1.620px
        // setelah scale 0.9) berdiri di tempatnya.
        "absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 w-max h-[3600px] z-0",
        className
      )}
      {...rest}
    >
      {rows.map((_, i) => (
        <motion.div key={`row` + i} className="w-20 h-10 border-l border-slate-200 relative">
          {cols.map((_, j) => (
            <motion.div
              whileHover={{
                backgroundColor: cellColor(i, j),
                transition: { duration: 0 },
              }}
              animate={{
                transition: { duration: 2 },
              }}
              key={`col` + j}
              className="w-20 h-10 border-r border-t border-slate-200 relative"
            >
              {j % 2 === 0 && i % 2 === 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="absolute h-6 w-10 -top-[18px] -left-[30px] text-slate-300/70 stroke-[1px] pointer-events-none"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                </svg>
              ) : null}
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export const Boxes = React.memo(BoxesCore);
