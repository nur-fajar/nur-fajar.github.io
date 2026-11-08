import type { Metadata } from 'next';
import { extname, join } from 'node:path';
import { readdirSync } from 'node:fs';
import {
  CONTACT,
  V5_FOUNDER_MAILTO,
  V7_BIO,
  V7_BIO_LINKS,
  V7_CHAPTERS,
  V7_COLOPHON,
  V7_CONTACT,
  V7_HISTORY,
  V7_META_DESCRIPTION,
  V7_PRAISE,
  V7_PRAISE_VOICES,
  V7_STACK_LINE,
  V7_STARS_WORDS,
  V7_WORK,
  V7_WORK_ROWS,
} from '@/content/v7';
import { CONSTELLATIONS, type Constellation } from '@/components/story/constellations';
import { equiDistant } from '@/components/story/sky-geometry';
import WorkNav from '@/components/v7/WorkNav';

export const metadata: Metadata = {
  title: { absolute: 'Nur Fajar, AI specialist who builds apps and communities' },
  description: V7_META_DESCRIPTION,
  robots: { index: false, follow: false },
};

/* Halaman /v7. Angka dan kutipan semua datang dari ledger/v5 canon, bukan
   diketik di sini.

   Kontrak JavaScript (2026-10-16): DIBUKA PENUH oleh founder — client
   component dan library motion sah, selama berkasnya tinggal di app/v7 atau
   components/v7 (guard tes menjaga lingkup, bukan jumlah). CSS-first tetap
   idiom default halaman ini: WorkNav (scrollspy) satu-satunya client
   component yang ada, sisanya server-rendered.

   Tanpa rail dan tanpa baris lokasi (dihapus 2026-10-15): masthead tinggal
   nama, lalu bio. Hero kini STICKY COVER — dipaku di atas saat modul Work
   menutupinya. */

/**
 * Render satu paragraf bio dengan link inline di frasa yang punya href di
 * V7_BIO_LINKS. Teks dipotong per frasa, sisanya dirender apa adanya, jadi
 * kalimat verbatim tidak pernah berubah. Logo (kalau ada) duduk di depan
 * frasa sebagai <img> dekoratif — nama organisasinya sudah jadi teks link,
 * jadi alt-nya kosong. Tanpa client component.
 */
