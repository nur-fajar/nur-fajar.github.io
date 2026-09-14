'use client';

import { useEffect, useRef } from 'react';

/**
 * Kursor custom: dot tinta + label kontekstual dari atribut data-cursor
 * pada elemen ter-hover ("Say hi", "Open case"). Hanya aktif di pointer
 * halus tanpa reduced-motion; kelas v5-cursor-on dipasang dari efek ini,
 * jadi tanpa JS kursor asli browser tetap dipakai.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!dot || !label) return;

    document.documentElement.classList.add('v5-cursor-on');

    let x = -100;
    let y = -100;
    let tx = x;
    let ty = y;
    let raf = 0;

    const render = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      if (Math.abs(tx - x) < 0.3 && Math.abs(ty - y) < 0.3) raf = 0;
      else raf = requestAnimationFrame(render);
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };
    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      dot.style.opacity = '1';
      wake();
    };
    const over = (e: PointerEvent) => {
      const target = (e.target as HTMLElement | null)?.closest?.('[data-cursor]');
      const labelText = target?.getAttribute('data-cursor') ?? '';
      label.textContent = labelText;
      dot.classList.toggle('has-label', labelText !== '');
      const interactive = (e.target as HTMLElement | null)?.closest?.('a, button');
      dot.classList.toggle('is-link', interactive !== null);
    };
    const leave = () => {
      dot.style.opacity = '0';
    };

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', over, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('pointerleave', leave);
      document.documentElement.classList.remove('v5-cursor-on');
    };
  }, []);

  return (
    <div className="v5-cursor" ref={dotRef} aria-hidden="true">
      <span className="v5-cursor__label" ref={labelRef} />
    </div>
  );
}
