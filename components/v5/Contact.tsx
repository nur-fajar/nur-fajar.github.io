'use client';

import { useState } from 'react';
import { Check, CopySimple } from '@phosphor-icons/react';
import { CONTACT, LAST_UPDATED } from '@/content/ledger';
import { V5_FOUNDER_MAILTO, V5_SECTIONS } from '@/content/v5';
import LocalTime from './LocalTime';
import PuzzleField from './PuzzleField';
import Reveal from '@/components/site/Reveal';
import Section, { findSection } from './Section';

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
  return (
    <Section section={section} backdrop={<PuzzleField />}>
      <p className="v5-avail">
        <span className="v5-avail__dot" aria-hidden="true" />
        Available immediately
        <span className="v5-avail__sep" aria-hidden="true">
          ·
        </span>
        Jakarta <LocalTime className="v5-avail__time" /> GMT+7
      </p>
      {/* Email duduk di dalam satu keping puzzle: slot kosong di latar
          yang baru saja terisi. Knob + socket di sisinya dari CSS murni;
          kepingnya masuk lewat Reveal biar "terpasang", bukan muncul. */}
      <Reveal delay={0.2}>
        <div className="v5-piece">
          <a className="v5-mailmega" href={V5_FOUNDER_MAILTO} data-cursor="Say hi">
            <span className="v5-mailmega__addr">{CONTACT.email}</span>
          </a>
        </div>
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
