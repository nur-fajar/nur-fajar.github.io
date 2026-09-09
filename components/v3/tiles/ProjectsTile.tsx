import { V3_PROJECT_CATEGORIES } from '@/content/ledger';

/**
 * Empat kata di ubin ini dan empat kategori di /v3/project berasal dari array
 * yang sama, dan sebuah tes mengunci urutannya. Mengetik ulang keempatnya di
 * sini akan membuat ubin dan halamannya bisa berpisah diam-diam.
 */
export default function ProjectsTile() {
  return (
    <div className="v3-projects" aria-hidden="true">
      <p className="v3-projects__head">PROJECTS</p>
      <ul className="v3-projects__list">
        {V3_PROJECT_CATEGORIES.map((category) => (
          <li key={category.id}>{category.label}</li>
        ))}
      </ul>
    </div>
  );
}
