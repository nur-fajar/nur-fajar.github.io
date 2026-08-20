import { BookOpen, Stack, Star, Users } from '@phosphor-icons/react/dist/ssr';
import { PROOF } from '@/content/ledger';
import Reveal from './Reveal';

const ICONS = [Users, Stack, BookOpen, Star];

/**
 * Empat angka, tepat di bawah hero.
 *
 * Posisi ini dulu ditempati strip logo institusi, yang ternyata mengulang
 * persis apa yang sudah dibawa bento di About, lengkap dengan konteksnya.
 * Angka bekerja lebih keras di sini: ia hal pertama yang dicari pembaca
 * setelah membaca klaim di headline.
 *
 * Setiap tile membawa baris metodenya sendiri, dan baris itu bukan hiasan.
 * Empat angka besar berjajar terbaca sebagai satu populasi yang sama kecuali
 * dikatakan sebaliknya: "300+" berlaku lintas tiga peran sejak 2023,
 * sementara "5" dan "4" hanya berlaku untuk satu tahun sebagai L&D Specialist.
 * Menghapus baris itu demi kerapian akan mengembalikan persis kesalahan yang
 * seluruh revisi konten ini dibuat untuk memperbaiki.
 */
export default function Stats() {
  const stats = PROOF.slice(0, 4);

  return (
    <section className="statsband" aria-label="By the numbers">
      <div className="shell">
        <Reveal>
          <dl className="stats">
            {stats.map((cell, index) => {
              const Icon = ICONS[index] ?? Star;
              return (
                <div className="stat" key={cell.label}>
                  <span className="stat__icon" aria-hidden="true">
                    <Icon size={22} weight="duotone" />
                  </span>
                  {/* Istilah dibaca screen reader, definisi dilihat mata:
                      keduanya membawa isi yang sama, jadi label visual
                      aria-hidden supaya tidak diumumkan dua kali. */}
                  <dt className="sr-only">{cell.label}</dt>
                  <dd className="stat__body">
                    <span className="stat__value">{cell.value}</span>
                    <span className="stat__label" aria-hidden="true">
                      {cell.label}
                    </span>
                    <span className="stat__method">{cell.method}</span>
                  </dd>
                </div>
              );
            })}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
