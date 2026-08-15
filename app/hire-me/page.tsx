import type { Metadata } from 'next';
import Link from 'next/link';
import '../story.css';
import './hire-me.css';
import StoryNav from '@/components/story/StoryNav';
import { SOCIAL } from '@/components/story/data';
import { REFERENCES } from '@/content/references';
import { DownloadIcon, LinkedInIcon, MailIcon } from '@/components/story/icons';
import {
  CASES,
  FAQS,
  FAILURES,
  FINAL_CTA,
  HERO,
  HERO_STATS,
  LOGOS,
  PROCESS,
  SERVICES,
} from '@/content/hireMe';

export const metadata: Metadata = {
  title: 'Hire me',
  description:
    'Hire Nur Fajar — Learning & Development specialist. GenAI training programmes, instructional design, AI workflow automation, and Train the Trainers. 350+ learners trained, 9.0/10 mean satisfaction.',
  alternates: { canonical: '/hire-me' },
  openGraph: {
    title: 'Hire Nur Fajar — Learning & Development Specialist',
    description:
      'Training your team actually applies: curriculum, delivery, evaluation, and the automation underneath it.',
    images: ['/og.png'],
  },
};

// Subject-nya diisi di depan supaya email masuk sudah terklasifikasi, dan
// supaya pengunjung tidak menatap kolom kosong — friction terakhir sebelum
// konversi biasanya justru "harus nulis apa".
const MAILTO = `mailto:${SOCIAL.email}?subject=${encodeURIComponent(
  'Hiring enquiry — L&D',
)}&body=${encodeURIComponent(
  "Hi Fajar,\n\nWe're looking at:\n- The gap:\n- Who it's for:\n- Rough timeline:\n\nThanks,\n",
)}`;

/**
 * `/hire-me` — halaman konversi.
 *
 * Sengaja BUKAN scroll-story seperti `/`. Homepage bekerja secara naratif dan
 * menahan ajakan bertindak sampai akhir; halaman ini kebalikannya — CTA muncul
 * di layar pertama, lalu diulang setelah tiap blok bukti, dan section-nya
 * berurut sebagai satu perjalanan: masalah → solusi → bukti → suara orang lain
 * → proses → bantahan keberatan → ajakan terakhir.
 *
 * Semua token warna, font, dan style navbar-nya menumpang `story.css` (yang
 * menggantung tokennya di `html:has(.story-root)`), jadi pembungkus di bawah
 * memakai kelas `.story-root` dan halaman ini otomatis ikut tema gelap/terang
 * yang sama — termasuk togglenya, karena `StoryNav` sudah membawa
 * `StoryThemeToggle`. Hero-nya memakai `id="story-hero"` karena itulah elemen
 * yang diamati `StoryNav` untuk memutuskan kapan navbar meluncur turun.
 *
 * Tidak ada Framer Motion di sini, dan itu disengaja: halaman ini seluruhnya
 * server component statis. Halaman yang tugasnya menutup kesepakatan tidak
 * boleh punya satu pun elemen yang menunggu JS untuk jadi terbaca.
 */
