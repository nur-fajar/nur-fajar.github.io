import { SKILLS } from '@/content/ledger';
import Reveal from './Reveal';

/**
 * Kompetensi dan perangkat, sebagai section sendiri.
 *
 * Sebelumnya blok ini menumpang di kaki Experience, di bawah kartu jabatan dan
 * blok kepemimpinan, tanpa judul dan tanpa batas section. Itu menempatkannya
 * sebagai lampiran riwayat kerja padahal isinya bukan riwayat: Experience
 * menjawab "di mana dan kapan", blok ini menjawab "dengan apa". Dua pertanyaan
 * berbeda yang berbagi satu judul berarti yang kedua tidak pernah benar-benar
 * dijawab, dan pembaca yang mencari daftar kompetensi (kebanyakan recruiter
 * memindai justru ini lebih dulu) tidak punya apa pun untuk dituju.
 *
 * Posisinya tetap SETELAH riwayat kerja, dan itu tidak berubah. Daftar skill
 * sebelum ada bukti apa pun hanyalah tag soup; setelah pembaca melihat di mana
 * kemampuan itu dipakai, daftar yang sama berubah jadi ringkasan.
 *
 * Judulnya menyambung langsung dari judul Experience di atasnya ("Three roles.
 * Same craft, rising ownership."), jadi kedua section terbaca sebagai satu
 * gerakan: kerajinannya disebut, lalu dibongkar isinya. Uji suara di audit §2
 * meminta enam heading situs berdiri sendiri sudah menceritakan seluruh
 * argumennya; ini mata rantai yang selama ini hilang di antara "same craft"
 * dan "certified".
 */
export default function Skills() {
  return (
    <section className="section" id="skills" aria-labelledby="skills-title">
      <div className="shell">
        <Reveal>
          {/* Tanpa lede, sama seperti Credentials dan References.
              Judulnya sudah berbentuk pertanyaan, dan chip di bawahnya adalah
              jawabannya; satu kalimat di antara keduanya cuma menunda jawaban
              yang sudah siap. Soal keluwesan yang dulu dikerjakan lede di sini
              juga sudah dikerjakan heading section sebelumnya ("Three roles.
              Same craft, rising ownership."), beberapa ratus piksel di atas,
              dan mengatakannya dua kali membuat yang kedua terdengar seperti
              sedang meyakinkan diri sendiri. */}
          <h2 className="section-title section-title--wide" id="skills-title">
            What the craft is made of.
          </h2>
        </Reveal>

        <Reveal>
          <div className="toolkit toolkit--section">
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
        </Reveal>
      </div>
    </section>
  );
}
