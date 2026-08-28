// Script sekali pakai (arsip): import foto asli work-gallery dari folder
// lokal Fajar ke public/work-gallery/, semua diseragamkan rasio 4:5.
// Sumbernya bukan bagian dari repo ini (folder lokal di luar D:\Claude\
// nur-fajar.github.io), jadi script ini tidak reproducible ulang dari
// clone bersih , dibiarkan di sini sebagai catatan cara aset ini dibuat.
import sharp from 'sharp';
import path from 'node:path';

const SRC_DIR = 'D:/Claude/instagram content';
const OUT_DIR = 'public/work-gallery';

// filename di SRC_DIR -> id post (shortcode Instagram, cocok dengan
// WORK_GALLERY di content/ledger.ts)
const MAP = {
  'vidmar 3.jpg': 'DMhq46JPyde',
  'vidmar 2.jpg': 'DM1noFqPfEv',
  'vidmar 1.jpg': 'DNP61IEP4RX',
  'arianto.jpg': 'DRD-EpeDz1i',
  'valencia.jpg': 'DSWQv2CjXRf',
  'silvia.jpg': 'DUIW5jWjemf',
  'elvira.jpg': 'DVXdPvqjSSy',
  'chatbot for edu.jpg': 'DPTH95QjwRe',
  'smojothon.jpg': 'DU5elThD_MQ',
  'adeline.jpg': 'DVvD0r_j9-c',
  'verren.jpg': 'DVvEzTTD1Ch',
  'devara.jpg': 'DVvGJHKDzd7',
  'dirgahayu ri.jpg': 'DNcRMq8Pwfd',
  'sumpah pemuda.jpg': 'DQWDuCFDyWt',
  'pahlawan.jpg': 'DQ4WBrDD-Xy',
  'guru.jpg': 'DReKtaHDwSV',
  'xmas.jpg': 'DSqznhDj1S4',
  'new year.jpg': 'DS8_ummD1kS',
  'isra mikraj.jpg': 'DTj_ziTD_JU',
  'cny.jpg': 'DU2UwiCj7YY',
  'nyepi.jpg': 'DWDP117kgut',
  'idult fitri.jpg': 'DWH7TRREvoP',
  'good friday.jpg': 'DWqLLd9j-NN',
  'easter.jpg': 'DWvG2g_j-1o',
};

for (const [filename, id] of Object.entries(MAP)) {
  const srcPath = path.join(SRC_DIR, filename);
  const outPath = path.join(OUT_DIR, `${id}.jpg`);
  const info = await sharp(srcPath)
    .resize(384, 480, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 88 })
    .toFile(outPath);
  console.log(`${filename} -> ${id}.jpg (${info.width}x${info.height})`);
}
