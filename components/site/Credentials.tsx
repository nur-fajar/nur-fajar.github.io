import { ArrowUpRight, SealCheck } from '@phosphor-icons/react/dist/ssr';
import { CREDENTIALS } from '@/content/ledger';
import Reveal from './Reveal';

/**
 * Kredensial, dipisah keluar dari About dan berdiri sebagai strip sendiri di
 * antara Experience dan References.
 *
 * Dua hal berubah dari versi sebelumnya, dan keduanya soal urutan.
 *
 * Yang pertama, posisinya di halaman. Kredensial dulu duduk di dalam About,
 * di bawah enam kartu riwayat kuliah dan organisasi, jadi ia terbaca sebagai
 * bagian dari cerita masa kuliah. Ia bukan itu: ia bukti pihak ketiga, dan
 * tempatnya adalah di deretan hal yang bisa diverifikasi orang lain, tepat
 * di sebelah References.
 *
 * Yang kedua, urutan di dalamnya. Urutan sebelumnya kebetulan persis terbalik
 * dari yang dibutuhkan: sertifikasi teknis di atas, sertifikasi HR/L&D di
 * bawah, di halaman yang seluruhnya melamar peran L&D.
 *
 * Setiap kredensial di strip utama membawa tautan verifikasinya sendiri.
 * Kredensial tanpa tautan cuma klaim yang diketik rapi; kredensial dengan
 * tautan adalah klaim yang sudah dibuktikan sebelum pembaca sempat
 * meragukannya. Yang belum punya tautan tidak berpura-pura punya, ia turun
 * ke baris kecil di bawah tanpa afordansi klik.
 */
export default function Credentials() {
  const primary = CREDENTIALS.filter((credential) => credential.track === 'ld');
  const rest = CREDENTIALS.filter((credential) => credential.track === 'other');

  return (
    <section className="section section--strip" id="credentials" aria-labelledby="credentials-title">
      <div className="shell">
        <Reveal>
          <h2 className="strip__title" id="credentials-title">
            Certified, and checkable.
          </h2>
        </Reveal>

        <ul className="creds">
          {primary.map((credential, index) => (
            <Reveal as="li" key={credential.name} delay={index * 0.05} className="creds__item">
              <a
                className="cred"
                href={credential.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="cred__seal" aria-hidden="true">
                  <SealCheck size={20} weight="duotone" />
                </span>
                <span className="cred__body">
                  <span className="cred__name">{credential.name}</span>
                  <span className="cred__issuer">
                    {credential.issuer}
                    {credential.year ? ` · ${credential.year}` : ''}
                  </span>
                </span>
                <span className="cred__go">
                  Verify
                  <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
                </span>
              </a>
            </Reveal>
          ))}
        </ul>

        <Reveal>
          <p className="creds__rest">
            Also held:{' '}
            {rest.map((credential, index) => (
              <span key={credential.name}>
                {index > 0 ? ' · ' : ''}
                {credential.href ? (
                  <a
                    className="link"
                    href={credential.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {credential.name} ({credential.issuer})
                  </a>
                ) : (
                  <>
                    {credential.name} ({credential.issuer}
                    {credential.year ? `, ${credential.year}` : ''})
                  </>
                )}
              </span>
            ))}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
