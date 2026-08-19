import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import { PROJECTS } from '@/content/ledger';
import Reveal from './Reveal';

/**
 * Grid karya: yang dibangun sendiri, dan yang bisa dibuka publik.
 *
 * Kartu yang punya tautan mendapat garis gradient tipis di tepi atas dan
 * tombol panah; yang tidak punya, tidak. Perbedaan itu bukan dekorasi: ia
 * memberi tahu pembaca mana yang bisa diverifikasi sendiri sekarang juga dan
 * mana yang harus dipercaya berdasarkan deskripsi, tanpa perlu satu kalimat
 * pun untuk menjelaskannya.
 *
 * Learner progress dashboard tidak ada di sini. Belum ada screenshot yang bisa
 * ditunjukkan, dan kartu tanpa apa pun di baliknya lebih buruk daripada tidak
 * ada kartu.
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
            Three of these are live and public. Open them and judge the material yourself.
          </p>
        </Reveal>

        <ul className="work">
          {PROJECTS.map((project, index) => {
            const body = (
              <>
                <span className="work__kind">{project.kind}</span>
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

            return (
              <Reveal as="li" key={project.id} delay={index * 0.04} className="work__item">
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
                  <div className="work__card">{body}</div>
                )}
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
