import ToolLogo from '../ToolLogo';
import { V3_TOOLS } from '@/content/ledger';

/* Posisi kesembilan chip ditulis tetap, bukan diacak. Penempatan acak akan
   berbeda antara render server dan client lalu memicu hydration mismatch,
   dan di build statis ia membeku pada satu susunan hasil undian saat build.

   Pojok kiri bawah sengaja dikosongkan: di sanalah tombol panah ubin duduk,
   dan chip yang jatuh ke sana akan tertimpa. */
const SPOTS = [
  { top: '26%', left: '2%' },
  { top: '6%', left: '17%' },
  { top: '2%', left: '37%' },
  { top: '5%', left: '56%' },
  { top: '10%', left: '76%' },
  { top: '34%', left: '24%' },
  { top: '28%', left: '44%' },
  { top: '36%', left: '64%' },
  { top: '52%', left: '6%' },
  { top: '58%', left: '32%' },
  { top: '50%', left: '78%' },
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
