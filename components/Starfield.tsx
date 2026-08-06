'use client';

import { useEffect, useRef } from 'react';
import { CONSTELLATIONS } from '@/content/constellations';
import { distToSegment, gnomonic } from '@/lib/sky-geometry';
import { MODE_CHANGE_EVENT } from '@/lib/theme';

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
     · Posisi   : dari RA/Dec sungguhan (content/constellations.ts).
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
     Canvas ini setinggi dokumen dan ber-position absolute (lihat globals.css),
     jadi ia ikut lapisan yang di-scroll: compositor menggesernya tanpa gambar
     ulang sama sekali — scroll-nya tidak pernah menyentuh canvas.
   ────────────────────────────────────────────────────────────────────────── */

const FIGURE_SCALE = 6;
const RA_CYCLE_MUL = 1.7;
const EDGE_PAD = 140;
const DEG_PER_SEC = 0.5;

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const docHeight = () => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);

interface Star {
  ra: number;
  dec: number;
  r: number;
}
interface Group {
  name: string;
  ra: number;
  y: number;
  rPx: number;
  segs: ([number, number] | null)[][];
  la: number;
  sx: number;
}

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const root = document.documentElement;
    const mouse = { x: -1, y: -1 };
    const colors = { dust: '#9C9A87', accent: '#FFB93C' };

    let W = 0;
    let docH = 0;
    let raCycle = 0;
    let skyStars: Star[] = [];
    let groups: Group[] = [];
    let lst = 0;
    let lastT = 0;
    let rafId = 0;

    function readColors() {
      const s = getComputedStyle(root);
      colors.dust = s.getPropertyValue('--text-secondary').trim() || colors.dust;
      colors.accent = s.getPropertyValue('--accent').trim() || colors.accent;
    }

    function decToY(dec: number) {
      const usable = Math.max(200, docH - EDGE_PAD * 2);
      return EDGE_PAD + ((90 - dec) / 180) * usable;
    }

    function init() {
      W = innerWidth;
      docH = docHeight();
      raCycle = W * RA_CYCLE_MUL;

      const budget = 14e6;
      const dpr = Math.min(devicePixelRatio || 1, Math.max(1, Math.sqrt(budget / (W * docH))));
      canvas!.style.height = docH + 'px';
      canvas!.width = Math.round(W * dpr);
      canvas!.height = Math.round(docH * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Bintang latar ini PENGISI DEKORATIF, bukan katalog bintang sungguhan.
      // Dec-nya diacak MERATA di halaman (bukan lewat asin(uniform)), karena
      // peta ini linear terhadap Dec — asin(uniform) akan menumpuk di ekuator.
      skyStars = Array.from({ length: Math.min(420, Math.max(160, Math.round(docH / 22))) }, () => ({
        ra: rand(0, 360),
        dec: rand(-90, 90),
        r: rand(0.4, 1.3),
      }));

      groups = CONSTELLATIONS.map((c) => {
        const [ra0, dec0] = c.c;
        const segs = c.l.map((line) =>
          line.map(([ra, dec]) => {
            const p = gnomonic(ra, dec, ra0, dec0);
            return p ? ([p[0] * FIGURE_SCALE, -p[1] * FIGURE_SCALE] as [number, number]) : null;
          }),
        );
        return { name: c.n, ra: ra0, y: decToY(dec0), rPx: c.r * FIGURE_SCALE, segs, la: 0, sx: 0 };
      });
    }

    /** RA → x, dibungkus dalam siklus yang lebih lebar dari layar. */
    function raToX(ra: number) {
      const f = (((((ra - lst) % 360) + 360) % 360) / 360); // 0..1
      return f * raCycle - (raCycle - W) / 2;
    }

    function draw(dt?: number) {
      if (dt) lst = (lst + DEG_PER_SEC * dt) % 360;

      ctx!.clearRect(0, 0, W, docH);

      ctx!.globalAlpha = 0.36;
      ctx!.fillStyle = colors.dust;
      for (const s of skyStars) {
        const x = raToX(s.ra);
        if (x < -3 || x > W + 3) continue;
        const y = decToY(s.dec);
        ctx!.beginPath();
        ctx!.arc(x, y, s.r, 0, Math.PI * 2);
        ctx!.fill();
      }

      const HOVER_PX = 14;
      let hovered: Group | null = null;
      let bestDist = HOVER_PX;
      const live: Group[] = [];

      for (const g of groups) {
        g.sx = raToX(g.ra);
        if (g.sx + g.rPx < -20 || g.sx - g.rPx > W + 20) {
          g.la = 0;
          continue;
        }
        live.push(g);
        if (mouse.x >= 0 && Math.abs(mouse.y - g.y) < g.rPx + 40) {
          for (const pts of g.segs) {
            for (let i = 0; i < pts.length - 1; i++) {
              const a = pts[i];
              const b = pts[i + 1];
              if (!a || !b) continue;
              const d = distToSegment(mouse.x, mouse.y, g.sx + a[0], g.y + a[1], g.sx + b[0], g.y + b[1]);
              if (d < bestDist) {
                bestDist = d;
                hovered = g;
              }
            }
          }
        }
      }

      for (const g of live) {
        ctx!.globalAlpha = 0.1;
        ctx!.strokeStyle = colors.accent;
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        for (const pts of g.segs) {
          let started = false;
          for (const p of pts) {
            if (!p) {
              started = false;
              continue;
            }
            if (!started) {
              ctx!.moveTo(g.sx + p[0], g.y + p[1]);
              started = true;
            } else ctx!.lineTo(g.sx + p[0], g.y + p[1]);
          }
        }
        ctx!.stroke();

        ctx!.globalAlpha = 0.5;
        ctx!.fillStyle = colors.accent;
        for (const pts of g.segs) {
          for (const p of pts) {
            if (!p) continue;
            ctx!.beginPath();
            ctx!.arc(g.sx + p[0], g.y + p[1], 1.7, 0, Math.PI * 2);
            ctx!.fill();
          }
        }

        g.la += ((g === hovered ? 1 : 0) - g.la) * 0.12;
        if (g.la > 0.01) {
          ctx!.globalAlpha = 0.45 * g.la;
          ctx!.fillStyle = colors.accent;
          ctx!.font = '11px var(--font-jbmono), monospace';
          ctx!.textAlign = 'center';
          ctx!.fillText(g.name.toUpperCase(), g.sx, g.y + g.rPx + 15);
        }
      }

      ctx!.globalAlpha = 1;
    }

    function loop(t: number) {
      const dt = lastT ? Math.min(0.05, (t - lastT) / 1000) : 0;
      lastT = t;
      draw(dt);
      if (!reducedMotion.matches) rafId = requestAnimationFrame(loop);
    }

    readColors();
    init();
    if (reducedMotion.matches) draw();
    else rafId = requestAnimationFrame(loop);

    const reinit = () => {
      init();
      if (reducedMotion.matches) draw();
    };

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(reinit, 150);
    };
    const onLoad = () => reinit();
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.pageX;
      mouse.y = e.pageY;
      if (reducedMotion.matches) draw();
    };
    const onMouseLeave = () => {
      mouse.x = -1;
      mouse.y = -1;
    };
    const onReducedChange = () => {
      if (!reducedMotion.matches) {
        lastT = 0;
        rafId = requestAnimationFrame(loop);
      } else draw();
    };
    const onModeChange = () => {
      readColors();
      if (reducedMotion.matches) draw();
    };

    addEventListener('resize', onResize);
    addEventListener('load', onLoad);
    addEventListener('mousemove', onMouseMove);
    addEventListener('mouseleave', onMouseLeave);
    reducedMotion.addEventListener('change', onReducedChange);
    window.addEventListener(MODE_CHANGE_EVENT, onModeChange);

    // Tinggi dokumen berubah saat <details> dibuka/ditutup. Kalau canvas tidak
    // ikut menyesuaikan, bagian bawah halaman kehabisan langit dan pemetaan
    // Dec jadi meleset.
    let obsTimer: ReturnType<typeof setTimeout>;
    let lastH = 0;
    const resizeObserver = new ResizeObserver(() => {
      const h = docHeight();
      if (Math.abs(h - lastH) < 40) return;
      lastH = h;
      clearTimeout(obsTimer);
      obsTimer = setTimeout(reinit, 120);
    });
    resizeObserver.observe(document.body);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
      clearTimeout(obsTimer);
      resizeObserver.disconnect();
      removeEventListener('resize', onResize);
      removeEventListener('load', onLoad);
      removeEventListener('mousemove', onMouseMove);
      removeEventListener('mouseleave', onMouseLeave);
      reducedMotion.removeEventListener('change', onReducedChange);
      window.removeEventListener(MODE_CHANGE_EVENT, onModeChange);
    };
  }, []);

  return <canvas id="sky" ref={canvasRef} aria-hidden="true" />;
}
