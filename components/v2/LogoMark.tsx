/* Logo pihak ketiga — file asli dari brand kit / asset resmi masing-masing
   (lihat catatan di content/v2Path.ts), tidak digambar ulang.

   Treatment: ukuran kecil dan tinggi seragam supaya terbaca sebagai
   atribusi, bukan co-branding. Logo berwarna diletakkan di atas "plate"
   terang kecil dan di-grayscale mengikuti palette; logo mono (Claude,
   OpenAI, Gemini — single path hitam) di-invert saat dark mode karena
   grayscale saja bikin hilang di background gelap. Warna asli balik saat
   hover/fokus. Pakai <img> biasa, bukan next/image: optimizer Next menolak
   SVG kecuali `dangerouslyAllowSVG` dinyalakan, dan tidak ada yang perlu
   dioptimasi dari asset sekecil ini. */

import type { PathLogo } from '@/content/v2Path';
import { MONO_LOGOS } from '@/content/v2Path';

export default function LogoMark({ logo, height = 18 }: { logo: PathLogo; height?: number }) {
  const width = Math.round((logo.w / logo.h) * height);
  return (
    <span className={`v2-logo${MONO_LOGOS.has(logo.src) ? ' v2-logo--mono' : ''}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo.src} alt={logo.alt} width={width} height={height} loading="lazy" decoding="async" />
    </span>
  );
}
