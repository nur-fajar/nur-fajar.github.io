'use client';

/* ── Contact: two bento boxes ────────────────────────────────────────────
   Left  — a live Cal.com embed (cal.com/nurfajar/15min) so a visitor can
           book straight off the page, no email round-trip needed.
   Right — a "drop a message" form. This is a static site with no backend
           of its own (it ships to both Vercel and a GitHub Pages export,
           the latter with no server at all), so submission goes straight
           from the browser to Web3Forms (web3forms.com) — free tier,
           250 submissions/month, no signup required from the visitor —
           which relays it to CONTACT_EMAIL as a normal email.

   The access key below is not a secret: Web3Forms' whole model is a
   public key meant to sit in client-side code (same idea as a reCAPTCHA
   site key), scoped server-side to the one destination address it was
   created for. Nothing to hide, nothing in an env var. */

import { useEffect, useRef, useState, type FormEvent } from 'react';
import YearNow from './YearNow';
import Reveal from './motion/Reveal';
import BorderBeam from './motion/BorderBeam';
import SpotlightPanel from './motion/SpotlightPanel';
import { getMode, MODE_CHANGE_EVENT, type Mode } from '@/lib/theme';

const CONTACT_EMAIL = 'hi.nurfajar@gmail.com';
const WEB3FORMS_ACCESS_KEY = '95e8d354-0a97-4000-8798-0e12285f9251';

const CONTACT_LINKS = [
  ['mailto:' + CONTACT_EMAIL, CONTACT_EMAIL],
  ['https://www.linkedin.com/in/nurfajar/', 'linkedin/nurfajar'],
  ['https://github.com/nur-fajar', 'github/nur-fajar'],
] as const;

function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}
function MessageIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5A8.5 8.5 0 1 1 21 11.5Z" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
    </svg>
  );
}
function AtIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-4 7.5" />
    </svg>
  );
}
function NoteIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h16M4 12h16M4 19h10" />
    </svg>
  );
}
function SendIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

const EMPTY_FORM = { firstName: '', lastName: '', email: '', message: '' };
const TOAST_DURATION = 5000;

type Status = 'idle' | 'sending' | 'error';

export default function Contact() {
  // Same pattern as ThemeToggle: SSR default 'light', corrected from the DOM
  // once mounted, kept in sync so the Cal.com iframe re-mounts with the
  // matching theme whenever the visitor flips dark/light.
  const [mode, setModeState] = useState<Mode>('light');
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setModeState(getMode());
    const onChange = (e: Event) => setModeState((e as CustomEvent<Mode>).detail);
    window.addEventListener(MODE_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(MODE_CHANGE_EVENT, onChange);
  }, []);

  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  function showToast() {
    setToastVisible(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), TOAST_DURATION);
  }

  function field(key: keyof typeof EMPTY_FORM) {
    return {
      value: form[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [key]: e.target.value })),
    };
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Honeypot: a field real visitors never see or fill (see .hp-field in
    // globals.css). Bots that blind-fill every input trip it; Web3Forms
    // just silently drops the submission instead of relaying it.
    if (new FormData(e.currentTarget).get('botcheck')) return;

    setStatus('sending');
    setError('');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Portfolio message from ${form.firstName} ${form.lastName}`.trim(),
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          message: form.message,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Something went wrong.');
      setForm(EMPTY_FORM);
      setStatus('idle');
      showToast();
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  return (
    <footer id="contact" className="section">
      <Reveal as="div" className="contact-intro">
        <h2 className="section-label">Let&apos;s talk.</h2>
        <p>Available for AI L&amp;D programs, GenAI curriculum work, and automation projects.</p>
      </Reveal>

      <div className="contact-grid">
        <SpotlightPanel className="panel contact-box">
          <Reveal as="div" index={0}>
            <div className="contact-box-head">
              <span className="contact-box-icon" aria-hidden="true">
                <CalendarIcon />
              </span>
              <div>
                <h3>Let&apos;s talk live</h3>
                <p>Grab 15 minutes on my calendar.</p>
              </div>
            </div>
            <div className="cal-embed">
              <iframe
                key={mode}
                src={`https://cal.com/nurfajar/15min?embed=true&theme=${mode}`}
                title="Book a 15-minute call with Nur Fajar on Cal.com"
                loading="lazy"
              />
            </div>
          </Reveal>
        </SpotlightPanel>

        <SpotlightPanel className="panel contact-box">
          <Reveal as="div" index={1}>
            <div className="contact-box-head">
              <span className="contact-box-icon" aria-hidden="true">
                <MessageIcon />
              </span>
              <div>
                <h3>Drop a message</h3>
                <p>I&apos;ll get back within a day or two.</p>
              </div>
            </div>
            <form className="contact-form" onSubmit={handleSubmit}>
              <input type="checkbox" name="botcheck" className="hp-field" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              <div className="contact-form-row">
                <label className="contact-field">
                  <UserIcon />
                  <input required name="firstName" placeholder="First name" autoComplete="given-name" {...field('firstName')} />
                </label>
                <label className="contact-field">
                  <UserIcon />
                  <input required name="lastName" placeholder="Last name" autoComplete="family-name" {...field('lastName')} />
                </label>
              </div>
              <label className="contact-field">
                <AtIcon />
                <input required type="email" name="email" placeholder="Your email" autoComplete="email" {...field('email')} />
              </label>
              <label className="contact-field contact-field-textarea">
                <NoteIcon />
                <textarea required name="message" placeholder="Your message…" rows={5} {...field('message')} />
              </label>
              <button type="submit" className="contact-send" disabled={status === 'sending'}>
                <BorderBeam />
                <SendIcon />
                {status === 'sending' ? 'Sending…' : 'Send message'}
              </button>
              <p className={`contact-form-hint${status === 'error' ? ' is-error' : ''}`}>
                {status === 'error' ? error : `Goes straight to ${CONTACT_EMAIL}.`}
              </p>
            </form>
          </Reveal>
        </SpotlightPanel>
      </div>

      <div className="contact-links mono">
        {CONTACT_LINKS.map(([href, label]) => (
          <a key={href} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener">
            {label}
          </a>
        ))}
        <a href="/nf.pdf" download="Nur-Fajar-CV-AI-LnD-2026.pdf" target="_blank" rel="noopener">
          CV.PDF ↓
        </a>
      </div>
      <p className="foot mono">
        © <YearNow /> Nur Fajar
      </p>

      {toastVisible && (
        <div className="toast" role="status" aria-live="polite">
          <span className="toast-icon" aria-hidden="true">
            <CheckIcon />
          </span>
          <div className="toast-copy">
            <p className="toast-title">Message sent!</p>
            <p className="toast-body">Thanks — I&apos;ll get back to you within a day or two.</p>
          </div>
          <button type="button" className="toast-close" aria-label="Dismiss" onClick={() => setToastVisible(false)}>
            ×
          </button>
        </div>
      )}
    </footer>
  );
}
