import ToolLogo from '../ToolLogo';
import { SKILLS, V3_SECTIONS, V3_TOOLS } from '@/content/ledger';
import Section, { findSection } from '../Section';

/**
 * Tool lebih dulu, baru kompetensi, dan keduanya sengaja tidak dicampur.
 *
 * Judulnya Technologies, bukan Skills, dan itu bukan soal kata. Daftar tool
 * memuat Claude, OpenAI, dan Gemini; sebuah tes memastikan ketiganya TIDAK
 * pernah masuk SKILLS. Pernah memakai produk sebuah vendor bukan kompetensi,
 * dan menaruhnya di daftar kompetensi adalah klaim yang tidak bisa
 * dibuktikan artefak apa pun.
 */
export default function Technologies() {
  const section = findSection(V3_SECTIONS, 'technologies');

  return (
    <Section section={section}>
      <ul className="v3-tools">
        {V3_TOOLS.map((tool) => (
          <li className="v3-card v3-tool" key={tool.id}>
            <ToolLogo id={tool.id} name={tool.name} size={28} />
            <div>
              <p className="v3-tool__name">{tool.name}</p>
              <p className="v3-tool__use">{tool.use}</p>
            </div>
          </li>
        ))}
      </ul>

      <h3 className="v3-subhead">What the craft is made of</h3>
      <div className="v3-skills">
        {SKILLS.map((group) => (
          <div className="v3-skills__group" key={group.label}>
            <p className="v3-skills__label">{group.label}</p>
            <ul className="v3-chips">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
