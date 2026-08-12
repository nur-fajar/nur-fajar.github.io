// components/retro/Panel.tsx
// Panel info di bawah stage. Framer Motion AnimatePresence memberi transisi
// masuk/keluar tiap kali `data` berganti (di-key oleh title+eyebrow supaya
// AnimatePresence tahu ini "halaman" baru, bukan update in-place).
'use client';

import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { RichText } from './RichText';

export interface PanelData {
  eyebrow: string;
  title: string;
  body: string[];
  tags?: [string, string][];
  hint: string;
}

const panelVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.16, ease: 'easeIn' } },
};

export function Panel({ data }: { data: PanelData }) {
  return (
    <div
      id="retro-panel"
      className="relative z-20 max-h-[46dvh] min-h-[170px] overflow-y-auto border-t-4 border-[var(--ink)] bg-[var(--cream)] px-4 py-3.5 text-[var(--ink)] md:min-h-[196px] md:px-6 md:py-4"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={data.eyebrow + data.title}
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="mb-2 flex flex-wrap items-center gap-2 font-pixel text-[8px] text-[var(--ink-2)]">
            <i className="not-italic bg-[var(--accent)] px-1.5 py-0.5 text-[var(--ink)]">{data.eyebrow}</i>
          </div>
          <h2 className="mb-2 font-pixel text-[13px] leading-relaxed text-[var(--ink)] md:text-[15px]">
            {data.title}
          </h2>
          <div className="space-y-1.5">
            {data.body.map((paragraph, i) => (
              <p key={i} className="max-w-[74ch]">
                <RichText text={paragraph} />
              </p>
            ))}
          </div>
          {data.tags && data.tags.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {data.tags.map(([label, value]) => (
                <span
                  key={label}
                  className="border-2 border-[var(--ink)] bg-[var(--cream-d)] px-1.5 py-1 font-pixel text-[8px]"
                >
                  {label} <i className="not-italic text-[var(--ink-2)]">{value}</i>
                </span>
              ))}
            </div>
          )}
          <div className="mt-2.5 flex items-center gap-1.5 font-pixel text-[8px] text-[var(--ink-2)]">
            <RichText text={data.hint} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
