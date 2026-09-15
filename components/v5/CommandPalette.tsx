'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CONTACT } from '@/content/ledger';
import { V5_FOUNDER_MAILTO } from '@/content/v5';

interface CmdAction {
  id: string;
  label: string;
  hint: string;
  href?: string;
  external?: boolean;
  run?: () => void;
}

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(CONTACT.email);
  } catch {
    /* clipboard unavailable: fall back to prompt-less select */
    const area = document.createElement('textarea');
    area.value = CONTACT.email;
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    area.remove();
  }
}

const ACTIONS: CmdAction[] = [
  { id: 'top', label: 'Back to top', hint: '⤒', href: '#top' },
  { id: 'capabilities', label: 'Go to What I do', hint: '01', href: '#capabilities' },
  { id: 'work', label: 'Go to Proof', hint: '02', href: '#work' },
  { id: 'voices', label: 'Go to Kind words', hint: '03', href: '#voices' },
  { id: 'about', label: 'Go to About', hint: '04', href: '#about' },
  { id: 'contact', label: 'Go to Hire me', hint: '05', href: '#contact' },
  { id: 'copy', label: 'Copy email address', hint: '⧉', run: () => void copyEmail() },
  { id: 'mailto', label: `Email ${CONTACT.email}`, hint: '✉', href: V5_FOUNDER_MAILTO },
  { id: 'linkedin', label: 'Open LinkedIn', hint: '↗', href: CONTACT.linkedin, external: true },
  { id: 'cv', label: 'Download CV (PDF)', hint: '⤓', href: CONTACT.cv },
];

/**
 * Command palette (Ctrl/⌘ K): navigasi section + aksi kontak dalam satu
 * ketukan. Tanpa dependensi (custom ~100 baris, bukan cmdk): anchor
 * internal lewat penanganan anchor Lenis yang sudah ada, fokus
 * dikembalikan ke pemicu saat menutup.
 */
export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | HTMLButtonElement | null)[]>([]);
  const returnTo = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActive(0);
  }, []);

  useEffect(() => {
    if (!open) return;
    returnTo.current = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    return () => returnTo.current?.focus?.();
  }, [open ]);

  useEffect(() => {
    const toggle = () => setOpen((v) => !v);
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggle();
      } else if (e.key === 'Escape') {
        close();
      }
    };
    const onEvent = () => toggle();
    window.addEventListener('keydown', onKey);
    window.addEventListener('v5:palette', onEvent);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('v5:palette', onEvent);
    };
  }, [close ]);

  const q = query.trim().toLowerCase();
  const items = q ? ACTIONS.filter((a) => a.label.toLowerCase().includes(q)) : ACTIONS;
  const clamped = Math.min(active, Math.max(items.length - 1, 0));

  if (!open) return null;

  return (
    <div className="v5-cmd" role="dialog" aria-modal="true" aria-label="Command menu">
      <div
        className="v5-cmd__overlay"
        onClick={close}
        onKeyDown={(e) => {
          if (e.key === 'Escape') close();
        }}
      />
      <div className="v5-cmd__panel">
        <input
          ref={inputRef}
          className="v5-cmd__input"
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-controls="v5-cmd-list"
          aria-activedescendant={items.length ? `v5-cmd-${items[clamped].id}` : undefined}
          placeholder="Type a command or section…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActive((i) => (i + 1) % Math.max(items.length, 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActive((i) => (i - 1 + Math.max(items.length, 1)) % Math.max(items.length, 1));
            } else if (e.key === 'Enter') {
              e.preventDefault();
              itemRefs.current[clamped]?.click();
            }
          }}
        />
        <ul className="v5-cmd__list" id="v5-cmd-list" role="listbox" aria-label="Commands">
          {items.map((action, i) => (
            <li key={action.id} role="presentation">
              {action.href ? (
                <a
                  ref={(n) => {
                    itemRefs.current[i] = n;
                  }}
                  id={`v5-cmd-${action.id}`}
                  role="option"
                  aria-selected={i === clamped}
                  className={i === clamped ? 'v5-cmd__item is-active' : 'v5-cmd__item'}
                  href={action.href}
                  {...(action.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                  onClick={close}
                  onMouseMove={() => setActive(i)}
                >
                  {action.label}
                  <span className="v5-cmd__hint" aria-hidden="true">
                    {action.hint}
                  </span>
                </a>
              ) : (
                <button
                  ref={(n) => {
                    itemRefs.current[i] = n;
                  }}
                  id={`v5-cmd-${action.id}`}
                  role="option"
                  aria-selected={i === clamped}
                  type="button"
                  className={i === clamped ? 'v5-cmd__item is-active' : 'v5-cmd__item'}
                  onClick={() => {
                    action.run?.();
                    close();
                  }}
                  onMouseMove={() => setActive(i)}
                >
                  {action.label}
                  <span className="v5-cmd__hint" aria-hidden="true">
                    {action.hint}
                  </span>
                </button>
              )}
            </li>
          ))}
          {items.length === 0 ? <li className="v5-cmd__empty">No matching command.</li> : null}
        </ul>
      </div>
    </div>
  );
}
