'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Bajak scroll vertikal jadi pan horizontal: tiap blok kategori (.v3-cat =
 * kepala + rel) di-pin selama scroll vertikal sepanjang sisa konten relnya,
 * 1px vertikal = 1px horizontal. Video habis dulu, lepas, lalu Design.
 *
 * Relnya sendiri tetap overflow-x bawaan dan scrollLeft-nya yang
 * digerakkan (bukan transform): tanpa JS, di sentuh, di layar sempit,
 * maupun di reduced-motion, pin tidak dipasang dan rel kembali jadi strip
 * geser + jalan otomatis biasa. Syarat pin: hover + ≥900px + gerak penuh.
 * Pola null-renderer sama seperti TimelineDraw/CardsDrift.
 *
 * Selama pin aktif, atribut data-pinned menempel di rel supaya jalan
 * otomatis GalleryRail berhenti (dibaca tiap frame di sana) — dua sopir
 * untuk satu setir tidak boleh jalan bareng.
 */
export default function GalleryPin() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (min-width: 900px)').matches) return;

    const cats = [...document.querySelectorAll('#work .v3-cat')];
    if (cats.length === 0) return;

    const ctx = gsap.context(() => {
      cats.forEach((cat, position) => {
        const rail = cat.querySelector('.v3-gallery');
        if (!(rail instanceof HTMLElement)) return;

        const max = () => rail.scrollWidth - rail.clientWidth;
        if (max() <= 8) return;

        /* Blok berikutnya menunggu: disembunyikan selama blok ini di-pin
           supaya kepala Design tidak muncul di bawah thumbnail Video yang
           masih dihabiskan. Visibility (bukan display) agar layout — dan
           dengan itu semua pengukuran pin — tidak bergeser. */
        const next = cats[position + 1];
        const gate = (waiting: boolean) => {
          if (next instanceof HTMLElement) next.classList.toggle('is-waiting', waiting);
        };

        /* Reveal amount={0} milik Section meninggalkan `transform` inline
           (translateY(0)) setelah entrance selesai. Nilai nol tidak
           menggeser apa pun — tapi keberadaannya membuat ScrollTrigger
           menempelkan pin fixed ke Reveal itu, bukan ke viewport, dan pin
           mendarat di posisi salah. Dibersihkan tepat saat pin aktif
           (visualnya identik: animasi entrance sudah lama selesai). */
        const clearReveal = () => {
          const reveal = cat.parentElement;
          if (reveal) gsap.set(reveal, { clearProps: 'transform' });
        };

        gsap.to(rail, {
          scrollLeft: () => max(),
          ease: 'none',
          scrollTrigger: {
            trigger: cat,
            start: 'top top+=80',
            end: () => `+=${max()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onEnter: clearReveal,
            onEnterBack: clearReveal,
            onToggle: (self) => {
              if (self.isActive) rail.setAttribute('data-pinned', '');
              else rail.removeAttribute('data-pinned');
              gate(self.isActive);
            },
          },
        });
      });
    });

    return () => {
      ctx.revert();
      /* revert mengembalikan inline style, tapi scrollLeft adalah properti
         (bukan style) dan kelas manual bukan milik GSAP — keduanya
         dikembalikan sendiri. */
      document.querySelectorAll('#work .v3-gallery').forEach((rail) => {
        if (rail instanceof HTMLElement) {
          rail.scrollLeft = 0;
          rail.removeAttribute('data-pinned');
        }
      });
      document.querySelectorAll('#work .v3-cat.is-waiting').forEach((cat) => {
        cat.classList.remove('is-waiting');
      });
    };
  }, []);

  return null;
}
