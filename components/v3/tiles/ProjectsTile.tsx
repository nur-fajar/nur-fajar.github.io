import { V3_PROJECT_CATEGORIES } from '@/content/ledger';

/**
 * Empat kata di ubin ini dan empat kategori di /v3/project berasal dari array
 * yang sama, dan sebuah tes mengunci urutannya. Mengetik ulang keempatnya di
 * sini akan membuat ubin dan halamannya bisa berpisah diam-diam.
 *
 * Tiap baris dua salinan kata yang ditumpuk: saat baris di-hover, keduanya
 * naik satu baris sehingga salinan kuning di bawahnya yang tampil — efek
 * roll di tempat. Salinan kedua aria-hidden ganda (induknya sudah
 * aria-hidden): cuma satu kata yang perlu ada di pohon aksesibilitas, dan
 * itu pun sudah tertutup aria-label ubinnya.
 */
export default function ProjectsTile() {
  return (
    <div className="v3-projects" aria-hidden="true">
      <p className="v3-projects__head">PROJECTS</p>
      <ul className="v3-projects__list">
        {V3_PROJECT_CATEGORIES.map((category) => (
          <li key={category.id}>
            <span className="v3-roll">
              <span>{category.label}</span>
              <span aria-hidden="true">{category.label}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
