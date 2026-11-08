# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary reader is a recruiter or hiring decision-maker screening candidates for a
full-time role, in one of two shapes, both first-priority:

- Technical founder / hiring manager at a startup: reads Python, LLM pipelines,
  agents; wants engineering proof that opens.
- In-house recruiter / HR: skim-reads; wants role fit, reliability, and a CV.

Shared job in the first 40 seconds: decide whether this person is reliable and
whether his portfolio could fill several gaps in the company, without deep
scrolling. Same reader is usually on mobile or desktop, arriving from LinkedIn
or a shared link.

## Product Purpose

nurfajar.com is Nur Fajar's hiring portfolio: a single page that answers, in the
first screen or two, who he is, what he can fill, what the proof is, and how to
reach him. Success = the reader opens the email/CV/contact in the same session,
or forwards the link.

## Positioning

An AI specialist who builds apps and communities (2026-10-16; menggantikan
"A reliable generalist who fills gaps" — kalimatnya kini verbatim tagline
masthead). The page opens with a short bio in his own
voice, then goes dry: work, praise, history, contact — with every number inside
the section that produced it. The site itself is built and guarded the way he
claims to work (single copy source, test suite that bans unsupported copy).
Another candidate could copy the role list, but not the record behind it.

## Operating Context

- Shared as a URL next to a CV (`/Nur-Fajar-Resume.pdf`) and LinkedIn.
- Read in short bursts: first screen decides whether the rest gets read.
- Deployed dual: Vercel production (nurfajar.com) + GitHub Pages mirror.
- Versioned folio history: v3–v6 remain as archives; v7 is staging at `/v7`
  before the homepage switches.
- `/v9` ("Signal", built 2026-10-20) is an **experiment route**, noindex and
  not a homepage candidate: the whole page is written in the idiom of the
  most-downloaded 21st.dev components (bento, offset testimonial columns,
  pill labels, mask reveal, spotlight, light ribbon shader) while the copy
  stays bound to the ledger. The 21st catalog was used as **research only**
  (search plus measured download counts); **no component code was retrieved
  or copied**, and the page ships with **zero new npm dependencies**. The
  v9-scoped exception to the house anti-references is limited to layout
  idiom; the rules on claims, numbers, and voice are unchanged.

## Capabilities and Constraints

- All numbers/copy derive from `content/ledger.ts` (SSOT); no retyped figures.
- Copy is guarded by vitest suites: no em-dashes, no unsupported adjectives,
  no L&D→AI causal bridges, numbers must not drift from the ledger.
- English copy only; the reader may be anywhere. The page no longer displays
  location or timezone at all (baris lokasi di masthead dihapus 2026-10-15) —
  open question: kalau itu terasa hilang, tempatnya adalah satu row di contact,
  bukan baris kecil di bawah nama.
- Availability confirmed 2026-10-14: Full-time · available immediately ·
  remote/hybrid · onsite Indonesia · willing to relocate.
- Staging pages are `robots: noindex` until promoted; sitemap lists homepage only.
- Legacy routes v3–v6 exist; v7 must not depend on them.

## Brand Commitments

- Name: Nur Fajar ("Fajar" allowed as short form). Email: hi@nurfajar.com
  (replaces hi.nurfajar@gmail.com, 2026-10-16).
- Voice: factual, honest, plain. Testimonials are verbatim from real people.
- No invented claims: every artifact link must open (JOIV DOI, crm.nurfajar.com,
  Nadi/Xcel concept sites, ai4impact Instagram). Dead links get removed, not
  relabeled (Sesi 22 rule).
- "Demo available on request" only where a real request channel exists.
- Bound visual references (user-confirmed): the clean-craft school —
  brianlovin.com, paco.me, rauno.me, antfu.me, brittanychiang.com structure,
  jim-nielsen.com proof patterns. Anti-references: puzzle/missing-piece motif,
  uniform heading formula, marquee duplication, scroll-jacking, logo soup.

## Evidence on Hand

- `content/ledger.ts`: audited numbers (300+ learners with denominator,
  9.0/10 locked to 2024–2025, 5 programs/3 modules/25+ sessions for 2025–2026,
  CRM: 9 agents, ~3,000 contacts / ~600 companies → ~500 qualified,
  ~11h vs 300+h manual = 96% less), work history, testimonials (verbatim),
  credentials with verification links.
- Live artifacts: crm.nurfajar.com, nadi-wellbeing.vercel.app,
  xcel-autodrive.vercel.app, instagram.com/ai4impact.id, JOIV DOI 10.62527/joiv.8.2.1949.
- CV: `public/Nur-Fajar-Resume.pdf` (kept in sync with ledger).
- Absences that must not be fabricated: no blog, no product screenshots for
  Remember/Nyunda (both in development; "demo available on request" note only),
  no client logos.
- Deliberate cut (v7): no live visitor-time clock; live clocks were judged chrome
  without a hiring job.
- Availability lives in the contact rows ("Looking for: Full-time", "Available:
  Immediately"). It used to be said in three places at once (revisi 2026-10-15).
- The masthead is the name and nothing else: rail navigasi dan baris lokasi
  dihapus 2026-10-15, jadi halaman ini sekarang tidak menampilkan lokasi maupun
  zona waktu sama sekali.
- The bio is verbatim founder copy and the only warm block on the page; it is
  frozen by a length guard so it cannot quietly grow. The dry register below it
  is enforced by a separate guard (revisi 2026-10-15).

## Product Principles

1. Answer fast, then explain: the first screen introduces him in his own words
   and hands over the contact strip; depth is opt-in and opens in place, never
   scroll-gated. No stat card sits above the fold (kotak Key figures dihapus
   2026-10-15).
2. Proof over adjectives: a claim earns space only if it can be checked — a
   labelled number from the ledger, an openable artifact, or a verbatim quote.
   The page never explains that it is trustworthy; it shows it.
3. One source of truth: numbers live in the ledger and nowhere else.
4. Say the boundary: scope honesty (what he did NOT own) is part of credibility.
5. Quiet craft: personality comes from precision, not decoration.

## Accessibility & Inclusion

- WCAG AA contrast; visible focus on every interactive element.
- Full parity without JS and under `prefers-reduced-motion`; no content or
  numbers accessible only via hover or animation.
- Keyboard-operable navigation; screen-reader labels on all controls.
