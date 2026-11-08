import { V9_HISTORY } from '@/content/v9';

/**
 * Riwayat v9: empat babak di atas garis yang terisi seiring halaman
 * digulir (garis itu diisi oleh GSAP, jadi tanpa JavaScript garisnya
 * kosong, bukan rusak).
 *
 * Baris stack Closing di bawah, monospace, karena itu data: daftar alat,
 * bukan kalimat.
 */
export default function History() {
  return (
    <section className="v9-section v9-section--tint" id="history" aria-labelledby="history-h">
      <div className="v9-shell">
        <div className="v9-section__head">
          <h2 className="v9-h2" id="history-h" data-reveal>
            {V9_HISTORY.heading}
          </h2>
        </div>

        <div className="v9-timeline" data-reveal>
          <div className="v9-timeline__rail" aria-hidden="true">
            <div className="v9-timeline__fill" />
          </div>
          {V9_HISTORY.chapters.map((chapter) => (
            <article key={chapter.span} className="v9-chapter">
              <span className="v9-chapter__span">{chapter.span}</span>
              <h3 className="v9-chapter__title">{chapter.title}</h3>
              <p className="v9-chapter__body">{chapter.body}</p>
            </article>
          ))}
        </div>

        <p className="v9-stack">{V9_HISTORY.stack}</p>
      </div>
    </section>
  );
}
