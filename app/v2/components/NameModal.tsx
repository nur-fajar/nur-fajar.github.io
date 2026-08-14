'use client';

/* Popup triggered by clicking "NF" in the hero. Scales+fades in from the
   click point (the origin is set as a CSS transform-origin driven by the
   click coordinates), not just a centered fade — a small nod to the
   "reacts to where you clicked" micro-interaction rather than a generic
   modal. Escape and backdrop click both close it. */

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function NameModal({
  open,
  origin,
  onClose,
}: {
  open: boolean;
  origin: { x: number; y: number } | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="v2-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="presentation"
        >
          <motion.div
            className="v2-modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="v2-nf-modal-title"
            style={origin ? { transformOrigin: `${origin.x}px ${origin.y}px` } : undefined}
            initial={{ opacity: 0, scale: 0.35 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="v2-modal-close" onClick={onClose} aria-label="Close">
              ×
            </button>
            <p id="v2-nf-modal-title" className="v2-modal-eyebrow mono">
              N.F.
            </p>
            <p className="v2-modal-body">
              Nur Fajar — everyone just says &ldquo;NF&rdquo;. It stuck sometime during Bangkit Academy and never let
              go, so it&apos;s on the CRM agent&apos;s commit log same as it is here.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
