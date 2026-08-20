import { SPECS } from '@/content/hireMe';

/* ─────────────────────────────────────────────────────────────────────────────
   BLUEPRINT SISTEM — gambar teknik siklus L&D, digambar sendiri saat dimuat.

   APA YANG DIGAMBAR
     Lima pelat bertumpuk, dibaca DARI BAWAH KE ATAS seperti penampang
     berlapis: automation jadi fondasi, lalu design → delivery → evaluation,
     dan outcome di puncak. Panah di tengah menunjukkan arah alirnya, garis
     putus-putus di kanan menunjukkan umpan balik dari outcome kembali ke
     design — iterasi kurikulum dari feedback tiap cohort, bukan hiasan.

     Isinya persis kalimat inti di StoryIntro ("the full cycle … from design to
     delivery to evaluation" + lapisan otomatisasi di bawahnya), jadi hero-nya
     sekaligus menjelaskan apa yang dijual halaman ini — bukan ilustrasi yang
     cuma menempel.

   KENAPA SERVER COMPONENT, BUKAN CLIENT
     Animasi "menggambar sendiri"-nya murni CSS (stroke-dasharray + keyframes di
     hire-me.css), bukan Framer Motion. Konsekuensinya bagus di dua arah:
     halaman ini tetap nol JavaScript seperti sebelumnya, DAN animasinya tetap
     jalan untuk pengunjung yang JS-nya mati — kalau ini pakai `pathLength`
     Framer, state awal `0` akan ikut ter-render di HTML server dan gambarnya
     hilang total tanpa hidrasi (penawar `.motion-safe` di layout.tsx cuma
     menyentuh opacity/transform/filter, bukan stroke-dashoffset).

   KENAPA pathLength={1} DI TIAP PATH
     Menormalkan panjang tiap path ke 1, jadi satu aturan CSS
     (`stroke-dasharray: 1; stroke-dashoffset: 1`) berlaku untuk semua bentuk
     tanpa perlu tahu panjang aslinya. Tanpa ini, tiap path butuh angka
     dasharray-nya sendiri dan garis pendek akan selesai jauh lebih cepat dari
     garis panjang.
   ────────────────────────────────────────────────────────────────────────── */

const X = 150;
const W = 320;

/**
 * Pelat bersudut potong — sudut kiri-atas dan kanan-bawah dipangkas, chamfer
 * yang sama dengan panel CSS di halaman ini, jadi gambar dan tata letaknya
 * memakai satu bahasa bentuk.
 */
const plate = (y: number, h: number, c = 10) =>
  `M${X + c} ${y} H${X + W} V${y + h - c} L${X + W - c} ${y + h} H${X} V${y + c} Z`;

/**
 * Nomor callout menunjuk ke indeks `SPECS`, BUKAN ke urutan dari atas — itu
 * cara kerja penomoran pada gambar teknik: nomor mengacu ke daftar komponen,
 * dan daftarnya ada tepat di bawah gambar. `badge: null` berarti tahap itu
 * memang tidak punya angka yang bisa ditelusuri di repo, dan halaman ini tidak
 * mengarang satu pun.
 */
const PLATES: {
  y: number;
  h: number;
  label: string;
  sub: string;
  badge: string | null;
  hatch?: boolean;
}[] = [
  { y: 56, h: 52, label: 'Outcome', sub: 'behaviour back on the job', badge: '04' },
  { y: 124, h: 52, label: 'Evaluation', sub: 'Kirkpatrick L1–L3', badge: '02' },
  { y: 192, h: 52, label: 'Delivery', sub: 'cohorts, workshops, webinars', badge: '01' },
  { y: 260, h: 52, label: 'Design', sub: 'objectives, curriculum, assessment', badge: null },
  { y: 328, h: 66, label: 'AI automation', sub: 'agents and pipelines underneath', badge: '03', hatch: true },
];

/** Panah alir di sela antar-pelat, menunjuk ke atas. */
const FLOW = [
  'M310 326 V314 M305 319 L310 314 L315 319',
  'M310 258 V246 M305 251 L310 246 L315 251',
  'M310 190 V178 M305 183 L310 178 L315 183',
  'M310 122 V110 M305 115 L310 110 L315 115',
];

