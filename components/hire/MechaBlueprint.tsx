import { SPECS } from '@/content/hireMe';

/* ─────────────────────────────────────────────────────────────────────────────
   BLUEPRINT UNIT — gambar teknik elevasi depan, digambar sendiri saat dimuat.

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

   DESAINNYA ORISINAL
     Bentuknya sengaja dirakit dari kosakata mecha yang generik — visor pita,
     satu sirip sensor di tengah dahi, pauldron bersudut, palka kokpit. Tidak
     meniru siluet, lambang, atau trade dress unit mana pun yang berhak cipta.
   ────────────────────────────────────────────────────────────────────────── */

/** Sisi mana tiap callout keluar, dan di ketinggian berapa relnya. */
const CALLOUTS = [
  { side: 'left', x: 260, y: 93, rail: 62, ry: 74 },
  { side: 'right', x: 260, y: 188, rail: 458, ry: 168 },
  { side: 'left', x: 186, y: 172, rail: 62, ry: 250 },
  { side: 'right', x: 284, y: 492, rail: 458, ry: 470 },
] as const;

/**
 * Garis luar unit — kelompok yang digambar paling dulu.
 *
 * Sosoknya digambar utuh dari kepala sampai kaki, bukan separuh badan:
 * potongan sebatas pinggang membuat lengan terbaca sebagai kaki dan
 * proporsinya jadi gempal.
 */
const OUTLINE = [
  // Kepala: sirip sensor rendah, tempurung, rahang, leher.
  'M251 70 L260 50 L269 70 Z',
  'M236 88 L242 70 L278 70 L284 88 L284 105 L276 117 L244 117 L236 105 Z',
  'M244 117 H276 L272 126 H248 Z',
  'M252 126 H268 V135 H252 Z',
  // Badan: kerah, dada, perut, blok pinggang.
  'M228 135 H292 L300 149 H220 Z',
  'M220 149 H300 L306 187 L300 233 H220 L214 187 Z',
  'M232 233 H288 L284 258 H236 Z',
  'M228 258 H292 V277 H228 Z',
  // Pauldron, dipasang keluar dengan jarak dari badan.
  'M152 147 L214 139 L220 197 L158 207 Z',
  'M368 147 L306 139 L300 197 L362 207 Z',
  // Lengan kiri: atas, bawah, telapak.
  'M166 213 H212 L208 269 H172 Z',
  'M172 275 H206 L202 331 H178 Z',
  'M180 335 H200 V347 H180 Z',
  // Lengan kanan.
  'M354 213 H308 L312 269 H348 Z',
  'M348 275 H314 L318 331 H342 Z',
  'M340 335 H320 V347 H340 Z',
  // Rok armor: tengah, kiri, kanan.
  'M240 281 H280 L277 325 H243 Z',
  'M206 281 H236 L230 319 H202 Z',
  'M314 281 H284 L290 319 H318 Z',
  // Kaki kiri: paha, lutut, betis, telapak.
  'M222 333 H254 L250 419 H222 Z',
  'M222 423 H250 V441 H222 Z',
  'M224 445 H250 L246 549 H222 Z',
  'M214 553 H250 L254 575 H208 Z',
  // Kaki kanan.
  'M298 333 H266 L270 419 H298 Z',
  'M298 423 H270 V441 H298 Z',
  'M296 445 H270 L274 549 H298 Z',
  'M306 553 H270 L266 575 H312 Z',
];

/** Panel line, ventilasi, palka — lapisan detail, digambar sesudah outline. */
const DETAIL = [
  // Visor dan dua celah mata.
  'M239 88 H281 V99 H239 Z',
  'M243 91 H258 V96 H243 Z',
  'M262 91 H277 V96 H262 Z',
  // Palka kokpit.
  'M240 168 H280 V208 H240 Z',
  'M246 175 H274 V201 H246 Z',
  // Ventilasi dada.
  'M224 162 L238 158 V174 L224 178 Z',
  'M296 162 L282 158 V174 L296 178 Z',
  // Panel line pauldron.
  'M160 160 L214 153',
  'M360 160 L306 153',
  // Garis perut dan rok.
  'M234 246 H286',
  'M246 295 H274',
  // Panel line lengan.
  'M176 240 H204',
  'M344 240 H316',
  // Panel line paha dan betis.
  'M226 375 H248',
  'M294 375 H272',
  'M228 490 H246',
  'M292 490 H274',
];

