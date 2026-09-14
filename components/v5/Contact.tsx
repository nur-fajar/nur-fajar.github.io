'use client';

import { useState } from 'react';
import { ArrowRight, CalendarBlank, Check, CopySimple } from '@phosphor-icons/react';
import { CONTACT, LAST_UPDATED } from '@/content/ledger';
import { V5_CONTACT_CLOSE, V5_FOUNDER_MAILTO, V5_SECTIONS } from '@/content/v5';
import Magnetic from '@/components/v3/Magnetic';
import LocalTime from './LocalTime';
import PuzzleField from './PuzzleField';
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
      <a className="v5-mailmega" href={V5_FOUNDER_MAILTO}>
        <span className="v5-mailmega__addr">{CONTACT.email}</span>
      </a>
      <div className="v5-contact__actions">
        <Magnetic strength={0.25}>
          <a
            className="v5-btn v5-btn--big"
            href={CONTACT.cal}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Book 15-min intro call in Contact, opens booking page in a new tab"
          >
            <CalendarBlank size={19} weight="bold" aria-hidden="true" />
            Book 15-min intro
            <span className="v5-btn__go" aria-hidden="true">
              <ArrowRight size={17} weight="bold" />
            </span>
          </a>
        </Magnetic>
      </div>
      <p className="v5-contact__close">{V5_CONTACT_CLOSE}</p>
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
