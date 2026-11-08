// Katalog 48 mockup — nomor, berkas, judul, family, deskripsi, dan swatch warna.
export type Fam = 'Style' | 'Awwwards' | 'Company';

export interface Entry {
  no: string;
  file: string;
  title: string;
  fam: Fam;
  desc: string;
  bg: string;
  ink: string;
  accent: string;
}

export const FAMS: Fam[] = ['Style', 'Awwwards', 'Company'];

export const CATALOG: Entry[] = [
  { no: '01', file: '01-swiss.html', title: 'Swiss / Editorial Clean', fam: 'Style', desc: 'Putih, hairline, satu aksen merah, grotesk tebal — presisi tanpa hiasan.', bg: '#ffffff', ink: '#111111', accent: '#d43a18' },
  { no: '02', file: '02-neobrutal.html', title: 'Neo-Brutalism', fam: 'Style', desc: 'Border hitam tebal, hard shadow, kuning-pink primer. Hover lompat patah-patah.', bg: '#ffde00', ink: '#111111', accent: '#ff90e8' },
  { no: '03', file: '03-brutalism.html', title: 'Brutalism asli', fam: 'Style', desc: 'Style browser default, sengaja. Times New Roman, link biru, tabel, hit counter.', bg: '#ffffff', ink: '#000000', accent: '#0000ee' },
  { no: '04', file: '04-pixel.html', title: 'Pixel / 8-bit', fam: 'Style', desc: 'Font piksel, palette terbatas, scanline CRT, hard drop shadow.', bg: '#1a1c2c', ink: '#94b0c2', accent: '#ffcd75' },
  { no: '05', file: 'terminal.html', title: 'Terminal / Developer-core', fam: 'Style', desc: 'Flagship: boot sequence diketik, output di-type saat scroll. Sinyal "engineer beneran".', bg: '#0c0c0c', ink: '#e6edf3', accent: '#4ade80' },
  { no: '06', file: '06-glass.html', title: 'Glassmorphism / Aurora', fam: 'Style', desc: 'Gradien aurora, kaca buram, pill button — slop indicator #1, untuk perbandingan.', bg: '#0a0a18', ink: '#ffffff', accent: '#6d5cff' },
  { no: '07', file: '07-y2k.html', title: 'Y2K Cyber Chrome', fam: 'Style', desc: 'Teks krom metalik, grid perspektif, lens flare. Nostalgia 2000-an.', bg: '#060a20', ink: '#dfe6ff', accent: '#5a78e8' },
  { no: '08', file: '08-atlas.html', title: 'Celestial Atlas', fam: 'Style', desc: 'Arah v8 — kertas malam, rasi digambar GSAP, tick marks. Versi penuh ada di /v8.', bg: '#171610', ink: '#f0ede3', accent: '#e24e1b' },
  { no: '09', file: '09-maximal.html', title: 'Maximalism / Anti-design', fam: 'Style', desc: 'Rotasi, tumpang tindih, stiker, font bentrok. Energi muda yang kacau-terukur.', bg: '#ff5c00', ink: '#111111', accent: '#b8f52a' },
  { no: '10', file: '10-bento.html', title: 'Bento Grid', fam: 'Style', desc: 'Kotak modular ukuran beda, tiap sel satu fakta, hover micro-scale. Slopy bila generik.', bg: '#f5f5f7', ink: '#1d1d1f', accent: '#0071e3' },
  { no: '11', file: '11-blueprint.html', title: 'Blueprint / Technical Drawing', fam: 'Style', desc: 'Kertas biru arsitek: grid koordinat, garis ukur, title block resmi.', bg: '#103a7d', ink: '#ffffff', accent: '#9be7ff' },
  { no: '12', file: '12-riso.html', title: 'Risograph / Zine', fam: 'Style', desc: 'Dua tinta overprint, misregistration sengaja, halftone, tape. Hangat dan handmade.', bg: '#f7f2e8', ink: '#1e1b4f', accent: '#ff4b4b' },
  { no: '13', file: '13-academia.html', title: 'Dark Academia', fam: 'Style', desc: 'Coklat tua, krem, emas redup, serif klasik dengan italic. Perpustakaan tua.', bg: '#191410', ink: '#efe3c8', accent: '#c9a227' },
  { no: '14', file: '14-retroos.html', title: 'Retro OS — Windows 95', fam: 'Style', desc: 'Jendela bevel, title bar navy, taskbar. Parodi sistem operasi yang rapi.', bg: '#008080', ink: '#000000', accent: '#000080' },
  { no: '15', file: '15-zen.html', title: 'Zen Minimal / Jepang', fam: 'Style', desc: 'Ruang kosong sangat besar, satu enso, teks vertikal. Konfidensi lewat keheningan.', bg: '#faf9f4', ink: '#22211d', accent: '#b23a12' },
  { no: '16', file: '16-kinetic.html', title: 'Kinetic Typography', fam: 'Style', desc: 'Teks raksasa solid/outline, satu kata merah bergeser. Tipe sebagai seluruh desain.', bg: '#ffffff', ink: '#111111', accent: '#e63200' },
  { no: '17', file: '17-industrial.html', title: 'Industrial / Military Terminal', fam: 'Style', desc: 'Panel logam, sekrup, garis hazard, stencil, barcode. Tegas dan mekanis.', bg: '#26251f', ink: '#d8d5c8', accent: '#e8c81e' },
  { no: '18', file: '18-clay.html', title: 'Claymorphism', fam: 'Style', desc: 'Bentuk tanah liat mengembang: radius besar, double shadow manis, pastel.', bg: '#e8ebff', ink: '#3d3a6b', accent: '#8f7bff' },
  { no: '19', file: '19-vaporwave.html', title: 'Vaporwave / Synthwave', fam: 'Style', desc: 'Matahari terbenam bergaris, grid neon perspektif, katakana, glow pink-cyan.', bg: '#1a0b3d', ink: '#ffffff', accent: '#ff71ce' },
  { no: '20', file: '20-luxury.html', title: 'Dark Luxury', fam: 'Style', desc: 'Hitam pekat, emas tipis, serif italic, corner ornaments. Sunyi dan mahal.', bg: '#0a0a0a', ink: '#f0ece2', accent: '#c8a45d' },
  { no: '21', file: 'velocity.html', title: 'Velocity Grotesque', fam: 'Awwwards', desc: 'Flagship: tipe condong reaktif kecepatan scroll, parallax dua arah, marquee. Bahasa Studio Freight.', bg: '#ff4d00', ink: '#111111', accent: '#f2f2f2' },
  { no: '22', file: '22-brokengrid.html', title: 'Broken Grid / Swiss-Punk', fam: 'Awwwards', desc: 'Grid dipecah, tipe miring tumpang tindih, serif × grotesk × mono, grain film. Bahasa Obys.', bg: '#e8e4dc', ink: '#141414', accent: '#d43a18' },
  { no: '23', file: '23-horizontal.html', title: 'Horizontal Scroll Gallery', fam: 'Awwwards', desc: 'Galeri menyamping dengan scroll-snap — pola Locomotive. Scroll ke samping.', bg: '#111111', ink: '#f0f0f0', accent: '#ff4d00' },
  { no: '24', file: 'varfont.html', title: 'Variable Font Playground', fam: 'Awwwards', desc: 'Flagship: wght/wdth mengikuti kursor dengan lerp + HUD, di-scrub scroll per bagian.', bg: '#101014', ink: '#f2f2f2', accent: '#ff4d00' },
  { no: '25', file: 'scrollytelling.html', title: 'Scrollytelling Pinned', fam: 'Awwwards', desc: 'Flagship: kisah CRM 5 bab terpaku — meter 300+h → ~11h mengalir, judul berganti.', bg: '#0e1512', ink: '#e8efe8', accent: '#7fd49a' },
  { no: '26', file: '26-contour.html', title: 'Topographic Contour', fam: 'Awwwards', desc: 'Garis kontur peta topografi digambar saat masuk — saudara daratan dari atlas.', bg: '#f4f2ec', ink: '#25301f', accent: '#4c5a35' },
  { no: '27', file: '27-ascii.html', title: 'ASCII / Generative Canvas', fam: 'Awwwards', desc: 'Medan karakter ASCII berdenyut 60fps di canvas. Kode sebagai tekstur hidup.', bg: '#050805', ink: '#b8ffb8', accent: '#7be07b' },
  { no: '28', file: '28-brutlux.html', title: 'Brutal Luxury (Balenciaga)', fam: 'Awwwards', desc: 'Helvetica polos, tanpa warna, tanpa shadow. Keberanian lewat pengurangan total.', bg: '#ffffff', ink: '#000000', accent: '#000000' },
  { no: '29', file: '29-apple.html', title: 'Apple', fam: 'Company', desc: 'Putih, tipe produk raksasa, abu, biru link. Dunia v7 sebagai perbandingan.', bg: '#ffffff', ink: '#1d1d1f', accent: '#0071e3' },
  { no: '30', file: '30-google.html', title: 'Google', fam: 'Company', desc: 'Roboto, empat warna brand, pill pencarian, kartu bersih. Universal dan datar.', bg: '#ffffff', ink: '#202124', accent: '#4285f4' },
  { no: '31', file: '31-stripe.html', title: 'Stripe', fam: 'Company', desc: 'Gradien anguler khas di kanan atas, navy, tombol pill. SaaS paling ditiru.', bg: '#ffffff', ink: '#0a2540', accent: '#635bff' },
  { no: '32', file: 'linear.html', title: 'Linear', fam: 'Company', desc: 'Flagship: hitam pekat, glow ungu mengikuti kursor, kartu gradient-border.', bg: '#08090a', ink: '#f7f8f8', accent: '#5e6ad2' },
  { no: '33', file: 'vercel.html', title: 'Vercel', fam: 'Company', desc: 'Hitam-putih absolut, segitiga, mono detail. Nol dekorasi — geometri saja.', bg: '#000000', ink: '#ffffff', accent: '#ffffff' },
  { no: '34', file: '34-notion.html', title: 'Notion', fam: 'Company', desc: 'Halaman dokumen dengan ikon emoji, callout abu, link bergaris bawah. Hangat.', bg: '#ffffff', ink: '#191918', accent: '#191918' },
  { no: '35', file: '35-figma.html', title: 'Figma', fam: 'Company', desc: 'Chip lima warna brand, heading tebal, kartu lembut. Playful-presisi.', bg: '#ffffff', ink: '#1e1e1e', accent: '#a259ff' },
  { no: '36', file: '36-github.html', title: 'GitHub', fam: 'Company', desc: 'Dark code UI: repo card, commit message dengan syntax warna. Bahasa developer.', bg: '#0d1117', ink: '#e6edf3', accent: '#2f81f7' },
  { no: '37', file: '37-openai.html', title: 'OpenAI', fam: 'Company', desc: 'Putih minimal, geometri bersih, satu prompt bar di tengah. Tenang tanpa warna.', bg: '#ffffff', ink: '#0d0d0d', accent: '#0d0d0d' },
  { no: '38', file: 'anthropic.html', title: 'Anthropic / Claude', fam: 'Company', desc: 'Flagship: gading hangat, serif italic, coral #d97757. Brand AI yang sedang naik.', bg: '#faf9f5', ink: '#191919', accent: '#d97757' },
  { no: '39', file: '39-spotify.html', title: 'Spotify', fam: 'Company', desc: 'Hitam + hijau #1db954, heading extra-bold, pill tebal. Loud dan percaya diri.', bg: '#000000', ink: '#ffffff', accent: '#1db954' },
  { no: '40', file: '40-airbnb.html', title: 'Airbnb', fam: 'Company', desc: 'Rausch merah muda, kartu membulat dengan foto-gradien, search pill.', bg: '#ffffff', ink: '#222222', accent: '#ff385c' },
  { no: '41', file: '41-slack.html', title: 'Slack', fam: 'Company', desc: 'Channel list, aubergine + empat warna, kartu putih membulat. Kolaborasi.', bg: '#ffffff', ink: '#1d1c1d', accent: '#611f69' },
  { no: '42', file: '42-discord.html', title: 'Discord', fam: 'Company', desc: 'Blurple penuh, heading chunky, pill putih. Berani dan muda.', bg: '#5865f2', ink: '#ffffff', accent: '#ffffff' },
  { no: '43', file: '43-framer.html', title: 'Framer', fam: 'Company', desc: 'Hitam, gradient-border card biru→pink, heading center. Sleek no-code era.', bg: '#000000', ink: '#ffffff', accent: '#0099ff' },
  { no: '44', file: '44-raycast.html', title: 'Raycast', fam: 'Company', desc: 'Hitam + glow merah-oranye, command bar ⌘K sebagai bintang. Interaksi dulu.', bg: '#0d0d0d', ink: '#ededed', accent: '#ff6348' },
  { no: '45', file: '45-supabase.html', title: 'Supabase', fam: 'Company', desc: 'Hitam + hijau #3ecf8e + amber, blok kode, mono. Dev-first yang lugas.', bg: '#121212', ink: '#ededed', accent: '#3ecf8e' },
  { no: '46', file: '46-tailwind.html', title: 'Tailwind CSS', fam: 'Company', desc: 'Slate gelap, teks gradient sky-cyan, blok kode rounded. Estetika framework.', bg: '#0f172a', ink: '#e2e8f0', accent: '#38bdf8' },
  { no: '47', file: '47-arc.html', title: 'Arc — The Browser Company', fam: 'Company', desc: 'Gradien pastel hangat, sidebar tab membulat, heading extra-bold. Ceria.', bg: '#f7f3ee', ink: '#1a1a2e', accent: '#1a1a2e' },
  { no: '48', file: '48-spacex.html', title: 'SpaceX / Tesla', fam: 'Company', desc: 'Hitam penuh, uppercase tracking lebar, dua tombol ghost. Sinematik dan dingin.', bg: '#000000', ink: '#ffffff', accent: '#ffffff' },
];