export default function MechaBlueprint() {
  return (
    <div className="bp">
      <svg
        className="bp__svg"
        viewBox="0 0 520 640"
        role="img"
        aria-label="Technical elevation drawing of a mecha unit, annotated with four performance specifications"
      >
        <defs>
          <pattern id="bp-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0 H0 V20" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>

        {/* Kertas kalkir. Bukan bagian yang "digambar" — ia sudah ada sejak
            frame pertama, seperti kertas grid yang sudah di meja. */}
        <rect className="bp__paper" width="520" height="640" fill="url(#bp-grid)" />

        {/* Tanda registrasi di empat sudut. */}
        <g className="bp__reg" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M14 34 V14 H34" />
          <path d="M486 14 H506 V34" />
          <path d="M506 606 V626 H486" />
          <path d="M34 626 H14 V606" />
        </g>

        {/* Garis dimensi tinggi total, di rel paling kiri. */}
        <g className="bp__dim" fill="none" stroke="currentColor" strokeWidth="0.8">
          <path d="M112 48 H100 M112 575 H100" />
          <path d="M106 48 V575" strokeDasharray="4 3" />
          <path d="M102 54 L106 48 L110 54" />
          <path d="M102 569 L106 575 L110 569" />
        </g>

        <g className="bp__unit" fill="none" stroke="currentColor" strokeLinejoin="round">
          {OUTLINE.map((d, i) => (
            <path
              key={d}
              className="bp__line"
              d={d}
              pathLength={1}
              strokeWidth="1.6"
              style={{ '--d': `${0.07 * i}s` } as React.CSSProperties}
            />
          ))}
          {DETAIL.map((d, i) => (
            <path
              key={d}
              className="bp__line bp__line--detail"
              d={d}
              pathLength={1}
              strokeWidth="1"
              style={{ '--d': `${1.5 + 0.05 * i}s` } as React.CSSProperties}
            />
          ))}
        </g>

        {/* Garis alas — unit berdiri di atasnya, seperti elevasi teknik. */}
        <path
          className="bp__ground"
          d="M170 583 H350"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          pathLength={1}
        />

        {/* Leader line tiap callout: dari titik di badan unit, mendatar ke rel
            samping, lalu berhenti di lingkaran bernomor. Nomornya diulang di
            daftar HTML di bawah — itu yang jadi teks sebenarnya, supaya angka
            spesifikasinya tetap terbaca besar di layar sempit. */}
        <g className="bp__callouts" fill="none" stroke="currentColor" strokeWidth="0.9">
          {CALLOUTS.map((c, i) => (
            <g className="bp__callout" key={c.y} style={{ '--d': `${2.8 + 0.14 * i}s` } as React.CSSProperties}>
              <path d={`M${c.x} ${c.y} L${c.rail + (c.side === 'left' ? 26 : -26)} ${c.ry} H${c.rail}`} pathLength={1} />
              <circle className="bp__dot" cx={c.x} cy={c.y} r="3.4" />
              <circle className="bp__badge" cx={c.rail} cy={c.ry} r="11" />
              <text className="bp__num" x={c.rail} y={c.ry} textAnchor="middle" dominantBaseline="central" stroke="none">
                {String(i + 1).padStart(2, '0')}
              </text>
            </g>
          ))}
        </g>
      </svg>

      <ol className="bp__specs">
        {SPECS.map((s, i) => (
          <li key={s.label} style={{ '--d': `${3.1 + 0.12 * i}s` } as React.CSSProperties}>
            <span className="bp__specnum">{String(i + 1).padStart(2, '0')}</span>
            <span className="bp__specval">{s.value}</span>
            <span className="bp__speclabel">{s.label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