function BioParagraph({ text }: { text: string }) {
  const marks = V7_BIO_LINKS.map((link) => ({ ...link, at: text.indexOf(link.phrase) }))
    .filter((m) => m.at >= 0)
    .sort((a, b) => a.at - b.at);
  if (!marks.length) return <p>{starize(text, 0)}</p>;
  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  for (const { phrase, href, logo, size, at } of marks) {
    if (at < cursor) continue; // frasa tumpang tindih, lewati
    if (at > cursor) nodes.push(text.slice(cursor, at));
    const label = text.slice(at, at + phrase.length);
    const isHttp = href.startsWith('http');
    nodes.push(
      <a
        /* key pakai posisi frasa, bukan href: dua tautan boleh menunjuk
           tujuan yang sama ("mail" dan "inbox" — dua-duanya mailto founder),
           dan key dobel bikin React memberi peringatan duplikat anak. */
        key={`${at}-${phrase}`}
        href={href}
        className={logo ? 'v7-bio__brand' : undefined}
        {...(isHttp ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        {logo ? (
          <img src={logo} alt="" style={{ height: size ? `${size}em` : '1em' }} />
        ) : null}
        {label}
      </a>,
    );
    cursor = at + phrase.length;
  }
  if (cursor < text.length) nodes.push(text.slice(cursor));
  // Kata pemicu mode malam dibungkus <label> — kliknya menambahkan/menanggalkan
  // checkbox #v7-stars yang menyetel palet halaman (lihat .v7-night di v7.css).
  return <p>{nodes.flatMap((node, i) => starize(node, i))}</p>;
}

function starize(node: React.ReactNode, base: number): React.ReactNode[] {
  if (typeof node !== 'string') return [node];
  const parts = node.split(new RegExp(`\\b(${V7_STARS_WORDS.join('|')})\\b`, 'g'));
  return parts.map((part, i) =>
    part === '' ? null : i % 2 === 1 ? (
      <label
        key={`${base}-${i}`}
        htmlFor="v7-stars"
        className="v7-stars-word"
        title="See the night sky"
      >
        {part}
      </label>
    ) : (
      part
    ),
  );
}

/* ── Data konstelasi mode malam ─────────────────────────────────────────
   Bukan bentukan tangan: SELURUH 89 rasi IAU (components/story/
   constellations.ts, koordinat RA/Dec asli dari d3-celestial).

   REVISI 2026-10-16 — menggantikan pemetaan 2026-10-15 yang ternyata salah:
   band lama PITA-nya DEKLINASI (+90..+45 dst) tapi rasi DIPILIH dari RA
   pusat, jadi rasi selatan (mis. Eridanus, dec -57..-3) digambar di band
   utara → Y-nya terpental jauh di luar layar dan tinggal fragmen, lalu
   pemenggulungan RA per-titik melahirkan garis bohongan yang membelah
   tembus band (34 garis semu tampak "bertabrakan" dengan rasi lain).

   Model sekarang mencontoh StoryStarfield (halaman story, 2026-09, teruji):
     · Band   : pita deklinasi +90..+45 / +45..0 / 0..-45 / -45..-90 —
                rasi masuk band yang DEKLINASI PUSATNYA di pita itu.
                Menggulir layar tetap = menuruni lintang langit.
     · Pusat  : y = deklinasi asli rasi (16px/derajat, pita bandnya).
                 x = slot desain tetap per figur (SKY_SHOTS di bawah) —
                 sejak kurasi ikonik, jarak antar figur tidak lagi
                 skala sudut (kompromi yang disadari, sama dgn StoryStar.)
      · Bentuk : proyeksi azimuthal ekuidistan di pusat TIAP rasi; skala
                per figur = 4px/derajat x SHAPE_ZOOM (kini 2, jadi
                8px/derajat) — jarak titik dari pusat = jarak sudut
                sungguhan, jadi rasio ukuran antar rasi eksak (Hydra
                memang ~20x Crux). Gnomonik lama menggelembungkan
                figur besar lewat tan(c) — itulah yang membuat rasio
                ukurannya tampak meleset. Figur dekat kutub tak
                terlebar: proyeksinya lokal per pusat.
   Proyeksi jalan DI SERVER saat build (server component): browser hanya
   menerima SVG jadi — tetap nol JavaScript. */
const SKY_BANDS = [
  { top: 90, bottom: 45 },
  { top: 45, bottom: 0 },
  { top: 0, bottom: -45 },
  { top: -45, bottom: -90 },
];
const MAP_TOP = 90; // napas atas peta band di tengah layar 900px
/* Dua skala (2026-10-16, kurasi ikonik):
   NIGHT_SCALE: posisi y = deklinasi asli rasi (16px/derajat); menggulir
   layar = menuruni lintang langit, tetap.
   SLOT x per figur ditulis di SKY_SHOTS (desain kerapian), bukan
   panorama RA lagi: panorama 22-33 figur per band berujung saling
   menimpa — founder memilih estetika. */
const NIGHT_SCALE = 16; // px per derajat untuk posisi y
/* SHAPE_ZOOM: skala bentuk tiap figur vs footprint sudutnya. 2 = 8px per
   derajat — figur paling besar tetap muat di band 45°-nya tanpa terpotong,
   dan rasio ukuran antar rasi tetap eksak sejak ekuidistan dipakai. */
const SHAPE_ZOOM = 2;
const SHAPE_PX = 8; // 4px footprint × SHAPE_ZOOM
/**
 * Bentuk satu rasi: polyline AZIMUTHAL EKUIDISTAN relatif pusatnya
 * (di latar [0,0]) — jarak tiap titik dari pusat = jarak sudut sungguhan
 * × SHAPE_PX, jadi ukuran relatif antar rasi pas rasio aslinya (revisi
 * 2026-10-16: gnomonik yang membesarkan figur jauh dari pusat dipensiunkan).
 * Terpisah per ruas putus (equiDistant bisa null di jauh dari pusat).
 */
function figureShape(c: Constellation) {
  const segs: [number, number][][] = [];
  const pts = new Map<string, [number, number]>();
  for (const line of c.l) {
    let cur: [number, number][] = [];
    for (const [ra, dec] of line) {
      const p = equiDistant(ra, dec, c.c[0], c.c[1]);
      if (!p) {
        if (cur.length > 1) segs.push(cur);
        cur = [];
        continue;
      }
      const pt: [number, number] = [p[0] * SHAPE_PX, -p[1] * SHAPE_PX];
      cur.push(pt);
      pts.set(`${pt[0]},${pt[1]}`, pt);
    }
    if (cur.length > 1) segs.push(cur);
  }
  return { segs, pts: [...pts.values()] };
}

/* Precompute di server: per band, figur terkurasi pada slot desainnya.
   Founder (2026-10-16): estetika dulu, kelengkapan kemudian — hanya rasi
   ikonik yang digambar per band; sisanya tidak muncul (jalurnya digantikan
   gerak drift + parallax). Semua posisi sudah diverifikasi numerik: tidak
   ada dua figur yang menimpa, dan tidak ada yang terpotong tepi layar. */
type NightCopy = { name: string; segs: [number, number][][]; pts: [number, number][] };
/* Skots per band: [kode-deket data (Prop. 'd'), slot x desain 0..1440].
   Slotnya menaruh figur di tempat yang berjajar rapi; polos dengan secukup
   deklinasi y ya tetap dihitung dari deklinasi asli. */
const SKY_SHOTS: Record<number, [abbr: string, slotX: number][]> = {
  // Band 0 (deklinasi +90..+45, sisi utara): Ursa Major, Cepheus,
  // Ursa Minor, Cassiopeia.
  0: [['UMa', 360], ['Cep', 720], ['UMi', 1080], ['Cas', 1330]],
  // Band 1 (pita tengah-utara): Andromeda, Auriga, Orion, Gemini.
  1: [['And', 290], ['Aur', 680], ['Ori', 1030], ['Gem', 1290]],
  // Band 2 (pita tengah-selatan): Capricornus, Ophiuchus, Libra, Corvus.
  2: [['Cap', 220], ['Oph', 560], ['Lib', 950], ['Crv', 1250]],
  // Band 3 (sisi selatan): Centaurus, Crux, Pavo, Grus.
  3: [['Cen', 320], ['Cru', 640], ['Pav', 980], ['Gru', 1240]],
};
const NIGHT_PLOT = SKY_BANDS.map((band, b) => {
  const figures: NightCopy[] = [];
  for (const [abbr, slotX] of SKY_SHOTS[b] ?? []) {
    const c = CONSTELLATIONS.find((k) => k.d === abbr);
    if (!c) throw new Error(`Kurasi langit: rasi "${abbr}" (band ${b}) tidak ada di data`);
    const { segs, pts } = figureShape(c);
    // y tetap faktual dari deklinasi pusat rasi terhadap pita band;
    // x memakai slot desain tertulis di SKY_SHOTS.
    const y0 = MAP_TOP + (band.top - c.c[1]) * NIGHT_SCALE;
    figures.push({
      name: c.d,
      segs: segs.map((seg) =>
        seg.map(([dx, dy]) => [+(dx + slotX).toFixed(1), +(dy + y0).toFixed(1)] as [number, number]),
      ),
      pts: pts.map(([dx, dy]) => [+(dx + slotX).toFixed(1), +(dy + y0).toFixed(1)]),
    });
  }
  return { b, figures };
});

// Selumdung bintang dekoratif, disebar satu per band (posisi beralih per
// band supaya polanya tidak sama persis di ulang-ulangan sisi bawah).
const SCATTER: [number, number][] = [
  [80, 120], [190, 70], [420, 90], [520, 160], [640, 80], [760, 60],
  [940, 90], [1180, 110], [1300, 60], [1380, 210], [60, 380],
  [130, 640], [390, 620], [470, 760], [690, 700], [860, 640],
  [1010, 780], [1200, 700], [1350, 560], [1400, 800], [300, 300],
  [700, 250], [1150, 420], [230, 800],
];

/* ── Galeri tiap showcase ───────────────────────────────────────────────
   Berkas ditaruh founder ke public/v7/work/<id>/ — daftar berkas dibaca
   DI BUILD TIME (static export) lewat readdirSync: halaman sama sekali
   tanpa JavaScript, tapi grid media tetap terisi otomatis begitu berkas
   ada dan build dijalankan ulang.

   Konvensi:
     icon.png   → dipakai sebagai mark blok (menggantikan numeral indeks).
     sisanya    → screenshot/mokup galeri, urut nama alami (01…, 02…).
   Kalau folder kosong → grid menampilkan TIGA tile placeholder abu
   bergaris putus yang mengingatkan lokasi berkasnya. Icon tanpa shot
   tetap memakai icon asli, tanpa placeholder. */
const WORK_MEDIA: Record<string, { icon?: string; shots: string[] }> =
  readWorkMedia();
function readWorkMedia(): Record<string, { icon?: string; shots: string[] }> {
  const map: Record<string, { icon?: string; shots: string[] }> = {};
  const IMG_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif']);
  for (const row of V7_WORK_ROWS) {
    let files: string[] = [];
    try {
      files = readdirSync(join(process.cwd(), 'public', 'v7', 'work', row.id));
    } catch {
      // folder belum ada — founder menyiapkannya nanti; placeholder yang tampil
    }
    const images = files
      .filter((f) => IMG_EXTS.has(extname(f).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
    let icon: string | undefined;
    const shots: string[] = [];
    for (const f of images) {
      if (!icon && f.toLowerCase() === 'icon.png') {
        icon = `/v7/work/${row.id}/${f}`;
      } else {
        shots.push(`/v7/work/${row.id}/${f}`);
      }
    }
    map[row.id] = { icon, shots };
  }
  return map;
}

export default function V7Page() {
  return (
    <>
      {/* Toggle mode malam: checkbox tersembunyi, murni HTML. Tiga kata di
          bio ("constellations", "night", "sky") adalah label-nya; :has() di
          CSS membalik palet + memunculkan konstelasi saat tercentang. */}
      <input type="checkbox" id="v7-stars" className="v7-stars-toggle" />

      <div className="v7-hero" id="v7-hero">
        <header className="v7-mast" id="top">
          <div className="v7-mast__row">
            <h1 className="v7-mast__name">Nur Fajar</h1>
            {/* Tagline (2026-10-15, pengganti morse rule): teks kecil di
                baris yang sama dengan nama di desktop, pindah di bawah nama
                di mobile (lihat media query di v7.css). Teks dari founder
                sendiri, verbatim. */}
            <p className="v7-mast__tag">
              AI specialist who builds apps and communities.
            </p>
          </div>
        </header>

        <div className="v7-bio">
          {V7_BIO.map((paragraph) => (
            <BioParagraph key={paragraph} text={paragraph} />
          ))}
        </div>

        <span className="v7-scroll" aria-hidden="true" />
      </div>

      {/* Work: enam showcase ala austinvalleskey.com (2026-10-16, permintaan
          founder, pengganti accordion). Satu proyek = satu blok: mark
          (ikon dari icon.png di public/v7/work/<id>/ bila ada, selain itu
          numeral indeks), kind, judul display, headline, galeri berkas dari
          public/v7/work/<id>/ yang dibaca di BUILD TIME (nol JS), lalu
          fakta. Id per blok `w-<id>` dipakai pil nav scrollspy (WorkNav)
          dan deep link. */}
      <section className="v7-sec v7-work" id="work" aria-labelledby="work-h">
        <h2 className="v7-sec__label v7-sec__label--head" id="work-h">
          {V7_WORK.label}
        </h2>
        {V7_WORK_ROWS.map((row) => {
          const media = WORK_MEDIA[row.id] ?? { icon: undefined, shots: [] };
          return (
            <article key={row.id} className="v7-show" id={`w-${row.id}`}>
              <div className="v7-show__mark" aria-hidden="true">
                {media.icon ? (
                  <img src={media.icon} alt="" />
                ) : (
                  <span className="v7-show__numeral">{row.index}</span>
                )}
              </div>
              <p className="v7-show__kind">{row.kind}</p>
              <h3 className="v7-show__title">{row.title}</h3>
              <p className="v7-show__headline">{row.headline}</p>
              {row.links.length ? (
                <ul className="v7-show__links">
                  {row.links.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} target="_blank" rel="noreferrer">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="v7-show__grid">
                {media.shots.length
                  ? media.shots.map((src, i) => (
                      <img key={src} src={src} alt={`${row.title} screenshot ${i + 1}`} loading="lazy" />
                    ))
                  : [0, 1, 2].map((i) => (
                      <figure key={i} className="v7-show__ph">
                        <figcaption>public/v7/work/{row.id}/</figcaption>
                      </figure>
                    ))}
              </div>
              {/* Konteks/build/metrik ditulis ulang di sini; blok facts
                  beserta sengaja tak dirender saat semua kosong — galeri
                  jadi penutup blok showcase ini (2026-10-16, case 01). */}
              {row.context.trim().length > 0 ||
              row.build.length > 0 ||
              row.metrics.length > 0 ||
              row.note ? (
                <div className="v7-show__facts">
                  {row.context.trim().length > 0 ? (
                    <p className="v7-show__context">{row.context}</p>
                  ) : null}
                  {row.build.length > 0 ? (
                    <div className="v7-show__build">
                      <ul className="v7-show__buildlist">
                        {row.build.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                      {row.metrics.length > 0 ? (
                        <p className="v7-show__metrics">{row.metrics.join(' · ')}</p>
                      ) : null}
                      {row.note ? <p className="v7-show__note">{row.note}</p> : null}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </article>
          );
        })}
      </section>

      {/* Pil nav sticky: satu-satunya client component di halaman ini
          (scrollspy ala austinvalleskey.com, keputusan founder). */}
      <WorkNav
        items={V7_WORK_ROWS.map((row) => ({ id: row.id, label: row.nav }))}
      />

      {/* Praise: empat kutipan verbatim, statis, nama + konteks. Latar abu
          Apple (#f5f5f7) full-bleed via .v7-sec--tint — modul pertama dalam
          ritme putih/abu bergantian. */}
      <section className="v7-sec v7-sec--tint" id="praise" aria-labelledby="praise-h">
        <p className="v7-sec__label">{V7_PRAISE.label}</p>
        <h2 className="v7-sec__h" id="praise-h">
          {V7_PRAISE.heading}
        </h2>
        <ul className="v7-voices">
          {V7_PRAISE_VOICES.map((t) => (
            <li key={t.name} className="v7-voice">
              <blockquote className="v7-voice__quote">{t.quote}</blockquote>
              <p className="v7-voice__who">
                <span className="v7-voice__name">{t.name}</span>
                <span className="v7-voice__rel">{t.relation}</span>
                <span className="v7-voice__role">{t.role}</span>
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* History: empat babak, satu baris masing-masing. Babak terakhir sengaja
          menyimpan 9.0/10 supaya angka itu tetap bisa dilacak di halaman. */}
      <section className="v7-sec" id="history" aria-labelledby="history-h">
        <p className="v7-sec__label">{V7_HISTORY.label}</p>
        <h2 className="v7-sec__h" id="history-h">
          {V7_HISTORY.heading}
        </h2>
        <ol className="v7-chapters">
          {V7_CHAPTERS.map((chapter) => (
            <li key={chapter.span} className="v7-chapter">
              <p className="v7-chapter__span">{chapter.span}</p>
              <div className="v7-chapter__body">
                <h3 className="v7-chapter__title">{chapter.title}</h3>
                <p className="v7-chapter__text">{chapter.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="v7-stackline">{V7_STACK_LINE}</p>
      </section>

      {/* Contact: email monumental jadi heading-nya sendiri. Modul kedua
          dalam ritme putih/abu Apple. */}
      <section className="v7-sec v7-sec--tint v7-sec--contact" id="contact" aria-labelledby="contact-h">
        <h2 className="v7-contact__mail" id="contact-h">
          <a href={V5_FOUNDER_MAILTO}>{CONTACT.email}</a>
        </h2>
        <dl className="v7-rows">
          {V7_CONTACT.rows.map((row) => (
            <div key={row.label} className="v7-row">
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
        <p className="v7-contact__more">
          <a href={CONTACT.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <span aria-hidden="true">·</span>
          <a href={CONTACT.cv} download={CONTACT.cvFilename}>
            CV (PDF)
          </a>
        </p>
      </section>

      {/* Mode malam: lapisan bintang FIXED se-viewport (sejak 2026-10-16) —
          di atas latar root, di bawah seluruh konten; memudar saat
          tercentang, tetap terlihat sampai footer. 4 band deklinasi
          utara→selatan duduk di strip .v7-night__strip yang digulir lewat
          scroll-driven animation: menggulir halaman = menuruni langit lebih
          LAMBAT dari kontennya — parallax, murni CSS, tanpa JavaScript.
          Ukuran & posisi antar rasi tetap faktual (16px/derajat). */}
      <div className="v7-night" aria-hidden="true">
        <div className="v7-night__strip">
          {NIGHT_PLOT.map(({ b, figures }) => (
          <svg
            key={b}
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid meet"
            data-band={b}
          >
            {/* selmdung bintang dekoratif (6 per band, posisi beralih) */}
            {SCATTER.map(([x, y], i) => (
              <circle
                key={i}
                cx={((x + b * 170) % 1440)}
                cy={((y + b * 130) % 900)}
                r={i % 3 === 0 ? 1.4 : 1}
                className={`v7-star v7-star--${(i % 3) + 1}`}
              />
            ))}
            {/* SELURUH rasi pita deklinasi ini (skala seragam, bentuk
                gnomonik per-rasi; salinan tepi untuk RA yang menyeberang
                0°/360°) */}
            {figures.map((f, i) => (
              <g key={`${f.name}-${i}`} className="v7-skyline">
                {f.segs.map((seg, j) => (
                  <polyline key={j} points={seg.map(([x, y]) => `${x},${y}`).join(' ')} />
                ))}
                {f.pts.map(([x, y], j) => (
                  <circle key={j} cx={x} cy={y} r={1.1} className="v7-skypt" />
                ))}
              </g>
            ))}
            {/* "Bintang paling terang + halo" papan lama (1000,700) dihapus:
                di layout kurasi ia baru jadi bulat menginap di dada Orion
                (laporan founder 2026-10-16). Bintang dekoratifnya sekarang
                cukup dari selemdung + titik figur yang sudah ada. */}
          </svg>
          ))}
        </div>
      </div>

      <footer className="v7-colo">
        <p>{V7_COLOPHON.build}</p>
        <p>{V7_COLOPHON.credit}</p>
      </footer>
    </>
  );
}
