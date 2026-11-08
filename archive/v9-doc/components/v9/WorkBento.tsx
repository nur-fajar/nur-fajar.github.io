import { ArrowUpRightIcon } from '@phosphor-icons/react/dist/ssr';import { V9_WORK } from '@/content/v9';

/**
 * Work v9: bento grid.
 *
 * Idiom "bento grid" (2 702 unduhan di 21st.dev) dipakai untuk enam case:
 * satu kartu besar untuk pipeline CRM, dua lebar, lalu tiga sama besar
 * untuk kasus yang lebih kecil.
 *
 * Cahaya spotlight di kartu mengikuti pointer (dua variabel CSS yang diisi
 * components/v9/Motion.tsx). Tanpa JavaScript, kartu tetap utuh dan
 * terbaca: spotlight murni tambahan.
 */
export default function WorkBento() {
  return (
    <section className="v9-section" id="work" aria-labelledby="work-h">
      <div className="v9-shell">
        <div className="v9-section__head">
          <h2 className="v9-h2" id="work-h" data-mask="scroll">
            {V9_WORK.heading}
          </h2>
          <p className="v9-section__sub">{V9_WORK.sub}</p>
        </div>

        <div className="v9-bento" data-reveal>
          {V9_WORK.tiles.map((tile) => (
            <article key={tile.id} className="v9-tile" data-spotlight>
              <span className="v9-tile__glow" aria-hidden="true" />
              <span className="v9-tile__index">{tile.index}</span>
              <span className="v9-tile__kind">{tile.kind}</span>
              <h3 className="v9-tile__title">{tile.title}</h3>
              <p className="v9-tile__headline">{tile.headline}</p>
              {tile.context ? <p className="v9-tile__context">{tile.context}</p> : null}
              {tile.build.length ? (
                <ul className="v9-tile__build">
                  {tile.build.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              ) : null}
              <div className="v9-tile__foot">
                {tile.links.length ? (
                  <p className="v9-tile__links">
                    {tile.links.map((link) => (
                      <a
                        key={link.href}
                        className="v9-link"
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {link.label}
                        <ArrowUpRightIcon size={13} weight="bold" aria-hidden="true" />
                      </a>
                    ))}
                  </p>
                ) : null}
                {tile.note ? <p className="v9-tile__note">{tile.note}</p> : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
