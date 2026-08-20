import { CalendarBlank } from '@phosphor-icons/react/dist/ssr';
import { LEADERSHIP, ORGS } from '@/content/ledger';
import { formatRange } from '@/lib/dates';
import Reveal from './Reveal';

/**
 * Experience, dikelompokkan per organisasi.
 *
 * Terra AI muncul sebagai satu kartu dengan dua sub-jabatan di dalamnya, dan
 * itu justru menguntungkan kejujuran: pembaca melihat langsung bahwa
 * "AI Training Specialist" dan "L&D Specialist" adalah dua periode berbeda
 * dengan tanggal masing-masing, bukan satu blok tiga tahun yang seolah
 * semuanya dikelola end to end.
 *
 * Blok peran awal (GDSC, GenBI) divisualkan lebih ringan dan diberi heading
 * sendiri. Keduanya bukan pekerjaan berbayar, dan menaruhnya sebaris dengan
 * jabatan Terra AI/Bangkit akan mengencerkan sinyal seniority peran berbayar,
 * persis pemisahan yang sudah ada di CV.
 *
 * Tag list per kartu sudah tidak ada. Kartu Terra AI dan Bangkit dulu
 * masing-masing membawa daftar kompetensinya sendiri, dan sembilan dari
 * sepuluh chip-nya muncul lagi persis sama di blok Skills beberapa ratus
 * piksel di bawahnya. Blok Skills sekarang satu-satunya sumber.
 */
export default function Experience() {
  return (
    <section className="section" id="experience" aria-labelledby="experience-title">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">Experience</p>
          {/* Dua baris, dan pembagiannya ditentukan <br/> di sini, bukan oleh
              lebar kotaknya. Dibiarkan membungkus sendiri, judulnya pecah jadi
              "Three roles. Same" / "craft, rising ownership.", yang memotong
              kalimat kedua persis di tengah dan membuat baris pertama terbaca
              seperti kalimat yang belum selesai. */}
          <h2 className="section-title section-title--wide" id="experience-title">
            Three roles.
            <br />
            Same craft,
            {/* Di bawah 560px "Same craft, rising ownership." tidak muat satu
                baris (450px pada 32px, shell cuma 345px), dan browser
                memecahnya jadi "Same craft, rising / ownership.", yang
                memisahkan kata sifat dari kata bendanya. Pecah di komanya. */}
            <br className="br-sm" />{' '}
            rising ownership.
          </h2>
        </Reveal>

        <div className="orgs">
          {ORGS.map((org, index) => (
            <Reveal key={org.id} delay={index * 0.05}>
              <article className="org">
                <div className="org__head">
                  <div>
                    <h3 className="org__name">{org.org}</h3>
                    <p className="org__place">{org.place}</p>
                  </div>
                  <p className="chip org__period">
                    <CalendarBlank size={14} weight="bold" aria-hidden="true" />
                    {formatRange(org.start, org.end)}
                  </p>
                </div>

                <p className="org__summary">{org.summary}</p>

                {/* <ol> karena urutannya bermakna: ini kronologi jabatan.
                    Bullet TIDAK digabung jadi satu daftar datar. Terra AI
                    punya dua peran dengan cakupan yang sangat berbeda, dan
                    daftar datar akan membuat "Trained 100+ students" terbaca
                    seolah bagian dari peran L&D, padahal itu peran trainer
                    setahun sebelumnya. Tiap bullet menggantung di bawah
                    jabatannya sendiri. */}
                <ol className="org__roles">
                  {org.roles.map((role) => (
                    <li className="org__block" key={role.title}>
                      <div className="org__role">
                        <span className="org__role-title">{role.title}</span>
                        {/* Satu format tanggal untuk seluruh situs, dihitung
                            di lib/dates.ts. Versi sebelumnya menyusunnya di
                            sini dari potongan-potongan, lengkap dengan kata
                            "to" khusus screen reader yang bocor ke mata. */}
                        <span className="org__role-date">{formatRange(role.start, role.end)}</span>
                      </div>
                      <ul className="org__bullets">
                        {role.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="early">
            <h3 className="early__label">Leadership &amp; organizational</h3>
            <div className="early__grid">
              {LEADERSHIP.map((role) => (
                <div className="early__card" key={role.title}>
                  <div className="early__head">
                    <h4 className="early__title">{role.title}</h4>
                    <span className="early__date">{formatRange(role.start, role.end)}</span>
                  </div>
                  <p className="early__org">
                    {role.org} · {role.place}
                  </p>
                  <p className="early__detail">{role.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Peta kompetensi tidak lagi menumpang di sini.
            Ia sekarang section-nya sendiri (components/site/Skills.tsx), tepat
            di bawah section ini. Experience menjawab "di mana dan kapan";
            daftar kompetensi menjawab "dengan apa". Dua pertanyaan berbeda
            yang berbagi satu judul berarti yang kedua tidak pernah
            benar-benar dijawab. Urutannya tidak berubah: daftar skill tetap
            datang SETELAH bukti, bukan sebelumnya. */}
      </div>
    </section>
  );
}
