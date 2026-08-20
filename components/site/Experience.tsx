import { CalendarBlank } from '@phosphor-icons/react/dist/ssr';
import {
  LEADERSHIP,
  ORGS,
  SKILLS,
  SKILLS_FOOTNOTE,
  TECHNICAL_FOOTNOTE,
} from '@/content/ledger';
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
 */
export default function Experience() {
  return (
    <section className="section" id="experience" aria-labelledby="experience-title">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">Experience</p>
          <h2 className="section-title" id="experience-title">
            Three roles, one through-line.
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
                    {org.period}
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
                        <span className="org__role-date">
                          {role.start}
                          <span className="sr-only"> to </span>
                          <span aria-hidden="true"> - </span>
                          {role.end}
                        </span>
                      </div>
                      <ul className="org__bullets">
                        {role.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>

                <ul className="org__chips">
                  {org.chips.map((chip) => (
                    <li className="chip chip--quiet" key={chip}>
                      {chip}
                    </li>
                  ))}
                </ul>
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
                    <span className="early__date">
                      {role.start}
                      <span className="sr-only"> to </span>
                      <span aria-hidden="true"> - </span>
                      {role.end}
                    </span>
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

        {/* Peta kompetensi duduk SETELAH riwayat kerja, bukan sebelumnya.
            Daftar skill sebelum ada bukti apa pun hanyalah tag soup; setelah
            pembaca melihat di mana kemampuan itu dipakai, daftar yang sama
            berubah jadi ringkasan. */}
        <Reveal>
          <div className="toolkit toolkit--after-exp">
            {SKILLS.map((group) => (
              <div className="toolkit__group" key={group.label}>
                <h3 className="toolkit__label">{group.label}</h3>
                <ul className="toolkit__chips">
                  {group.items.map((item) => (
                    <li className="chip" key={item}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="footnote">{SKILLS_FOOTNOTE}</p>
          {/* Satu-satunya tempat proyek 9 agent muncul di seluruh situs.
              Tanpa card, tanpa angka besar, tanpa warna aksen: kredensial
              pendukung, bukan pencapaian utama. */}
          <p className="footnote">{TECHNICAL_FOOTNOTE}</p>
        </Reveal>
      </div>
    </section>
  );
}
