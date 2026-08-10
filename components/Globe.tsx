'use client';

import { useEffect, useRef } from 'react';
import { CONSTELLATIONS } from '@/content/constellations';
import { distToSegment, raDecToXYZ } from '@/lib/sky-geometry';
import { MODE_CHANGE_EVENT } from '@/lib/theme';

// wireframe geometry on a unit sphere: latitude rings + longitude arcs
const GLOBE_PARALLELS = [-60, -30, 0, 30, 60].map((lat) => {
  const phi = (lat * Math.PI) / 180;
  const pts: [number, number, number][] = [];
  for (let i = 0; i <= 40; i++) {
    const th = (i / 40) * Math.PI * 2;
    pts.push([Math.cos(phi) * Math.cos(th), Math.sin(phi), Math.cos(phi) * Math.sin(th)]);
  }
  return { pts, isEquator: lat === 0 };
});
const GLOBE_MERIDIANS = [0, 30, 60, 90, 120, 150].map((lon) => {
  const lam = (lon * Math.PI) / 180;
  const pts: [number, number, number][] = [];
  for (let i = 0; i <= 40; i++) {
    const phi = (i / 40) * Math.PI - Math.PI / 2;
    pts.push([Math.cos(phi) * Math.cos(lam), Math.sin(phi), Math.cos(phi) * Math.sin(lam)]);
  }
  return { pts, isEquator: false };
});
// The 12 zodiac constellations, reused straight from the page's own real
// RA/Dec sky data — same unit-sphere convention as the parallels/meridians
// above, so no extra projection or scaling is needed.
const ZODIAC_NAMES = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpius', 'Sagittarius', 'Capricornus', 'Aquarius', 'Pisces',
];
const GLOBE_ZODIAC = CONSTELLATIONS.filter((c) => ZODIAC_NAMES.includes(c.n)).map((c) => ({
  name: c.n,
  center: raDecToXYZ(c.c),
  segs: c.l.map((line) => line.map(raDecToXYZ)),
  la: 0, // label alpha, eased toward hover state
}));

