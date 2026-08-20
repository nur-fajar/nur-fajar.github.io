import { ArrowRight, ArrowUpRight, CalendarBlank } from '@phosphor-icons/react/dist/ssr';
import { CONTACT, PROJECTS } from '@/content/ledger';
import Reveal from './Reveal';

/**
 * Grid karya: yang dibangun sendiri, yang bisa dibuka publik, dan satu yang
 * berdiri di luar mandat L&D.
 *
 * Kartu yang punya tautan mendapat garis gradient tipis di tepi atas dan
 * tombol panah; yang tidak punya, tidak. Perbedaan itu bukan dekorasi: ia
 * memberi tahu pembaca mana yang bisa diverifikasi sendiri sekarang juga dan
 * mana yang harus dipercaya berdasarkan deskripsi, tanpa perlu satu kalimat
 * pun untuk menjelaskannya.
 *
 * Section ini naik dari posisi keempat ke posisi kedua, tepat setelah hero.
 * Alasannya sederhana: ia satu-satunya bagian halaman yang bisa diperiksa
 * pembaca tanpa mempercayai satu kata pun yang ditulis di sekitarnya.
 */
export default function Work() {
  return (
    <section className="section" id="work" aria-labelledby="work-title">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">Work</p>
          <h2 className="section-title" id="work-title">
            Curriculum I own, and courses you can open.
          </h2>
          <p className="section-lede">
            Three of these are live and public. Take a look and see what&apos;s inside.
          </p>
        </Reveal>

        <ul className="work">
          {PROJECTS.map((project, index) => {
            const body = (
              <>
                <span className={project.aside ? 'work__kind work__kind--aside' : 'work__kind'}>
                  {project.kind}
                </span>
                <h3 className="work__title">{project.title}</h3>
                <p className="work__body">{project.body}</p>
                <ul className="work__chips">
                  {project.chips.map((chip) => (
                    <li className="chip chip--quiet" key={chip}>
                      {chip}
                    </li>
                  ))}
                </ul>
                {project.href ? (
                  <span className="work__go" aria-hidden="true">
                    <ArrowUpRight size={18} weight="bold" />
                  </span>
                ) : null}
              </>
            );

            /* Lebar kartu diturunkan dari APA kartunya, bukan dari urutan
               indeksnya, jadi menambah satu karya nanti tidak diam-diam
               merusak barisnya:

                 aside  selebar penuh, treatment sendiri
                 href   sepertiga, jadi tiga course jatuh sebaris penuh
                 sisa   setengah, dua karya milik sendiri mengisi baris pertama */
            const width = project.aside
              ? 'work__item work__item--aside'
              : project.href
                ? 'work__item work__item--course'
                : 'work__item work__item--own';

            return (
              <Reveal as="li" key={project.id} delay={index * 0.04} className={width}>
                {project.href ? (
                  <a
                    className="work__card work__card--link"
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {body}
                  </a>
                ) : (
                  <div className={project.aside ? 'work__card work__card--aside' : 'work__card'}>
                    {body}
                  </div>
                )}
              </Reveal>
            );
          })}
        </ul>

        {/* Titik keyakinan tertinggi di seluruh halaman: pembaca baru saja
            bisa membuka materinya sendiri. Satu tombol, bukan tiga; tiga
            pilihan di titik ini mengubah keputusan "ya" jadi keputusan
            "yang mana", dan keputusan kedua itu yang paling sering
            berakhir tanpa jawaban. */}
        <Reveal>
          <div className="midcta">
            <p className="midcta__text">Seen enough?</p>
            <a
              className="btn btn--primary"
              href={CONTACT.cal}
              target="_blank"
              rel="noopener noreferrer"
            >
              <CalendarBlank size={18} weight="bold" aria-hidden="true" />
              Book 15 min
              <ArrowRight size={16} weight="bold" aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