export default function HireMePage() {
  return (
    <div className="story-root hire">
      <StoryNav />

      <main className="hire-main">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="hire-hero" id="story-hero">
          <p className="hire-status">
            <span className="hire-status__dot" aria-hidden="true" />
            {HERO.status}
          </p>

          <h1 className="hire-hero__h1">
            {HERO.h1[0]}
            <br />
            <em>{HERO.h1[1]}</em>
          </h1>

          <p className="hire-hero__sub">{HERO.sub}</p>

          <div className="hire-ctas">
            <a className="hire-btn hire-btn--primary" href={SOCIAL.cal} target="_blank" rel="noopener noreferrer">
              {HERO.primaryCta}
            </a>
            <a className="hire-btn hire-btn--ghost" href={MAILTO}>
              <MailIcon size={16} />
              {HERO.secondaryCta}
            </a>
          </div>

          <p className="hire-hero__reassure">{FINAL_CTA.reassure}</p>

          <ul className="hire-stats">
            {HERO_STATS.map((s) => (
              <li key={s.label}>
                <span className="hire-stats__value">{s.value}</span>
                <span className="hire-stats__label">{s.label}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Trust bar ────────────────────────────────────────────────── */}
        <section className="hire-logos" aria-label="Organisations worked with">
          <p className="hire-eyebrow">Programmes built, delivered, or led at</p>
          <ul className="hire-logos__row">
            {LOGOS.map((logo) => (
              <li key={logo.alt}>
                {/* eslint-disable-next-line @next/next/no-img-element -- aset lokal berukuran tetap,
                    dan halaman ini juga di-build sebagai static export (next/image tanpa optimizer). */}
                <img src={logo.src} alt={logo.alt} width={40} height={40} loading="lazy" />
                <span>{logo.alt}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Problem ──────────────────────────────────────────────────── */}
        <section className="hire-section" aria-labelledby="hire-why-h">
          <p className="hire-eyebrow">01 · The problem</p>
          <h2 className="hire-h2" id="hire-why-h">
            Why most training gets good reviews and <em>changes nothing.</em>
          </h2>

          <ul className="hire-fail">
            {FAILURES.map((f) => (
              <li key={f.problem} className="hire-fail__item">
                <h3 className="hire-fail__problem">{f.problem}</h3>
                <p className="hire-fail__because">{f.because}</p>
                <p className="hire-fail__fix">
                  <span className="hire-fail__fixlabel">How I handle it</span>
                  {f.fix}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Services ─────────────────────────────────────────────────── */}
        <section className="hire-section" aria-labelledby="hire-services-h">
          <p className="hire-eyebrow">02 · What you can hire me for</p>
          <h2 className="hire-h2" id="hire-services-h">
            Four things, and the <em>proof each one works.</em>
          </h2>

          <ul className="hire-services">
            {SERVICES.map((s) => (
              <li key={s.n} className="hire-service">
                <span className="hire-service__n">{s.n}</span>
                <h3 className="hire-service__name">{s.name}</h3>
                <p className="hire-service__promise">{s.promise}</p>
                <ul className="hire-service__list">
                  {s.deliverables.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
                <p className="hire-service__proof">{s.proof}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Evidence ─────────────────────────────────────────────────── */}
        <section className="hire-section" aria-labelledby="hire-cases-h">
          <p className="hire-eyebrow">03 · Evidence</p>
          <h2 className="hire-h2" id="hire-cases-h">
            Three engagements, <em>result first.</em>
          </h2>

          <ul className="hire-cases">
            {CASES.map((c) => (
              <li key={c.title} className="hire-case">
                <div className="hire-case__metric">
                  <span className="hire-case__value">{c.metric}</span>
                  <span className="hire-case__mlabel">{c.metricLabel}</span>
                </div>
                <div className="hire-case__body">
                  <h3 className="hire-case__title">{c.title}</h3>
                  <p className="hire-case__context">{c.context}</p>
                  <ul className="hire-case__did">
                    {c.did.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                  <p className="hire-case__result">{c.result}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="hire-midcta">
            <p>Want the same shape of result for your team?</p>
            <a className="hire-btn hire-btn--primary" href={SOCIAL.cal} target="_blank" rel="noopener noreferrer">
              {HERO.primaryCta}
            </a>
          </div>
        </section>

        {/* ── Testimonials ─────────────────────────────────────────────── */}
        <section className="hire-section" aria-labelledby="hire-refs-h">
          <p className="hire-eyebrow">04 · What people who worked with me say</p>
          <h2 className="hire-h2" id="hire-refs-h">
            Five perspectives — a manager, a teammate, <em>and three people I taught.</em>
          </h2>

          <ul className="hire-refs">
            {REFERENCES.map((r) => (
              <li key={r.name} className="hire-ref">
                <span className="hire-ref__tag">{r.tag}</span>
                <blockquote>{r.quote}</blockquote>
                <div className="hire-ref__by">
                  <span className="hire-ref__avatar" aria-hidden="true">
                    {r.initial}
                  </span>
                  <span>
                    <strong>{r.name}</strong>
                    <span className="hire-ref__role">{r.role}</span>
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <p className="hire-refs__more">
            <a href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer">
              All 11 recommendations on LinkedIn →
            </a>
          </p>
        </section>

        {/* ── Process ──────────────────────────────────────────────────── */}
        <section className="hire-section" aria-labelledby="hire-process-h">
          <p className="hire-eyebrow">05 · How working together goes</p>
          <h2 className="hire-h2" id="hire-process-h">
            No mystery, <em>no surprise invoice.</em>
          </h2>

          <ol className="hire-process">
            {PROCESS.map((s) => (
              <li key={s.n} className="hire-step">
                <span className="hire-step__n">{s.n}</span>
                <div>
                  <h3 className="hire-step__name">
                    {s.name}
                    <span className="hire-step__when">{s.when}</span>
                  </h3>
                  <p className="hire-step__detail">{s.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Objections ───────────────────────────────────────────────── */}
        <section className="hire-section" aria-labelledby="hire-faq-h">
          <p className="hire-eyebrow">06 · Before you ask</p>
          <h2 className="hire-h2" id="hire-faq-h">
            The questions that usually come <em>right before a yes.</em>
          </h2>

          {/* <details> asli, bukan akordeon buatan sendiri: keyboard, screen
              reader, dan Ctrl+F sudah benar tanpa satu baris JS pun. */}
          <ul className="hire-faq">
            {FAQS.map((f) => (
              <li key={f.q}>
                <details className="hire-faq__item">
                  <summary>
                    {f.q}
                    <span className="hire-faq__mark" aria-hidden="true" />
                  </summary>
                  <p>{f.a}</p>
                </details>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Final CTA ────────────────────────────────────────────────── */}
        <section className="hire-final" aria-labelledby="hire-final-h">
          <h2 className="hire-final__h" id="hire-final-h">
            {FINAL_CTA.heading[0]}
            <br />
            <em>{FINAL_CTA.heading[1]}</em>
          </h2>
          <p className="hire-final__sub">{FINAL_CTA.sub}</p>

          <div className="hire-ctas">
            <a className="hire-btn hire-btn--primary" href={SOCIAL.cal} target="_blank" rel="noopener noreferrer">
              {HERO.primaryCta}
            </a>
            <a className="hire-btn hire-btn--ghost" href={MAILTO}>
              <MailIcon size={16} />
              {HERO.secondaryCta}
            </a>
          </div>
          <p className="hire-hero__reassure">{FINAL_CTA.reassure}</p>

          <ul className="hire-final__links">
            <li>
              <a href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer">
                <LinkedInIcon size={17} />
                <span>LinkedIn</span>
              </a>
            </li>
            <li>
              <a href={SOCIAL.resume} target="_blank" rel="noopener noreferrer">
                <DownloadIcon size={17} />
                <span>Resume</span>
              </a>
            </li>
            <li>
              <Link href="/">
                <span>← Back to the full story</span>
              </Link>
            </li>
          </ul>
        </section>
      </main>

      {/* Bar CTA yang menempel di dasar layar, HANYA di layar sempit: di
          desktop CTA hero masih terlihat lama, di ponsel ia hilang setelah
          satu ayunan jempol. */}
      <div className="hire-dock" aria-hidden="false">
        <a className="hire-btn hire-btn--primary" href={SOCIAL.cal} target="_blank" rel="noopener noreferrer">
          Book a 15-min call
        </a>
        <a className="hire-btn hire-btn--ghost" href={MAILTO} aria-label="Email me directly">
          <MailIcon size={17} />
        </a>
      </div>
    </div>
  );
}
