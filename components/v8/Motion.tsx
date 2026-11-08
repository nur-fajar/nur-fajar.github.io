'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

export default function Motion() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger, SplitText);
    document.documentElement.style.scrollBehavior = 'auto';

    const lenis = new Lenis({ lerp: 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const onAnchor = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.getElementById(href.slice(1));
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -48, duration: 1.2 });
      history.replaceState(null, '', href);
    };
    document.addEventListener('click', onAnchor);

    const allSplits: SplitText[] = [];
    let dead = false;

    /* Kursor Carbon: kotak biru yang mengikuti pointer, membesar di atas
       elemen interaktif. Hanya untuk pointer presisi; tidak jalan di
       prefers-reduced-motion (guard di atas). */
    let removeCursor: (() => void) | null = null;
    if (matchMedia('(pointer: fine)').matches) {
      const ring = document.querySelector('.v8-cursor');
      if (ring) {
        gsap.set(ring, { xPercent: -50, yPercent: -50 });
        const cx = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3' });
        const cy = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3' });
        const move = (e: PointerEvent) => {
          gsap.set(ring, { autoAlpha: 1 });
          cx(e.clientX);
          cy(e.clientY);
        };
        const over = (e: Event) => {
          const t = e.target instanceof Element ? e.target : null;
          const hot = t && t.closest('a, button, input, .v8-card');
          gsap.to(ring, { scale: hot ? 1.8 : 1, duration: 0.3, ease: 'power3.out' });
        };
        window.addEventListener('pointermove', move);
        document.addEventListener('pointerover', over);
        removeCursor = () => {
          window.removeEventListener('pointermove', move);
          document.removeEventListener('pointerover', over);
        };
      }
    }

    const ctx = gsap.context(() => {
      // Intro hero: masuk berurutan, productive motion (cepat dan kering).
      gsap.from('.v8-hero__h, .v8-hero__bio p, .v8-hero__cta', {
        y: 24,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.07,
        delay: 0.05,
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 24,
          autoAlpha: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 92%' },
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: 'none',
            scrollTrigger: {
              trigger: img.parentElement ?? img,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      });
    });

    document.fonts.ready.then(() => {
      if (dead) return;
      ctx.add(() => {
        gsap.utils.toArray<HTMLElement>('[data-split]').forEach((el) => {
          const split = SplitText.create(el, { type: 'lines', mask: 'lines' });
          allSplits.push(split);
          gsap.from(split.lines, {
            yPercent: 110,
            duration: 0.9,
            ease: 'power4.out',
            stagger: 0.08,
            scrollTrigger: { trigger: el, start: 'top 88%' },
          });
        });
        ScrollTrigger.refresh();
      });
    });

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);

    return () => {
      dead = true;
      removeCursor?.();
      window.removeEventListener('load', onLoad);
      document.removeEventListener('click', onAnchor);
      allSplits.forEach((s) => s.revert());
      ctx.revert();
      lenis.destroy();
      gsap.ticker.remove(raf);
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  return null;
}