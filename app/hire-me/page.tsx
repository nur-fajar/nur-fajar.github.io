import type { Metadata } from 'next';
import Link from 'next/link';
import '../story.css';
import './hire-me.css';
import StoryNav from '@/components/story/StoryNav';
import {
  AWARDS,
  NUCLEUS,
  PATH_STEPS,
  REFERENCE_CARDS,
  SKILL_GROUPS,
  SOCIAL,
  WORK,
} from '@/components/story/data';
import { DownloadIcon, LinkedInIcon, MailIcon } from '@/components/story/icons';
import HudFrame from '@/components/hire/HudFrame';
import SystemBlueprint from '@/components/hire/SystemBlueprint';
import Reveal from '@/components/hire/Reveal';
import TargetWord from '@/components/hire/TargetWord';
import { LAUNCH, SECTIONS, SORTIES, SUBSYSTEM_CODES, UNIT } from '@/content/hireMe';

export const metadata: Metadata = {
  title: 'Hire me',
  description:
    'Hire Nur Fajar — Learning & Development specialist. The full cycle: design, delivery, evaluation, and the AI automation underneath. 350+ learners trained, 9.0/10 mean satisfaction.',
  alternates: { canonical: '/hire-me' },
  openGraph: {
    title: 'Hire Nur Fajar — Learning & Development Specialist',
    description: 'Design → delivery → evaluation, plus the automation underneath it.',
    images: ['/og.png'],
  },
};

// Subject-nya diisi di depan supaya email masuk sudah terklasifikasi, dan
// supaya pengunjung tidak menatap kolom kosong — friction terakhir sebelum
// konversi biasanya justru "harus nulis apa". Isinya sengaja tetap bahasa
// kerja biasa: temanya mecha, emailnya sungguhan.
const MAILTO = `mailto:${SOCIAL.email}?subject=${encodeURIComponent(
  'Hiring enquiry — Learning & Development',
)}&body=${encodeURIComponent(
  "Hi Fajar,\n\nWe're looking at:\n- The gap:\n- Who it's for:\n- Rough timeline:\n\nThanks,\n",
)}`;

/** Header kokpit — kode, nama, dan catatan pendek di kanan. */
function SectionHead({ of }: { of: keyof typeof SECTIONS }) {
  const s = SECTIONS[of];
  return (
    <header className="sec__head">
      <span className="sec__code">{s.code}</span>
      <h2 className="sec__name" id={`sec-${of}`}>
        {s.name}
      </h2>
      <span className="sec__rule" aria-hidden="true" />
      <span className="sec__note">{s.note}</span>
    </header>
  );
}

/**
 * `/hire-me` — briefing pra-peluncuran.
 *
 * ISINYA CERITA HOMEPAGE, BUKAN COPY TERSENDIRI. Section di bawah adalah
 * urutan `/` yang dibingkai ulang: StoryHero → profil unit, StoryIntro →
 * sistem inti, StoryPath → riwayat penempatan, StorySkills → subsistem,
 * StoryShowcase → rekam jejak & transmisi, StoryClosing → peluncuran. Datanya
 * diimpor langsung dari `components/story/data.ts`, jadi tidak ada satu pun
 * fakta yang punya dua salinan yang bisa berselisih.
 *
 * Palet, font, dan navbarnya menumpang `story.css` (tokennya digantung di
 * `html:has(.story-root)`), lalu `.hire` menimpa lapisan warnanya jadi warna
 * trad mecha — override-nya ada di hire-me.css dan hanya berlaku di dalam
 * `.hire`, jadi `/` tidak ikut berubah. Toggle terang/gelap tetap bekerja
 * karena override-nya ditulis untuk kedua tema. Hero memakai `id="story-hero"`
 * karena itulah elemen yang diamati `StoryNav` untuk memutuskan kapan navbar
 * meluncur turun.
 *
 * Halaman ini tetap server component. Yang butuh JS cuma tiga hal kecil dan
 * semuanya opsional: reveal antar-section (`Reveal`, dengan penawar
 * `.motion-safe`), kata berputar di penutup (`TargetWord`, yang merender kata
 * pertama tanpa JS), dan navbar. Blueprint hero serta seluruh bingkai HUD
 * digambar oleh CSS — jadi bagian yang membawa bukti tidak pernah menunggu
 * JavaScript untuk jadi terbaca.
 */
