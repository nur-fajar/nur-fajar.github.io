'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { EnvelopeSimple, PuzzlePiece } from '@phosphor-icons/react/dist/ssr';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Magnetic from '@/components/v3/Magnetic';
import { CONTACT } from '@/content/ledger';
import { V5_FOUNDER_MAILTO, V5_HERO, V5_PILLARS } from '@/content/v5';
import PuzzleField from './PuzzleField';

gsap.registerPlugin(ScrollTrigger);

/**
 * v5 hero, statement pass. Foto dan "Fajar" terlihat sejak awal, tanpa
 * hold-scroll dan tanpa hijack. Koreografinya digerakkan scroll (GSAP
 * scrub, dihaluskan Lenis): headline melayan lebih lambat dari halaman,
 * menu + CTA memudar lebih dulu, latar puzzle menyusul dengan easing
 * sendiri. Tanpa JS maupun reduced motion: semuanya statis, isi tetap
 * lengkap.
 */
export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      const hero = heroRef.current;
      if (!hero) return;
      /* Satu pemicu per lapisan, kecepatan scrub beda: three planes of depth. */
      gsap.to('.v5-mega', {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 },
      });
      gsap.to('.v5-hero__after', {
        opacity: 0.2,
        yPercent: -6,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: '55% top', scrub: 0.6 },
      });
      gsap.to('.v5-puzzlefield', {
        yPercent: 10,
        scale: 1.06,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 },
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <header className="v5-hero" id="top" ref={heroRef}>
      <PuzzleField />
      <div className="v5-shell v5-hero__inner">
        <h1 className="v5-mega">
          <span className="v5-mega__line v5-rise" style={{ ['--v5-rise-delay' as string]: '120ms' }}>
            {V5_HERO.titleLead}
          </span>
          <span
            className="v5-mega__line v5-mega__line--serif v5-rise"
            style={{ ['--v5-rise-delay' as string]: '230ms' }}
          >
            {V5_HERO.indexPrompt}
            <span className="v5-mega__mark" aria-hidden="true">
              <Image
                className="v5-mega__face"
                src="/foto-profile-nf-avatar.jpg"
                alt=""
                width={96}
                height={96}
                sizes="(max-width: 640px) 3rem, 9rem"
              />
            </span>
            <span className="v5-mega__fajar">Fajar</span>
          </span>
        </h1>

        {V5_HERO.sub.length ? (
          <div className="v5-hero__sub v5-rise" style={{ ['--v5-rise-delay' as string]: '420ms' }}>
            {V5_HERO.sub.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        ) : null}

        <div className="v5-hero__after">
          <ul className="v5-hero__menu v5-rise" style={{ ['--v5-rise-delay' as string]: '480ms' }} aria-label="Where I help">
            {V5_PILLARS.map((pillar) => (
              <li key={pillar.id}>
                <a href="#capabilities">
                  <span className="v5-hero__menu-tag">{pillar.tag}</span>
                  <span className="v5-hero__menu-title">{pillar.title}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="v5-hero__ctas v5-rise" style={{ ['--v5-rise-delay' as string]: '520ms' }}>
            <Magnetic strength={0.25}>
              <a
                className="v5-btn v5-btn--big"
                href={V5_FOUNDER_MAILTO}
                aria-label="Email Nur Fajar"
                data-cursor="Say hi"
              >
                <EnvelopeSimple size={19} weight="bold" aria-hidden="true" />
                {CONTACT.email}
              </a>
            </Magnetic>
            <a className="v5-hero__secondary" href="#work">
              {V5_HERO.secondaryCta}
              {/* Keping mini menggantikan panah: CTA ini "menyambungkan" pembaca
                  ke section Work, jadi penghubungnya pun berbentuk keping. */}
              <PuzzlePiece size={15} weight="bold" aria-hidden="true" />
            </a>
          </div>
        </div>

      </div>

      <div className="v5-ticker v5-rise" style={{ ['--v5-rise-delay' as string]: '740ms' }} aria-label="Services">
        <div className="v5-ticker__track">
          {[0, 1].map((copy) => (
            <div className="v5-ticker__run" key={copy} aria-hidden={copy === 1}>
              {V5_HERO.ticker.map((item) => (
                <span className="v5-ticker__item" key={item}>
                  {item}
                  {/* Separator ticker: keping mini, bukan asterisk, biar satu
                      bahasa bentuk dengan tombol-tab-keping di bawahnya. */}
                  <PuzzlePiece className="v5-ticker__star" size={12} weight="bold" aria-hidden="true" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
