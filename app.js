/* ── Grey Space: mode toggle, starfield ───────────────────────────────── */
'use strict';

/* ── Mode toggle ──────────────────────────────────────────────────────── */
const root = document.documentElement;
const modeButtons = document.querySelectorAll('[data-set-mode]');

function applyMode(mode) {
  root.dataset.mode = mode;
  try { localStorage.setItem('mode', mode); } catch (e) {}
  modeButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.setMode === mode)));
  skyReadColors();
  if (reducedMotion.matches) skyDraw();
  globeReadColors();
  if (reducedMotion.matches) globeDraw();
}
modeButtons.forEach((b) => b.addEventListener('click', () => applyMode(b.dataset.setMode)));
modeButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.setMode === root.dataset.mode)));

document.getElementById('year').textContent = new Date().getFullYear();

/* ── Starfield & constellations ───────────────────────────────────────── */
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const canvas = document.getElementById('sky');
const ctx = canvas.getContext('2d');

// CONSTELLATIONS (all 88 IAU figures) is loaded from constellations.js

/* ─────────────────────────────────────────────────────────────────────────────
   LANGIT — peta deklinasi setinggi dokumen.

   PEMETAAN
     y  ← Deklinasi. Dec +90° (kutub langit utara) di puncak halaman, −90°
          (kutub selatan) di dasar. Scroll ke bawah = menyusuri langit dari
          utara ke selatan, jadi tiap layar baru membawa rasi yang berbeda.
     x  ← Right Ascension, berputar dalam satu siklus yang lebih lebar dari
          viewport, sehingga hanya sebagian yang terlihat sekaligus dan
          pembungkusannya terjadi di luar layar.

   YANG FAKTUAL
     · Posisi   : dari RA/Dec sungguhan (constellations.js).
     · Bentuk   : proyeksi gnomonik di pusat tiap rasi, jadi figurnya tidak melar.
     · Ukuran   : satu skala px-per-derajat untuk semua figur, jadi Hydra (r 67,6°)
                  memang ~20× Crux (r 3,43°).
     · Gerak    : SATU rotasi rigid untuk seluruh langit, arah sama, laju sama.
                  15°/jam yang dipercepat agar terlihat.

   KOMPROMI YANG DISADARI
     Jarak ANTAR rasi tidak berskala sudut: sumbu y direntangkan ke tinggi
     dokumen dan sumbu x dipadatkan ke lebar layar. Jadi ini peta deklinasi,
     bukan pandangan horizon. Posisi, bentuk, dan ukuran tiap rasi tetap benar —
     yang direntangkan hanya ruang di antaranya.

   KENAPA ABSOLUTE, BUKAN FIXED
     Canvas ini setinggi dokumen dan ber-position absolute, jadi ia ikut lapisan
     yang di-scroll: compositor menggesernya tanpa gambar ulang sama sekali.
     Versi fixed sebelumnya menggambar dari scrollY di dalam rAF dan selalu
     tertinggal satu frame — itu sumber rasa menyeret. Di sini scroll tidak
     pernah menyentuh canvas.
   ────────────────────────────────────────────────────────────────────────── */

let W, docH, skyStars = [], groups = [];
let lst = 0;              // RA yang sedang berada di titik acuan horizontal
let lastT = 0;

const mouse = { x: -1, y: -1 };
const colors = { dust: '#8B8D93', accent: '#54D6DE' };
const rand = (a, b) => a + Math.random() * (b - a);
const docHeight = () => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;

/* ── Dua tombol pengatur rasa ────────────────────────────────────────────────
   FIGURE_SCALE  px per derajat untuk MENGGAMBAR figur. Naikkan → rasi lebih
                 besar dan lebih bertumpuk; turunkan → lebih lega.
   RA_CYCLE_MUL  lebar siklus RA sebagai kelipatan lebar layar. Naikkan → lebih
                 sedikit rasi terlihat sekaligus (lebih lega), karena sebagian
                 sedang berada di luar layar secara horizontal.                */
