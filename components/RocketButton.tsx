'use client';

import { useEffect, useState } from 'react';

const SHOW_AT = 420;

export default function RocketButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > SHOW_AT);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  function handleClick() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  }

  return (
    <button
      type="button"
      id="rocket-btn"
      className={`rocket-btn${visible ? ' visible' : ''}`}
      aria-label="Back to top"
      title="Back to top"
      onClick={handleClick}
    >
      ↑
    </button>
  );
}
