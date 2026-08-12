// components/retro/TitleOverlay.tsx
'use client';

import { motion } from 'framer-motion';

export function TitleOverlay({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      className="absolute inset-0 z-40 grid place-items-center bg-[var(--sea)] px-5 text-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
    >
      <div>
        <div className="font-pixel text-[clamp(16px,5.4vw,34px)] leading-relaxed text-[var(--cream)] [text-shadow:0_4px_0_var(--ink),0_8px_0_rgba(32,24,46,.28)]">
          FAJAR
          <br />
          ISLAND
        </div>
        <p className="mt-4 text-[clamp(15px,2.6vw,20px)] text-[var(--cream)]">one island, five ways to play, one person</p>
        <p className="mt-1.5 font-pixel text-[8px] text-[var(--sand)]">
          LEARNING &amp; DEVELOPMENT · PROGRAM · AI AUTOMATION
        </p>
        <button
          type="button"
          onClick={onStart}
          className="mt-6 animate-pulse border-4 border-[var(--ink)] bg-[var(--gold)] px-3.5 py-2.5 font-pixel text-[10px] text-[var(--ink)]"
        >
          SCROLL / CLICK TO START
        </button>
      </div>
    </motion.div>
  );
}
