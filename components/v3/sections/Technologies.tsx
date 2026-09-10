'use client';

import { m, useReducedMotion } from 'framer-motion';
import Tilt from '../Tilt';
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
  const reduced = useReducedMotion();

  /* Kartu masuk berurutan (stagger 60ms), bukan sekaligus: grid 3 kolom yang
     muncul serentak terbaca seperti kedipan. motion-safe di tiap kartu karena
     opacity:0-nya dibakar ke HTML server; aturan <noscript> di root layout
     yang mengembalikannya. Grup skills di bawahnya tidak ikut: ia sudah
     dibawa Reveal section dan menambah stagger kedua cuma menunda bacaan. */
  const cards = (animated: boolean) =>
    V3_TOOLS.map((tool) => {
      const inner = (
        <Tilt className="v3-tool__tilt">
          <ToolLogo id={tool.id} name={tool.name} size={28} />
          <div>
            <p className="v3-tool__name">{tool.name}</p>
            <p className="v3-tool__use">{tool.use}</p>
          </div>
        </Tilt>
      );
      if (!animated) {
        return (
          <li className="v3-card v3-tool" key={tool.id}>
            {inner}
          </li>
        );
      }
      return (
        <m.li
          className="v3-card v3-tool motion-safe"
          key={tool.id}
          variants={{
            hidden: { opacity: 0, y: 24 },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
            },
          }}
        >
          {inner}
        </m.li>
      );
    });

  return (
    <Section section={section}>
      {reduced ? (
        <ul className="v3-tools">{cards(false)}</ul>
      ) : (
        <m.ul
          className="v3-tools"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
        >
          {cards(true)}
        </m.ul>
      )}

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
