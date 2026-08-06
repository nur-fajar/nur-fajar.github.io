'use client';

import { useEffect, useRef, useState } from 'react';

const ROCKET_SHOW_AT = 420;

export default function RocketButton() {
  const [visible, setVisible] = useState(false);
  const [launching, setLaunching] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > ROCKET_SHOW_AT);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  function handleClick() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setLaunching(true);
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    timerRef.current = setTimeout(() => setLaunching(false), 750);
  }

  return (
    <button
      type="button"
      id="rocket-btn"
      className={`rocket-btn${visible ? ' visible' : ''}${launching ? ' launching' : ''}`}
      aria-label="Back to top"
      title="Back to top"
      onClick={handleClick}
    >
      🚀
    </button>
  );
}
