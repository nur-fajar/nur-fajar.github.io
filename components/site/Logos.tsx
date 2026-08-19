import Image from 'next/image';
import { INSTITUTIONS } from '@/content/ledger';

/**
 * Strip logo institusi, duduk tepat di bawah hero.
 *
 * Bukan marquee. Versi sebelumnya menggerakkannya terus-menerus, tapi tujuh
 * logo muat dalam satu baris terbungkus di hampir semua lebar layar, jadi
 * menggerakkannya hanya menambah gerakan tanpa menambah informasi, dan
 * membuat logo lebih sulit dibaca, bukan lebih mudah.
 *
 * Setiap logo duduk di kartu putihnya sendiri: ketujuhnya dibuat untuk kertas
 * putih dan memakai warna merek masing-masing, jadi kartu putih membuat setiap
 * logo membawa latarnya sendiri alih-alih bergantung pada warna halaman.
 */
export default function Logos() {
  return (
    <section className="logos" aria-labelledby="logos-label">
      <div className="shell">
        <p className="logos__label" id="logos-label">
          Trained, mentored and studied with
        </p>
        <ul className="logos__track">
          {INSTITUTIONS.map((institution) => (
            <li key={institution.name} className="logos__card">
              <Image
                src={institution.src}
                alt={institution.name}
                width={100}
                height={38}
                className="logos__img"
                style={institution.scale ? { scale: String(institution.scale) } : undefined}
                loading="lazy"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
