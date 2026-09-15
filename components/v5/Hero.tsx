'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowDown, EnvelopeSimple } from '@phosphor-icons/react/dist/ssr';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Magnetic from '@/components/v3/Magnetic';
import { CONTACT } from '@/content/ledger';
import { V5_FOUNDER_MAILTO, V5_HERO, V5_PILLARS } from '@/content/v5';
import PuzzleField from './PuzzleField';

gsap.registerPlugin(ScrollTrigger);

/** Satu kalimat jadi kata-kata berisi mask karakter, stagger global di
 *  dalam baris. Space antar kata = text node biasa, satu-satunya titik
 *  yang boleh dipecah barisnya. */
function CharLine({ text, serif = false }: { text: string; serif?: boolean }) {
  return (
    <>
      {text.split(' ').map((word, w, words) => (
        <span key={w} aria-hidden="true">
          <span className="v5-word">
            {[...word].map((ch, i) => (
              <span className="v5-ch" key={i}>
                <span className={serif ? 'v5-ch__c v5-ch__c--serif' : 'v5-ch__c'} style={{ ['--ci' as string]: i }}>
                  {ch}
                </span>
              </span>
            ))}
          </span>
          {w < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </>
  );
}

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
  const tickerRef = useRef<HTMLDivElement>(null);

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
    /* Ticker satu driver: kecepatan dasar + boost scroll + drag/lempar.
       CSS animation hanya fallback no-JS; saat JS aktif kelas is-driven
       mematikan animasi CSS dan offset dikemudikan inline per frame.
       ponytail: konstanta heuristik (BASE px/s, decay fling), bukan fisika. */
    const track = tickerRef.current;
    let stopTicker = () => {};
    if (track) {
      track.classList.add('is-driven');
      let runW = track.children[0] ? (track.children[0] as HTMLElement).offsetWidth : 0;
      const measure = () => {
        runW = track.children[0] ? (track.children[0] as HTMLElement).offsetWidth : 0;
      };
      const BASE = 60;
      let offset = 0;
      let lastY = window.scrollY;
      let boost = 0;
      let fling = 0;
      let dragging = false;
      let lastX = 0;
      let lastT = 0;
      const wrap = (v: number) => (runW > 0 ? ((v % runW) + runW) % runW - runW : v);
      const paint = () => {
        track.style.transform = `translate3d(${offset.toFixed(1)}px,0,0)`;
      };
      const onTick = (_time: number, dtMs: number) => {
        const dt = Math.min(dtMs / 1000, 0.05);
        const y = window.scrollY;
        const target = dt > 0 ? Math.min(Math.abs(y - lastY) / dt / 2500, 4) * BASE : 0;
        lastY = y;
        boost += (target - boost) * 0.08;
        if (dragging) return;
        offset = wrap(offset - (BASE + boost + fling) * dt);
        fling *= Math.pow(0.12, dt);
        if (Math.abs(fling) < 2) fling = 0;
        paint();
      };
      /* Drag khusus mouse: touch tetap scroll natural halaman. */
      const fine = window.matchMedia('(pointer: fine)').matches;
      const down = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse' || e.button !== 0) return;
        dragging = true;
        lastX = e.clientX;
        lastT = performance.now();
        fling = 0;
        track.classList.add('is-grabbed');
        e.preventDefault();
      };
      const move = (e: PointerEvent) => {
        if (!dragging) return;
        const now = performance.now();
        const dx = e.clientX - lastX;
        const dt = Math.max((now - lastT) / 1000, 0.001);
        offset = wrap(offset + dx);
        paint();
        fling = 0.7 * fling - 0.3 * (dx / dt);
        fling = Math.max(-1500, Math.min(1500, fling));
        lastX = e.clientX;
        lastT = now;
      };
      const up = () => {
        dragging = false;
        track.classList.remove('is-grabbed');
      };
      gsap.ticker.add(onTick);
      window.addEventListener('resize', measure);
      if (fine) {
        track.addEventListener('pointerdown', down);
        window.addEventListener('pointermove', move, { passive: true });
        window.addEventListener('pointerup', up);
      }
      stopTicker = () => {
        gsap.ticker.remove(onTick);
        window.removeEventListener('resize', measure);
        if (fine) {
          track.removeEventListener('pointerdown', down);
          window.removeEventListener('pointermove', move);
          window.removeEventListener('pointerup', up);
        }
        track.classList.remove('is-driven', 'is-grabbed');
        track.style.transform = '';
      };
    }
    return () => {
      stopTicker();
      ctx.revert();
    };
  }, []);

  return (
    <header className="v5-hero" id="top" ref={heroRef}>
      <PuzzleField />
      <div className="v5-shell v5-hero__inner">
        <h1 className="v5-mega">
          {/* Char-rise ala HorizonX. Karakter dikelompokkan per kata dalam
              span nowrap: tanpa itu browser bebas memecah baris di antara
              dua huruf (pernah terjadi: "MISSI / NG PIECE?"). Break hanya
              boleh terjadi di spasi antar kata. */}
          <span className="v5-mega__line" aria-label={V5_HERO.titleLead}>
            <CharLine text={V5_HERO.titleLead} />
          </span>
          <span
            className="v5-mega__line v5-mega__line--serif"
            aria-label={`${V5_HERO.indexPrompt} Fajar`}
          >
            <CharLine text={V5_HERO.indexPrompt} serif />
            <span className="v5-mega__sig" aria-hidden="true">
              <span className="v5-mega__mark v5-fadescale">
                <Image
                  className="v5-mega__face"
                  src="/foto-profile-nf-avatar.jpg"
                  alt=""
                  width={96}
                  height={96}
                  sizes="(max-width: 640px) 3rem, 9rem"
                />
              </span>
              <span className="v5-mega__fajar v5-fadescale v5-fadescale--late">Fajar</span>
            </span>
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
              <ArrowDown size={15} weight="bold" aria-hidden="true" />
            </a>
          </div>
        </div>

      </div>

      <div
        className="v5-ticker v5-rise"
        style={{ ['--v5-rise-delay' as string]: '740ms' }}
        aria-label="Services"
        data-cursor="Drag"
      >
        <div className="v5-ticker__track" ref={tickerRef}>
          {[0, 1].map((copy) => (
            <div className="v5-ticker__run" key={copy} aria-hidden={copy === 1}>
              {V5_HERO.ticker.map((item) => (
                <span className="v5-ticker__item" key={item}>
                  {item}
                  <span className="v5-ticker__star" aria-hidden="true">
                    ✳
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
