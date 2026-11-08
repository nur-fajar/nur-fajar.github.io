import { V9_PRAISE } from '@/content/v9';

/**
 * Pujian v9: grid enam kartu testimoni.
 *
 * Polanya diambil dari komponen "testimonial" di 21st.dev (uilayout.contact,
 * featured) yang jadi rujukan untuk section ini: kartu-kartu testimoni di
 * dalam grid tiga kolom, dengan satu kartu menyala saat dibaca. Bedanya:
 * yang menyala adalah kartu yang sedang dibaca manusia, bukan kartu yang
 * dipilih jam.
 *
 * Keputusan anti-slop (audit 2026-10-20):
 *   1. **Tidak ada timer.** Versi sebelumnya memindahkan sorotan tiap 4,5
 *      detik. UI yang bergerak tanpa diminta manusia adalah tanda paling
 *      mudah dibaca sebagai "dari template", dan audit 2026-10-13 sudah
 *      menandai pola serupa di halaman lama. Sekarang sorotan hanya muncul
 *      saat kursor masuk atau fokus naik ke kartu itu.
 *   2. Isi kartu tidak pernah berputar. Enam kutipan tetap enam kutipan.
 *   3. Tanpa satu system gerak tambahan: kartu masuk dengan reveal yang
 *      sama seperti blok lain (GSAP di components/v9/Motion.tsx), jadi
 *      framer-motion tidak dipakai di halaman ini sama sekali.
 */
export default function Praise() {
  return (
    <section className="v9-section" id="praise" aria-labelledby="praise-h">
      <div className="v9-shell">
        <div className="v9-section__head v9-section__head--center">
          <span className="v9-pill">{V9_PRAISE.label}</span>
          <h2 className="v9-h2" id="praise-h" data-mask="scroll">
            {V9_PRAISE.heading}
          </h2>
          <p className="v9-section__sub">{V9_PRAISE.sub}</p>
        </div>

        <div className="v9-praise-grid">
          {V9_PRAISE.voices.map((voice, index) => (
            <figure
              key={voice.name}
              className="v9-quote"
              data-reveal
              data-stagger={index}
            >
              <blockquote>{voice.quote}</blockquote>
              <figcaption>
                <span className="v9-quote__who">
                  <span className="v9-quote__name">{voice.name}</span>
                  <span className="v9-quote__role">{voice.relation}</span>
                  <span className="v9-mono v9-quote__where">{voice.role}</span>
                </span>
                <span className="v9-avatar" aria-hidden="true">
                  {initials(voice.name)}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Monogram, bukan foto. Repo ini tidak punya potret orang, dan potret
 * karangan untuk orang nyata tidak boleh dipakai.
 */
function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}
