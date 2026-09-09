import { PROOF, V3_SECTIONS } from '@/content/ledger';
import Section, { findSection } from '../Section';

/**
 * Empat angka, masing-masing membawa baris metodenya.
 *
 * Baris method BUKAN keterangan tambahan yang bisa dipotong kalau kartunya
 * sempit. Ia yang mengubah angka dari klaim jadi sesuatu yang bisa dihitung
 * ulang pembaca, dan ada tes yang gagal kalau sebuah sel kehilangan
 * metodenya. Jadi ia mendapat ruang, bukan ellipsis.
 *
 * Empat sel pertama, bukan seluruh PROOF: keempatnya adalah yang berbicara
 * L&D, dan urutannya sudah diputuskan di ledger.
 */
export default function Proof() {
  const section = findSection(V3_SECTIONS, 'proof');

  return (
    <Section section={section}>
      <ul className="v3-proof">
        {PROOF.slice(0, 4).map((cell) => (
          <li className="v3-card v3-proof__cell" key={cell.label}>
            <p className="v3-display v3-proof__value">{cell.value}</p>
            <p className="v3-proof__label">{cell.label}</p>
            <p className="v3-proof__method">{cell.method}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
