import Image from 'next/image';
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import {
  BUILT,
  CRM_PROJECT,
  V3_GALLERY_CATEGORY,
  V3_PROJECT_CATEGORIES,
  V3_SECTIONS,
  V3_WEBSITES,
  WORK,
  WORK_GALLERY,
  type V3Category,
} from '@/content/ledger';
import GalleryPin from '../GalleryPin';
import GalleryRail from '../GalleryRail';
import Section, { findSection } from '../Section';

/**
 * Empat kategori, lalu satu kartu yang sengaja berdiri di luar keempatnya.
 * Panel ADDIE ("Behind the work") sudah tidak tampil di sini — ia tetap
 * hidup di homepage lama lewat components/site/Work.tsx.
 */
function CategoryHead({ id }: { id: V3Category }) {
  const category = V3_PROJECT_CATEGORIES.find((entry) => entry.id === id);
  if (!category) throw new Error(`Kategori "${id}" tidak ada di V3_PROJECT_CATEGORIES`);
  /* Nomor cerminan indeks (01–04), dihitung dari urutan yang sama — bukan
     konstanta baru yang bisa basi sebelah. */
  const num = String(V3_PROJECT_CATEGORIES.findIndex((entry) => entry.id === id) + 1).padStart(
    2,
    '0',
  );

  return (
    <header className="v3-cat__head" id={`work-${id}`}>
      <h3 className="v3-cat__label">{category.label}</h3>
      <span className="v3-cat__num" aria-hidden="true">
        {num}
      </span>
      <p className="v3-cat__blurb">{category.blurb}</p>
    </header>
  );
}

function GalleryGrid({ target }: { target: V3Category }) {
  const items = WORK_GALLERY.filter((item) => V3_GALLERY_CATEGORY[item.category] === target);

  return (
    <GalleryRail>
      {items.map((item) => (
        <li key={item.id}>
          <a className="v3-gallery__item" href={item.href} target="_blank" rel="noreferrer">
            {/* Seret mouse memakai pointer events sendiri; ghost drag bawaan
                gambar wajib mati supaya tidak menimpa seret itu. */}
            {/* Breakpoint situs ini 980px dan 640px, bukan lebar --v3-maxw.
                sizes yang memakai angka yang salah diam-diam mengunduh berkas
                lebih besar daripada yang pernah ditampilkan. */}
            <Image
              src={item.thumbnail}
              alt={item.title}
              width={640}
              height={800}
              sizes="(max-width: 640px) 50vw, (max-width: 980px) 33vw, 20vw"
              draggable={false}
            />
            <span className="v3-gallery__caption">{item.title}</span>
          </a>
        </li>
      ))}
    </GalleryRail>
  );
}

export default function Work() {
  const section = findSection(V3_SECTIONS, 'work');

  return (
    <Section section={section}>
      <GalleryPin />

      {/* ── Course ─────────────────────────────────────────────────────── */}
      <CategoryHead id="course" />

      <ul className="v3-cards v3-cards--three">
        {WORK.map((course) => (
          <li key={course.id}>
            <a className="v3-card v3-course" href={course.href} target="_blank" rel="noreferrer">
              <p className="v3-kind">{course.kind}</p>
              <h4 className="v3-card__title">{course.title}</h4>
              <p className="v3-card__body">{course.body}</p>
              <span className="v3-card__go" aria-hidden="true">
                <ArrowUpRight size={16} weight="bold" />
              </span>
            </a>
          </li>
        ))}
      </ul>

      <ul className="v3-cards v3-cards--two">
        {BUILT.map((card) => (
          <li className="v3-card" key={card.id}>
            <h4 className="v3-card__title">{card.title}</h4>
            <p className="v3-card__body">{card.body}</p>
            <ul className="v3-chips">
              {card.metrics.map((metric) => (
                <li key={metric}>{metric}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      {/* ── Video, then Design ─────────────────────────────────────────── */}
      {/* Tiap pasangan kepala + rel dibungkus .v3-cat: GalleryPin mem-pin
          blok ini utuh (kepala ikut menempel) selama scroll vertikal
          dipakai menghabiskan pan horizontal relnya. */}
      <div className="v3-cat">
        <CategoryHead id="video" />
        <GalleryGrid target="video" />
      </div>

      <div className="v3-cat">
        <CategoryHead id="design" />
        <GalleryGrid target="design" />
      </div>

      {/* ── Website ────────────────────────────────────────────────────── */}
      <CategoryHead id="website" />
      <ul className="v3-cards v3-cards--two">
        {V3_WEBSITES.map((site) => (
          <li className="v3-card" key={site.id}>
            <a className="v3-card__link" href={site.href} target="_blank" rel="noreferrer">
              <h4 className="v3-card__title">
                {site.name}
                <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
              </h4>
            </a>
            <p className="v3-card__body">{site.body}</p>
            <ul className="v3-chips">
              {site.stack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      {/* Berdiri di luar keempat kategori, dan labelnya yang mengerjakan
          pemisahan itu. Menyelipkannya ke dalam salah satu kategori akan
          membatalkan satu-satunya mekanisme yang memisahkannya dari kerja
          Learning & Development. */}
      <div className="v3-card v3-aside">
        <p className="v3-kind v3-kind--aside">{CRM_PROJECT.kind}</p>
        <h4 className="v3-card__title">{CRM_PROJECT.title}</h4>
        <p className="v3-card__body">{CRM_PROJECT.body}</p>
        <ul className="v3-chips">
          {CRM_PROJECT.metrics.map((metric) => (
            <li key={metric}>{metric}</li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
