'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Entry, Fam } from './catalog';

const FAM_LABEL: Record<Fam | 'All', string> = {
  All: 'All · 48',
  Style: 'Style families · 20',
  Awwwards: 'Awwwards genres · 8',
  Company: 'Tech companies · 20',
};

const DEVICE_WIDTH: Record<string, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '390px',
};

function Swatch({ it }: { it: Entry }) {
  return (
    <span className="sw" style={{ background: it.bg }}>
      <span className="swname" style={{ color: it.ink }}>
        Nf
      </span>
      <span className="swdot" style={{ background: it.accent }} />
    </span>
  );
}

export default function MockupBrowser({ items }: { items: Entry[] }) {
  const [q, setQ] = useState('');
  const [fam, setFam] = useState<Fam | 'All'>('All');
  const [open, setOpen] = useState<number | null>(null);
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [loaded, setLoaded] = useState(false);

  const filtered = useMemo(
    () =>
      items.filter(
        (it) =>
          (fam === 'All' || it.fam === fam) &&
          (q.trim() === '' ||
            (it.title + ' ' + it.desc + ' ' + it.no).toLowerCase().includes(q.toLowerCase()))
      ),
    [items, q, fam]
  );

  const item = open !== null ? filtered[open] : undefined;

  const go = (d: 1 | -1) =>
    setOpen((o) => (o === null ? o : (o + d + filtered.length) % filtered.length));

  /* Ganti mockup → reset status loading iframe. React menyarankan pola
     "adjust state during render" (prev !== now) daripada setState di
     dalam efek, supaya tidak memicu render berantai (eslint
     react-hooks/set-state-in-effect). */
  const [prevFile, setPrevFile] = useState(item?.file);
  if (item?.file !== prevFile) {
    setPrevFile(item?.file);
    setLoaded(false);
  }

  /* Keyboard: ← → navigasi, Esc tutup. */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (open === null) return;
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') setOpen((o) => (o === null ? o : (o + 1 + filtered.length) % filtered.length));
      if (e.key === 'ArrowLeft') setOpen((o) => (o === null ? o : (o - 1 + filtered.length) % filtered.length));
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  /* Mockup mengirim 'v8close' (tombol ← close di bar-nya). */
  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (e.data === 'v8close') setOpen(null);
    }
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  return (
    <>
      <header className="mhead">
        <div className="mhead__row">
          <span className="mhead__title">
            v8 Style Atlas <i>·</i> 48 arah visual
          </span>
          <span className="mhead__count">
            {filtered.length} / {items.length} shown
          </span>
        </div>
        <div className="mtools">
          <input
            className="msearch"
            placeholder="cari style… (mis. brutal, atlas, stripe)"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(null);
            }}
          />
          <div className="mchips">
            {(['All', 'Style', 'Awwwards', 'Company'] as const).map((f) => (
              <button
                key={f}
                className={`mchip ${fam === f ? 'on' : ''}`}
                onClick={() => {
                  setFam(f);
                  setOpen(null);
                }}
              >
                {FAM_LABEL[f]}
              </button>
            ))}
          </div>
          <span className="mhint">← → next / prev · ESC close</span>
        </div>
      </header>

      <div className="mgrid">
        {filtered.map((it, i) => (
          <button
            key={it.file}
            style={{ '--i': Math.min(i, 12) } as React.CSSProperties}
            className="card"
            onClick={() => setOpen(i)}
            aria-label={`Buka mockup ${it.no} — ${it.title}`}
          >
            <Swatch it={it} />
            <span className="card__no">{it.no}</span>
            <span className="card__t">{it.title}</span>
            <span className="card__fam">{it.fam}</span>
            <span className="card__d">{it.desc}</span>
          </button>
        ))}
        {filtered.length === 0 && <p className="empty">Tidak ada yang cocok dengan pencarian itu.</p>}
      </div>

      {item && (
        <div className="ov" role="dialog" aria-label={`Mockup ${item.no} — ${item.title}`}>
          <div className="chrome">
            <div className="dots">
              <i /><i /><i />
            </div>
            <div className="url">/mockups/{item.file}</div>
            <div className="tools">
              {(['desktop', 'tablet', 'mobile'] as const).map((d) => (
                <button
                  key={d}
                  className={`tbtn ${device === d ? 'on' : ''}`}
                  onClick={() => setDevice(d)}
                >
                  {d}
                </button>
              ))}
              <button className="tbtn" onClick={() => go(-1)} aria-label="Sebelumnya">
                ←
              </button>
              <button className="tbtn" onClick={() => go(1)} aria-label="Berikutnya">
                →
              </button>
              <a className="tbtn" href={`/mockups/${item.file}`} target="_blank" rel="noreferrer">
                ↗
              </a>
              <button className="tbtn" onClick={() => setOpen(null)} aria-label="Tutup">
                ✕
              </button>
            </div>
          </div>
          <div className="frame" data-device={device}>
            {!loaded && <div className="loading">loading {item.no} — {item.title}…</div>}
            <iframe
              key={item.file}
              src={`/mockups/${item.file}`}
              title={`Mockup ${item.no} — ${item.title}`}
              onLoad={() => setLoaded(true)}
            />
          </div>
          <p className="meta2">
            <span className="no">{item.no}</span>
            <b>{item.title}</b> — {item.desc}
          </p>
        </div>
      )}
    </>
  );
}