export default function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const root = document.documentElement;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const colors = { line: '#C9C4B6', accent: '#A85A2A', text: '#4E574F' };
    const gMouse = { x: -1, y: -1 };
    let gW = 0;
    let gH = 0;
    let gYaw = 0.5;
    let gPitch = -0.3;
    let gDragging = false;
    let gLastX = 0;
    let gLastY = 0;
    let rafId = 0;

    function readColors() {
      const s = getComputedStyle(root);
      colors.line = s.getPropertyValue('--line').trim() || colors.line;
      colors.accent = s.getPropertyValue('--accent').trim() || colors.accent;
      colors.text = s.getPropertyValue('--text-secondary').trim() || colors.text;
    }

    function rotate([x, y, z]: [number, number, number]): [number, number, number] {
      const cx = x * Math.cos(gYaw) + z * Math.sin(gYaw);
      const cz = -x * Math.sin(gYaw) + z * Math.cos(gYaw);
      const cy = y * Math.cos(gPitch) - cz * Math.sin(gPitch);
      const cz2 = y * Math.sin(gPitch) + cz * Math.cos(gPitch);
      return [cx, cy, cz2];
    }

    function resize() {
      // offsetWidth/Height, NOT getBoundingClientRect() — this canvas sits
      // inside a flip-card page that Framer Motion rotates on the Y axis
      // (rotateY) while it's not the active page. getBoundingClientRect()
      // returns the post-transform, on-screen projected box, so measuring
      // this while the card is mid-flip (or parked at rotateY:100 before
      // ever being flipped to) captures a squashed sliver instead of the
      // card's real 340×340 layout size — every ring and constellation then
      // gets drawn into that wrong, tiny canvas buffer, which is why the
      // globe rendered as a flat smear instead of a sphere. offsetWidth/
      // Height report the untransformed CSS layout box, immune to this.
      const dpr = devicePixelRatio || 1;
      gW = canvas!.offsetWidth;
      gH = canvas!.offsetHeight;
      canvas!.width = gW * dpr;
      canvas!.height = gH * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw() {
      if (!gW || !gH) return;
      ctx!.clearRect(0, 0, gW, gH);
      const cx = gW / 2;
      const cy = gH / 2;
      const R = (Math.min(gW, gH) / 2) * 0.86;

      function project(p: [number, number, number]) {
        const [x, y, z] = rotate(p);
        return { x: cx + x * R, y: cy - y * R, z };
      }

      ctx!.lineWidth = 1;
      function strokeRing(pts: [number, number, number][], isEquator: boolean) {
        for (let i = 0; i < pts.length - 1; i++) {
          const a = project(pts[i]);
          const b = project(pts[i + 1]);
          const front = (a.z + b.z) / 2 >= 0;
          ctx!.globalAlpha = isEquator ? (front ? 0.7 : 0.22) : front ? 0.5 : 0.14;
          ctx!.strokeStyle = isEquator ? colors.accent : colors.line;
          ctx!.beginPath();
          ctx!.moveTo(a.x, a.y);
          ctx!.lineTo(b.x, b.y);
          ctx!.stroke();
        }
      }
      GLOBE_PARALLELS.forEach((r) => strokeRing(r.pts, r.isEquator));
      GLOBE_MERIDIANS.forEach((r) => strokeRing(r.pts, r.isEquator));

      ctx!.globalAlpha = 0.55;
      ctx!.strokeStyle = colors.line;
      ctx!.beginPath();
      ctx!.arc(cx, cy, R, 0, Math.PI * 2);
      ctx!.stroke();

      // zodiac figures on the sphere — drawn after the neutral grid so they
      // read as "content"; hover reveals the name, same quiet reveal as the
      // background sky's constellation labels.
      const GLOBE_HOVER_PX = 10;
      let gHovered: (typeof GLOBE_ZODIAC)[number] | null = null;
      let gBestDist = GLOBE_HOVER_PX;
      const gMouseActive = gMouse.x >= 0;

      ctx!.lineWidth = 1;
      for (const z of GLOBE_ZODIAC) {
        for (const line of z.segs) {
          let prev: ReturnType<typeof project> | null = null;
          for (const p3 of line) {
            const p = project(p3);
            if (prev) {
              const front = (prev.z + p.z) / 2 >= 0;
              ctx!.globalAlpha = front ? 0.6 : 0.15;
              ctx!.strokeStyle = colors.accent;
              ctx!.beginPath();
              ctx!.moveTo(prev.x, prev.y);
              ctx!.lineTo(p.x, p.y);
              ctx!.stroke();
              if (gMouseActive && front) {
                const d = distToSegment(gMouse.x, gMouse.y, prev.x, prev.y, p.x, p.y);
                if (d < gBestDist) {
                  gBestDist = d;
                  gHovered = z;
                }
              }
            }
            if (p.z >= -0.05) {
              ctx!.globalAlpha = p.z >= 0 ? 0.75 : 0.25;
              ctx!.fillStyle = colors.accent;
              ctx!.beginPath();
              ctx!.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
              ctx!.fill();
            }
            prev = p;
          }
        }
      }

      ctx!.font = '9px var(--font-jbmono), monospace';
      ctx!.textAlign = 'center';
      for (const z of GLOBE_ZODIAC) {
        z.la += ((z === gHovered ? 1 : 0) - z.la) * 0.15;
        if (z.la > 0.01) {
          const p = project(z.center);
          ctx!.globalAlpha = 0.8 * z.la;
          ctx!.fillStyle = colors.accent;
          ctx!.fillText(z.name.toUpperCase(), p.x, p.y - 8);
        }
      }
      ctx!.globalAlpha = 1;
    }

    function loop() {
      if (!gDragging && !reducedMotion.matches) gYaw += 0.0018;
      draw();
      rafId = requestAnimationFrame(loop);
    }

    const onPointerDown = (e: PointerEvent) => {
      gDragging = true;
      gLastX = e.clientX;
      gLastY = e.clientY;
      canvas!.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas!.getBoundingClientRect();
      gMouse.x = e.clientX - rect.left;
      gMouse.y = e.clientY - rect.top;
      if (gDragging) {
        gYaw += (e.clientX - gLastX) * 0.006;
        gPitch = Math.max(-1.3, Math.min(1.3, gPitch + (e.clientY - gLastY) * 0.006));
        gLastX = e.clientX;
        gLastY = e.clientY;
      }
      if (reducedMotion.matches) draw();
    };
    const onPointerLeave = () => {
      gMouse.x = -1;
      gMouse.y = -1;
    };
    const onPointerUp = () => {
      gDragging = false;
    };
    const onModeChange = () => {
      readColors();
      if (reducedMotion.matches) draw();
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerleave', onPointerLeave);
    addEventListener('pointerup', onPointerUp);
    window.addEventListener(MODE_CHANGE_EVENT, onModeChange);

    readColors();
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    if (reducedMotion.matches) draw();
    else rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      removeEventListener('pointerup', onPointerUp);
      window.removeEventListener(MODE_CHANGE_EVENT, onModeChange);
    };
  }, []);

  return <canvas id="globe" className="globe-canvas" ref={canvasRef} />;
}
