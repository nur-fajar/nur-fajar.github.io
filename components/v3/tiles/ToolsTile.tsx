import ToolLogo from '../ToolLogo';
import { V3_TOOLS } from '@/content/ledger';

/* Posisi kesembilan chip ditulis tetap, bukan diacak. Penempatan acak akan
   berbeda antara render server dan client lalu memicu hydration mismatch,
   dan di build statis ia membeku pada satu susunan hasil undian saat build.

   Pojok kiri bawah sengaja dikosongkan: di sanalah tombol panah ubin duduk,
   dan chip yang jatuh ke sana akan tertimpa. */
const SPOTS = [
  { top: '30%', left: '2%' },
  { top: '8%', left: '19%' },
  { top: '2%', left: '42%' },
  { top: '6%', left: '68%' },
  { top: '40%', left: '26%' },
  { top: '26%', left: '52%' },
  { top: '52%', left: '7%' },
  { top: '60%', left: '35%' },
  { top: '46%', left: '74%' },
];

export default function ToolsTile() {
  return (
    <div className="v3-tools" aria-hidden="true">
      {V3_TOOLS.map((tool, index) => (
        <span className="v3-tools__spot" key={tool.id} style={SPOTS[index]}>
          <ToolLogo id={tool.id} name={tool.name} />
        </span>
      ))}
    </div>
  );
}