const FIGURE_SCALE = 6;
const RA_CYCLE_MUL = 1.7;

/** Sisipan atas/bawah supaya rasi di dekat kutub tidak terpotong tepi dokumen. */
const EDGE_PAD = 140;

/** 15°/jam dipercepat 120× ≈ 0,5°/detik. Arah dan rigiditas nyata, laju di-skala.
    (Sebelumnya 40× / 0,167°/detik — itu cuma ~1px/detik gerak horizontal di layar
    biasa, jadi nyaris tak terlihat. Dinaikkan ~3× supaya benar-benar terasa.) */
const DEG_PER_SEC = 0.5;

function skyReadColors() {
  const s = getComputedStyle(root);
  colors.dust = s.getPropertyValue('--text-secondary').trim() || colors.dust;
  colors.accent = s.getPropertyValue('--accent').trim() || colors.accent;
}

function raDelta(ra, ref) {
  let d = ra - ref;
  while (d > 180) d -= 360;
  while (d < -180) d += 360;
  return d;
}

/** Gnomonik: (ra,dec) relatif pusat → offset derajat pada bidang singgung. */
function gnomonic(ra, dec, ra0, dec0) {
  const d = dec * D2R, d0 = dec0 * D2R;
  const dRa = raDelta(ra, ra0) * D2R;
  const sinD = Math.sin(d), cosD = Math.cos(d);
  const sinD0 = Math.sin(d0), cosD0 = Math.cos(d0);
  const cosC = sinD0 * sinD + cosD0 * cosD * Math.cos(dRa);
  if (cosC <= 0.01) return null;
  return [
    (cosD * Math.sin(dRa)) / cosC * R2D,
    (cosD0 * sinD - sinD0 * cosD * Math.cos(dRa)) / cosC * R2D,
  ];
}

/** Dec → y dokumen. +90 di atas, −90 di bawah. */
function decToY(dec) {
  const usable = Math.max(200, docH - EDGE_PAD * 2);
  return EDGE_PAD + ((90 - dec) / 180) * usable;
}

let raCycle = 0;

