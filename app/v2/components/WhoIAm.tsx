'use client';

/* ── WHO I AM ────────────────────────────────────────────────────────────
   Motion signature: paling tenang di halaman. Cuma reveal baris per baris
   (translateY + fade), tanpa split per kata — kontras dengan hero di atas
   dan The Path di bawah. Satu-satunya aksen: angka 1,000+ yang count-up
   saat masuk viewport. */

import { Line } from './SplitText';
import CountUp from './CountUp';

export default function WhoIAm() {
  return (
    <section className="v2-section v2-who">
      <Line index={0} className="v2-lede">
        I run the full cycle of Learning &amp; Development — end-to-end, as a program manager, from design to delivery to
        evaluation.
      </Line>
      <Line index={1} className="v2-body">
        I also love building things with AI. This site is one example. So is an AI agent I embedded into my company’s
        CRM — it now does the work of <CountUp value="1,000+" className="v2-stat" /> human-hours, automatically.
      </Line>
    </section>
  );
}
