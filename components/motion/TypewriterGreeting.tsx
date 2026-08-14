'use client';

/* ── Typewriter greeting ───────────────────────────────────────────────────
   Types out "hi" in one language, holds, deletes, then types the next —
   looping through twelve languages. Purely decorative (the swap doesn't
   convey information beyond "hello"), so the animated span is aria-hidden
   and a single static "hi" stands in for it in the accessibility tree —
   nothing announces on every keystroke or every language change.
   Under prefers-reduced-motion the per-character typing is skipped in
   favor of a slower plain cross-fade between whole words. */

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const GREETINGS = [
  'hi', // English
  'hai', // Indonesian
  'hola', // Spanish
  'salut', // French
  'مرحبا', // Arabic
  '안녕', // Korean
  'こんにちは', // Japanese
  'hallo', // German
  '你好', // Chinese
  'hai', // Malay
  'नमस्ते', // Hindi (India)
  'olá', // Portuguese
] as const;

const TYPE_MS = 90;
const DELETE_MS = 45;
const HOLD_MS = 1300;
const REDUCED_HOLD_MS = 2200;

export default function TypewriterGreeting({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState('');

  useEffect(() => {
    if (reduceMotion) {
      let cancelled = false;
      const show = (i: number) => {
        if (!cancelled) setText(GREETINGS[i]);
      };
      show(wordIndex);
      const id = setTimeout(() => setWordIndex((w) => (w + 1) % GREETINGS.length), REDUCED_HOLD_MS);
      return () => {
        cancelled = true;
        clearTimeout(id);
      };
    }

    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout>;
    const target = GREETINGS[wordIndex];

    const type = (i: number) => {
      if (cancelled) return;
      setText(target.slice(0, i));
      if (i < target.length) timeout = setTimeout(() => type(i + 1), TYPE_MS);
      else timeout = setTimeout(() => del(target.length), HOLD_MS);
    };
    const del = (i: number) => {
      if (cancelled) return;
      setText(target.slice(0, i));
      if (i > 0) timeout = setTimeout(() => del(i - 1), DELETE_MS);
      else setWordIndex((w) => (w + 1) % GREETINGS.length);
    };

    type(0);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [wordIndex, reduceMotion]);

  return (
    <span className={className}>
      <span aria-hidden="true">
        {text}
        <span className="typewriter-cursor" aria-hidden="true" />
      </span>
      <span className="sr-only">hi</span>
    </span>
  );
}
