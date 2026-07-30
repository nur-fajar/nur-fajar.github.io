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

let W, H, dust = [], groups = [];
const mouse = { x: -1, y: -1 };
const colors = { dust: '#8B8D93', accent: '#54D6DE' };
const rand = (a, b) => a + Math.random() * (b - a);
const docHeight = () => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);

function skyReadColors() {
  const s = getComputedStyle(root);
  colors.dust = s.getPropertyValue('--text-secondary').trim() || colors.dust;
  colors.accent = s.getPropertyValue('--accent').trim() || colors.accent;
}

function skyInit() {
  // canvas covers the whole scrollable page, not just one viewport —
  // gives 88 constellations room to breathe instead of stacking on screen 1
  W = innerWidth; H = docHeight();
  const dpr = devicePixelRatio || 1;
  canvas.style.height = H + 'px';
  canvas.width = W * dpr; canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const n = Math.min(220, Math.max(80, Math.round((W * H) / 9000)));
  dust = Array.from({ length: n }, () => ({
    x: rand(0, W), y: rand(0, H),
    r: rand(0.4, 1.4),
    vx: rand(-0.06, 0.06), vy: rand(-0.06, 0.06),
  }));

  groups = CONSTELLATIONS.map((c) => {
    const w = W * rand(0.035, 0.07);
    return {
      name: c.n, stars: c.s, edges: c.e,
      w, h: w * Math.min(c.a, 2.5),
      x: rand(0, W), y: rand(0, H),
      vx: rand(-0.025, 0.025), vy: rand(-0.018, 0.018),
      la: 0, // label alpha, eased toward hover state
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

function skyDraw() {
  ctx.clearRect(0, 0, W, H);

  // A. ambient dust
  ctx.globalAlpha = 0.4;
  ctx.fillStyle = colors.dust;
  for (const d of dust) {
    d.x += d.vx; d.y += d.vy;
    if (d.x < -5) d.x = W + 5; else if (d.x > W + 5) d.x = -5;
    if (d.y < -5) d.y = H + 5; else if (d.y > H + 5) d.y = -5;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // hover: nearest constellation whose actual lines pass close to the cursor
  const HOVER_PX = 14;
  let hovered = null, bestDist = HOVER_PX;
  if (mouse.x >= 0) {
    for (const g of groups) {
      for (const [a, b] of g.edges) {
        const ax = g.x + g.stars[a][0] * g.w, ay = g.y + g.stars[a][1] * g.h;
        const bx = g.x + g.stars[b][0] * g.w, by = g.y + g.stars[b][1] * g.h;
        const d = distToSegment(mouse.x, mouse.y, ax, ay, bx, by);
        if (d < bestDist) { bestDist = d; hovered = g; }
      }
    }
  }

  // B. constellations (rigid groups, drift + wrap on bounding box)
  for (const g of groups) {
    g.x += g.vx; g.y += g.vy;
    if (g.x > W + 20) g.x = -g.w - 20; else if (g.x + g.w < -20) g.x = W + 20;
    if (g.y > H + 20) g.y = -g.h - 20; else if (g.y + g.h < -20) g.y = H + 20;

    ctx.globalAlpha = 0.1;
    ctx.strokeStyle = colors.accent;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (const [a, b] of g.edges) {
      ctx.moveTo(g.x + g.stars[a][0] * g.w, g.y + g.stars[a][1] * g.h);
      ctx.lineTo(g.x + g.stars[b][0] * g.w, g.y + g.stars[b][1] * g.h);
    }
    ctx.stroke();

    ctx.globalAlpha = 0.45;
    ctx.fillStyle = colors.accent;
    for (const [sx, sy] of g.stars) {
      ctx.beginPath();
      ctx.arc(g.x + sx * g.w, g.y + sy * g.h, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // faint name label, eased in/out on hover
    g.la += ((g === hovered ? 1 : 0) - g.la) * 0.08;
    if (g.la > 0.01) {
      ctx.globalAlpha = 0.3 * g.la;
      ctx.fillStyle = colors.accent;
      ctx.font = '11px "IBM Plex Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(g.name.toUpperCase(), g.x + g.w / 2, g.y + g.h + 16);
    }
  }
  ctx.globalAlpha = 1;
}

function skyLoop() {
  skyDraw();
  if (!reducedMotion.matches) requestAnimationFrame(skyLoop);
}

skyReadColors();
skyInit();
skyLoop();

let resizeTimer;
addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => { skyInit(); if (reducedMotion.matches) skyDraw(); }, 150);
});
// content can grow after fonts/images finish loading, which changes doc height
addEventListener('load', () => { skyInit(); if (reducedMotion.matches) skyDraw(); });
addEventListener('mousemove', (e) => {
  mouse.x = e.pageX; mouse.y = e.pageY;
  if (reducedMotion.matches) skyDraw();
});
reducedMotion.addEventListener('change', () => { if (!reducedMotion.matches) skyLoop(); });

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
