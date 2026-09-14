'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Mobile sticky quick-action dock. Appears after the hero, hides while
 * the contact section is on screen. Honors safe-area bottom.
 * If the dock hides while it holds focus, focus is released first
 * so keyboard and screen-reader users are never stranded.
 */
export default function HireDock() {
  const [visible, setVisible] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const contact = document.getElementById('contact');
    if (!contact) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(false);
        else if (window.scrollY > window.innerHeight * 0.7) setVisible(true);
      },
      { threshold: 0.15 },
    );
    observer.observe(contact);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible && dockRef.current?.contains(document.activeElement)) {
      (document.activeElement as HTMLElement).blur();
    }
  }, [visible]);

  return (
    <div ref={dockRef} className={`v5-dock${visible ? ' is-visible' : ''}`} aria-hidden={!visible}>
      <a className="v5-dock__ghost" href="#work" tabIndex={visible ? undefined : -1}>
        See work
      </a>
    </div>
  );
}
