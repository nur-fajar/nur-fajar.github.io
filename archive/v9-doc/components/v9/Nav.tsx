'use client';

import { useEffect, useRef, useState } from 'react';
import { ListIcon } from '@phosphor-icons/react';

/**
 * Nav v9: bilah kaca di atas kertas, gaya "navbar with dropdowns" yang paling
 * banyak diunduh di 21st.dev, diratakan karena halaman ini tidak punya
 * sub-menu yang jujur untuk ditawarkan.
 *
 * Menu mobile pakai <details>, bukan state React, supaya tetap bisa dibuka
 * tanpa JavaScript dan tetap bisa dijangkau keyboard. Scrollspy (menandai
 * section yang sedang dibaca) adalah tambahan JavaScript, dan halaman tetap
 * utuh tanpanya.
 */
export interface V9NavItem {
  id: string;
  label: string;
}

export default function Nav({
  items,
  mailto,
  cv,
}: {
  items: readonly V9NavItem[];
  mailto: string;
  cv: string;
}) {
  const [active, setActive] = useState<string | null>(null);
  const menu = useRef<HTMLDetailsElement | null>(null);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length !== items.length) return;

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
  }, [items]);

  // Menutup sheet setelah tautan ditekan: tanpa ini, sheet tetap menutupi
  // halaman setelah memilih section.
  const closeSheet = () => {
    if (menu.current) menu.current.open = false;
  };

  return (
    <nav className="v9-nav" aria-label="Sections">
      <div className="v9-shell v9-nav__bar">
        <a className="v9-nav__brand" href="#top">
          Nur Fajar
        </a>

        <ul className="v9-nav__list">
          {items.map((item) => (
            <li key={item.id}>
              <a
                className={active === item.id ? 'v9-nav__link v9-nav__link--on' : 'v9-nav__link'}
                href={`#${item.id}`}
                aria-current={active === item.id ? 'true' : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="v9-nav__actions">
          <a className="v9-btn v9-btn--ghost" href={cv} download>
            Resume
          </a>
          <a className="v9-btn v9-btn--primary" href={mailto}>
            Get in touch
          </a>
        </div>

        <details className="v9-nav__menu" ref={menu}>
          <summary className="v9-nav__toggle" aria-label="Menu">
            <ListIcon size={18} weight="bold" aria-hidden="true" />
          </summary>
          <div className="v9-nav__sheet">
            {items.map((item) => (
              <a key={item.id} className="v9-nav__link" href={`#${item.id}`} onClick={closeSheet}>
                {item.label}
              </a>
            ))}
            <a className="v9-btn v9-btn--ghost" href={cv} download onClick={closeSheet}>
              Resume
            </a>
            <a className="v9-btn v9-btn--primary" href={mailto} onClick={closeSheet}>
              Get in touch
            </a>
          </div>
        </details>
      </div>
    </nav>
  );
}
