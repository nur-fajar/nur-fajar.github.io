'use client';

/* Modal kecil yang kebuka saat "NF" di hero diklik. Muncul dengan
   scale + fade dari titik klik: posisi akhirnya di tengah layar, tapi
   animasi berangkat dari offset titik klik terhadap pusat viewport, jadi
   terasa "tumbuh" dari kata yang barusan ditekan.

   Di-portal ke document.body supaya selalu di atas konten apa pun, dan
   ditutup lewat Escape, klik backdrop, atau tombol close — pola yang sama
   dengan SkillPopup di halaman root. */

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

export interface ClickOrigin {
  x: number;
  y: number;
}

export default function NfModal({ origin, onClose }: { origin: ClickOrigin; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  // Offset titik klik terhadap pusat viewport, diredam 60% supaya
  // pergerakannya terbaca sebagai asal-usul, bukan lemparan panjang.
  const dx = (origin.x - window.innerWidth / 2) * 0.6;
  const dy = (origin.y - window.innerHeight / 2) * 0.6;

  return createPortal(
    <motion.div
      className="v2-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="About the name NF"
        className="v2-modal"
        initial={{ opacity: 0, scale: 0.55, x: dx, y: dy }}
        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, scale: 0.6, x: dx, y: dy }}
        transition={{ type: 'spring', stiffness: 320, damping: 30, mass: 0.8 }}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mono v2-modal-eyebrow">NF</p>
        <p className="v2-modal-body">
          Short for <strong>Nur Fajar</strong> — <em>nur</em> means light, <em>fajar</em> means dawn. NF is just faster
          to say. Either one works.
        </p>
        <button ref={closeRef} type="button" className="v2-modal-close" onClick={onClose}>
          Close
        </button>
      </motion.div>
    </motion.div>,
    document.body
  );
}
