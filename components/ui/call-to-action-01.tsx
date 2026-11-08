'use client';

import { Fragment, useEffect, useRef, useState } from 'react';

import { Boxes } from '@/components/ui/background-boxes';
import { Button } from '@/components/ui/button';
import { V9_BIO_LINES, V9_HERO } from '@/content/v9';

/**
 * Cta1 - hero homepage, adaptasi komponen "call-to-action-01" milik
 * @aliimam di 21st.dev (edisi 2026-11-08).
 *
 * Latar diganti atas permintaan founder (2026-11-08): komponen
 * "background-boxes" Aceternity, edisi light - tembok sel miring dengan
 * panifikasi pastel saat hover, memudar putih di tepi. Grid hairline
 * versi pertama digantinya.
 *
 * Yang dipinjam dari referensi: bidang putih dengan grid hairline di
 * belakang (border-x yang memudar + pola svg 60px jejitawan), headline
 * font-medium di tengah, dan dua tombol shadcn.
 *
 * Yang dipakai ganti-perangkat, sesuai keputusan founder (bedanya dengan
 * referensi, dan alasannya):
 *   - Deretan badge bintang di atas headline diganti foto kartun founder
 *     (badge "Read our launch article" di referensi pun jabatannya
 *     menjadi foto, edisi sebelum ini).
 *   - Headlinenya dua baris: lead statis + satu frasa yang berotasi
 *     (warisan "animated-hero", dipertahankan founder 2026-11-08).
 *   - Tidak ada grid logo bawah: "Jump on a call / Sign up here" referensi
 *     diganti kontak nyata dari kanon (email + LinkedIn).
 *
 * Semua teks dari kanon content/v9.ts, tidak ada yang diketik di sini.
 * Rotasi frasa digerakkan CSS (animate-roll-in di base.css), bukan GSAP:
 * tanpa JavaScript pun halaman terbaca utuh, dan `prefers-reduced-motion`
 * mematikan interval sebelum ia pernah berjalan.
 */
export function Cta1() {
  const [index, setIndex] = useState(0);
  const slotRef = useRef<HTMLSpanElement>(null);
  const phrase = V9_HERO.rotating[index % V9_HERO.rotating.length];

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(
      () => setIndex((prev) => (prev + 1) % V9_HERO.rotating.length),
      2600,
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="relative flex min-h-svh flex-col justify-center py-32">
      <div className="container mx-auto">
        {/* Latar: sel-sel miring edisi light (components/ui/background-boxes).
          Biar pintar lagaksmooth dan tidak mengganggu teks: tembok selnya
          diturunkan ke opacity-70, plus satu vignette sanft di tepi yang
          hanya menurunkan sampai 45% (bukan nol, supaya tidak kembali ada
          zona putih polos). Konten di atasnya tetap membawa z-20. */}
        <div className="absolute inset-0 overflow-hidden [mask-image:radial-gradient(ellipse_at_center,black_62%,rgba(0,0,0,0.45))]">
          <Boxes className="opacity-70" />
        </div>

        <div className="relative z-20 flex flex-col items-center px-4 pb-32 pt-24 text-center">
          {/* Foto kartun menggantikan deretan badge bintang di referensi. */}
          <img
            className="mb-10 size-16 rounded-2xl object-cover shadow-sm ring-1 ring-border"
            src={V9_HERO.avatar.src}
            width={V9_HERO.avatar.width}
            height={V9_HERO.avatar.height}
            alt={V9_HERO.avatar.alt}
            fetchPriority="high"
          />

          {/* Headline: lead statis + frasa yang berotasi di slot tirai. */}
          <h2 className="max-w-lg text-balance text-4xl font-medium tracking-tight sm:text-5xl">
            <span className="block">{V9_HERO.lead}</span>{' '}
            <span className="block overflow-hidden leading-tight">
              <span
                ref={slotRef}
                key={phrase}
                className="inline-block animate-roll-in motion-reduce:animate-none"
              >
                {phrase}
              </span>
            </span>
          </h2>

          {/* Bio founder: empat baris tetap (dua paragraf dua baris),
              pemenggalannya dari kanon V9_BIO_LINES. Di layar sempit
              baris-baris itu kembali mengalir alami (inline) supaya
              tidak meluber; di desktop masing-masing jadi block. */}
          <div className="mt-6 max-w-[62rem] text-lg font-medium text-muted-foreground sm:text-xl">
            {V9_BIO_LINES.map((lines, group) => (
              <p key={lines[0].slice(0, 24)} className="mt-8 first:mt-0">
                {lines.map((line, li) => (
                  <Fragment key={line}>
                    {li > 0 ? ' ' : null}
                    <span className={li === 0 ? 'sm:block' : undefined}>{line}</span>
                  </Fragment>
                ))}
              </p>
            ))}
          </div>

          {/* Dua aksi dari kanon kontak: email dialamat mailto, LinkedIn
              buka tab baru karena link keluar situs. */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {V9_HERO.ctas.map((cta, i) => {
              const isExternal = cta.href.startsWith('http');
              return (
                <Button key={cta.href} asChild variant={i === 1 ? 'secondary' : 'default'}>
                  <a
                    href={cta.href}
                    {...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {})}
                  >
                    {cta.label}
                  </a>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Cta1;
