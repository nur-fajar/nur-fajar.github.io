/**
 * Seam divider: batas antar section berupa garis seam puzzle dengan tiga
 * tonjolan deterministik (atas, bawah, atas). Geometri statis di markup
 * supaya SSR dan client identik tanpa efek. `tone` menyamakan latar pita
 * dengan section berikutnya agar batas terbaca sebagai sambungan keping,
 * bukan gap.
 */
export default function SectionDivider({ tone }: { tone?: 'paper' | 'warm' }) {
  return (
    <div className={`v5-seam${tone === 'warm' ? ' v5-seam--warm' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 1200 48" preserveAspectRatio="xMidYMid slice" focusable="false">
        <path
          d="M0 24 H272 C280 24 284 10 300 10 C316 10 320 24 328 24 H572 C580 24 584 38 600 38 C616 38 620 24 628 24 H872 C880 24 884 10 900 10 C916 10 920 24 928 24 H1200"
          fill="none"
          stroke="#d9d3c3"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="300" cy="10" r="3" fill="#d9d3c3" />
        <circle cx="900" cy="10" r="3" fill="#d9d3c3" />
      </svg>
    </div>
  );
}
