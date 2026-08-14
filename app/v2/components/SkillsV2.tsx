'use client';

/* ── SKILLS ──────────────────────────────────────────────────────────────
   Data-nya di-reuse langsung dari content/skills.ts (sumber yang sama
   dengan halaman root) — di sini cuma disaring ke 4 grup yang diminta
   brief /v2, tidak diketik ulang. Proof project tiap skill juga diambil
   dari skillProof.ts — dicocokkan ke teks program/pengalaman/pipeline
   yang memang sudah ada di situs ini, bukan kalimat yang ditulis manual.

   Motion signature: grid stagger saat masuk viewport, lalu interaksi —
   satu-satunya section yang responsif ke pointer, bukan cuma ke scroll.
   Desktop (pointer presisi + hover): baris skill membuka proof-nya saat
   di-hover. Mobile: tap-to-expand accordion. Dua-duanya animasi
   height/opacity yang sama, cuma trigger-nya beda. */

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SKILL_GROUPS, type Accent } from '@/content/skills';
import { getSkillProof } from '../skillProof';
import { LOGOS, type PathLogo } from '../data';
import LogoMark from './LogoMark';
import useMediaQuery from './useMediaQuery';

const EASE = [0.16, 1, 0.3, 1] as const;

// 4 grup yang diminta brief /v2 — Content Production (02) tidak ikut.
const GROUP_IDS = ['01', '04', '03', '05'];

const ACCENT_VAR: Record<Accent, string> = {
  warmth: 'var(--v2-blue)',
  signal: 'var(--v2-yellow)',
};

// Logo resmi hanya dipasang di baris yang memang menyebut produknya —
// "LLM APIs (GPT-4o-mini)" itu OpenAI, sisanya tidak diklaim satu vendor.
const TOOL_LOGOS: { match: RegExp; logo: PathLogo }[] = [{ match: /gpt-4o-mini/i, logo: LOGOS.openai }];

// Model yang dipakai sehari-hari, ditaruh sebagai baris atribusi di kaki
// grup "Tools" saja — grup AI Engineering sudah punya logo OpenAI di baris
// GPT-4o-mini, mengulang tiga logo yang sama di dua kartu cuma jadi noise.
const AI_TOOLBELT: PathLogo[] = [LOGOS.claude, LOGOS.openai, LOGOS.gemini];
const TOOLBELT_GROUPS = new Set(['05']);

function logoFor(name: string) {
  return TOOL_LOGOS.find((t) => t.match.test(name))?.logo;
}

function SkillRow({ name, accent, canHover }: { name: string; accent: Accent; canHover: boolean }) {
  const [open, setOpen] = useState(false);
  const proof = useMemo(() => getSkillProof(name), [name]);
  const logo = logoFor(name);

  // Tanpa proof, baris ini bukan tombol — tidak ada yang bisa dibuka.
  if (!proof) {
    return (
      <li className="v2-skill-row v2-skill-row--static">
        <span className="v2-skill-name">
          {logo ? <LogoMark logo={logo} height={14} /> : null}
          {name}
        </span>
      </li>
    );
  }

  const hoverProps = canHover ? { onMouseEnter: () => setOpen(true), onMouseLeave: () => setOpen(false) } : {};

  return (
    <li className="v2-skill-row" {...hoverProps}>
      <button
        type="button"
        className="v2-skill-name"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onFocus={() => canHover && setOpen(true)}
        onBlur={() => canHover && setOpen(false)}
        style={{ '--row-accent': ACCENT_VAR[accent] } as React.CSSProperties}
      >
        {logo ? <LogoMark logo={logo} height={14} /> : null}
        {name}
        <span className="v2-skill-cue" aria-hidden="true" />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="v2-skill-proof"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: EASE }}
            style={{ '--row-accent': ACCENT_VAR[accent] } as React.CSSProperties}
          >
            <p className="mono v2-proof-title">{proof.title}</p>
            <p className="v2-proof-blurb">{proof.blurb}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export default function SkillsV2() {
  // (hover: hover) = device dengan pointer beneran. Di touch device
  // hasilnya false → mode accordion (tap) yang jalan.
  const canHover = useMediaQuery('(hover: hover) and (pointer: fine)');
  const groups = GROUP_IDS.map((id) => SKILL_GROUPS.find((g) => g.id === id)!).filter(Boolean);

  return (
    <section className="v2-section v2-skills">
      <div className="v2-skill-grid">
        {groups.map((group, gi) => (
          <motion.div
            key={group.id}
            className="v2-skill-card motion-safe"
            style={{ '--group-accent': ACCENT_VAR[group.accent] } as React.CSSProperties}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: gi * 0.09, ease: EASE }}
          >
            <h2 className="mono v2-skill-group">{group.label}</h2>
            <ul className="v2-skill-list">
              {group.items.map((item) => {
                const name = typeof item === 'string' ? item : item.name;
                const accent = typeof item === 'string' ? group.accent : (item.accent ?? group.accent);
                return <SkillRow key={name} name={name} accent={accent} canHover={canHover} />;
              })}
            </ul>
            {TOOLBELT_GROUPS.has(group.id) ? (
              <div className="v2-toolbelt">
                <span className="mono v2-toolbelt-label">daily driver</span>
                {AI_TOOLBELT.map((logo) => (
                  <LogoMark key={logo.src} logo={logo} height={16} />
                ))}
              </div>
            ) : null}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