export default function SystemBlueprint() {
  return (
    <div className="bp">
      <svg
        className="bp__svg"
        viewBox="0 0 560 460"
        role="img"
        aria-label="Technical diagram of the Learning and Development cycle: an AI automation layer supporting design, delivery, and evaluation, leading to on-the-job outcome, with a feedback loop back to design. Annotated with four performance figures."
      >
        <defs>
          <pattern id="bp-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0 H0 V20" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
          {/* Arsir fondasi — penanda "material" pada gambar teknik. */}
          <pattern id="bp-hatch" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M-2 2 L2 -2 M0 8 L8 0 M6 10 L10 6" stroke="currentColor" strokeWidth="0.7" />
          </pattern>
        </defs>

        {/* Kertas kalkir. Bukan bagian yang "digambar" — ia sudah ada sejak
            frame pertama, seperti kertas grid yang sudah di meja. */}
        <rect className="bp__paper" width="560" height="460" fill="url(#bp-grid)" />

        {/* Tanda registrasi di empat sudut. */}
        <g className="bp__reg" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M14 34 V14 H34" />
          <path d="M526 14 H546 V34" />
          <path d="M546 426 V446 H526" />
          <path d="M34 446 H14 V426" />
        </g>

        {/* Garis dimensi tinggi tumpukan, di rel kiri. */}
        <g className="bp__dim" fill="none" stroke="currentColor" strokeWidth="0.8">
          <path d="M126 56 H114 M126 394 H114" />
          <path d="M120 56 V394" strokeDasharray="4 3" />
          <path d="M116 62 L120 56 L124 62" />
          <path d="M116 388 L120 394 L124 388" />
        </g>

        {/* Arsir fondasi, digambar di bawah garis pelatnya. */}
        <path className="bp__hatch" d={plate(328, 66)} fill="url(#bp-hatch)" stroke="none" />

        <g className="bp__unit" fill="none" stroke="currentColor" strokeLinejoin="round">
          {PLATES.map((p, i) => (
            <path
              key={p.label}
              className="bp__line"
              d={plate(p.y, p.h)}
              pathLength={1}
              strokeWidth="1.6"
              style={{ '--d': `${0.1 * i}s` } as React.CSSProperties}
            />
          ))}
          {FLOW.map((d, i) => (
            <path
              key={d}
              className="bp__line bp__line--detail"
              d={d}
              pathLength={1}
              strokeWidth="1.2"
              style={{ '--d': `${0.9 + 0.08 * i}s` } as React.CSSProperties}
            />
          ))}
        </g>

        {/* Umpan balik: outcome kembali ke design. Putus-putus, karena ia
            bukan aliran utama melainkan koreksi yang berulang tiap cohort. */}
        <path
          className="bp__feedback"
          d="M470 82 H512 V286 H478 M486 281 L478 286 L486 291"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="5 4"
          pathLength={1}
        />

        {/* Label tiap pelat. Nomor callout ditaruh DI DALAM pelatnya, bukan di
            ujung leader line yang panjang: di layar sempit gambar ini menyusut
            dan leader line jadi benang-benang yang saling silang. */}
        <g className="bp__labels">
          {PLATES.map((p, i) => {
            const cy = p.y + p.h / 2;
            return (
              <g key={p.label} style={{ '--d': `${1.5 + 0.1 * i}s` } as React.CSSProperties}>
                {p.badge && (
                  <>
                    <circle className="bp__badge" cx={X + 28} cy={cy} r="12" />
                    <text className="bp__num" x={X + 28} y={cy} textAnchor="middle" dominantBaseline="central">
                      {p.badge}
                    </text>
                  </>
                )}
                <text className="bp__label" x={X + 56} y={cy - 5}>
                  {p.label}
                </text>
                <text className="bp__sub" x={X + 56} y={cy + 13}>
                  {p.sub}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      <ol className="bp__specs">
        {SPECS.map((s, i) => (
          <li key={s.label} style={{ '--d': `${2.3 + 0.12 * i}s` } as React.CSSProperties}>
            <span className="bp__specnum">{String(i + 1).padStart(2, '0')}</span>
            <span className="bp__specval">{s.value}</span>
            <span className="bp__speclabel">{s.label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