export default function HireMePage() {
  return (
    <div className="story-root hire">
      <HudFrame />
      <StoryNav />

      <main className="hire-main">
        {/* ── Hero: profil unit ────────────────────────────────────────── */}
        <section className="hire-hero" id="story-hero">
          <div className="hire-hero__text">
            <p className="hire-status">
              <span className="hire-status__dot" aria-hidden="true" />
              {UNIT.status}
            </p>

            <p className="plate">
              <span className="plate__desig">{UNIT.designation}</span>
              <span className="plate__class">{UNIT.class}</span>
            </p>

            <h1 className="hire-hero__h1">
              {UNIT.callsign}
              <em>{UNIT.tagline}</em>
            </h1>

            <div className="hire-ctas">
              <a className="hire-btn hire-btn--primary" href={SOCIAL.cal} target="_blank" rel="noopener noreferrer">
                {UNIT.primaryCta}
              </a>
              <a className="hire-btn hire-btn--ghost" href={MAILTO}>
                <MailIcon size={16} />
                {UNIT.secondaryCta}
              </a>
            </div>

            <p className="hire-hero__reassure">{UNIT.reassure}</p>
          </div>

          <SystemBlueprint />
        </section>

        {/* ── SEC-01 · Sistem inti (StoryIntro) ────────────────────────── */}
        <section className="sec" aria-labelledby="sec-core">
          <SectionHead of="core" />
          <Reveal>
            {/* Dua kalimat ini milik StoryIntro di homepage. Penekanannya
                tertanam di tengah kalimat, jadi ia hidup sebagai JSX di sini —
                sama seperti di komponen aslinya — bukan sebagai data. */}
            <p className="core">
              I run the full cycle of Learning &amp; Development — end-to-end, from <em>design</em> to{' '}
              <em>delivery</em> to <em>evaluation</em>.
            </p>
            <p className="core">
              I also love building things with AI — like the AI agent I embedded into my company’s CRM, which now
              does the work of <mark>1,000+ human-hours</mark>, automatically.
            </p>
          </Reveal>
        </section>

        {/* ── SEC-02 · Riwayat penempatan (StoryPath) ──────────────────── */}
        <section className="sec" aria-labelledby="sec-sorties">
          <SectionHead of="sorties" />
          <ol className="sortie">
            {SORTIES.map((s, i) => {
              // Indeks 0 adalah nucleus orbit di homepage (Unsil); sisanya
              // memakai node ring yang terbuka di step yang sama.
              const nodes = i === 0 ? [NUCLEUS] : PATH_STEPS[i].nodes;
              return (
                <li key={s.code}>
                  <Reveal className="sortie__row" delay={0.04 * i}>
                    <div className="sortie__mark">
                      <span className="sortie__code">{s.code}</span>
                      <span className="sortie__phase">{s.phase}</span>
                    </div>
                    <div className="sortie__body">
                      <ul className="sortie__chips">
                        {nodes.map((n) => (
                          <li key={n.src}>
                            {/* eslint-disable-next-line @next/next/no-img-element -- aset lokal
                                berukuran tetap, dan halaman ini juga di-build sebagai static
                                export (next/image tanpa optimizer). */}
                            <img src={n.src} alt={n.alt} width={34} height={34} loading="lazy" />
                            <span>{n.alt}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="sortie__caption">{s.caption}</p>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </section>

        {/* ── SEC-03 · Subsistem (StorySkills) ─────────────────────────── */}
        <section className="sec" aria-labelledby="sec-subsystems">
          <SectionHead of="subsystems" />
          <ul className="sys">
            {SKILL_GROUPS.map((g, i) => (
              <li key={g.name}>
                <Reveal className="sys__card" delay={0.05 * i}>
                  <span className="sys__code">{SUBSYSTEM_CODES[i]}</span>
                  <h3 className="sys__name">{g.name}</h3>
                  <ul className="sys__tags">
                    {g.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>

        {/* ── SEC-04 · Rekam jejak (StoryShowcase) ─────────────────────── */}
        <section className="sec" aria-labelledby="sec-record">
          <SectionHead of="record" />
          <div className="rec">
            <Reveal className="rec__col">
              <h3 className="rec__title">Commendations</h3>
              <ul className="rec__list">
                {AWARDS.map((a) => (
                  <li key={a.title}>
                    <span className="rec__tag">{a.tag}</span>
                    <span className="rec__name">{a.title}</span>
                    <span className="rec__sub">{a.sub}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal className="rec__col" delay={0.08}>
              <h3 className="rec__title">Mission log</h3>
              <ul className="rec__list">
                {WORK.map((w) => (
                  <li key={w.title}>
                    <span className="rec__tag">{w.tag}</span>
                    <span className="rec__name">{w.title}</span>
                    <span className="rec__sub">{w.sub}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* ── SEC-05 · Transmisi masuk (StoryShowcase quotes) ──────────── */}
        <section className="sec" aria-labelledby="sec-transmissions">
          <SectionHead of="transmissions" />
          <ul className="tx">
            {REFERENCE_CARDS.map((r, i) => (
              <li key={r.name}>
                <Reveal className="tx__card" delay={0.04 * i}>
                  <span className="tx__meta">
                    <span className="tx__bars" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                      <i />
                    </span>
                    incoming
                  </span>
                  <blockquote>{r.quote}</blockquote>
                  <div className="tx__by">
                    <span className="tx__avatar" aria-hidden="true">
                      {r.name.charAt(0)}
                    </span>
                    <span>
                      <strong>{r.name}</strong>
                      <span className="tx__role">{r.role}</span>
                    </span>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>

          <p className="tx__more">
            <a href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer">
              {/* 11 adalah jumlah rekomendasi di LinkedIn, BUKAN jumlah yang
                  ditampilkan di sini — `REFERENCE_CARDS` memuat 5 di antaranya
                  (lihat catatan pemilihannya di content/references.ts). Menulis
                  `.length` di sini akan mengubahnya jadi klaim yang salah. */}
              All 11 recommendations on LinkedIn →
            </a>
          </p>
        </section>

        {/* ── SEC-06 · Peluncuran (StoryClosing) ───────────────────────── */}
        <section className="sec sec--launch" aria-labelledby="sec-launch">
          <SectionHead of="launch" />

          <div className="launch">
            <span className="launch__stripe" aria-hidden="true" />
            <h3 className="launch__line">{LAUNCH.line}</h3>
            <p className="launch__line launch__line--roll">
              {LAUNCH.lineBefore} <TargetWord />
            </p>
            <p className="launch__sub">{LAUNCH.sub}</p>

            <div className="hire-ctas">
              <a className="hire-btn hire-btn--primary" href={SOCIAL.cal} target="_blank" rel="noopener noreferrer">
                {UNIT.primaryCta}
              </a>
              <a className="hire-btn hire-btn--ghost" href={MAILTO}>
                <MailIcon size={16} />
                {UNIT.secondaryCta}
              </a>
            </div>
            <p className="hire-hero__reassure">{UNIT.reassure}</p>

            <ul className="launch__links">
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

            <p className="launch__thanks">{LAUNCH.thanks}</p>
          </div>
        </section>
      </main>

      {/* Bar CTA yang menempel di dasar layar, HANYA di layar sempit: di
          desktop CTA hero masih terlihat lama, di ponsel ia hilang setelah
          satu ayunan jempol. */}
      <div className="hire-dock">
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
