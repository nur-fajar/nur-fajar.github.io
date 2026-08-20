import {
  ArrowRight,
  CalendarBlank,
  DownloadSimple,
  EnvelopeSimple,
  HandWaving,
  LinkedinLogo,
} from '@phosphor-icons/react/dist/ssr';
import { CONTACT, LAST_UPDATED, LOOKING_FOR, MAILTO } from '@/content/ledger';
import Reveal from './Reveal';

/**
 * Kontak.
 *
 * Tanpa form. Situs referensi punya satu, tapi form berarti satu lagi hal yang
 * bisa gagal diam-diam (kiriman tidak sampai, dan tidak ada yang tahu), dan
 * dua jalur di bawah ini sudah membawa orang ke tempat yang sama dengan
 * gesekan yang sama rendahnya: kalender yang bisa langsung dipesan, dan email
 * dengan subject serta kerangka body sudah terisi.
 *
 * Tiga tombol setara diganti hierarki tiga tingkat, dan itu bukan soal
 * estetika. Tiga tombol seukuran menghasilkan lebih sedikit aksi daripada
 * satu, dan yang paling mungkin diambil adalah yang komitmennya paling
 * rendah, yaitu Download CV, yang justru paling tidak berguna: CV yang
 * diunduh berakhir di folder Downloads, panggilan 15 menit berakhir di
 * kalender.
 *
 * Kalimat terkuat situs yang dulu duduk di sini sudah naik ke hero. Yang
 * tinggal di posisinya adalah kalimat operasional: apa yang terjadi setelah
 * seseorang menekan tombol.
 */
export default function Contact() {
  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="shell">
        <Reveal>
          <p className="eyebrow contact__eyebrow">
            <HandWaving size={14} weight="fill" aria-hidden="true" />
            Contact
          </p>
          {/* Tanpa lede.
              Judulnya sudah berupa pertanyaan langsung, dan pertanyaan yang
              disusul kalimat penjelas berhenti terbaca sebagai pertanyaan.
              Kalimat yang dulu duduk di sini ("Book fifteen minutes and bring
              the problem...") juga sudah punya rumah yang lebih baik: versi
              aslinya sekarang jadi sub-headline di hero. Yang tersisa di sini
              adalah jawabannya, dan jawabannya adalah tabel di bawah. */}
          <h2 className="contact__title" id="contact-title">
            Need someone who can design the curriculum, build the campaign, and run the room?
          </h2>
        </Reveal>

        <Reveal>
          <dl className="lookup">
            {LOOKING_FOR.map((row) => (
              <div className="lookup__row" key={row.label}>
                <dt className="lookup__label">{row.label}</dt>
                <dd className="lookup__value">
                  {row.value}
                  {/* Daftar kota disembunyikan di balik satu frasa, TAPI tidak
                      disembunyikan dari semua orang.

                      Konten yang cuma muncul saat hover tidak pernah sampai ke
                      pengguna ponsel (tidak ada kursor) maupun pengguna
                      keyboard (tidak pernah lewat). Karena itu pemicunya
                      tabbable, kotanya juga muncul saat :focus-visible, dan
                      teksnya tetap berada di pohon aksesibilitas sepanjang
                      waktu, jadi screen reader membacakannya berurutan tanpa
                      perlu berinteraksi sama sekali. Yang disembunyikan hanya
                      tampilannya, bukan informasinya. */}
                  {row.reveal ? (
                    <>
                      {' · '}
                      <span className="reveal-term" tabIndex={0}>
                        {row.reveal.label}
                        <span className="reveal-term__bubble">
                          {row.reveal.items.join(' · ')}
                        </span>
                      </span>
                    </>
                  ) : null}
                  {row.note ? <span className="lookup__hint">{row.note}</span> : null}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal>
          <div className="contact__actions">
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
            {/* Subject dan kerangka body sudah terisi: empat baris berlabel,
                jadi hiring manager tinggal mengetik di belakang titik dua.
                Setiap gesekan yang dihapus dari sisi mereka menaikkan tingkat
                balasan lebih dari yang terlihat. */}
            <a className="btn btn--outline" href={MAILTO}>
              <EnvelopeSimple size={18} weight="bold" aria-hidden="true" />
              Email me
            </a>
          </div>
        </Reveal>

        <Reveal>
          {/* Yang menahan orang mengirim email dingin bukan ragu soal
              alamatnya, tapi ragu apakah akan dibalas. Satu baris. */}
          <p className="contact__reply">{CONTACT.responseTime}</p>
        </Reveal>

        <Reveal>
          <p className="contact__minor">
            <a className="contact__minor-link" href={CONTACT.cv} download={CONTACT.cvFilename}>
              <DownloadSimple size={15} weight="bold" aria-hidden="true" />
              Download CV (PDF)
            </a>
            <span className="contact__minor-sep" aria-hidden="true" />
            <a
              className="contact__minor-link"
              href={CONTACT.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedinLogo size={15} weight="bold" aria-hidden="true" />
              LinkedIn
            </a>
          </p>
        </Reveal>
      </div>

      <footer className="footer">
        <div className="shell">
          <nav className="footer__links" aria-label="Footer">
            <a className="link" href="#work">
              Work
            </a>
            <a className="link" href="#experience">
              Experience
            </a>
            <a className="link" href="#skills">
              Skills
            </a>
            <a className="link" href="#credentials">
              Credentials
            </a>
            <a className="link" href="#references">
              References
            </a>
            <a className="link" href="#about">
              About
            </a>
          </nav>
          <p className="footer__colophon">
            Nur Fajar · {CONTACT.location}
            <br />
            Built with Next.js, Framer Motion, and heavy AI pairing. Same way I ship everything.
            Last updated {LAST_UPDATED}.
          </p>
        </div>
      </footer>
    </section>
  );
}
