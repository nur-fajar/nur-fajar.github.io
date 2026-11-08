/**
 * Capture halaman statis (out/) jadi PNG full-page untuk review impeccable.
 * Pakai: node scripts/capture.mjs <url-path> <outfile> <width> [height] [--open]
 * Height opsional: tanpa itu full-page. Port server: 4173 (scripts/serve-v7.mjs).
 * `--open` membuka semua <details> sebelum capture, untuk memeriksa isi panel.
 * `--nojs` mematikan JavaScript, untuk memeriksa halaman tanpa JS.
 * `--reduced` mengemulasikan prefers-reduced-motion: reduce.
 * `--selector <css>` memotret satu elemen saja (buat review per section).
 *
 * PENTING untuk dev server: pakai `http://localhost:3000/...`, BUKAN
 * `127.0.0.1:3000`. Dev server Next menolak request lintas-origin dengan
 * 403, dan browser mengirim header `Origin` untuk skrip. Akibatnya chunk JS
 * tidak pernah termuat, tidak ada hidrasi, dan halaman tampak "mati"
 * (canvas shader tetap 300x150, animasi tidak jalan). Static server
 * (port 4173) tidak punya cek itu, jadi 127.0.0.1 aman di sana.
 */
import puppeteer from 'puppeteer-core';

const raw = process.argv.slice(2);
const openAll = raw.includes('--open');
const noJs = raw.includes('--nojs');
const reduced = raw.includes('--reduced');
const selectorIndex = raw.indexOf('--selector');
const selector = selectorIndex >= 0 ? raw[selectorIndex + 1] : null;
// Posisional: semua yang bukan flag, DAN bukan nilai milik flag.
const args = raw.filter(
  (a, i) => !a.startsWith('--') && !(selectorIndex >= 0 && i === selectorIndex + 1),
);
const [path = '/v7', out = '.impeccable/review/desktop.png', widthArg = '1440', heightArg] = args;
const width = Number(widthArg);
const height = heightArg ? Number(heightArg) : null;

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--hide-scrollbars', '--force-device-scale-factor=1'],
});
try {
  const page = await browser.newPage();
  await page.setJavaScriptEnabled(!noJs);
  if (reduced) {
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  }
  await page.setViewport({ width, height: height ?? 900 });
  const url = path.startsWith('http') ? path : `http://127.0.0.1:4173${path}`;
  await page.goto(url, { waitUntil: 'networkidle0' });
  if (!noJs) {
    await page.evaluate(async (openAll) => {
      await document.fonts.ready;
      // Buang entrance motion + matikan smooth scroll: semua konten harus
      // terlihat dan berada di posisi semestinya saat capture.
      document.documentElement.style.scrollBehavior = 'auto';
      if (openAll) document.querySelectorAll('details').forEach((d) => d.setAttribute('open', ''));
      // Gulir BERTAHAP. Lompatan sekali ke bawah bisa melewati trigger
      // ScrollTrigger dan whileInView, sehingga elemen yang seharusnya
      // muncul tetap di state tersembunyi saat full-page capture.
      const step = Math.max(300, Math.round(window.innerHeight * 0.6));
      const total = document.body.scrollHeight;
      for (let y = 0; y <= total; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 90));
      }
      window.scrollTo(0, total);
      await new Promise((r) => setTimeout(r, 500));
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 400));
    }, openAll);
  }
  if (selector) {
    const element = await page.$(selector);
    if (!element) throw new Error(`selector ${selector} tidak ditemukan`);
    await element.screenshot({ path: out });
    console.log(`saved ${out} (${selector})`);
  } else {
    await page.screenshot({ path: out, fullPage: height == null });
    console.log(`saved ${out} (${width}${height ? `x${height}` : ' full'}${noJs ? ', no-js' : ''}${reduced ? ', reduced' : ''})`);
  }
} finally {
  await browser.close();
}
