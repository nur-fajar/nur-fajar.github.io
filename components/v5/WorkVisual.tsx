import Image from 'next/image';
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import { WORK_GALLERY } from '@/content/ledger';
import { V5_PIPELINE_STAGES } from '@/content/v5';
import GalleryStrip from './GalleryStrip';

/**
 * Visual per case di section Work: satu WorkVisual dipilih by case id.
 * Semua visual murni server component kecuali GalleryStrip (client) —
 * geraknya cuma CSS animation, jadi hidup tanpa satu baris JS per frame.
 */

const ARTIFACTS = [
  { src: '/artifacts/outline.webp', label: 'Outline' },
  { src: '/artifacts/slides.webp', label: 'Live deck' },
  { src: '/artifacts/warmup-quiz.webp', label: 'Warm-up quiz' },
  { src: '/artifacts/evaluation.webp', label: 'Evaluation' },
] as const;

interface SiteDef {
  title: string;
  addr: string;
  href: string;
  /** Screenshot dipakai kalau ada; drop file di /public/sites/<id>.jpg. */
  shot?: string;
}

const SITES: SiteDef[] = [
  { title: 'This portfolio', addr: 'nurfajar.com', href: 'https://nurfajar.com' },
  { title: 'Nadi wellbeing', addr: 'nadi-wellbeing.vercel.app', href: 'https://nadi-wellbeing.vercel.app/' },
  { title: 'Xcel Autodrive', addr: 'xcel-autodrive.vercel.app', href: 'https://xcel-autodrive.vercel.app/' },
];

function CrmVisual() {
  return (
    <figure className="v5-canvas">
      <div className="v5-crm">
        <p className="v5-crm__cap">Terra Weather B2B pivot · ~3,000 contacts in, ~500 qualified out</p>
        <div className="v5-crm__lane">
          <ol className="v5-crm__track" aria-label="Simplified pipeline stages">
            {V5_PIPELINE_STAGES.map((stage, i) => (
              <li key={stage} className={`v5-crm__node${stage === 'Human review' ? ' is-hot' : ''}`}>
                <span className="v5-crm__dot" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="v5-crm__label" aria-hidden="true">
                  {stage}
                </span>
              </li>
            ))}
          </ol>
          <div className="v5-crm__pulses" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
        </div>
        <div className="v5-crm__bars">
          <div className="v5-crm__bar">
            <span className="v5-crm__bar-label">Manual outreach</span>
            <span className="v5-crm__bar-track">
              <i className="v5-crm__bar-fill is-manual" />
            </span>
            <span className="v5-crm__bar-val">300+h</span>
          </div>
          <div className="v5-crm__bar">
            <span className="v5-crm__bar-label">Pipeline runtime</span>
            <span className="v5-crm__bar-track">
              <i className="v5-crm__bar-fill is-auto" />
            </span>
            <span className="v5-crm__bar-val">~11h</span>
          </div>
        </div>
      </div>
      <figcaption className="v5-case__cap">Simplified flow, not agent names · 96% less manual time</figcaption>
    </figure>
  );
}

function CurriculumVisual() {
  const tilts = [-3, 2, -1.5, 2.5];
  return (
    <figure className="v5-canvas">
      <div className="v5-collage">
        {ARTIFACTS.map((a, i) => (
          <figure key={a.src} className="v5-collage__item" style={{ ['--tilt' as string]: `${tilts[i]}deg` }}>
            <span className="v5-collage__ph">
              <Image src={a.src} alt={a.label} fill sizes="(max-width: 980px) 45vw, 300px" loading="lazy" />
            </span>
            <figcaption>{a.label}</figcaption>
          </figure>
        ))}
      </div>
      <figcaption className="v5-case__cap">Program artifacts, one of three modules</figcaption>
    </figure>
  );
}

function SitesVisual() {
  const tilts = [1.5, -1, 2];
  return (
    <figure className="v5-canvas">
      <div className="v5-sites">
        {SITES.map((s, i) => (
          <a
            key={s.addr}
            className="v5-siteframe"
            href={s.href}
            target="_blank"
            rel="noreferrer"
            style={{ ['--tilt' as string]: `${tilts[i]}deg` }}
          >
            <span className="v5-siteframe__chrome" aria-hidden="true">
              <i />
              <i />
              <i />
              <span className="v5-siteframe__addr">{s.addr}</span>
            </span>
            <span className="v5-siteframe__body" aria-hidden="true">
              {/* ponytail: wireframe skeleton berdiri sampai screenshot asli
                  diletakkan di /public/sites/ dan diisi ke SITES[].shot */}
              <span className="v5-skel v5-skel--hero" />
              <span className="v5-skel v5-skel--line w70" />
              <span className="v5-skel v5-skel--line w50" />
              <span className="v5-skel v5-skel--cards">
                <i />
                <i />
              </span>
            </span>
            <span className="v5-siteframe__foot">
              {s.title}
              <ArrowUpRight size={13} weight="bold" aria-hidden="true" />
            </span>
          </a>
        ))}
      </div>
      <figcaption className="v5-case__cap">Three sites, all live</figcaption>
    </figure>
  );
}

function ContentVisual() {
  return (
    <figure className="v5-canvas">
      <GalleryStrip />
      <figcaption className="v5-case__cap">
        {WORK_GALLERY.length} posts published · posters, videos, alumni stories
      </figcaption>
    </figure>
  );
}

export default function WorkVisual({ id }: { id: string }) {
  switch (id) {
    case 'crm-pipeline':
      return <CrmVisual />;
    case 'curriculum-engine':
      return <CurriculumVisual />;
    case 'web-builds':
      return <SitesVisual />;
    case 'content-engine':
      return <ContentVisual />;
    default:
      return null;
  }
}