function skyInit() {
  W = innerWidth;
  docH = docHeight();
  raCycle = W * RA_CYCLE_MUL;

  // Canvas setinggi dokumen, jadi dpr perlu dibatasi lewat anggaran piksel —
  // di sini biayanya nyata, tidak seperti versi viewport.
  const budget = 14e6;
  const dpr = Math.min(devicePixelRatio || 1, Math.max(1, Math.sqrt(budget / (W * docH))));
  canvas.style.height = docH + 'px';
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(docH * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // Bintang latar ini PENGISI DEKORATIF, bukan katalog bintang sungguhan —
  // berbeda dari figur rasi di bawah, yang koordinatnya nyata. Karena itu Dec-nya
  // diacak MERATA, bukan lewat asin(uniform).
  //
  // asin(uniform) memberi sebaran merata di permukaan sfera, dan itu benar secara
  // geometri — tapi peta ini linear terhadap Dec, sehingga hasilnya menumpuk di
  // ekuator: terukur 70 bintang di sepersepuluh tengah halaman melawan 3 di
  // puncak. Area hero jadi kosong. Untuk pengisi, merata di HALAMAN yang benar.
  skyStars = Array.from({ length: Math.min(420, Math.max(160, Math.round(docH / 22))) }, () => ({
    ra: rand(0, 360),
    dec: rand(-90, 90),
    r: rand(0.4, 1.3),
  }));

  // Offset figur dihitung SEKALI: gnomonik terhadap pusat sendiri tidak
  // bergantung pada waktu maupun scroll, jadi loop gambar bebas trigonometri.
  groups = CONSTELLATIONS.map((c) => {
    const ra0 = c.c[0], dec0 = c.c[1];
    const segs = c.l.map((line) => line.map(([ra, dec]) => {
      const p = gnomonic(ra, dec, ra0, dec0);
      return p ? [p[0] * FIGURE_SCALE, -p[1] * FIGURE_SCALE] : null;
    }));
    return {
      name: c.n,
      ra: ra0,
      y: decToY(dec0),
      rPx: c.r * FIGURE_SCALE,
      segs,
      la: 0,
      sx: 0,
    };
  });
}

function distToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const len2 = dx * dx + dy * dy;
  let t = len2 ? ((px - ax) * dx + (py - ay) * dy) / len2 : 0;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

/** RA → x, dibungkus dalam siklus yang lebih lebar dari layar. */
function raToX(ra) {
  let f = ((ra - lst) % 360 + 360) % 360 / 360;   // 0..1
  return f * raCycle - (raCycle - W) / 2;
}

function skyDraw(dt) {
  if (dt) lst = (lst + DEG_PER_SEC * dt) % 360;

  ctx.clearRect(0, 0, W, docH);

  // A. bintang latar — penghuni langit yang sama, ikut berputar rigid
  ctx.globalAlpha = 0.36;
  ctx.fillStyle = colors.dust;
  for (const s of skyStars) {
    const x = raToX(s.ra);
    if (x < -3 || x > W + 3) continue;
    const y = decToY(s.dec);
    ctx.beginPath();
    ctx.arc(x, y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // B. rasi
  const HOVER_PX = 14;
  let hovered = null, bestDist = HOVER_PX;
  const live = [];

  for (const g of groups) {
    g.sx = raToX(g.ra);
    if (g.sx + g.rPx < -20 || g.sx - g.rPx > W + 20) { g.la = 0; continue; }
    live.push(g);
    if (mouse.x >= 0 && Math.abs(mouse.y - g.y) < g.rPx + 40) {
      for (const pts of g.segs) {
        for (let i = 0; i < pts.length - 1; i++) {
          const a = pts[i], b = pts[i + 1];
          if (!a || !b) continue;
          const d = distToSegment(mouse.x, mouse.y,
            g.sx + a[0], g.y + a[1], g.sx + b[0], g.y + b[1]);
          if (d < bestDist) { bestDist = d; hovered = g; }
        }
      }
    }
  }

  for (const g of live) {
    ctx.globalAlpha = 0.1;
    ctx.strokeStyle = colors.accent;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (const pts of g.segs) {
      let started = false;
      for (const p of pts) {
        if (!p) { started = false; continue; }
        if (!started) { ctx.moveTo(g.sx + p[0], g.y + p[1]); started = true; }
        else ctx.lineTo(g.sx + p[0], g.y + p[1]);
      }
    }
    ctx.stroke();

    ctx.globalAlpha = 0.5;
    ctx.fillStyle = colors.accent;
    for (const pts of g.segs) {
      for (const p of pts) {
        if (!p) continue;
        ctx.beginPath();
        ctx.arc(g.sx + p[0], g.y + p[1], 1.7, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    g.la += ((g === hovered ? 1 : 0) - g.la) * 0.12;
    if (g.la > 0.01) {
      ctx.globalAlpha = 0.45 * g.la;
      ctx.fillStyle = colors.accent;
      ctx.font = '11px "IBM Plex Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(g.name.toUpperCase(), g.sx, g.y + g.rPx + 15);
    }
  }

  ctx.globalAlpha = 1;
}

function skyLoop(t) {
  const dt = lastT ? Math.min(0.05, (t - lastT) / 1000) : 0;
  lastT = t;
  skyDraw(dt);
  if (!reducedMotion.matches) requestAnimationFrame(skyLoop);
}

skyReadColors();
skyInit();
// Lewat rAF supaya frame pertama sudah membawa timestamp — kalau dipanggil
// langsung, dt frame pertama terbuang.
if (reducedMotion.matches) skyDraw(); else requestAnimationFrame(skyLoop);

// TIDAK ADA listener scroll di sini, dan itu disengaja. Canvas absolute ikut
// digeser compositor bersama halaman, jadi scroll tidak perlu — dan tidak boleh —
// memicu gambar ulang. Di situlah lag versi fixed dulu muncul.

const reinit = () => { skyInit(); if (reducedMotion.matches) skyDraw(); };

let resizeTimer;
addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(reinit, 150);
});
addEventListener('load', reinit);

// Tinggi dokumen berubah saat <details> dibuka/ditutup. Kalau canvas tidak
// ikut menyesuaikan, bagian bawah halaman kehabisan langit dan pemetaan Dec
// jadi meleset.
if ('ResizeObserver' in window) {
  let obsTimer, lastH = 0;
  new ResizeObserver(() => {
    const h = docHeight();
    if (Math.abs(h - lastH) < 40) return;
    lastH = h;
    clearTimeout(obsTimer);
    obsTimer = setTimeout(reinit, 120);
  }).observe(document.body);
}

addEventListener('mousemove', (e) => {
  // pageX/pageY: canvas kembali hidup di ruang DOKUMEN, jadi koordinat
  // dokumenlah yang benar di sini.
  mouse.x = e.pageX; mouse.y = e.pageY;
  if (reducedMotion.matches) skyDraw();
});
addEventListener('mouseleave', () => { mouse.x = -1; mouse.y = -1; });
reducedMotion.addEventListener('change', () => {
  if (!reducedMotion.matches) { lastT = 0; requestAnimationFrame(skyLoop); }
  else skyDraw();
});

/* ── Hero globe: draggable wireframe sphere ───────────────────────────── */
const globeCanvas = document.getElementById('globe');
const gctx = globeCanvas.getContext('2d');
const globeColors = { line: '#34363B', accent: '#54D6DE', text: '#8B8D93' };
let gW = 0, gH = 0;

function globeReadColors() {
  const s = getComputedStyle(root);
  globeColors.line = s.getPropertyValue('--line').trim() || globeColors.line;
  globeColors.accent = s.getPropertyValue('--accent').trim() || globeColors.accent;
  globeColors.text = s.getPropertyValue('--text-secondary').trim() || globeColors.text;
}

// wireframe geometry on a unit sphere: latitude rings + longitude arcs
const GLOBE_PARALLELS = [-60, -30, 0, 30, 60].map((lat) => {
  const phi = lat * Math.PI / 180, pts = [];
  for (let i = 0; i <= 40; i++) {
    const th = (i / 40) * Math.PI * 2;
    pts.push([Math.cos(phi) * Math.cos(th), Math.sin(phi), Math.cos(phi) * Math.sin(th)]);
  }
  return { pts, isEquator: lat === 0 };
});
const GLOBE_MERIDIANS = [0, 30, 60, 90, 120, 150].map((lon) => {
  const lam = lon * Math.PI / 180, pts = [];
  for (let i = 0; i <= 40; i++) {
    const phi = (i / 40) * Math.PI - Math.PI / 2;
    pts.push([Math.cos(phi) * Math.cos(lam), Math.sin(phi), Math.cos(phi) * Math.sin(lam)]);
  }
  return { pts, isEquator: false };
});
const GLOBE_BLIPS = [
  { lat: 35, lon: 40, label: 'L&D' },
  { lat: -10, lon: -100, label: 'GENAI' },
  { lat: -30, lon: 150, label: 'AUTOMATION' },
  { lat: -55, lon: -40, label: 'ML' },
].map((b) => {
  const phi = b.lat * Math.PI / 180, lam = b.lon * Math.PI / 180;
  return { p: [Math.cos(phi) * Math.cos(lam), Math.sin(phi), Math.cos(phi) * Math.sin(lam)], label: b.label };
});

let gYaw = 0.5, gPitch = -0.3, gDragging = false, gLastX = 0, gLastY = 0;

function globeRotate([x, y, z]) {
  const cx = x * Math.cos(gYaw) + z * Math.sin(gYaw);
  const cz = -x * Math.sin(gYaw) + z * Math.cos(gYaw);
  const cy = y * Math.cos(gPitch) - cz * Math.sin(gPitch);
  const cz2 = y * Math.sin(gPitch) + cz * Math.cos(gPitch);
  return [cx, cy, cz2];
}

function globeResize() {
  const rect = globeCanvas.getBoundingClientRect();
  const dpr = devicePixelRatio || 1;
  gW = rect.width; gH = rect.height;
  globeCanvas.width = gW * dpr; globeCanvas.height = gH * dpr;
  gctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function globeDraw() {
  if (!gW || !gH) return;
  gctx.clearRect(0, 0, gW, gH);
  const cx = gW / 2, cy = gH / 2, R = Math.min(gW, gH) / 2 * 0.86;

  function project(p) {
    const [x, y, z] = globeRotate(p);
    return { x: cx + x * R, y: cy - y * R, z };
  }

  gctx.lineWidth = 1;
  function strokeRing(pts, isEquator) {
    for (let i = 0; i < pts.length - 1; i++) {
      const a = project(pts[i]), b = project(pts[i + 1]);
      const front = (a.z + b.z) / 2 >= 0;
      gctx.globalAlpha = isEquator ? (front ? 0.7 : 0.22) : (front ? 0.5 : 0.14);
      gctx.strokeStyle = isEquator ? globeColors.accent : globeColors.line;
      gctx.beginPath();
      gctx.moveTo(a.x, a.y);
      gctx.lineTo(b.x, b.y);
      gctx.stroke();
    }
  }
  GLOBE_PARALLELS.forEach((r) => strokeRing(r.pts, r.isEquator));
  GLOBE_MERIDIANS.forEach((r) => strokeRing(r.pts, r.isEquator));

  gctx.globalAlpha = 0.55;
  gctx.strokeStyle = globeColors.line;
  gctx.beginPath();
  gctx.arc(cx, cy, R, 0, Math.PI * 2);
  gctx.stroke();

  gctx.font = '9px "IBM Plex Mono", monospace';
  GLOBE_BLIPS.forEach((b) => {
    const p = project(b.p);
    if (p.z < -0.1) return; // hide once it's well around the back
    gctx.globalAlpha = Math.max(0.35, Math.min(1, p.z + 0.6));
    gctx.fillStyle = globeColors.accent;
    gctx.beginPath();
    gctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    gctx.fill();
    gctx.fillStyle = globeColors.text;
    gctx.textAlign = p.x > cx ? 'left' : 'right';
    gctx.fillText(b.label, p.x + (p.x > cx ? 8 : -8), p.y + 3);
  });
  gctx.globalAlpha = 1;
}

function globeLoop() {
  if (!gDragging && !reducedMotion.matches) gYaw += 0.0018;
  globeDraw();
  requestAnimationFrame(globeLoop);
}

globeCanvas.addEventListener('pointerdown', (e) => {
  gDragging = true; gLastX = e.clientX; gLastY = e.clientY;
  globeCanvas.setPointerCapture(e.pointerId);
});
globeCanvas.addEventListener('pointermove', (e) => {
  if (!gDragging) return;
  gYaw += (e.clientX - gLastX) * 0.006;
  gPitch = Math.max(-1.3, Math.min(1.3, gPitch + (e.clientY - gLastY) * 0.006));
  gLastX = e.clientX; gLastY = e.clientY;
  if (reducedMotion.matches) globeDraw();
});
addEventListener('pointerup', () => { gDragging = false; });

globeReadColors();
globeResize();
new ResizeObserver(globeResize).observe(globeCanvas);
if (reducedMotion.matches) globeDraw(); else globeLoop();

/* ── Scroll-to-top rocket ──────────────────────────────────────────────── */
const rocketBtn = document.getElementById('rocket-btn');
const ROCKET_SHOW_AT = 420;

function updateRocketVisibility() {
  rocketBtn.classList.toggle('visible', scrollY > ROCKET_SHOW_AT);
}
addEventListener('scroll', updateRocketVisibility, { passive: true });
updateRocketVisibility();

rocketBtn.addEventListener('click', () => {
  rocketBtn.classList.add('launching');
  scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
  setTimeout(() => rocketBtn.classList.remove('launching'), 750);
});
