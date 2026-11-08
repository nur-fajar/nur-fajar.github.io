'use client';

/**
 * Nav v8: masthead gelap ala Carbon — brand kiri, nav tengah, alamat email
 * kanan. Scrollspy menandai section yang sedang di tengah layar.
 */
import { useEffect, useState } from 'react';

const ITEMS = [
  { id: 'work', label: 'Work' },
  { id: 'praise', label: 'Praise' },
  { id: 'contact', label: 'Contact' },
] as const;

export default function Nav({ email }: { email: string }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = ITEMS.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length !== ITEMS.length) return;

    const spy = new IntersectionObserver(
      (entries) => {
        setActive((prev) => {
          let next = prev;
          for (const entry of entries) {
            if (entry.isIntersecting) next = entry.target.id;
            else if (next === entry.target.id) next = null;
          }
          return next;
        });
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    sections.forEach((section) => spy.observe(section));

    return () => spy.disconnect();
  }, []);

  return (
    <nav className="v8-nav" aria-label="Sections">
      <a className="v8-nav__brand" href="#top">
        Nur Fajar
      </a>
      <ul className="v8-nav__list">
        {ITEMS.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? 'true' : undefined}
              className={active === item.id ? 'v8-nav__on' : undefined}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      <a className="v8-nav__cta" href={`mailto:${email}`}>
        {email}
      </a>
    </nav>
  );
}
