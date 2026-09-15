'use client';

import { useEffect, useState } from 'react';
import { Check, CopySimple } from '@phosphor-icons/react/dist/ssr';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CONTACT, LAST_UPDATED } from '@/content/ledger';
import { V5_FOUNDER_MAILTO, V5_SECTIONS } from '@/content/v5';
import LocalTime from './LocalTime';
import PuzzleField from './PuzzleField';
import Reveal from '@/components/site/Reveal';
import Magnetic from '@/components/v3/Magnetic';
import Section, { findSection } from './Section';

gsap.registerPlugin(ScrollTrigger);

/** Jam pengunjung (zona waktu perangkat), pendamping LocalTime Jakarta:
 *  empati ke hiring manager di luar GMT+7. Pola island yang sama. */
function VisitorTime() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 15000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span title="Your local time" suppressHydrationWarning>
      {new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(now)}
    </span>
  );
}

/** Copy-email fallback for visitors without a mail client or with cal.com blocked. */
function CopyEmail() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
    } catch {
      /* clipboard unavailable (permissions, non-secure context): fall back to prompt-less select */
      const area = document.createElement('textarea');
      area.value = CONTACT.email;
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button type="button" className="v5-link-caps v5-link-caps--btn" onClick={copy}>
      {copied ? <Check size={13} weight="bold" aria-hidden="true" /> : <CopySimple size={13} weight="bold" aria-hidden="true" />}
      {copied ? 'Email copied' : 'Copy email'}
    </button>
  );
}

/** Contact as a centered monument: pill, giant email, one booking CTA. */
export default function Contact() {
  const section = findSection(V5_SECTIONS, 'contact');

  /* Judul jadi fill-text scroll-linked: sapuan biru mengisi glyph tinta
     saat section masuk. Kelas is-fill dipasang dari JS supaya tanpa JS
     (atau reduced motion) judul tetap tinta biasa. */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const sec = document.getElementById('contact');
    const title = sec?.querySelector('.v5-section__title');
    if (!sec || !title) return;
    const lines = title.querySelectorAll('.v5-mask__line');
    if (!lines.length) return;
    title.classList.add('is-fill');
    const tween = gsap.fromTo(
      lines,
      { backgroundSize: '0% 100%, 100% 100%' },
      {
        backgroundSize: '100% 100%, 100% 100%',
        ease: 'none',
        stagger: 0.2,
        scrollTrigger: { trigger: sec, start: 'top 80%', end: 'top 25%', scrub: 0.6 },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      title.classList.remove('is-fill');
    };
  }, []);
  return (
    <Section section={section} backdrop={<PuzzleField />}>
      <p className="v5-avail">
        <span className="v5-avail__dot" aria-hidden="true" />
        Available immediately
        <span className="v5-avail__sep" aria-hidden="true">
          ·
        </span>
        Jakarta <LocalTime className="v5-avail__time" /> GMT+7
        <span className="v5-avail__sep" aria-hidden="true">
          ·
        </span>
        <VisitorTime /> your time
        <span className="v5-avail__sep" aria-hidden="true">
          ·
        </span>
        replies within 24h
      </p>
      {/* Email monumental: langsung di atas latar puzzle, tanpa kartu. */}
      <Reveal delay={0.2}>
        <Magnetic strength={0.12}>
          <a className="v5-mailmega" href={V5_FOUNDER_MAILTO} data-cursor="Say hi">
            <span className="v5-mailmega__addr">{CONTACT.email}</span>
          </a>
        </Magnetic>
      </Reveal>
      <p className="v5-contact__more">
        <a href={CONTACT.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <span aria-hidden="true">·</span>
        <a href={CONTACT.cv} download={CONTACT.cvFilename}>
          CV (PDF)
        </a>
        <span aria-hidden="true">·</span>
        <CopyEmail />
      </p>
      <p className="v5-contact__stamp">Last updated {LAST_UPDATED}</p>
    </Section>
  );
}
