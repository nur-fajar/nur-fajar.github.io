import { UNIT } from '@/content/hireMe';

/**
 * Bingkai kokpit. Menempel di viewport (`position: fixed`), `pointer-events:
 * none` supaya tidak pernah mencegat klik, dan `aria-hidden` karena isinya
 * murni dekorasi — tidak satu pun informasi di sini yang tidak juga ada di
 * badan halaman.
 *
 * Server component: seluruh geraknya (kedip LED, garis sapuan) berasal dari
 * keyframes CSS, jadi tidak ada JS yang perlu dijalankan untuk bingkainya
 * muncul. Di layar sempit ia menipis jadi kurung sudut saja — lihat
 * hire-me.css — supaya tidak memakan ruang baca.
 */
export default function HudFrame() {
  return (
    <div className="hud" aria-hidden="true">
      <span className="hud__corner hud__corner--tl" />
      <span className="hud__corner hud__corner--tr" />
      <span className="hud__corner hud__corner--bl" />
      <span className="hud__corner hud__corner--br" />

      <div className="hud__bar hud__bar--top">
        <span className="hud__tag">
          {UNIT.designation} <span className="hud__sep">{'//'}</span> pre-launch briefing
        </span>
        <span className="hud__tag hud__tag--right">
          <span className="hud__led" />
          {UNIT.statusCode}
        </span>
      </div>

      <div className="hud__bar hud__bar--bottom">
        <span className="hud__tag">link established</span>
        <span className="hud__tag hud__tag--right">scroll to continue</span>
      </div>

      <span className="hud__scan" />
    </div>
  );
}
